import React, { useContext } from 'react'
import styled from 'styled-components'
import RadioForm from '../forms/RadioForm'
import NumberForm from '../forms/NumberForm'
import ToggleForm from '../forms/ToggleForm'
import { THEME_BORDER_COLOR } from '../../constants/styleConstants'
import AppContext from '../../AppContext'

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

function GlobalOptions () {
  const appState = useContext(AppContext)
  return (
        <GlobalSettingsWrapper>
          <ExplanationWrapper>
            <ExplanatoryTitle>
              Global Options
            </ExplanatoryTitle>
            <ExplanatoryText>
              Options that apply to each game mode.
            </ExplanatoryText>
          </ExplanationWrapper>
          <NumberForm title='Tempo' units='BPM' stateValue={appState.tempoOpt} setValue={appState.setTempoOpt} min={15} max={300} />
          <RadioForm title='Starting Note Display' stateValues={appState.startNoteDisplayOpt} setValues={appState.setStartNoteDisplayOpt} />
          <ToggleForm title='Auto Continue on Correct' stateValue={appState.autoContinueCorrectOpt} setValue={appState.setAutoContinueCorrectOpt} />
          {appState.autoContinueCorrectOpt
            ? <NumberForm title='Correct Auto Continue Delay' units='Seconds' stateValue={appState.autoContinueCorrectDelayOpt} setValue={appState.setAutoContinueCorrectDelayOpt} min={0} max={60} />
            : null
          }
          <ToggleForm title='Auto Continue on Wrong' stateValue={appState.autoContinueWrongOpt} setValue={appState.setAutoContinueWrongOpt} />
          {appState.autoContinueWrongOpt
            ? <NumberForm title='Wrong Auto Continue Delay' units='Seconds' stateValue={appState.autoContinueWrongDelayOpt} setValue={appState.setAutoContinueWrongDelayOpt} min={0} max={60} />
            : null
          }
          <ToggleForm title='Repeat on Wrong' stateValue={appState.repeatOnWrongOpt} setValue={appState.setRepeatOnWrongOpt} />
          <NumberForm title='Repeat Preview Count' stateValue={appState.repeatPreviewCountOpt} setValue={appState.setRepeatPreviewCountOpt} min={0} max={10} />
        </GlobalSettingsWrapper>
  )
}

export default GlobalOptions
