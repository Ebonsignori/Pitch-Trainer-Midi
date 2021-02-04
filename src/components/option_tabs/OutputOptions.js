import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { THEME_BORDER_COLOR } from '../../constants/styleConstants'
import DropdownForm from '../forms/DropdownForm'
import AppContext from '../../AppContext'
import { getSelectedSetting } from '../../utils/settings'
import { GreenBtn } from '../Buttons'
import { fetchInstruments } from '../../utils/instruments'
import Game from '../../services/Game'
import { fetchSounds } from '../../utils/sounds'
import ToggleForm from '../forms/ToggleForm'

const GlobalSettingsWrapper = styled.div`
  border-top: 1px solid ${THEME_BORDER_COLOR};
  max-height: 95vh;
  min-height: 95vh;
  overflow-y: auto;
  padding: 1vw;
`

const ExplanationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1vw;
`

const ExplanatoryTitle = styled.div`
  font-size: 1.8vw;
  font-weight: 600;
  align-items: center;
  margin-bottom: 1vw;
`

const ExplanatoryText = styled.div`
  font-size: 1.5vw;
  align-items: center;
`

const { DEFAULT_INSTRUMENT, DEFAULT_SUCCESS_SOUND, DEFAULT_FAIL_SOUND } = process.env

let instruments
let sounds
let game
let previousInstrument
let previousFailSound
let previousSuccessSound
function OutputOptions () {
  const appState = useContext(AppContext)
  const [instrumentsLoading, setInstrumentsLoading] = useState(false)
  const [instrumentReady, setInstrumentReady] = useState(false)
  const [soundsLoading, setSoundsLoading] = useState(false)
  const [successSoundPlaying, setSuccessSoundPlaying] = useState(false)
  const [failSoundPlaying, setFailSoundPlaying] = useState(false)
  const [testSongPlaying, setTestSongPlaying] = useState(false)

  const selectedInstrument = getSelectedSetting(appState.outputSoundsOpt, true) || DEFAULT_INSTRUMENT
  const selectedSuccessSound = getSelectedSetting(appState.successSoundsOpt, true) || DEFAULT_SUCCESS_SOUND
  const selectedFailSound = getSelectedSetting(appState.failSoundsOpt, true) || DEFAULT_FAIL_SOUND

  const refreshInputs = () => {
    instruments = null
    game = null
    previousInstrument = null
    sounds = null
    previousFailSound = null
    previousSuccessSound = null
    setInstrumentReady(false)
    setInstrumentsLoading(true)
  }

  // On unmount, refresh
  useEffect(() => {
    return () => {
      refreshInputs()
    }
  }, [])

  if (!previousInstrument) {
    previousInstrument = selectedInstrument
  }
  if (!previousSuccessSound) {
    previousSuccessSound = selectedSuccessSound
  }
  if (!previousFailSound) {
    previousFailSound = selectedFailSound
  }
  if (previousInstrument !== selectedInstrument) {
    refreshInputs()
  }
  if (previousSuccessSound !== selectedSuccessSound) {
    refreshInputs()
  }
  if (previousFailSound !== selectedFailSound) {
    refreshInputs()
  }

  if (!instruments) {
    setInstrumentsLoading(true)
    instruments = fetchInstruments().then((instrumentMap) => {
      const instrumentOptions = {}
      Object.entries(instrumentMap).forEach(entry => {
        if (entry[1] === selectedInstrument) {
          instrumentOptions[`${entry[0]}#${entry[1]}`] = true
        } else {
          instrumentOptions[`${entry[0]}#${entry[1]}`] = false
        }
      })
      appState.setOutputSoundsOpt(instrumentOptions)
      setInstrumentsLoading(false)
    })
  }

  if (!sounds) {
    setSoundsLoading(true)
    sounds = fetchSounds().then((soundsMap) => {
      const successSounds = {}
      const failSounds = {}
      Object.entries(soundsMap).forEach(entry => {
        if (entry[1] === selectedSuccessSound) {
          successSounds[`${entry[0]}#${entry[1]}`] = true
        } else {
          successSounds[`${entry[0]}#${entry[1]}`] = false
        }
        if (entry[1] === selectedFailSound) {
          failSounds[`${entry[0]}#${entry[1]}`] = true
        } else {
          failSounds[`${entry[0]}#${entry[1]}`] = false
        }
      })
      appState.setSuccessSoundsOpt(successSounds)
      appState.setFailSoundsOpt(failSounds)
      setSoundsLoading(false)
    })
  }

  if (!game && appState.outputSoundsOpt && appState.successSoundsOpt && appState.failSoundsOpt && !instrumentsLoading && !soundsLoading) {
    game = new Game(appState)
    game.instrumentReady().then(() => {
      setInstrumentReady(true)
    })
  }

  let SoundsRender = null
  if (soundsLoading) {
    SoundsRender = 'Loading sounds...'
  } else {
    SoundsRender = (
      <>
      <ToggleForm title='Play sound on correct answer' stateValue={appState.playSuccessSoundOpt} setValue={appState.setPlaySuccessSoundOpt} />
      {appState.playSuccessSoundOpt && (
        <>
        <DropdownForm isCompound title='Success Sound' stateValues={appState.successSoundsOpt} setValues={appState.setSuccessSoundsOpt} />
        {instrumentReady
          ? <GreenBtn small disabled={successSoundPlaying} onClick={async () => {
            if (successSoundPlaying) {
              return
            }
            setSuccessSoundPlaying(true)
            await game.playSuccessSound()
            setSuccessSoundPlaying(false)
          }} >Test Sound</GreenBtn>
          : (
            <ExplanationWrapper>
              <ExplanatoryText>
                Loading Sounds. This may take a minute...
              </ExplanatoryText>
            </ExplanationWrapper>
            )
        }
        </>
      )}
      <ToggleForm title='Play sound on wrong answer' stateValue={appState.playFailSoundOpt} setValue={appState.setPlayFailSoundOpt} />
      {appState.playFailSoundOpt && (
        <>
        <DropdownForm isCompound title='Fail Sound' stateValues={appState.failSoundsOpt} setValues={appState.setFailSoundsOpt} />
        {instrumentReady
          ? <GreenBtn small disabled={failSoundPlaying} onClick={async () => {
            if (failSoundPlaying) {
              return
            }
            setFailSoundPlaying(true)
            await game.playFailSound()
            setFailSoundPlaying(false)
          }}>Test Sound</GreenBtn>
          : (
            <ExplanationWrapper>
              <ExplanatoryText>
                Loading Sounds. This may take a minute...
              </ExplanatoryText>
            </ExplanationWrapper>
            )
        }
        </>
      )}
      </>
    )
  }

  return (
        <GlobalSettingsWrapper>
          <ExplanationWrapper>
            <ExplanatoryTitle>
              Output Options
            </ExplanatoryTitle>
            <ExplanatoryText>
              Instrument and feedback sound choices.
            </ExplanatoryText>
          </ExplanationWrapper>
            {instrumentsLoading
              ? 'Loading instruments...'
              : (
                <>
                  <DropdownForm isCompound title='Instrument Sound' stateValues={appState.outputSoundsOpt} setValues={appState.setOutputSoundsOpt} />
                  {instrumentReady
                    ? <GreenBtn small disabled={testSongPlaying} onClick={async () => {
                      if (testSongPlaying) {
                        return
                      }
                      setTestSongPlaying(true)
                      await game.playTestSong()
                      setTestSongPlaying(false)
                    }} >Test Instrument</GreenBtn>
                    : (
                      <ExplanationWrapper>
                        <ExplanatoryText>
                          Loading Instrument. This may take a minute...
                        </ExplanatoryText>
                      </ExplanationWrapper>
                      )}
                </>
                )}
            {SoundsRender}
        </GlobalSettingsWrapper>
  )
}

export default OutputOptions
