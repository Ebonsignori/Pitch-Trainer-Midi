import { Note } from '@tonaljs/tonal'
import React, { Component } from 'react'
// import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import Vex from 'vexflow'
import { ASCENDING, DESCENDING, HARMONIC } from '../../constants/settingsConstants'

const SheetMusicWrapper = styled.div`
`
const divRefId = 'vexflow-parent-div'

class SheetMusic extends Component {
  constructor (props) {
    super(props)
    this.state = { dataReady: false }
    this.vf = undefined
    this.score = undefined
    this.system = undefined
    this.divRef = React.createRef()
  }

  getClefAndPlaceholder (notes) {
    let clef = 'treble'
    let notePlaceholder = 'B4'
    let clefCenter = notes[0]
    // TODO for 2 notes compare which is higher/lower, for 4 which of middle 2 is higher/lower
    if (notes.length === 2) {
      clefCenter = notes[1]
    }
    const octave = Note.octave(clefCenter)
    if (octave <= 4) {
      notePlaceholder = 'D3'
      clef = 'bass'
    }
    return [clef, notePlaceholder]
  }

  getClef (note) {
    let clef = 'treble'
    const octave = Note.octave(note)
    if (octave <= 4) {
      clef = 'bass'
    }
    return clef
  }

  fillInRemainderWithRests (voice) {
    let totalTime = 0
    for (const item of voice) {
      if (item.includes('/q')) {
        totalTime += 1
      } else if (item.includes('/h')) {
        totalTime += 2
      }
    }
    for (let time = totalTime; time < 4; time++) {
      voice.push(`${}/q/r`)
    }
  }

  // moveToClefs (voices) {
    // const clefs = {
      // bass: []
      // treble: []
    // }
    // for (const voice of voices) {
      // for (const note of voice) {

      // }
    // }
  // }

  processNotes () {
    const notes = [...this.props.notes]
    const correctIndex = this.props.correctIndex
    // 4 voices for 4 possible simultaneous notes at one time 
    const voices = [
      [],
      [],
      [],
      []
    ]
    let clef
    let notePlaceholder
    for (const note of notes) {
      // When chord / harmonic multiple notes at once
      if (Array.isArray(note)) {
        note.forEach((notePart, index) => {
          voices[index].push(`${notePart}/h`)
        })
      // When single note
      } else {
        voices[0].push(`${note}/q`)
      }
    }
    // const cleffedVoices = this.moveToClefs(voices)
    voices.forEach((voice) => this.fillInRemainderWithRests(voice))
    console.log(voices)
    return [clef, voices]
  }

  setupOsmd () {
    this.vf = new Vex.Flow.Factory({
      renderer: { elementId: divRefId, width: '35vw', height: '15vh' }
    })

    this.score = this.vf.EasyScore()
    this.system = this.vf.System()

    const [clef, processedVoices] = this.processNotes()

    const voices = processedVoices.map((voice, index) => {
      // TODO: add logic to add multiple voices for chords and melodies
      if (index > 0) {
        return null
      }
      return this.score.voice(this.score.notes(voice.join(', '), { clef }))
    }).filter(x => x)

    this.system.addStave({
      voices
    }).addClef(clef).addTimeSignature('4/4')

    this.vf.draw()
  }

  resize () {
    this.forceUpdate()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize)
  }

  componentDidUpdate (prevProps) {
    if (this.props.notes[0] !== prevProps.notes[0]) {
      this.setupOsmd()
    }
    window.addEventListener('resize', this.resize)
  }

  // Called after render
  componentDidMount () {
    this.setupOsmd()
  }

  render () {
    return (
      <>
        <SheetMusicWrapper ref={this.divRef} id={divRefId} key='sm-div-1' />
      </>
    )
  }
}

export default SheetMusic
