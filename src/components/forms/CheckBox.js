import React, { Component } from 'react'
import styled from 'styled-components'
import { THEME_BORDER_COLOR, THEME_SPLASH_COLOR } from '../../constants/styleConstants'

class Checkbox extends Component {
  render () {
    return (
      <Styled
        onClick={() => this.props.onChange(!this.props.checked)}
      >
        <input
          type="checkbox"
          checked={this.props.checked}
          onChange={() => null}
        />
        <label>{this.props.label}</label>
      </Styled>
    )
  }
}

export default Checkbox

const Styled = styled.div`
  margin-top: .8vw;
  margin-left: 0;
  display: inline-block;
  > input {
    opacity: 0;
    margin-left: 0;
  }
  > input + label {
    position: relative;
    padding-left: 30px;
    padding-top: .15vw;
    cursor: pointer;
    font-size: 1.2vw;
    &:before {
      content: '';
      position: absolute;
      left:0; top: 1px;
      width: 20px;
      height: 20px;
      border: 1px solid ${THEME_BORDER_COLOR};
      background: white;
      border-radius: 3px;
      box-shadow: inset 0 1px 3px rgba(0,0,0,.3);
    }
    &:after {
      content: '✔';
      position: absolute;
      top: -1px;
      left: 2px;
      font-size: 1.7vw;
      color: ${THEME_SPLASH_COLOR};
      transition: all .1s;
    }
  }
  > input:not(:checked) + label {
      &:after {
        opacity: 0;
        transform: scale(0);
      }
  }
  > input:disabled:not(:checked) + label {
      &:before {
        box-shadow: none;
        border-color: ${THEME_BORDER_COLOR};
        background-color: #ddd;
      }
  }
  > input:checked + label {
    font-weight: 600;
    color: ${THEME_SPLASH_COLOR};
    &:after {
      opacity: 1;
      transform: scale(1);
    }
  }
  > input:disabled:checked + label {
    &:after {
      color: #999;
    }
  }
  > input:disabled + label {
    color: #aaa;
  }
  > input:not(:checked) + label:hover {
    color: ${THEME_SPLASH_COLOR};
  }
  > input:checked + label:hover {
    color: pink;
    &:after {
      font-size: 1.4vw;
      opacity: .8;
    }
  }
`
