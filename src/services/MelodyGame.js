import { Interval, Note } from '@tonaljs/tonal'
import Game from '../services/Game'
import { KEY_TO_SEMITONES, NOTE_DURATIONS, NOT_FIXED_ROOT } from '../constants/settingsConstants'
import { getSelectedSettings } from '../utils/settings'

class MelodyGame extends Game {
  constructor (...args) {
    super(...args)
    const appState = args[0]
    // Melody Game specific settings
    this.keysSelected = getSelectedSettings(appState.melodyKeysOpt)
    this.numberOfMelodyNotes = appState.numberOfMelodyNotesOpt
    this.randomizeRythme = appState.randomizeRythmeOpt
    this.keySignature = ''
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
    // Get starting note of melody
    if (this.fixedRoot !== NOT_FIXED_ROOT) {
      this.songNotes.push(this.fixedRoot)
    } else {
      this.songNotes.push(this.noteOptions[this.currentStartingNoteIndex++])
    }

    // Randomize playMode
    this.keySignature = this.getRandomFromArr(this.keysSelected)
    for (let noteIndex = 0; noteIndex < this.numberOfMelodyNotes; noteIndex++) {
      const nextNoteSemiTone = this.getRandomFromArr(KEY_TO_SEMITONES[this.keySignature])
      const interval = Interval.fromSemitones(nextNoteSemiTone)
      const nextNote = this.noteToSharp(Note.transpose(this.songNotes[0], interval))
      this.songNotes.push(nextNote)
    }

    // Reload state
    this.setNoteDisplayIsLoading(false)
  }

  // Play intervals as two quarter notes, harmonic as a half note
  async playNotes () {
    const song = []
    for (const noteOrNotes of this.songNotes) {
      let duration = '4n'
      if (this.randomizeRythme) {
        duration = this.getRandomFromArr(NOTE_DURATIONS)
      }
      console.log(duration)
      song.push({ note: noteOrNotes, duration })
    }
    return this.playSong(song)
  }
}

export default MelodyGame
