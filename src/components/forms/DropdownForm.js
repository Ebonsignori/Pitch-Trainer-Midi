import React, { memo, useState } from 'react'
import styled from 'styled-components'
import { Button } from 'styled-button-component'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
} from 'styled-dropdown-component'
import { getSelectedSetting, settingChanged } from '../../utils/settings'
import { THEME_BORDER_COLOR, THEME_SPLASH_COLOR } from '../../constants/styleConstants'

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

const ButtonStyled = styled(Button)`
  margin-left: .8vw;
  background-color: ${THEME_SPLASH_COLOR};
  border-color: ${THEME_BORDER_COLOR}
`

const DropdownItemStyled = styled(DropdownItem)`
  :hover {
    opacity: .8;
    background-color: ${THEME_BORDER_COLOR}
  }
`

function DropdownForm ({
  title,
  stateValues,
  setValues,
  isCompound,
}) {
  const [hidden, setHidden] = useState(true)
  if (!stateValues) {
    stateValues = {}
  }

  const onOptionSelect = (option) => {
    setHidden(true)
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
      <DropdownItemStyled
        key={entry[0]}
        onClick={() => onOptionSelect(entry[0])}
        active={entry[1]}
        colorHoverFocus={THEME_BORDER_COLOR}
      >
        {isCompound ? entry[0].substring(0, entry[0].indexOf('#')) : entry[0]}
      </DropdownItemStyled>
    )
  })

  const selectedSetting = getSelectedSetting(stateValues) || ''

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Dropdown>
        <ButtonStyled dropdownToggle onClick={() => setHidden(!hidden)}>
          {isCompound ? selectedSetting.substring(0, selectedSetting.indexOf('#')) : selectedSetting}
        </ButtonStyled>
        <DropdownMenu hidden={hidden} toggle={() => setHidden(!hidden)}>
          {Options}
        </DropdownMenu>
      </Dropdown>
    </Wrapper>
  )
}

export default memo(DropdownForm, (prev, next) => {
  if (settingChanged(prev.stateValues, next.stateValues)) {
    return false
  }
  return true
})
