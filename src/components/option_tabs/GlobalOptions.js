import React, { useContext } from 'react'
import styled from 'styled-components'
import RadioForm from '../forms/RadioForm'
import NumberForm from '../forms/NumberForm'
import ToggleForm from '../forms/ToggleForm'
import { THEME_BORDER_COLOR } from '../../constants/styleConstants'
import DropdownForm from '../forms/DropdownForm'
import AppContext from '../../AppContext'

const GlobalSettingsWrapper = styled.div`
  border-top: 1px solid ${THEME_BORDER_COLOR};
  max-height: 95vh;
  min-height: 95vh;
  overflow-y: auto;
`

function GlobalOptions () {
  const appState = useContext(AppContext)
  return (
        <GlobalSettingsWrapper>
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
          <DropdownForm title='Repeat Preview Count' stateValues={appState.repeatPreviewCountOpt} setValues={appState.setRepeatPreviewCountOpt} />
        </GlobalSettingsWrapper>
  )
}

export default GlobalOptions
