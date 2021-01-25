import React from 'react'
import styled from 'styled-components'
import { INFINITE } from '../constants/settingsConstants'
import { THEME_SPLASH_COLOR } from '../constants/styleConstants'
import { ThemeBtn } from './Buttons'

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
  min-width: 98vw;
  min-width: 98vw;
  justify-content: center;
  align-items: center;
`

const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 5vh;
`

const Status = styled.div`
  min-height: 8vh;
  display: flex;
  font-size: 2.5vw;
  color: ${props => props.color ? props.color : THEME_SPLASH_COLOR};
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

function Results ({
  gameStats,
  selectedGameMode,
  numberOfQuestionsOpt,
  goBackToMenu,
}) {
  const {
    totalAnswered,
    numberCorrect,
    numberWrong,
  } = gameStats
  let questionsDisplay = `${totalAnswered} questions answered`
  if (numberOfQuestionsOpt !== INFINITE) {
    questionsDisplay = `${totalAnswered} out of ${numberOfQuestionsOpt} answered`
  }
  const percentCorrect = Math.round((numberCorrect / numberOfQuestionsOpt) * 100) / 100
  return (
    <PageWrapper>
      <TitleRow>
        <Title>{selectedGameMode} Results</Title>
      </TitleRow>
      <StatusRow>
        <StatusColumn>
          <Status color='black'>{questionsDisplay}</Status>
          <Status color='darkgreen'>Percent Correct: {percentCorrect}%</Status>
          <Status color='green'>Number Correct: {numberCorrect}</Status>
          <Status color='red'>Number Incorrect: {numberWrong}</Status>
        </StatusColumn>
      </StatusRow>
      <ButtonsRow>
        <ThemeBtn onClick={goBackToMenu}>Back to Menu</ThemeBtn>
      </ButtonsRow>
    </PageWrapper>
  )
}

export default Results
