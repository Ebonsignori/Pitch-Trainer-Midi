import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Piano } from 'react-piano'
import { PianoStyle } from './note_display/pianoStyle'
import AppContext from '../AppContext'
import { ANSWERED_STATE, INTERVALS, LISTENING_STATE, PLAYING_STATE, RESULTS } from '../constants/gameConstants'
import { INFINITE, MICROPHONE_DEVICE, NOTE_DISPLAY, PIANO_DISPLAY, SHEET_MUSIC_DISPLAY } from '../constants/settingsConstants'
import { THEME_SPLASH_COLOR } from '../constants/styleConstants'
import IntervalGame from '../services/IntervalGame'
import { GreenBtn, RedBtn, ThemeBtn } from './Buttons'
// import SheetMusic from './note_display/SheetMusic'
import { Note } from '@tonaljs/tonal'
import Microphone from '../utils/microphone'
import { getSelectedSetting } from '../utils/settings'
import NoteStrings from './note_display/NoteStrings'

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 98vw;
  min-height: 98vh;
  max-width: 98vw;
  max-height: 98vh;
  overflow: hidden;
`

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  max-height: 8vh;
  min-height: 8vh;
  margin-top: 5vh;
`

const Title = styled.div`
  display: flex;
  font-size: 4vw;
  font-weight: 600;
  color: ${THEME_SPLASH_COLOR};
  min-width: 98vw;
  min-width: 98vw;
  justify-content: center;
  align-items: center;
`

const StatusRow = styled.div`
  display: flex;
  flex-direction: row;
  max-height: 10vh;
  min-height: 10vh;
  min-width: 98vw;
  min-width: 98vw;
  justify-content: center;
  align-items: center;
`

const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 8vh;
  min-height: 8vh;
`

const Status = styled.div`
  display: flex;
  font-size: 1.5vw;
  color: ${props => props.color ? props.color : THEME_SPLASH_COLOR};
`

const NoteDisplayRow = styled.div`
  display: flex;
  flex-direction: row;
  max-height: 15vh;
  min-height: 15vh;
  max-width: 100vw;
  min-width: 100vw;
  justify-content: center;
`

const StateRow = styled.div`
  display: flex;
  font-size: 1.5vw; 
  align-items: center;
  justify-content: center;
  max-height: 10vh;
  min-height: 10vh;
`

const Playing = styled.div`
  font-size: 2.5vw;
  font-weight: 600;
  color: orange;
`

const Listening = styled.div`
  font-size: 2.5vw;
  font-weight: 600;
  color: green;
`

const CountDown = styled.div`
  font-size: 1.5vw;
  color: black;
`

const AnswerResult = styled.div`
  font-size: 2.5vw;
  font-weight: 600;
  color: ${props => props.correct ? 'green' : 'red'};
`

const IntervalResult = styled.div`
  font-size: 2.5vw;
  font-weight: 900;
`

const InfoRow = styled.div`
  display: flex;
  font-size: 1.5vw; 
  align-items: center;
  justify-content: center;
  max-height: 5vh;
  min-height: 5vh;
`

const ButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 5vh;
  max-height: 5vh;
  min-height: 5vh;
`

const PianoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 5vh;
  max-height: 15vh;
  min-height: 15vh;
`

const NotePlayedWrapper = styled.div`
  margin-top: 3vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const NotePlayedTitle = styled.div`
  font-size: 2vw;
`

const NotePlayedText = styled.div`
  font-size: 2.5vw;
  font-weight: 900;
`

const CORRECT = 'Correct!'
const WRONG = 'Incorrect.'
let gameObject
let microphone
let isUsingMic = null
let noteDisplayOpt = null
let countDownInterval = null
let initialNotePlayed = false

function Game () {
  useEffect(() => {
  // On umount, cleanup
    return () => {
      microphone.stop()
      gameObject = undefined
      microphone = undefined
      isUsingMic = null
      noteDisplayOpt = null
      clearInterval(countDownInterval)
      countDownInterval = null
      initialNotePlayed = false
    }
  }, [])

  const appState = useContext(AppContext)
  const [gameState, setGameState] = useState(PLAYING_STATE)
  const [gameObjectLoading, setGameObjectLoading] = useState(true)
  const [microphoneLoading, setMicrophoneLoading] = useState(true)
  const [noteDisplayIsLoading, setNoteDisplayIsLoading] = useState(true)
  const [notePlayed, setNotePlayed] = useState(null)
  const [answerResult, setAnswerResult] = useState(CORRECT)
  const [numberCorrect, setNumberCorrect] = useState(0)
  const [numberWrong, setNumberWrong] = useState(0)
  const [countDownSecond, setCountDownSecond] = useState(0)
  const [repeating, setRepeating] = useState(null)

  const totalAnswered = numberCorrect + numberWrong
  const isTheEnd = gameState === RESULTS ||
     (appState.numberOfQuestionsOpt !== INFINITE && totalAnswered >= appState.numberOfQuestionsOpt)
  const isQuestionBeforeLast = (appState.numberOfQuestionsOpt !== INFINITE &&
      numberWrong + numberCorrect + 1 >= appState.numberOfQuestionsOpt)

  if (isTheEnd) {
    appState.setGameStats({
      totalAnswered,
      numberCorrect,
      numberWrong,
    })
    appState.setSelectedGameMode(RESULTS)
  }

  const updateTotals = async (isWrong, gameObject) => {
    const gameState = await gameObject.getCurrentState()
    if (gameState === PLAYING_STATE) {
      return
    }
    setGameState(ANSWERED_STATE)
    if (isWrong) {
      setAnswerResult(WRONG)
      setNumberWrong((prevWrong) => prevWrong + 1)
      if (appState.playFailSoundOpt) {
        setRepeating(true)
        await gameObject.playFailSound()
        setRepeating(false)
      }
      if (appState.repeatOnWrongOpt) {
        setRepeating(true)
        await gameObject.onReplay(true)
        setRepeating(false)
      }
      if (appState.autoContinueWrongOpt) {
        setCountDownSecond(appState.autoContinueWrongDelayOpt)
        countDownInterval = setInterval(() => {
          setCountDownSecond((prevSecond) => {
            prevSecond -= 1
            if (prevSecond <= 0 && !isQuestionBeforeLast) {
              gameObject.onNext()
              clearInterval(countDownInterval)
            }
            return prevSecond
          })
        }, 1000)
      }
    } else {
      setAnswerResult(CORRECT)
      setNumberCorrect((prevCorrect) => prevCorrect + 1)
      if (appState.autoContinueCorrectOpt) {
        setCountDownSecond(appState.autoContinueCorrectDelayOpt)
        countDownInterval = setInterval(() => {
          setCountDownSecond((prevSecond) => {
            prevSecond -= 1
            if (prevSecond <= 0 && !isQuestionBeforeLast) {
              gameObject.onNext()
              clearInterval(countDownInterval)
            }
            return prevSecond
          })
        }, 1000)
      }
    }
  }

  if (!gameObject) {
    if (appState.selectedGameMode === INTERVALS) {
      gameObject = new IntervalGame(
        appState,
        setGameState,
        updateTotals,
        setRepeating,
        setNoteDisplayIsLoading,
        setNotePlayed
      )
      gameObject.instrumentReady().then(() => {
        setGameObjectLoading(false)
      })
    }
  }

  const nextQuestion = () => {
    if (repeating) {
      return
    }
    clearInterval(countDownInterval)
    setCountDownSecond(0)
    if (!isQuestionBeforeLast) {
      gameObject.onNext()
    }
  }

  // Cache settings locally
  if (isUsingMic === null) {
    isUsingMic = getSelectedSetting(appState.inputDeviceOpt) === MICROPHONE_DEVICE
  }
  if (noteDisplayOpt === null) {
    noteDisplayOpt = getSelectedSetting(appState.startNoteDisplayOpt)
  }

  if (isUsingMic && !microphone && gameObject) {
    const selectedMicDevice = getSelectedSetting(appState.micDeviceOpt, true)
    microphone = new Microphone(
      selectedMicDevice,
      (note) => gameObject.onNotePlayed(note, true),
      appState.setErrorModalData
    )
    microphone.init().then(() => {
      microphone.listen()
      setMicrophoneLoading(false)
    })
  }

  if ((isUsingMic && microphoneLoading) || gameObjectLoading) {
    return 'Loading...'
  }

  if (!initialNotePlayed) {
    initialNotePlayed = true
    gameObject.onNext()
  }

  let NotePlayedDisplay = null
  if (!isUsingMic && appState.showMidiPianoOpt) {
    const firstNote = Note.get(gameObject.lowestNote || 'C2').midi
    const lastNote = Note.get(gameObject.highestNote || 'C6').midi
    NotePlayedDisplay = (
      <PianoRow>
        <PianoStyle />
        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          activeNotes={[Note.get(gameObject.songNotes[0]).midi]}
          playNote={(midiNumber) => {
            // Play a given note - see notes below
          }}
          stopNote={(midiNumber) => {
            // Stop playing a given note - see notes below
          }}
          width={500}
        />
      </PianoRow>
    )
  } else if (isUsingMic && notePlayed && gameState !== ANSWERED_STATE) {
    NotePlayedDisplay = (
      <NotePlayedWrapper>
        <NotePlayedTitle>
          Last Note Played:
        </NotePlayedTitle>
        <NotePlayedText>
         {notePlayed}
        </NotePlayedText>
      </NotePlayedWrapper>
    )
  }

  let NoteDisplay = null
  if (!noteDisplayIsLoading) {
    if (noteDisplayOpt === PIANO_DISPLAY) {
      const firstNote = Note.get(gameObject.lowestNote || 'C2').midi
      const lastNote = Note.get(gameObject.highestNote || 'C6').midi
      const activeNotes = []
      if (gameObject && gameObject.songNotes && gameObject.songNotes.length) {
        for (let i = 0; i < gameObject.songNotes.length; i++) {
          if (i < gameObject.correctIndex || i === 0) {
            activeNotes.push(Note.get(gameObject.songNotes[i]).midi)
          }
        }
      }
      NoteDisplay = (
      <PianoRow>
        <PianoStyle />
        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          activeNotes={activeNotes}
          playNote={() => {}}
          stopNote={() => {}}
          width={500}
        />
      </PianoRow>
      )
    } else if (noteDisplayOpt === SHEET_MUSIC_DISPLAY) {
    // NoteDisplay = (
    // <SheetMusic
    // // notes={gameObject.songNotes}
    // notes={[['c4', 'e4'], 'd4']}
    // correctIndex={gameObject.correctIndex}
    // playMode={gameObject.playMode}
    // key={gameObject.songNotes.join('-')}
    // />
    // )
    } else if (noteDisplayOpt === NOTE_DISPLAY) {
      NoteDisplay = (
        <NoteStrings
          notes={gameObject.songNotes}
          correctIndex={gameObject.correctIndex}
          correctHarmonics={gameObject.correctHarmonics}
        />
      )
    }
  }

  let StatusDisplay = <Listening>{gameState}</Listening>
  let NextBtnDisplay = <ThemeBtn onClick={() => updateTotals(true, gameObject)}>Skip</ThemeBtn>
  let IntervalDisplay = <IntervalResult>?</IntervalResult>
  if (gameState === LISTENING_STATE) {
    StatusDisplay = <Playing>{gameState}</Playing>
  } else if (gameState === ANSWERED_STATE) {
    IntervalDisplay = <IntervalResult>{gameObject.interval}</IntervalResult>
    StatusDisplay = <AnswerResult correct={answerResult === CORRECT}>{answerResult}</AnswerResult>
    NextBtnDisplay = (
    <GreenBtn onClick={nextQuestion}>Next</GreenBtn>
    )
  }

  const currentQuestionStatus = `${totalAnswered + 1} / ${appState.numberOfQuestionsOpt}`
  return (
    <PageWrapper>
      <TitleRow>
        <Title>{appState.selectedGameMode}</Title>
      </TitleRow>
      <StatusRow>
        <StatusColumn>
          <Status>Question: {currentQuestionStatus}</Status>
          <Status color='green'>Correct: {numberCorrect}</Status>
          <Status color='red'>Incorrect: {numberWrong}</Status>
        </StatusColumn>
      </StatusRow>
      <NoteDisplayRow>
        {NoteDisplay}
      </NoteDisplayRow>
      <StateRow>
        {StatusDisplay}
      </StateRow>
      <InfoRow>
        {IntervalDisplay}
      </InfoRow>
      {repeating && (
      <StateRow>
        <CountDown>
          {repeating}
        </CountDown>
      </StateRow>
      )}
      {countDownSecond > 0 && (
      <StateRow>
        <CountDown>
          Continuing in: {countDownSecond} seconds
        </CountDown>
      </StateRow>
      )}
      <ButtonsRow>
        <ThemeBtn onClick={() => {
          if (!repeating && countDownSecond <= 0) {
            gameObject.onReplay()
          }
        }}>Replay</ThemeBtn>
        {NextBtnDisplay}
      </ButtonsRow>
      <ButtonsRow>
        <RedBtn onClick={() => {
          appState.setPromptModalData({
            onModalPrompt: (shouldDoPrompt) => {
              if (shouldDoPrompt) {
                setGameState(RESULTS)
              }
              appState.setPromptModalData({})
            },
            heading: 'Are you sure you want to stop playing?'
          })
        }}>End</RedBtn>
      </ButtonsRow>
      {NotePlayedDisplay}
    </PageWrapper>
  )
}

export default Game
