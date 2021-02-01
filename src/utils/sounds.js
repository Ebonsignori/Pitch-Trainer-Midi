import * as Tone from 'tone'
import { fetchJson } from './misc'

const { INSTRUMENTS_REPO_BASE_URL, DEFAULT_SUCCESS_SOUND, DEFAULT_FAIL_SOUND } = process.env

export async function fetchSounds () {
  const infoJson = await fetchJson(`${INSTRUMENTS_REPO_BASE_URL}/effects/info.json`)
  return infoJson.sounds
}

let successPlayer = null
let prevSuccessFile = null
export async function getSuccessPlayer (successFile = DEFAULT_SUCCESS_SOUND) {
  if (successPlayer && prevSuccessFile === successFile) {
    return successPlayer
  }
  prevSuccessFile = successFile

  return new Promise(resolve => {
    successPlayer = new Tone.Player(`${INSTRUMENTS_REPO_BASE_URL}/effects/${successFile}`, () => {
      resolve(successPlayer)
    }).toDestination()
  })
}

let failPlayer = null
let prevFailFile = null
export async function getFailPlayer (failFile = DEFAULT_FAIL_SOUND) {
  if (successPlayer && prevFailFile === failFile) {
    return successPlayer
  }
  prevFailFile = failFile

  return new Promise(resolve => {
    failPlayer = new Tone.Player(`${INSTRUMENTS_REPO_BASE_URL}/effects/${failFile}`, () => {
      resolve(failPlayer)
    }).toDestination()
  })
}
