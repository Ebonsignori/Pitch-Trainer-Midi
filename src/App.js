import React, { useState } from 'react'
import Game from './components/Game'
import Options from './components/Options'
import AppContext from './AppContext'
import {
  INTERVALS_SELECTED,
  PLAY_MODES_SELECTED,
  FIXED_ROOT,
  UPPER_RANGE,
  LOWER_RANGE,
  INPUT_DEVICE_SELECTED,
  START_NOTE_DISPLAY_SELECTED,
} from './constants/settingsConstants'
import { GAME_OPTIONS, INTERVALS, RESULTS } from './constants/gameConstants'
import Results from './components/Results'
import { loadSettingsJson } from './utils/settings'

// NOTE: Make sure to add all new settings to this list
const existingSettings = loadSettingsJson()

function App () {
  const [selectedGameMode, setSelectedGameMode] = useState(GAME_OPTIONS)
  // const [selectedGameMode, setSelectedGameMode] = useState(INTERVALS)

  // Input settings
  const [inputDeviceOpt, setInputDeviceOpt] = useState(existingSettings.inputDeviceOpt || INPUT_DEVICE_SELECTED)
  const [midiDeviceOpt, setMidiDeviceOpt] = useState(existingSettings.midiDeviceOpt || null)
  const [micDeviceOpt, setMicDeviceOpt] = useState(existingSettings.micDeviceOpt || null)
  const [showMidiPianoOpt, setShowMidiPianoOpt] = useState(existingSettings.showMidiPianoOpt || true)
  const [showPlayedMicNote, setShowPlayedMicNote] = useState(existingSettings.showPlayedMicNote || true)
  // Output settings
  const [outputSoundsOpt, setOutputSoundsOpt] = useState(existingSettings.outputSoundsOpt || null)

  // Global game settings
  const [tempoOpt, setTempoOpt] = useState(existingSettings.tempoOpt || 80)
  const [repeatPreviewCountOpt, setRepeatPreviewCountOpt] = useState(existingSettings.repeatPreviewCountOpt || 0)
  const [startNoteDisplayOpt, setStartNoteDisplayOpt] = useState(existingSettings.startNoteDisplayOpt || START_NOTE_DISPLAY_SELECTED)
  const [autoContinueCorrectOpt, setAutoContinueCorrectOpt] = useState(existingSettings.autoContinueCorrectOpt || true)
  const [autoContinueCorrectDelayOpt, setAutoContinueCorrectDelayOpt] = useState(existingSettings.autoContinueCorrectDelayOpt || 2)
  const [autoContinueWrongOpt, setAutoContinueWrongOpt] = useState(existingSettings.autoContinueWrongOpt || true)
  const [autoContinueWrongDelayOpt, setAutoContinueWrongDelayOpt] = useState(existingSettings.autoContinueWrongDelayOpt || 2)
  const [repeatOnWrongOpt, setRepeatOnWrongOpt] = useState(existingSettings.repeatOnWrongOpt || true)

  // Game tab-level settings
  const [numberOfQuestionsOpt, setNumberOfQuestionsOpt] = useState(existingSettings.numberOfQuestionsOpt || 50)
  const [intervalsOpt, setIntervalsOpt] = useState(existingSettings.intervalsOpt || INTERVALS_SELECTED)
  const [playModesOpt, setPlayModesOpt] = useState(existingSettings.playModesOpt || PLAY_MODES_SELECTED)
  const [fixedRootOpt, setFixedRootOpt] = useState(existingSettings.fixedRootOpt || FIXED_ROOT)
  const [upperRangesOpt, setUpperRangesOpt] = useState(existingSettings.upperRangesOpt || UPPER_RANGE)
  const [lowerRangesOpt, setLowerRangesOpt] = useState(existingSettings.lowerRangesOpt || LOWER_RANGE)

  // Game results
  const [gameStats, setGameStats] = useState({})

  const appState = {
    selectedGameMode,
    setSelectedGameMode,
    inputDeviceOpt,
    setInputDeviceOpt,
    midiDeviceOpt,
    setMidiDeviceOpt,
    micDeviceOpt,
    setMicDeviceOpt,
    showMidiPianoOpt,
    setShowMidiPianoOpt,
    showPlayedMicNote,
    setShowPlayedMicNote,
    outputSoundsOpt,
    setOutputSoundsOpt,
    tempoOpt,
    setTempoOpt,
    repeatPreviewCountOpt,
    setRepeatPreviewCountOpt,
    startNoteDisplayOpt,
    setStartNoteDisplayOpt,
    autoContinueCorrectOpt,
    autoContinueCorrectDelayOpt,
    setAutoContinueCorrectDelayOpt,
    setAutoContinueCorrectOpt,
    autoContinueWrongOpt,
    setAutoContinueWrongOpt,
    autoContinueWrongDelayOpt,
    setAutoContinueWrongDelayOpt,
    repeatOnWrongOpt,
    setRepeatOnWrongOpt,
    numberOfQuestionsOpt,
    setNumberOfQuestionsOpt,
    intervalsOpt,
    setIntervalsOpt,
    playModesOpt,
    setPlayModesOpt,
    fixedRootOpt,
    setFixedRootOpt,
    lowerRangesOpt,
    setLowerRangesOpt,
    upperRangesOpt,
    setUpperRangesOpt,
    gameStats,
    setGameStats,
  }

  let MainRender = <Options />
  if (selectedGameMode === INTERVALS) {
    MainRender = <Game />
  } else if (selectedGameMode === RESULTS) {
    MainRender = <Results
      gameStats={gameStats}
      selectedGameMode={appState.selectedGameMode}
      numberOfQuestionsOpt={appState.numberOfQuestionsOpt}
      goBackToMenu={() => appState.setSelectedGameMode(GAME_OPTIONS)}
    />
  }

  return (
      <AppContext.Provider value={appState}>
        {MainRender}
      </AppContext.Provider>
  )
}

export default App
