import React from 'react'
import styled from 'styled-components'
import { THEME_SPLASH_COLOR } from '../../constants/styleConstants'

const NotesContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: -3vw;
  align-items: center;
  max-width: 80vw;
  overflow-y: auto;
`

const Note = styled.div`
  font-size: 2.5vw;
  color: ${props => props.correct ? 'green' : THEME_SPLASH_COLOR};
  margin: 1vw;
`

const HarmonicContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${props => props.correct ? 'green' : THEME_SPLASH_COLOR};
`

const HarmonicNote = styled.div`
  font-size: 2vw;
  margin: .5vw;
`

function NoteStrings ({
  notes,
  correctIndex
}) {
  const RenderedNotes = notes.map((note, index) => {
    if (Array.isArray(note)) {
      const harmonicNotes = note.map((notePart, index) => {
        // Only show "root" of harmonic note when note already played
        if (index >= correctIndex && index > 0) {
          return (
            <HarmonicNote key={`harmonic-${notePart}-${index}}`}>
              ?
            </HarmonicNote>
          )
        }
        return (
        <HarmonicNote key={`harmonic-${notePart}-${index}}`}>
          {notePart}
        </HarmonicNote>
        )
      })
      harmonicNotes.reverse()
      return (
        <HarmonicContainer correct={index < correctIndex} key={`${note.join('-')}-${index}`}>
          {harmonicNotes}
        </HarmonicContainer>
      )
    }
    return (
      <Note correct={index < correctIndex} key={`${note}-${index}`}>
        {(index < correctIndex || index === 0) ? note : '?'}
      </Note>
    )
  })
  return (
    <NotesContainer>
      {RenderedNotes}
    </NotesContainer>
  )
}

export default NoteStrings
