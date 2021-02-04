/* eslint-env node, worker */
import { Note } from '@tonaljs/tonal'
import Pitchfinder from 'pitchfinder'

// THIS FILE IS A WORKER

// Analyse data sent to the worker.
onmessage = e => {
  postMessage(analyseAudioData(e.data))
}

console.log('worker started')
function analyseAudioData ({ sampleRate, audioData }) {
  const detectPitch = Pitchfinder.YIN({ sampleRate })
  const frequencies = Pitchfinder.frequencies(detectPitch, audioData)
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
