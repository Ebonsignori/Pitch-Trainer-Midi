const { Range } = require('@tonaljs/tonal')

// - - - - - -
// Input Settings
// - - - - - -
// Input engine
export const MIDI_DEVICE = 'MIDI Device (High accuracy)'
export const MICROPHONE_DEVICE = 'Microphone (Frequency detection)'

export const INPUT_DEVICE_OPTIONS = [
  MIDI_DEVICE,
  MICROPHONE_DEVICE,
]

export const INPUT_DEVICE_SELECTED = {
  [MIDI_DEVICE]: false,
  [MICROPHONE_DEVICE]: true,
}

// - - - - - -
// Output Settings
// - - - - - -

// - - - - - -
// Global settings
// - - - - - -
// Starting Note Display
export const SHEET_MUSIC_DISPLAY = 'Sheet Music'
export const PIANO_DISPLAY = 'Piano Keyboard'
export const NOTE_DISPLAY = 'Note Name'
export const NONE_DISPLAY = 'None'

export const STARTING_NOTE_DISPLAY_OPTS = [
  SHEET_MUSIC_DISPLAY,
  PIANO_DISPLAY,
  NOTE_DISPLAY,
  NONE_DISPLAY
]

export const START_NOTE_DISPLAY_SELECTED = {
  // [SHEET_MUSIC_DISPLAY]: true,
  [NOTE_DISPLAY]: true,
  [PIANO_DISPLAY]: false,
  [NONE_DISPLAY]: false,
}

// - - - - - -
// Tab settings
// - - - - - -
// Intervals
export const MINOR_2ND = 'Minor 2nd'
export const MAJOR_2ND = 'Major 2nd'
export const MINOR_3RD = 'Minor 3rd'
export const MAJOR_3RD = 'Major 3nd'
export const PERFECT_4TH = 'Perfect 4th'
export const DIM_5TH = 'Dim 5th'
export const PERFECT_5TH = 'Perfect 5th'
export const MINOR_6TH = 'Minor 6th'
export const MAJOR_6TH = 'Major 6th'
export const MINOR_7TH = 'Minor 7th'
export const MAJOR_7TH = 'Major 7th'
export const OCTAVE = 'Octave'

export const INTERVAL_OPTS = [
  MINOR_2ND,
  MAJOR_2ND,
  MINOR_3RD,
  MAJOR_3RD,
  PERFECT_4TH,
  DIM_5TH,
  PERFECT_5TH,
  MINOR_6TH,
  MAJOR_6TH,
  MINOR_7TH,
  MAJOR_7TH,
  OCTAVE,
]

export const INTERVALS_SELECTED = {}
INTERVAL_OPTS.forEach(intervalName => {
  INTERVALS_SELECTED[intervalName] = true
})

export const INTERVAL_TO_SEMITONE_MAP = {
  [MINOR_2ND]: 1,
  [MAJOR_2ND]: 2,
  [MINOR_3RD]: 3,
  [MAJOR_3RD]: 4,
  [PERFECT_4TH]: 5,
  [DIM_5TH]: 6,
  [PERFECT_5TH]: 7,
  [MINOR_6TH]: 8,
  [MAJOR_6TH]: 9,
  [MINOR_7TH]: 10,
  [MAJOR_7TH]: 11,
  [OCTAVE]: 12,
}

export const SEMITONE_TO_INTERVAL_MAP = {
  1: MINOR_2ND,
  2: MAJOR_2ND,
  3: MINOR_3RD,
  4: MAJOR_3RD,
  5: PERFECT_4TH,
  6: DIM_5TH,
  7: PERFECT_5TH,
  8: MINOR_6TH,
  9: MAJOR_6TH,
  10: MINOR_7TH,
  11: MAJOR_7TH,
  12: OCTAVE,
}

// Play Modes
export const ASCENDING = 'Ascending'
export const DESCENDING = 'Descending'
export const HARMONIC = 'Harmonic'

export const PLAY_MODE_OPTS = [
  ASCENDING,
  DESCENDING,
  HARMONIC
]

export const PLAY_MODES_SELECTED = {
  [ASCENDING]: true,
  [DESCENDING]: true,
  [HARMONIC]: false,
}

// All Notes
export const NOTE_OPTS = Range.chromatic(['C2', 'C6'], { sharps: true })
export const FIXED_ROOT = {}
export const LOWER_RANGE = {}
export const UPPER_RANGE = {}
export const NOT_FIXED_ROOT = 'Not Fixed'
FIXED_ROOT[NOT_FIXED_ROOT] = true
NOTE_OPTS.forEach(note => {
  if (note === 'C2') {
    LOWER_RANGE[note] = true
  } else {
    LOWER_RANGE[note] = false
  }
  if (note === 'C6') {
    UPPER_RANGE[note] = true
  } else {
    UPPER_RANGE[note] = false
  }
  FIXED_ROOT[note] = false
})

// Keys
// Intervals
export const MAJOR = 'Major'
export const MAJOR_PENTATONIC = 'Major Pentatonic'
export const MINOR = 'Minor'
export const MINOR_PENTATONIC = 'Minor Pentatonic'
export const MELODIC_MINOR = 'Melodic Minor'
export const NATURAL_MINOR = 'Natural Minor'
export const DORIAN = 'Dorian'
export const PHRYGIAN = 'Phrygian'
export const LYDIAN = 'Lydian'
export const MIXOLYDIAN = 'Mixolydian'
export const LOCRIAN = 'Locrian'

export const KEY_SIGNATURE_OPTS = [
  MAJOR,
  MAJOR_PENTATONIC,
  MINOR,
  MINOR_PENTATONIC,
  MELODIC_MINOR,
  NATURAL_MINOR,
  DORIAN,
  PHRYGIAN,
  LYDIAN,
  MIXOLYDIAN,
  LOCRIAN,
]

export const KEY_SIGNATURES_SELECTED = {}
KEY_SIGNATURE_OPTS.forEach(keySignature => {
  KEY_SIGNATURES_SELECTED[keySignature] = true
})

export const KEY_TO_SEMITONES = {
  [MAJOR]: [0, 2, 4, 5, 7, 9, 11, 12],
  [MAJOR_PENTATONIC]: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24],
  [MINOR]: [0, 2, 3, 5, 7, 8, 10, 12],
  [MINOR_PENTATONIC]: [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24],
  [MELODIC_MINOR]: [0, 2, 3, 5, 7, 9, 11, 12],
  [NATURAL_MINOR]: [0, 2, 3, 5, 7, 8, 11, 12],
  [DORIAN]: [0, 2, 3, 5, 7, 9, 10, 12],
  [PHRYGIAN]: [0, 1, 3, 5, 7, 8, 10, 12],
  [LYDIAN]: [0, 2, 4, 6, 7, 9, 11, 12],
  [MIXOLYDIAN]: [0, 2, 4, 5, 7, 9, 10, 12],
  [LOCRIAN]: [0, 1, 3, 5, 6, 8, 10, 12],
}

// Note durations
export const NOTE_DURATIONS = ['2n', '4n', '8n']

// Nuber of questions
export const INFINITE = 'Infinite'
