import * as Tone from 'tone'
import { NOTE_OPTS } from '../constants/settingsConstants'

const urls = {}
NOTE_OPTS.forEach(note => {
  urls[note] = `${note.toLowerCase().replace('#', 's')}.mp3`
})

let piano = null
let prevPianoType = null
export function getPiano (pianoType = 'SoftPiano') {
  console.log('here!')
  if (piano && prevPianoType === pianoType) {
    return piano
  }
  prevPianoType = pianoType
  piano = new Tone.Sampler({
    urls,
    baseUrl: `https://raw.githubusercontent.com/Ebonsignori/piano-sounds/master/${pianoType}/`
  }).toDestination()
  return piano
}
