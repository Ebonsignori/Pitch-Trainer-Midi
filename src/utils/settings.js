const homedir = require('os').homedir()
const path = require('path')
const fs = require('fs')

const { APP_NAME } = process.env
const SETTINGS_FILE = path.join(homedir, APP_NAME, 'settings.json')

// On startup try to load settings from ~/pitch-trainer/settings.json
// If settings file doesn't exist, create it
let settings = {}
if (fs.existsSync(SETTINGS_FILE)) {
  settings = getSettings()
} else {
  setSettings(settings)
}

function getSettings () {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE))
  } catch (error) {
    console.error(`Unable to read settings file at ${SETTINGS_FILE}`, error)
    return {}
  }
}

function setSettings (newSettings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings))
  } catch (error) {
    console.error(`Unable to read settings file at ${SETTINGS_FILE}`, error)
  }
  return newSettings
}

export function getSetting (key) {
  return settings[key]
}

export function setSetting (key, value) {
  settings[key] = value
  return setSettings(settings)
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
