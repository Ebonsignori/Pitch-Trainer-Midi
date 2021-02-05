import React, { useContext } from 'react'
import styled from 'styled-components'
import AppContext from '../../AppContext'
import CheckboxForm from '../forms/CheckboxForm'
import DropdownForm from '../forms/DropdownForm'
import { GreenBtn } from '../Buttons'
import { THEME_BORDER_COLOR } from '../../constants/styleConstants'
import { MELODIES } from '../../constants/gameConstants'
import NumberForm from '../forms/NumberForm'
import { saveAllSettings } from '../../utils/settings'
import ToggleForm from '../forms/ToggleForm'

const SelectedTabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${THEME_BORDER_COLOR};
  border-top: 1px solid ${THEME_BORDER_COLOR};
  max-height: 95vh;
  min-height: 95vh;
  overflow-y: auto;
`

const SelectedTabRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 1vw;

  :last-of-type {
    margin-top: 3vw;
  }
`

const SelectedTabColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1vw;
  margin-right: 4vw;
`

const ExplanationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2vw;
`

const ExplanatoryTitle = styled.div`
  font-size: 1.8vw;
  font-weight: 600;
  align-items: center;
  justify-content: start;
  margin-bottom: 1vw;
`

const ExplanatoryText = styled.div`
  font-size: 1.5vw;
  align-items: center;
  justify-content: start;
`

function MelodyOptions () {
  const appState = useContext(AppContext)
  return (
    <SelectedTabWrapper>
      <SelectedTabRow>
        <ExplanationWrapper>
          <ExplanatoryTitle>
            Melody Playback Mode
          </ExplanatoryTitle>
          <ExplanatoryText>
            In this game mode, a random melody will be played using the selections below. You must play back the melody in the same order it was played to get it correct.
          </ExplanatoryText>
        </ExplanationWrapper>
      </SelectedTabRow>
      <SelectedTabRow>
        <SelectedTabColumn>
            <NumberForm title='Number of Questions' units='Empty for infinite' stateValue={appState.numberOfQuestionsOpt} setValue={appState.setNumberOfQuestionsOpt} canBeInfinite />
            <NumberForm title='Number of melody notes' units='1-12 to play' stateValue={appState.numberOfMelodyNotesOpt} setValue={appState.setNumberOfMelodyNotesOpt} min={1} max={12} />
          <ToggleForm title='Randomize Rythme?' stateValue={appState.randomizeRythmeOpt} setValue={appState.setRandomizeRythmeOpt} />
        </SelectedTabColumn>
        <SelectedTabColumn>
          <CheckboxForm title='Keys' stateValues={appState.melodyKeysOpt} setValues={appState.setMelodyKeysOpt} />
        </SelectedTabColumn>
        <SelectedTabColumn>
          <DropdownForm title='Fixed Root Note' stateValues={appState.fixedRootOpt} setValues={appState.setFixedRootOpt} />
          <DropdownForm title='Lowest Note' stateValues={appState.lowerRangesOpt} setValues={appState.setLowerRangesOpt} />
          <DropdownForm title='Highest Note' stateValues={appState.upperRangesOpt} setValues={appState.setUpperRangesOpt} />
        </SelectedTabColumn>
      </SelectedTabRow>
      <SelectedTabRow style={{ marginLeft: '3vw' }}>
        <GreenBtn onClick={() => {
          saveAllSettings(appState)
          appState.setSelectedGameMode(MELODIES)
        }}>Start Melody Mode</GreenBtn>
      </SelectedTabRow>
    </SelectedTabWrapper>
  )
}

export default MelodyOptions
