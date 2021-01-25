import { createGlobalStyle } from 'styled-components'

export const PianoStyle = createGlobalStyle`
  
.ReactPiano__Keyboard {
  /* Used for absolute positioning of .ReactPiano__Key--accidental elements */
  position: relative;
  /* Used to lay out .ReactPiano__Key--natural elements */
  display: flex;
  margin: auto;
}

.ReactPiano__Key {
  /* Used for flexbox layout of the child .ReactPiano__NoteLabelContainer elements */
  display: flex;
}

/*
 * Styles of accidental notes (flat or sharp)
 */
.ReactPiano__Key--accidental {
  background: #555;
  border: 1px solid #fff;
  border-top: 1px solid transparent;
  border-radius: 0 0 4px 4px;
  cursor: pointer;
  height: 66%;
  /* Overlay on top of natural keys */
  z-index: 1;
  /* Use absolute positioning along with inline styles specified in JS to put keys in correct locations. */
  position: absolute;
  top: 0;
}

/*
 * Styles of natural notes (white keys)
 */
.ReactPiano__Key--natural {
  background: #f6f5f3;
  border: 1px solid #888;
  border-radius: 0 0 6px 6px;
  cursor: pointer;
  z-index: 0;
  /*
   * Uses flexbox with margin instead of absolute positioning to have more consistent margin rendering.
   * This causes inline styles to be ignored.
   */
  flex: 1;
  margin-right: 1px;
}

.ReactPiano__Key--natural:last-child {
  /* Don't render extra margin on the last natural note */
  margin-right: 0;
}

/*
 * Styles of "active" or pressed-down keys
 */
.ReactPiano__Key--active {
  background: #3ac8da;
}

.ReactPiano__Key--active.ReactPiano__Key--accidental {
  border: 1px solid #fff;
  border-top: 1px solid #3ac8da;
  /* Slight height reduction for "pushed-down" effect */
  height: 65%;
}

.ReactPiano__Key--active.ReactPiano__Key--natural {
  border: 1px solid #3ac8da;
  /* Slight height reduction for "pushed-down" effect */
  height: 98%;
}

/*
 * Styles for disabled state
 */
.ReactPiano__Key--disabled.ReactPiano__Key--accidental {
  background: #ddd;
  border: 1px solid #999;
}

.ReactPiano__Key--disabled.ReactPiano__Key--natural {
  background: #eee;
  border: 1px solid #aaa;
}

/*
 * Styles for the note label inside a piano key
 */
.ReactPiano__NoteLabelContainer {
  flex: 1;
  /* Align children .ReactPiano__NoteLabel to the bottom of the key */
  align-self: flex-end;
}

.ReactPiano__NoteLabel {
  font-size: 12px;
  text-align: center;
  text-transform: capitalize;
  /* Disable text selection */
  user-select: none;
}

.ReactPiano__NoteLabel--accidental {
  color: #f8e8d5;
  margin-bottom: 3px;
}

.ReactPiano__NoteLabel--natural {
  color: #888;
  margin-bottom: 3px;
}

.ReactPiano__NoteLabel--natural.ReactPiano__NoteLabel--active {
  color: #f8e8d5;
}
`
