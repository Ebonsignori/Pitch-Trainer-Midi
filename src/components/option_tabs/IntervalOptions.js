import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import AppContext from '../../AppContext'
import CheckboxForm from '../forms/CheckboxForm'
import DropdownForm from '../forms/DropdownForm'
import { GreenBtn } from '../Buttons'
import { THEME_BORDER_COLOR } from '../../constants/styleConstants'
import { INTERVALS } from '../../constants/gameConstants'
import NumberForm from '../forms/NumberForm'
import { saveAllSettings } from '../../utils/settings'

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

function IntervalOptions () {
  const appState = useContext(AppContext)
  return (
    <SelectedTabWrapper>
      {}
      <SelectedTabRow>
        <ExplanationWrapper>
          <ExplanatoryTitle>
            Interval Recognition Mode
          </ExplanatoryTitle>
          <ExplanatoryText>
           The intervals you select will be randomly be played with the interval's starting note anywhere between the lowest and highest note option selected.
           The starting note in each interval will be given and you need to play the second note of the interval on your MIDI device.
           Intervals can be ascending (up), descending (down), harmonic (same time) modes depending on selections.
          </ExplanatoryText>
        </ExplanationWrapper>
      </SelectedTabRow>
      <SelectedTabRow>
        <SelectedTabColumn>
            <NumberForm title='Number of Questions' units='-1 for infinite' stateValue={appState.numberOfQuestionsOpt} setValue={appState.setNumberOfQuestionsOpt} canBeInfinite />
        </SelectedTabColumn>
        <SelectedTabColumn>
          <CheckboxForm title='Intervals' stateValues={appState.intervalsOpt} setValues={appState.setIntervalsOpt} />
        </SelectedTabColumn>
        <SelectedTabColumn>
          <CheckboxForm title='Play Modes' stateValues={appState.playModesOpt} setValues={appState.setPlayModesOpt} />
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
          appState.setSelectedGameMode(INTERVALS)
        }}>Start Interval Mode</GreenBtn>
      </SelectedTabRow>
    </SelectedTabWrapper>
  )
}

export default IntervalOptions
