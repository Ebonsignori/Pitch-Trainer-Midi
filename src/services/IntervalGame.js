import { Interval, Note } from '@tonaljs/tonal'
import Game from '../services/Game'
import { ASCENDING, DESCENDING, HARMONIC, INTERVAL_TO_SEMITONE_MAP, NOT_FIXED_ROOT, SEMITONE_TO_INTERVAL_MAP } from '../constants/settingsConstants'

class IntervalGame extends Game {
  constructor (
    appState,
    setGameState,
    updateTotals,
    setRepeating,
    setNoteDisplayIsLoading,
    setNotePlayed
  ) {
    super(
      appState,
      setGameState,
      updateTotals,
      setRepeating,
      setNoteDisplayIsLoading,
      setNotePlayed
    )
    // Interval Game specific settings
    this.playMode = ASCENDING
  }

  // Generate ascending, descending, or harmonic intervals
  generateSong () {
    this.setNoteDisplayIsLoading(true)
    this.setNotePlayed(null)
    // Clear previous song
    this.songNotes = []
    this.correctIndex = 0
    // When we've gone through each noteOption, reshuffle and reset index to 0
    if (this.currentStartingNoteIndex > this.noteOptions.length - 1) {
      this.shuffleNotes()
      this.currentStartingNoteIndex = 0
    }
    // Get starting note of interval
    if (this.fixedRoot !== NOT_FIXED_ROOT) {
      this.songNotes.push(this.fixedRoot)
    } else {
      this.songNotes.push(this.noteOptions[this.currentStartingNoteIndex++])
    }

    // Get random interval
    const intervalName = this.getRandomFromArr(this.intervalsSelected)
    let intervalSemiTone = INTERVAL_TO_SEMITONE_MAP[intervalName]

    // Randomize playMode
    this.playMode = this.getRandomFromArr(this.playModes)

    // Invert interval if descending
    if (this.playMode === DESCENDING) {
      intervalSemiTone = -intervalSemiTone
    }
    // Add second note to song
    const interval = Interval.fromSemitones(intervalSemiTone)
    const nextNote = this.noteToSharp(Note.transpose(this.songNotes[0], interval))
    if (this.playMode === HARMONIC) {
      const rootNote = this.songNotes[0]
      this.songNotes[0] = [rootNote, nextNote]
    } else {
      this.songNotes.push(nextNote)
    }

    // Get interval string
    this.interval = SEMITONE_TO_INTERVAL_MAP[Math.abs(intervalSemiTone)]

    // Reload state
    this.setNoteDisplayIsLoading(false)
  }

  // Play intervals as two quarter notes, harmonic as a half note
  async playNotes () {
    const song = []
    for (const noteOrNotes of this.songNotes) {
      let duration = '4n'
      if (Array.isArray(noteOrNotes)) {
        duration = '2n'
      }
      song.push({ note: noteOrNotes, duration })
    }
    return this.playSong(song)
  }
}

export default IntervalGame
