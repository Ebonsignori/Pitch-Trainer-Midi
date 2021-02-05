import React, { useState } from 'react'
import styled from 'styled-components'
import { THEME_BORDER_COLOR, THEME_SPLASH_COLOR } from '../constants/styleConstants'
import {
  CHORDS,
  GLOBAL_OPTIONS,
  INPUT_OPTIONS,
  OUTPUT_OPTIONS,
  INTERVALS,
  MELODIES
} from '../constants/gameConstants'
import IntervalOptions from './option_tabs/IntervalOptions'
import GlobalOptions from './option_tabs/GlobalOptions'
import InputOptions from './option_tabs/InputOptions'
import OutputOptions from './option_tabs/OutputOptions'
import MelodyOptions from './option_tabs/MelodyOptions'

const PageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 98vw;
  min-height: 98vh;
  max-width: 98vw;
  max-height: 98vh;
  overflow: hidden;
`

const LeftPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 30vw;
  max-width: 30vw;
`

const TabSettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 70vw;
  max-width: 70vw;
`

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 5vh;
  max-height: 5vh;
  background-color: white;
`

const Tab = styled.span`
  display: flex;
  font-size: 1.5vw; 
  align-items: center;
  justify-content: center;
  min-width: 8vw;
  transition: .3s;
  ${props => props.selected && `background-color: ${THEME_SPLASH_COLOR};`}

  border-top: 1px solid ${THEME_BORDER_COLOR};
  border-right: 1px solid ${THEME_BORDER_COLOR};
  :first-of-type {
    border-left: 1px solid ${THEME_BORDER_COLOR};
  }

  :hover {
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    background-color: ${THEME_BORDER_COLOR};
    opacity: .8;
  }
`

function Options () {
  const [gameOptionsTab, setGameOptionsTab] = useState(INTERVALS)
  const [globalOptionsTab, setGlobalOptionsTab] = useState(GLOBAL_OPTIONS)
  let RenderedGameOptionsTab
  if (gameOptionsTab === INTERVALS) {
    RenderedGameOptionsTab = <IntervalOptions />
  // } else if (gameOptionsTab === CHORDS) {
    // RenderedGameOptionsTab = 'Chords are still under development'
  } else if (gameOptionsTab === MELODIES) {
    RenderedGameOptionsTab = <MelodyOptions />
  } else {
    RenderedGameOptionsTab = `Internal Error. Invalid Tab, ${gameOptionsTab}`
  }
  let RenderedGlobalOptionsTab
  if (globalOptionsTab === GLOBAL_OPTIONS) {
    RenderedGlobalOptionsTab = <GlobalOptions />
  } else if (globalOptionsTab === INPUT_OPTIONS) {
    RenderedGlobalOptionsTab = <InputOptions />
  } else if (globalOptionsTab === OUTPUT_OPTIONS) {
    RenderedGlobalOptionsTab = <OutputOptions />
  } else {
    RenderedGlobalOptionsTab = `Internal Error. Invalid Tab, ${globalOptionsTab}`
  }
  return (
    <PageWrapper>
      <LeftPageWrapper>
        <TabsWrapper>
          <Tab
            selected={globalOptionsTab === GLOBAL_OPTIONS}
            onClick={() => setGlobalOptionsTab(GLOBAL_OPTIONS)}
          >
            {GLOBAL_OPTIONS}
          </Tab>
          <Tab
            selected={globalOptionsTab === INPUT_OPTIONS}
            onClick={() => setGlobalOptionsTab(INPUT_OPTIONS)}
          >
            {INPUT_OPTIONS}
          </Tab>
          <Tab
            selected={globalOptionsTab === OUTPUT_OPTIONS}
            onClick={() => setGlobalOptionsTab(OUTPUT_OPTIONS)}
          >
            {OUTPUT_OPTIONS}
          </Tab>
        </TabsWrapper>
        {RenderedGlobalOptionsTab}
      </LeftPageWrapper>
      <TabSettingsWrapper>
        <TabsWrapper>
          <Tab
            selected={gameOptionsTab === INTERVALS}
            onClick={() => setGameOptionsTab(INTERVALS)}
          >
            {INTERVALS}
          </Tab>
          <Tab
            selected={gameOptionsTab === CHORDS}
            disabled
            // onClick={() => setGameOptionsTab(CHORDS)}
          >
            {CHORDS}
          </Tab>
          <Tab
            selected={gameOptionsTab === MELODIES}
            onClick={() => setGameOptionsTab(MELODIES)}
          >
            {MELODIES}
          </Tab>
        </TabsWrapper>
        {RenderedGameOptionsTab}
      </TabSettingsWrapper>
    </PageWrapper>
  )
}

export default Options
