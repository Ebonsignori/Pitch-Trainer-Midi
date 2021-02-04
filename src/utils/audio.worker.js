/* eslint-env node, worker */
import { Note } from '@tonaljs/tonal'
import Pitchfinder from 'pitchfinder'

// THIS FILE IS A WORKER

// Analyse data sent to the worker.
onmessage = e => {
  postMessage(analyseAudioData(e.data))
}

console.log('worker started')
// const AMDFAlgo = Pitchfinder.AMDF({ minFrequency: 46, maxFrequency: 2150 })
function analyseAudioData ({ sampleRate, audioData }) {
  const YINAlgo = Pitchfinder.YIN({ sampleRate })
  const frequencies = Pitchfinder.frequencies(YINAlgo, audioData)
  if (frequencies === null) {
    return null
  }

  const notes = []
  for (const freq of frequencies) {
    // Only if between C2 and C6 (actually C7)
    if (freq && freq > 60 && freq < 2150) {
      notes.push(Note.transpose(Note.fromFreqSharps(freq), '-8M'))
    }
  }

  return notes
}
