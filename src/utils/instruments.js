import * as Tone from 'tone'

const { INSTRUMENTS_REPO_BASE_URL, DEFAULT_INSTRUMENT } = process.env

async function fetchJson (url) {
  try {
    const res = await fetch(url)
    return res.json()
  } catch (err) {
    console.error(`Unable to fetch and parse JSON from url: ${url}`)
  }
  return {}
}

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
  console.log(infoJson)
  piano = new Tone.Sampler({
    urls: infoJson.fileMap,
    baseUrl: `${INSTRUMENTS_REPO_BASE_URL}/instruments/${pianoType}/`
  }).toDestination()

  return piano
}
