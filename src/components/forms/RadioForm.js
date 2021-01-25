import React from 'react'
import styled from 'styled-components'
import {
  THEME_SPLASH_COLOR,
  THEME_BORDER_COLOR,
} from '../../constants/styleConstants'

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

const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Option = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  position: relative;
`

const Label = styled.div`
  font-size: 1.1vw;  
  padding-top: .1vw;
  ${props => props.checked && `
    color: ${THEME_SPLASH_COLOR};
    font-weight: 600;
  `}
`
const RadioButtonLabel = styled.label`
  position: absolute;
  top: 25%;
  left: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 1px solid ${THEME_BORDER_COLOR};
  margin-left: .5vw;
`

const RadioButton = styled.input`
  margin-left: .9vw;
  opacity: 0;
  z-index: 1;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  transition: 0.5s;
  margin-right: 10px;
   ${props =>
    props.checked
    ? `&:checked + ${RadioButtonLabel} {
      background: ${THEME_SPLASH_COLOR};
      border: 1px solid ${THEME_SPLASH_COLOR};
      &::after {
        content: "";
        display: block;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        margin: 6px;
        box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.1);
        background: white;
      }
    }
    `
: `
    &:hover ~ ${RadioButtonLabel} {
      background: ${THEME_BORDER_COLOR};
      &::after {
        content: "";
        display: block;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        margin: 6px;
        background: #eeeeee;
      }
    }
  `}
`

function RadioForm ({
  title,
  stateValues,
  setValues,
}) {
  const onOptionSelect = (option) => {
    const newOptions = { ...stateValues }
    newOptions[option] = true
    // Set every other selected value to false for ratio buttons (there can only be one!)
    Object.keys(newOptions).forEach(optKey => {
      if (optKey !== option) {
        newOptions[optKey] = false
      }
    })
    setValues(newOptions)
  }

  const Options = Object.entries(stateValues).map((entry) => {
    return (
      <Option key={entry[0]}>
        <RadioButton onChange={() => onOptionSelect(entry[0])} checked={entry[1]} type='radio' />
        <RadioButtonLabel />
        <Label checked={entry[1]}>{entry[0]}</Label>
      </Option>
    )
  })

  return (
    <Wrapper>
      <Title>{title}</Title>
      <OptionsWrapper>
        {Options}
      </OptionsWrapper>
    </Wrapper>
  )
}

export default RadioForm
