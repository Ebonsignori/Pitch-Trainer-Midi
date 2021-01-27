import styled from 'styled-components'
import { Button as styledBtn } from 'styled-button-component'
const { THEME_BORDER_COLOR, THEME_SPLASH_COLOR } = require('../constants/styleConstants')

const Button = styled(styledBtn)`
  padding: ${props => props.small ? '.6vw' : '1vw'};
  font-size: ${props => props.small ? '1vw' : '1.3vw'};
  border: 1px solid ${THEME_BORDER_COLOR}
  border-radius: 25px;
  min-width: ${props => props.small ? '5vw' : '7vw'};
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
