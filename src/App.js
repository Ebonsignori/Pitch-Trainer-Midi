import React, { useState } from 'react'
import Game from './components/Game'
import Options from './components/Options'
import AppContext from './AppContext'
import {
  REPEAT_PREVIEW_COUNT_OPTS,
  START_NOTE_DISPLAY_SELECTED,
  INTERVALS_SELECTED,
  PLAY_MODES_SELECTED,
  FIXED_ROOT,
  UPPER_RANGE,
  LOWER_RANGE,
  INPUT_DEVICE_SELECTED,
} from './constants/settingsConstants'
import { GAME_OPTIONS, INTERVALS, RESULTS } from './constants/gameConstants'
import Results from './components/Results'

function App () {
  const [selectedGameMode, setSelectedGameMode] = useState(GAME_OPTIONS)
  // const [selectedGameMode, setSelectedGameMode] = useState(INTERVALS)

  // Input settings
  const [inputDeviceOpt, setInputDeviceOpt] = useState(INPUT_DEVICE_SELECTED)
  const [midiDeviceOpt, setMidiDeviceOpt] = useState(null)
  const [micDeviceOpt, setMicDeviceOpt] = useState({
    'default#default': true
  })
  const [showMidiPianoOpt, setShowMidiPianoOpt] = useState(true)

  // Global game settings
  const [tempoOpt, setTempoOpt] = useState(80)
  const [repeatPreviewCountOpt, setRepeatPreviewCountOpt] = useState(REPEAT_PREVIEW_COUNT_OPTS)
  const [startNoteDisplayOpt, setStartNoteDisplayOpt] = useState(START_NOTE_DISPLAY_SELECTED)
  const [autoContinueCorrectOpt, setAutoContinueCorrectOpt] = useState(true)
  const [autoContinueCorrectDelayOpt, setAutoContinueCorrectDelayOpt] = useState(2)
  const [autoContinueWrongOpt, setAutoContinueWrongOpt] = useState(true)
  const [autoContinueWrongDelayOpt, setAutoContinueWrongDelayOpt] = useState(2)
  const [repeatOnWrongOpt, setRepeatOnWrongOpt] = useState(true)

  // Game tab-level settings
  const [numberOfQuestionsOpt, setNumberOfQuestionsOpt] = useState(50)
  const [intervalsOpt, setIntervalsOpt] = useState(INTERVALS_SELECTED)
  const [playModesOpt, setPlayModesOpt] = useState(PLAY_MODES_SELECTED)
  const [fixedRootOpt, setFixedRootOpt] = useState(FIXED_ROOT)
  const [upperRangesOpt, setUpperRangesOpt] = useState(UPPER_RANGE)
  const [lowerRangesOpt, setLowerRangesOpt] = useState(LOWER_RANGE)

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
