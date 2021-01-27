const homedir = require('os').homedir()
const path = require('path')
const fs = require('fs')

const { APP_NAME } = process.env
const SETTINGS_FILE = path.join(homedir, APP_NAME, 'settings.json')

const SETTINGS_KEYS = [
  'inputDeviceOpt',
  'midiDeviceOpt',
  'micDeviceOpt',
  'showMidiPianoOpt',
  'showPlayedMicNote',
  'tempoOpt',
  'repeatPreviewCountOpt',
  'startNoteDisplayOpt',
  'autoContinueCorrectOpt',
  'autoContinueCorrectDelayOpt',
  'autoContinueWrongOpt',
  'autoContinueWrongDelayOpt',
  'repeatOnWrongOpt',
  'numberOfQuestionsOpt',
  'intervalsOpt',
  'playModesOpt',
  'fixedRootOpt',
  'lowerRangesOpt',
  'upperRangesOpt',
]

// Extract each setting from appState and save it to JSON
export function saveAllSettings (appState) {
  const newSettings = {}
  SETTINGS_KEYS.forEach(key => {
    newSettings[key] = appState[key]
  })
  setSettingsJson(newSettings)
}

// export function loadAllSettings (appState) {
// const existingSettings = getSettings()
// SETTINGS_KEYS.forEach(key => {
// if (existingSettings[key])
// newSettings[key] = appState[key]
// })
// setSettings(newSettings)
// }

// Get all settings from default JSON file
export function loadSettingsJson () {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE))
  } catch (error) {
    console.error(`Unable to read settings file at ${SETTINGS_FILE}`, error)
    return {}
  }
}

// Save settings to default JSON file
function setSettingsJson (newSettings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings))
  } catch (error) {
    console.error(`Unable to read settings file at ${SETTINGS_FILE}`, error)
  }
  return newSettings
}

export function getSelectedSetting (settingObj, compoundSetting) {
  if (!settingObj) {
    settingObj = {}
  }
  for (const entry of Object.entries(settingObj)) {
    if (entry[1]) {
      if (compoundSetting) {
        return entry[0].substring(entry[0].indexOf('#') + 1, entry[0].length)
      }
      return entry[0]
    }
  }
}

export function getSelectedSettings (settingsObj) {
  if (!settingsObj) {
    settingsObj = {}
  }
  const selected = []
  for (const entry of Object.entries(settingsObj)) {
    if (entry[1]) {
      selected.push(entry[0])
    }
  }
  return selected
}

export function settingChanged (prev, next) {
  if (!prev || !next) {
    return true
  }
  for (const key of Object.keys(prev)) {
    if (prev[key] !== next[key]) {
      return true
    }
  }
  return false
}
