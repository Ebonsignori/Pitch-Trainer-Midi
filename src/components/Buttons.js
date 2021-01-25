import styled from 'styled-components'
import { Button as styledBtn } from 'styled-button-component'
const { THEME_BORDER_COLOR, THEME_SPLASH_COLOR } = require('../constants/styleConstants')

const Button = styled(styledBtn)`
  padding: 1vw;
  font-size: 1.3vw;
  border: 1px solid ${THEME_BORDER_COLOR}
  border-radius: 25px;
  min-width: 7vw;
  margin: 1vw;

  :hover {
    cursor: pointer;
  }
`

export const GreenBtn = styled(Button)`
  background-color: green;
  color: white;
`

export const ThemeBtn = styled(Button)`
  background-color: ${THEME_SPLASH_COLOR};
  color: white;
`

export const RedBtn = styled(Button)`
  background-color: red;
  color: white;
`
