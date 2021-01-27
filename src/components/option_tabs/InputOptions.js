import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import ToggleForm from '../forms/ToggleForm'
import RadioForm from '../forms/RadioForm'
import { THEME_BORDER_COLOR, THEME_SPLASH_COLOR } from '../../constants/styleConstants'
import DropdownForm from '../forms/DropdownForm'
import AppContext from '../../AppContext'
import { getSelectedSetting } from '../../utils/settings'
import { MICROPHONE_DEVICE } from '../../constants/settingsConstants'
import { GreenBtn, RedBtn } from '../Buttons'
import Microphone, { getInputDevices } from '../../utils/microphone'

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

const PreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const PreviewTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2vw;
  font-weight: 600;
  margin-top: 2vh;
`
const PreviewSubText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1vw
  margin-top: 2vh;
  text-align: center;
`

const NotePreview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.listening ? '3.5vw' : '1vw'};
  color: ${THEME_SPLASH_COLOR};
  font-weight: 600;
  margin-top: 2vh;
`

let microphone
let devices
function InputOptions () {
  const appState = useContext(AppContext)
  const [isListening, setIsListening] = useState(false)
  const [notePlayed, setNotePlayed] = useState(null)
  const [devicesLoading, setDevicesLoading] = useState(false)
  const [microphoneLoading, setMicrophoneLoading] = useState(false)

  const inputDeviceSelected = getSelectedSetting(appState.inputDeviceOpt)
  const selectedMicDevice = getSelectedSetting(appState.micDeviceOpt, true)

  const refreshInputs = () => {
    microphone = null
    devices = null
    setDevicesLoading(true)
    setMicrophoneLoading(true)
  }

  // Async fetch and populate mic input device options
  if (!devices) {
    setDevicesLoading(true)
    devices = getInputDevices().then((mics) => {
      const deviceOptions = {}
      mics.forEach(mic => {
        if (mic.id === 'default') {
          deviceOptions[`${mic.label.replace('#', '')}#${mic.id}`] = true
        } else {
          deviceOptions[`${mic.label.replace('#', '')}#${mic.id}`] = false
        }
      })
      appState.setMicDeviceOpt(deviceOptions)
      setDevicesLoading(false)
    })
  }

  // Callback used internally by Microphone to set played note
  const onNotePlayed = (note) => {
    setNotePlayed(note)
  }

  // Once micDevice is selected, load microphone or on mic change
  if ((devices && selectedMicDevice && !microphone) ||
    (microphone && microphone.deviceId !== selectedMicDevice)) {
    setMicrophoneLoading(true)
    microphone = new Microphone(
      selectedMicDevice,
      onNotePlayed,
      setIsListening
    )
    microphone.init().then(() => {
      setMicrophoneLoading(false)
    })
  }

  let MicPreviewRender = null
  if (microphone) {
    if (microphoneLoading) {
      MicPreviewRender = 'Microphone is loading...'
    } else {
      let NotePreviewRender = null
      if (isListening) {
        NotePreviewRender = 'Listening...'
        if (notePlayed) {
          NotePreviewRender = notePlayed
        }
      } else {
        NotePreviewRender = 'Not Listening'
      }
      MicPreviewRender = (
        <PreviewWrapper>
          <PreviewTitle>Mic Check</PreviewTitle>
          <PreviewSubText>{'If note doesn\'t match, try tuning your instrument, trying another device, or switching to Midi.'}</PreviewSubText>
          <NotePreview listening={NotePreviewRender !== 'Listening...' && NotePreviewRender !== 'Not Listening'}>{NotePreviewRender}</NotePreview>
          {!isListening
            ? <GreenBtn small onClick={() => microphone.listen()}>Listen</GreenBtn>
            : <RedBtn small onClick={() => microphone.stop()}>Stop Listening</RedBtn>
          }
        </PreviewWrapper>
      )
    }
  }

  let DeviceOptions = (
    <>
      <DropdownForm title='Midi Device' stateValues={appState.midiDeviceOpt} setValues={appState.setMidiDeviceOpt} />
      <ToggleForm title='Show MIDI piano' stateValue={appState.showMidiPianoOpt} setValue={appState.setShowMidiPianoOpt} />
    </>
  )
  if (inputDeviceSelected === MICROPHONE_DEVICE) {
    DeviceOptions = (
      <>
        {devicesLoading
          ? 'Loading mic devices...'
          : (
            <>
            <DropdownForm isCompound title='Microphone Device' stateValues={appState.micDeviceOpt} setValues={appState.setMicDeviceOpt} />
            <GreenBtn small onClick={() => refreshInputs()}>Refresh Inputs</GreenBtn>
            </>
            )
        }
        {MicPreviewRender}
      </>
    )
  }
  return (
        <GlobalSettingsWrapper>
          <ExplanationWrapper>
            <ExplanatoryTitle>
              Instrument Options
            </ExplanatoryTitle>
            <ExplanatoryText>
              Input and playback instrument options.
            </ExplanatoryText>
          </ExplanationWrapper>
          <RadioForm title='Input Engine' stateValues={appState.inputDeviceOpt} setValues={appState.setInputDeviceOpt} />
          {DeviceOptions}
        </GlobalSettingsWrapper>
  )
}

export default InputOptions
