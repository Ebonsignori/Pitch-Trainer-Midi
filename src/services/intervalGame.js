import { Collection, Interval, Note, Range } from '@tonaljs/tonal'
import * as Tone from 'tone'
import { ANSWERED_STATE, LISTENING_STATE, PLAYING_STATE, RESULTS } from '../constants/gameConstants'
import { ASCENDING, DESCENDING, HARMONIC, INTERVAL_TO_SEMITONE_MAP, NOT_FIXED_ROOT, SEMITONE_TO_INTERVAL_MAP } from '../constants/settingsConstants'
import { getPiano } from '../utils/instruments'
import { getSelectedSetting, getSelectedSettings } from '../utils/settings'

export default class IntervalGame {
  constructor (
    appState,
    setGameState,
    setRootNote,
    updateTotals,
    setRepeating
  ) {
    // Set up Tone.js
    Tone.Transport.bpm.value = appState.tempoOpt || 80
    Tone.Transport.timeSignature = 4

    this.instrument = getPiano()
    console.log('here!')
    console.log(this.instrument)

    this.currentNoteIndex = 0
    this.lowestNote = getSelectedSetting(appState.lowerRangesOpt)
    this.highestNote = getSelectedSetting(appState.upperRangesOpt)

    this.noteOptions = Range.chromatic([
      this.lowestNote, this.highestNote
    ], { sharps: true }
    )
    this.intervalOptions = getSelectedSettings(appState.intervalsOpt)
    this.playModes = appState.playModesOpt
    this.fixedRoot = getSelectedSetting(appState.fixedRootOpt)
    this.rootNote = 'C3'
    this.secondNote = 'E3'
    this.playMode = ASCENDING
    this.repeatPreviewCount = getSelectedSetting(appState.repeatPreviewCountOpt)
    this.setGameState = setGameState
    this.setRootNote = setRootNote
    this.setRepeating = setRepeating
    this.updateTotals = updateTotals
    this.notesPlayed = []
    this.shuffleNotes()
  }

  shuffleNotes () {
    Collection.shuffle(this.noteOptions)
  }

  pickInterval () {
    // When we've gone through each noteOption, reshuffle and reset index to 0
    if (this.currentNoteIndex > this.noteOptions.length - 1) {
      this.shuffleNotes()
      this.currentNoteIndex = 0
    }
    // Get current root note
    this.rootNote = this.noteOptions[this.currentNoteIndex++]
    // If fixed, use fixed as rootnote
    if (this.fixedRoot !== NOT_FIXED_ROOT) {
      this.rootNote = this.fixedRoot
    }
    // Get random interval
    const intervalName = this.intervalOptions[Math.floor(Math.random() * this.intervalOptions.length)]
    let intervalSemiTone = INTERVAL_TO_SEMITONE_MAP[intervalName]

    // Randomize if ascending / desceding, or just set one or the other
    if (this.playModes[ASCENDING] && this.playModes[DESCENDING]) {
      this.playMode = ASCENDING
      const isAscending = (Math.floor(Math.random() * 2) === 0)
      if (!isAscending) {
        this.playMode = DESCENDING
        intervalSemiTone = -intervalSemiTone
      }
    } else if (this.playModes[DESCENDING]) {
      this.playMode = DESCENDING
      intervalSemiTone = -intervalSemiTone
    } else if (this.playModes[ASCENDING]) {
      this.playMode = ASCENDING
    // When only Harmonic
    } else if (this.playModes[HARMONIC]) {
      this.playMode = HARMONIC
    }
    // When other modes are active, randomize if Harmonic
    if (this.playMode !== HARMONIC && this.playModes[HARMONIC]) {
      const isHarmonic = (Math.floor(Math.random() * 2) === 0)
      if (isHarmonic) {
        this.playMode = HARMONIC
      }
    }

    const interval = Interval.fromSemitones(intervalSemiTone)
    const secondNote = Note.transpose(this.rootNote, interval)
    this.secondNote = Note.fromFreqSharps(Note.get(secondNote).freq)
    this.interval = SEMITONE_TO_INTERVAL_MAP[Math.abs(intervalSemiTone)]

    if (this.playMode === DESCENDING) {
      const temp = this.rootNote
      this.rootNote = this.secondNote
      this.secondNote = temp
    }

    this.setRootNote(this.rootNote)
  }

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
    this.pickInterval()
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

  get gain () {
    if (!this._gain) {
      this._gain = new Tone.Gain()
    }
    return this._gain
  }

  playAheadTimes (noteDuration, times) {
    let time = this.gain.toSeconds(noteDuration)
    for (let i = 0; i < times - 1; i++) {
      time += this.gain.toSeconds(noteDuration)
    }
    return time
  }

  async playNotes () {
    await Tone.loaded()
    this.instrument.sync()
    console.log(this.instrument)
    const now = Tone.now()
    let finalNoteTime = now + this.gain.toSeconds('4n')
    let song = [
      { time: now, note: this.rootNote, duration: '4n' },
      { time: now + this.gain.toSeconds('4n'), note: this.secondNote, duration: '4n' },
    ]
    finalNoteTime += this.gain.toSeconds('4n')
    if (this.playMode === DESCENDING) {
      song = [
        { time: now, note: this.secondNote, duration: '4n' },
        { time: now + this.gain.toSeconds('4n'), note: this.rootNote, duration: '4n' },
      ]
      finalNoteTime += this.gain.toSeconds('4n')
    } else if (this.playMode === HARMONIC) {
      song = [
        { time: now, note: this.secondNote, duration: '2n' },
        { time: now, note: this.rootNote, duration: '2n' },
      ]
      finalNoteTime = now + this.gain.toSeconds('2n')
    }
    for (const element of song) {
      this.instrument.triggerAttackRelease(element.note, element.duration, element.time)
    }

    const donePlaying = new Promise((resolve, reject) => {
      Tone.Transport.schedule((time) => {
        this.stopNotes()
        resolve(time)
      }, finalNoteTime)
    })
    Tone.Transport.start(now, now)
    return donePlaying
  }

  stopNotes () {
    this.notesPlayed = []
    Tone.Transport.stop()
  }

  async getCurrentState () {
    return new Promise((resolve, reject) => {
      this.setGameState((prevState) => {
        resolve(prevState)
        console.log('prevState at get is', prevState)
        return prevState
      })
    })
  }

  // On note played for Midi or microphone
  async onNotePlayed (note, isMic) {
    const currentState = await this.getCurrentState()
    if (currentState !== LISTENING_STATE) {
      return
    }
    // When playing via a mic, we don't penalize for wrong notes since the mic is inacurate
    if (isMic) {
      this.notesPlayed.push(note)
      const [isCorrect] = this.hasPlayedCorrectNotes()
      if (isCorrect) {
        this.updateTotals(false, {
          onReplay: this.onReplay.bind(this),
          onNext: this.onNext.bind(this),
          getCurrentState: this.getCurrentState.bind(this)
        })
      }
    } else {
      // TODO: Midi onNotePlayed
      // this.notesPlayed.push(note)
      // const [isCorrect, notesWrong] = hasPlayedCorrectNotes()
      // if (isCorrect) {
      // this.onNext()
      // } else if ()
    }
  }

  hasPlayedCorrectNotes () {
    const wrongNotesInBetween = 0
    if (this.playMode === HARMONIC) {
      console.log('TODO: Harmonic played notes for MIDI')
      return [false, wrongNotesInBetween]
    }
    if (!this.notesPlayed.length) {
      return [false]
    }
    const rootIndices = getAllIndexes(this.notesPlayed, this.rootNote)
    const secondIndices = getAllIndexes(this.notesPlayed, this.secondNote)
    if (!rootIndices.length || !secondIndices.length) {
      return [false]
    }
    if (this.playMode === ASCENDING) {
      const earliestOccurance = Math.min(...rootIndices)
      const latestOccurance = Math.max(...secondIndices)
      if (latestOccurance > earliestOccurance) {
        return [true]
      }
    } else if (this.playMode === DESCENDING) {
      const earliestOccurance = Math.min(...secondIndices)
      const latestOccurance = Math.max(...rootIndices)
      if (latestOccurance > earliestOccurance) {
        return [true]
      }
    }
  }
}

function getAllIndexes (arr, val) {
  const indexes = []
  let i
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === val) { indexes.push(i) }
  }
  return indexes
}
