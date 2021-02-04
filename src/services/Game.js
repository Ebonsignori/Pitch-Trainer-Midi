import { Collection, Note, Range } from '@tonaljs/tonal'
import * as Tone from 'tone'
import { ANSWERED_STATE, LISTENING_STATE, PLAYING_STATE, RESULTS } from '../constants/gameConstants'
import { INTERVAL_OPTS } from '../constants/settingsConstants'
import { getPiano } from '../utils/instruments'
import { getSelectedSetting, getSelectedSettings } from '../utils/settings'
import { getSuccessPlayer, getFailPlayer } from '../utils/sounds'

const { SOUND_PLAY_TIME } = process.env

class Game {
  constructor (
    appState,
    setGameState,
    updateTotals,
    setRepeating,
    setNoteDisplayIsLoading,
    setNotePlayed
  ) {
    this.setGameState = setGameState
    this.setRepeating = setRepeating
    this.updateTotals = updateTotals
    this.setNoteDisplayIsLoading = setNoteDisplayIsLoading
    this.setNotePlayed = setNotePlayed

    // Set up Tone.js
    Tone.Transport.bpm.value = appState.tempoOpt || 80
    Tone.Transport.timeSignature = 4

    // User playback settings
    this.instrumentOption = getSelectedSetting(appState.outputSoundsOpt, true)
    this.intervalsSelected = getSelectedSettings(appState.intervalsOpt)
    this.fixedRoot = getSelectedSetting(appState.fixedRootOpt)
    this.repeatPreviewCount = getSelectedSetting(appState.repeatPreviewCountOpt)
    this.playModes = getSelectedSettings(appState.playModesOpt)

    // Sound effects
    if (appState.playSuccessSoundOpt) {
      this.successSoundOption = getSelectedSetting(appState.successSoundsOpt, true)
    }
    if (appState.playFailSoundOpt) {
      this.failSoundOption = getSelectedSetting(appState.failSoundsOpt, true)
    }

    // We don't want the second note of our interval to go above / below our note boundaries
    const highestIntervalSelected = INTERVAL_OPTS.indexOf(this.intervalsSelected[this.intervalsSelected.length - 1]) + 1
    this.lowestNote = Note.fromMidiSharps(
      Note.get(getSelectedSetting(appState.lowerRangesOpt)).midi + highestIntervalSelected
    )
    this.highestNote = Note.fromMidiSharps(
      Note.get(getSelectedSetting(appState.upperRangesOpt)).midi - highestIntervalSelected
    )

    // Notes to play from options
    this.currentStartingNoteIndex = 0
    this.noteOptions = Range.chromatic([
      this.lowestNote, this.highestNote
    ], { sharps: true }
    )
    // Song
    this.rootNote = 'C3' // rootNote is starting note for display
    this.songNotes = ['C3']
    this.correctIndex = 0 // all items before this index in this.songNotes have been played
    this.correctHarmonics = [] // for harmonic notes, keep track of each correct note in harmonic
    this.shuffleNotes()
  }

  async getInstrument () {
    if (!this._instrument) {
      this._instrument = await getPiano(this.instrumentOption)
    }
    return this._instrument
  }

  get gain () {
    if (!this._gain) {
      this._gain = new Tone.Gain()
    }
    return this._gain
  }

  shuffleNotes () {
    Collection.shuffle(this.noteOptions)
  }

  playAheadTimes (noteDuration, times) {
    let time = this.gain.toSeconds(noteDuration)
    for (let i = 0; i < times - 1; i++) {
      time += this.gain.toSeconds(noteDuration)
    }
    return time
  }

  async playTestSong () {
    const song = [
      { note: 'C4', duration: '4n' },
      { note: 'E4', duration: '4n' },
      { note: 'G4', duration: '4n' },
      { note: ['C4', 'E4', 'G4'], duration: '2n' },
    ]
    return this.playSong(song)
  }

  async instrumentReady () {
    await this.getInstrument()
    await this.getSuccessPlayer()
    await this.getFailPlayer()
    await Tone.loaded()
    return true
  }

  stopNotes () {
    Tone.Transport.stop()
  }

  async getCurrentState () {
    return new Promise((resolve, reject) => {
      this.setGameState((prevState) => {
        resolve(prevState)
        return prevState
      })
    })
  }

  // Song is in form [{note: 'C4', duration: '4n'}, ...]
  async playSong (song) {
    const instrument = await this.getInstrument()
    await Tone.loaded()
    instrument.sync()
    const now = Tone.now()
    let nextNoteDuration = now
    for (const noteObj of song) {
      instrument.triggerAttackRelease(noteObj.notes || noteObj.note, noteObj.duration, nextNoteDuration)
      nextNoteDuration += this.gain.toSeconds(noteObj.duration)
    }
    const donePlaying = new Promise((resolve, reject) => {
      Tone.Transport.schedule((time) => {
        this.stopNotes()
        resolve(time)
      // NextNoteDuration will be end of final note
      }, nextNoteDuration)
    })
    Tone.Transport.start(now, now)
    return donePlaying
  }

  // - - -
  // Handling User Input and Results
  // - - -
  isMatchingNote (playedNote, correctNote) {
    // These notes are sometimes confused by pitch detect
    if (
      (correctNote === 'C#3' || correctNote === 'C#4') &&
      (playedNote === 'C#3' || playedNote === 'C#4' || playedNote === 'C#5')
    ) {
      return true
    }
    return playedNote === correctNote
  }

  // On note played for Midi or microphone
  async onNotePlayed (notes, isMic) {
    const currentState = await this.getCurrentState()
    if (currentState !== LISTENING_STATE) {
      return
    }
    // Use certain notes out of range as repeat commands
    if (notes[0] === 'B0') {
      return this.onReplay()
    }
    const correctNote = this.songNotes[this.correctIndex]
    // When playing via a mic, we don't penalize for wrong notes since the mic is inacurate
    if (isMic && notes.length) {
      for (const notePlayed of notes) {
        if (Array.isArray(correctNote)) {
          if (correctNote.includes(notePlayed) && !this.correctHarmonics.includes(notePlayed)) {
            this.correctHarmonics.push(notePlayed)
          }
          if (this.correctHarmonics.length === correctNote.length) {
            this.correctHarmonics = []
            this.correctIndex++
          }
        } else if (this.isMatchingNote(notePlayed, correctNote)) {
          this.correctIndex++
        }
        if (this.correctIndex === this.songNotes.length) {
          this.onSongCorrect()
        }
        this.setNotePlayed(notePlayed)
      }
    } else {
      // TODO: Midi onNotePlayed, penalize incorrect
    }
  }

  async onSongCorrect () {
    // TODO: Add config if should play sound on success
    this.playSuccessSound()
    this.updateTotals(false, {
      onReplay: this.onReplay.bind(this),
      onNext: this.onNext.bind(this),
      getCurrentState: this.getCurrentState.bind(this)
    })
  }

  // - - -
  // Game flow logic
  // - - -
  async onNext () {
    let wasResultState = false
    const currentState = await this.getCurrentState()
    if (currentState === RESULTS) {
      return
    }
    this.stopNotes()
    this.setGameState((prevState) => {
      if (prevState !== RESULTS) {
        return PLAYING_STATE
      } else {
        wasResultState = true
      }
    })
    if (wasResultState) {
      return
    }
    this.generateSong()
    await this.playNotes()
    this.setGameState((prevState) => {
      if (prevState !== RESULTS) {
        return LISTENING_STATE
      } else {
        wasResultState = true
      }
    })
    if (wasResultState) {
      return
    }
    if (this.repeatPreviewCount) {
      for (let i = 0; i < this.repeatPreviewCount; i++) {
        await this.onReplay(false, `Repeating ${i + 1} / ${this.repeatPreviewCount}...`)
      }
    }
  }

  async onReplay (doNotUpdateState, repeatMessage = 'Repeating...') {
    let wasResultState = false
    const currentState = await this.getCurrentState()
    if (currentState === PLAYING_STATE || currentState === RESULTS) {
      return
    }
    this.stopNotes()
    this.setRepeating(repeatMessage)
    let atAnswered = false
    if (!doNotUpdateState) {
      this.setGameState((prevState) => {
        if (prevState === ANSWERED_STATE) {
          atAnswered = true
        }
        if (prevState !== RESULTS) {
          return PLAYING_STATE
        } else {
          wasResultState = true
        }
      })
      if (wasResultState) {
        return
      }
    }
    await this.playNotes()
    if (!doNotUpdateState) {
      this.setGameState((prevState) => {
        if (atAnswered) {
          return ANSWERED_STATE
        } else if (prevState !== RESULTS) {
          return LISTENING_STATE
        } else {
          wasResultState = true
        }
      })
      if (wasResultState) {
        return
      }
    }
    this.setRepeating(null)
  }

  // - - -
  // Sound effects
  // - - -
  async getSuccessPlayer () {
    if (!this._successPlayer) {
      this._successPlayer = await getSuccessPlayer(this.successSoundOption)
    }
    return this._successPlayer
  }

  async getFailPlayer () {
    if (!this._failPlayer) {
      this._failPlayer = await getFailPlayer(this.failSoundOption)
    }
    return this._failPlayer
  }

  async playSuccessSound () {
    if (!this._successPlayer) {
      console.error('Init players before trying to play sounds')
    }
    const donePlaying = new Promise((resolve, reject) => {
      setTimeout(() => {
        this._successPlayer.stop()
        this._failPlayer.stop()
        resolve(true)
      }, SOUND_PLAY_TIME)
    })
    this._successPlayer.start()
    return donePlaying
  }

  playFailSound () {
    if (!this._failPlayer) {
      console.error('Init players before trying to play sounds')
    }
    const donePlaying = new Promise((resolve, reject) => {
      setTimeout(() => {
        this._failPlayer.stop()
        resolve(true)
      }, SOUND_PLAY_TIME)
    })
    this._failPlayer.start()
    return donePlaying
  }

  // - - -
  // Music helper methods
  // - - -
  noteToSharp (noteName) {
    return Note.fromFreqSharps(Note.get(noteName).freq)
  }

  // - - -
  // Generic helper methods
  // - - -
  getRandomFromArr (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }
}

export default Game
