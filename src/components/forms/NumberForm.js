import React from 'react'
import styled from 'styled-components'
import { THEME_BORDER_COLOR, THEME_SPLASH_COLOR } from '../../constants/styleConstants'
import { INFINITE } from '../../constants/settingsConstants'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  display: flex;
  font-size: 1.5vw;
  align-items: center;
  justify-content: start;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const Units = styled.div`
  display: flex;
  font-size: 1.1vw;
  align-items: center;
  justify-content: center;
`

const Input = styled.input`
  margin-left: 10px;
  margin-right: 10px;
  text-align: center;
  font-size: 1.1vw;
  min-width: 4vw;
  max-width: 4vw;
  font-size: 18px;
  padding: 5px;
  background: white;
  border: 1.5px solid ${THEME_BORDER_COLOR};
  border-radius: 3px;
  ::placeholder {
    color: ${THEME_SPLASH_COLOR};
  }
  :focus {
    outline: none !important;
    border: 1.5px solid ${THEME_SPLASH_COLOR};
    box-shadow: 0 0 10px ${THEME_SPLASH_COLOR};
  }
`

function isNumeric (string) {
  if (typeof string !== 'string') return false
  return !isNaN(string) && !isNaN(parseFloat(string))
}

function NumberForm ({
  title,
  units,
  stateValue,
  setValue,
  canBeInfinite,
  min,
  max,
}) {
  const onFormBlur = (e) => {
    let value = e.target.value
    if (canBeInfinite) {
      if (!value || value < 1) {
        value = INFINITE 
      }
    } else if (!value) {
      value = 120 // default
    } else if (min && value < min) {
      value = min
    } else if (max && value > max) {
      value = max
    }
    setValue(value)
  }
  const onFormChange = (e) => {
    const value = e.target.value
    if ((canBeInfinite && !value) || isNumeric(value)) {
      setValue(value)
    }
  }
  return (
    <Wrapper>
      <Title>{title}</Title>
      <InputWrapper>
        <Input
          onBlur={onFormBlur}
          onChange={onFormChange}
          value={stateValue}
        />
        <Units>{units}</Units>
      </InputWrapper>
    </Wrapper>
  )
}

export default NumberForm
