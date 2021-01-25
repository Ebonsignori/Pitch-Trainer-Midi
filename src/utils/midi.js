// import * as Jazz from 'jzz'
//
//   // function listMidiPorts () {
// let i
// let info
// let txt = '<ul><li>MIDI-Out ports:</li><ul>'
// const outs = Jazz.MidiOutList()
// if (outs.length) {
// for (i = 0; i < outs.length; i++) {
// txt += '<li>' + outs[i]
// info = Jazz.MidiOutInfo(outs[i])
// if (info.length >= 3) {
// txt += '<ul><li>Manufacturer: ' + info[1] + '; Version: ' + info[2] + '</li></ul>'
// }
// txt += '</li>'
// }
// } else {
// txt += '<li>none</li>'
// }
// txt += '</ul><li>MIDI-In ports:</li><ul>'
// const ins = Jazz.MidiInList()
// if (ins.length) {
// for (i = 0; i < ins.length; i++) {
// txt += '<li>' + ins[i]
// info = Jazz.MidiInInfo(ins[i])
// if (info.length >= 3) {
// txt += '<ul><li>Manufacturer: ' + info[1] + '; Version: ' + info[2] + '</li></ul>'
// }
// txt += '</li>'
// }
// } else {
// txt += '<li>none</li>'
// }
// txt += '</ul></ul>'
// console.log(txt)
// }
// if (Jazz.isJazz) {
// listMidiPorts()
// Jazz.OnConnectMidiOut(function (name) { listMidiPorts(); alert('New MIDI-Out port connected: ' + name) })
// Jazz.OnDisconnectMidiOut(function (name) { listMidiPorts(); alert('MIDI-Out port disconnected: ' + name) })
// Jazz.OnConnectMidiIn(function (name) { listMidiPorts(); alert('New MIDI-In port connected: ' + name) })
// Jazz.OnDisconnectMidiIn(function (name) { listMidiPorts(); alert('MIDI-In port disconnected: ' + name) })
// }
//
