import React from 'react'
import styled from 'styled-components'
// import {
  // THEME_SPLASH_COLOR,
  // THEME_BORDER_COLOR,
// } from '../../constants/styleConstants'
import Checkbox from './CheckBox'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 5px;
  display: flex;
  font-size: 1.5vw;
  align-items: center;
  justify-content: start;
`

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

function CheckboxForm ({
  title,
  stateValues,
  setValues,
}) {
  const onOptionSelect = (option) => {
    const newOptions = { ...stateValues }
    newOptions[option] = !newOptions[option]
    setValues(newOptions)
  }

  const CheckBoxes = Object.entries(stateValues).map((entry) => {
    return (
      <Checkbox key={entry[0]} onChange={() => onOptionSelect(entry[0])} checked={entry[1]} label={entry[0]} />
    )
  })

  return (
    <Wrapper>
      <Title>{title}</Title>
      <CheckboxWrapper>
        {CheckBoxes}
      </CheckboxWrapper>
    </Wrapper>
  )
}

export default CheckboxForm
