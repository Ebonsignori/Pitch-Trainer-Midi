import React, { useState } from 'react'
import GameComponent from './components/GameComponent'
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
import PromptModal from './components/modal/promptModal'
import ErrorModule from './components/modal/errorModal'

// NOTE: Make sure to add all new settings to this list
const existingSettings = loadSettingsJson()

function App () {
  const [selectedGameMode, setSelectedGameMode] = useState(GAME_OPTIONS)
  // const [selectedGameMode, setSelectedGameMode] = useState(INTERVALS)

  // Modal State
  const [promptModalData, setPromptModalData] = useState({})
  const [errorModalData, setErrorModalData] = useState({})

  // Input settings
  const [inputDeviceOpt, setInputDeviceOpt] = useState(existingSettings.inputDeviceOpt || INPUT_DEVICE_SELECTED)
  const [midiDeviceOpt, setMidiDeviceOpt] = useState(existingSettings.midiDeviceOpt || null)
  const [micDeviceOpt, setMicDeviceOpt] = useState(existingSettings.micDeviceOpt || null)
  const [showMidiPianoOpt, setShowMidiPianoOpt] = useState(existingSettings.showMidiPianoOpt || true)
  const [showPlayedMicNote, setShowPlayedMicNote] = useState(existingSettings.showPlayedMicNote || true)
  // Output settings
  const [outputSoundsOpt, setOutputSoundsOpt] = useState(existingSettings.outputSoundsOpt || null)
  const [playSuccessSoundOpt, setPlaySuccessSoundOpt] = useState(existingSettings.playSuccessSoundOpt || true)
  const [successSoundsOpt, setSuccessSoundsOpt] = useState(existingSettings.successSoundsOpt || null)
  const [playFailSoundOpt, setPlayFailSoundOpt] = useState(existingSettings.playFailSoundOpt || true)
  const [failSoundsOpt, setFailSoundsOpt] = useState(existingSettings.failSoundsOpt || null)

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
    // Internal State
    selectedGameMode,
    setSelectedGameMode,
    // Modal State
    setPromptModalData,
    setErrorModalData,
    // Input Options
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
    // Output options
    outputSoundsOpt,
    setOutputSoundsOpt,
    playSuccessSoundOpt,
    setPlaySuccessSoundOpt,
    successSoundsOpt,
    setSuccessSoundsOpt,
    playFailSoundOpt,
    setPlayFailSoundOpt,
    failSoundsOpt,
    setFailSoundsOpt,
    // Global Game options
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
    MainRender = <GameComponent />
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
        <PromptModal
          modalOpen={!!promptModalData.onModalPrompt}
          closeModal={() => setPromptModalData({})}
          modalData={promptModalData}
        />
        <ErrorModule
          modalOpen={!!errorModalData.onModalPrompt}
          closeModal={() => errorModalData({})}
          modalData={errorModalData}
        />
      </AppContext.Provider>
  )
}

export default App
