# Pitch Trainer (midi)

A highly configurable electron app for relative pitch (ear) training.

Runs through a series of randomized interval, chord, or randomly generated melodies and prompts for matching playback from a MIDI (piano keyboard) or microphone input device.

For intervals, frequency detection via a microphone can be used, but for any setting where chords (harmonic) is enabled, MIDI is preferred. Chords must be played out one note at a time (arpeggiated) to be picked up by microphone / frequency detection.

**Note:** Currently only microphone input feedback for Interval and Melody mode is supported.

## Demo

There are three customizable game modes

![Options Demo](./docs/options_demo.png)

Below is a ss from the Interval game mode

![Interval Demo](./docs/interval_demo.png)

## Usage

1. Clone this repo, 
2. `npm install`
3. `npm start` to run the dev build

Production build is not tested.

## Instruments

A list of instruments used can be found [in this repo](https://github.com/Ebonsignori/pitch-trainer-instruments/tree/master/instruments). If you'd like to add an instrument it should be picked up by this app, feel free to open a PR 

## Work in Progress

Currently only microphone (frequency) feedback works for Interval mode.


Below is a list of TODO items before I'll consider this project "finished":

- MIDI Support: input and game mode feedback
- ~Fix slow option rendering~
- ~Finish melodies game mode~
- Finish chords game mode
- ~Fix bugs~
- ~Add note-name starting note display opt implementation~
- ~Add different instrument options~
- ~Add correct note played feedback~
- ~Persist settings~ 
- ~Have sheet music use '8va' notation for high/low notes on clef~ Removed sheet music disp in favor of other note disp opts

Stretch-goal TODOs:

- Add Scales game mode
- Look into frequency chord identification 
- Cleanup / polish UI
- Build platform-agnostic executables 
- Clean / reorg code
- Re-add sheet music support with correct note feedback

