const homedir = require('os').homedir()
const path = require('path')
const fs = require('fs')
const player = require('node-wav-player')

const { APP_NAME } = process.env
const SOUNDS_PATH = path.join(homedir, APP_NAME, 'sounds')

let notes
const paths = {}
export function getNotes () {
  if (!notes) {
    notes = {}
    try {
      fs.readdirSync(SOUNDS_PATH).forEach(noteFile => {
        if (noteFile.includes('-1-48')) {
          let noteName = noteFile.substr(0, 2)
          if (noteFile.includes('#')) {
            noteName = noteFile.substr(0, 3)
          }
          notes[noteName] = {
            path: noteFile,
            selected: false
          }
          paths[noteName] = noteFile
        }
      })
    } catch (error) {
      console.error(`Unable to read sounds directory at ${SOUNDS_PATH}`, error)
      alert(`No instrument sounds in ${SOUNDS_PATH}. Please follow README to add sounds to this path.`)
      window.close()
    }
  }
  return notes
}

export async function playNote (noteName) {
  const notePath = paths[noteName]
  return player.play({
    path: path.join(SOUNDS_PATH, notePath)
  })
}
