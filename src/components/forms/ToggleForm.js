import React from 'react'
import styled from 'styled-components'
import { THEME_SPLASH_COLOR } from '../../constants/styleConstants'
import Switch from './ToggleSwitch'

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

const Selection = styled.div`
  display: flex;
  font-size: 1.2vw;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  margin-left: 1vw;
  color: ${props => props.selected ? THEME_SPLASH_COLOR : 'black'};
`

function ToggleForm ({
  title,
  stateValue,
  setValue,
}) {
  const onFormChange = (e) => {
    const value = e.target.checked
    setValue(value)
  }
  return (
    <Wrapper>
      <Title>{title}</Title>
      <InputWrapper>
         <Switch
          id={title}
          toggled={stateValue}
          onChecked={onFormChange}
        />
        <Selection selected={stateValue}>{stateValue ? 'Yes' : 'No'}</Selection>
      </InputWrapper>
    </Wrapper>
  )
}

export default ToggleForm
