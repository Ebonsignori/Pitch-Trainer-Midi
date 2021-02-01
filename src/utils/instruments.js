import * as Tone from 'tone'
import { fetchJson } from './misc'

const { INSTRUMENTS_REPO_BASE_URL, DEFAULT_INSTRUMENT } = process.env

export async function fetchInstruments () {
  const infoJson = await fetchJson(`${INSTRUMENTS_REPO_BASE_URL}/instruments/info.json`)
  return infoJson.instruments
}

let piano = null
let prevPianoType = null
export async function getPiano (pianoType = DEFAULT_INSTRUMENT) {
  if (piano && prevPianoType === pianoType) {
    return piano
  }
  prevPianoType = pianoType

  const infoJson = await fetchJson(`${INSTRUMENTS_REPO_BASE_URL}/instruments/${pianoType}/info.json`)
  piano = new Tone.Sampler({
    urls: infoJson.fileMap,
    baseUrl: `${INSTRUMENTS_REPO_BASE_URL}/instruments/${pianoType}/`
  }).toDestination()

  return piano
}
