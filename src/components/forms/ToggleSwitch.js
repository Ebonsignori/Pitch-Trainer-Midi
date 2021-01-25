import React from 'react'
import styled from 'styled-components'
import { THEME_BORDER_COLOR, THEME_SPLASH_COLOR } from '../../constants/styleConstants'

const SwitchInput = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;
`

const SwitchLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 50px;
  height: 28px;
  border-radius: 100px;
  position: relative;
  transition: 0.2s;
  border: 2px solid white;
  ${props => props.checked
    ? `background: ${THEME_SPLASH_COLOR};`
    : `border: 2px solid ${THEME_BORDER_COLOR};`
  }
`

const SwitchButton = styled.span`
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 25px;
  height: 25px;
  border-radius: 45px;
  transition: 0.2s;
  background: ${THEME_BORDER_COLOR};
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
  ${SwitchInput}:checked + ${SwitchLabel} & {
    left: calc(100% - 2px);
    transform: translateX(-100%);
    background: white;
  }

  ${SwitchLabel}:active & {
    width: 45px;
  }
`

const Switch = ({ id, toggled, onChecked }) => {
  return (
    <>
      <SwitchInput
        className="switch-checkbox"
        id={id}
        type="checkbox"
        checked={toggled}
        onChange={onChecked}
      />
      <SwitchLabel className="switch-label" htmlFor={id} checked={toggled}>
        <SwitchButton className="switch-button" />
      </SwitchLabel>
    </>
  )
}

export default Switch
