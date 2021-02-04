import Worker from './audio.worker.js'
const audioContext = new AudioContext()

// Returns a list of computers input audio devices
export async function getInputDevices () {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const newDevices = []
  devices.forEach(device => {
    if (device.kind === 'audioinput') {
      const newDevice = {}
      newDevice.label = device.label
      newDevice.id = device.deviceId
      newDevices.push(newDevice)
    }
  })
  return newDevices
}

// Using deviceId from getInputDevices, returns a sourceStream
export async function getSourceStream (deviceId) {
  const sourceStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: {
        exact: deviceId
      }
    }
  })
  return sourceStream
}

const nullFunc = () => {}

export default class Microphone {
  constructor (deviceId, onNotePlayed, setErrorModalData, setIsListening) {
    this.deviceId = deviceId || 'default'
    // Callback that is called when a note is played after listening
    this.onNotePlayed = onNotePlayed
    // Callbackt that is fired when listening has begun
    this.setIsListening = setIsListening || nullFunc
    this.setErrorModalData = setErrorModalData
    this.listening = null
    this.refreshHandle = null
    this.audioProcessor = null
    this.mediaRecorder = null
    this._init = false
  }

  async init () {
    if (this._init) {
      return true
    }
    try {
      this.sourceStream = await getSourceStream(this.deviceId)
    } catch (error) {
      try {
        this.sourceStream = await getSourceStream('default')
      } catch (error) {
        console.error(error)
        console.log('DeviceID:', this.deviceId)
        this.setErrorModalData({
          heading: 'Something is wrong with mic input device. Please restart and choose another.',
          onModalPrompt: () => {
            process.exit(1)
          }
        })
        return
      }
    }
    this._init = true
    return true
  }

  stop () {
    this.listening = false
    clearInterval(this.refreshHandle)
    try {
      this.audioProcessor.terminate()
    } catch (err) {
      console.log('audioProcessor error on stop')
      console.error(err)
    }
    this.audioProcessor = null
    try {
      this.mediaRecorder.stop()
    } catch (err) {
      console.log('MediaRecorder inactive on stop')
    }
    this.mediaRecorder = null
    this.setIsListening(false)
  }

  listen (deviceId) {
    console.log('Listening on mic input device...')
    if (!this._init) {
      console.error('Microphone class has not been initialized. Must call await init() first')
      return
    }
    this.listening = true
    this.audioProcessor = new Worker()
    this.audioProcessor.onmessage = this.handleProcessorMessage.bind(this)
    this.mediaRecorder = new MediaRecorder(this.sourceStream)

    this.mediaRecorder.ondataavailable = this.update.bind(this)
    this.mediaRecorder.start()
    this.setIsListening(true)
    setTimeout(() => this.listening && this.mediaRecorder.stop(), 400)

    // Every 200ms, send whatever has been recorded to the audio processor.
    this.refreshHandle = setInterval(() => {
      this.listening && this.mediaRecorder.start()
      setTimeout(() => this.listening && this.mediaRecorder.stop(), 400)
    }, 500)
  }

  // Handles responses received from the audio processing web worker.
  handleProcessorMessage (e) {
    if (this.listening) {
      if (e.data) {
        // Send notes to callback
        this.onNotePlayed(e.data)
      }
    }
  }

  // Handles data received from a `MediaRecorder`.
  async update (e) {
    if (e.data.size !== 0) {
      // Load the blob.
      const response = await fetch(URL.createObjectURL(e.data))
      const arrayBuffer = await response.arrayBuffer()
      // Decode the audio.
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const audioData = audioBuffer.getChannelData(0)
      if (!this.audioProcessor) {
        return
      }
      // Send the audio data to the audio processing worker.
      this.audioProcessor.postMessage({
        sampleRate: audioBuffer.sampleRate,
        audioData,
      })
    }
  }
}
