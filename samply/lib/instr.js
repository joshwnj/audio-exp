const makeDistortionCurve = require('make-distortion-curve')
const Param = require('./param')
const Node = require('./node')
const connectAll = require('./connect-all')

function Instr (ac) {
  this._ac = ac
  this._bs = null
  this._buffer = null
  this._dest = null

  this._volumeIn = ac.createGain()
  this._volumeOut = ac.createGain()

  this.duration = null
  this.nodes = {}

  this.params = {
    playbackRate: new Param({
      value: 1.0
    }),
    loopStart: new Param(),
    loopEnd: new Param(),
  }
}

Instr.prototype = {
  load (url, cb) {
    loadSample(url, (buffer) => {
      this._buffer = buffer
      this.duration = buffer.duration
      cb(null, buffer)
    })
  },

  addNodes (nodes) {
    Object.assign(this.nodes, nodes)
  },

  connect (dest) {
    this._dest = dest
  },

  noteOn (time) {
    const params = this.params
    const bs = this._bs = this._ac.createBufferSource()
    bs.buffer = this._buffer

    params.playbackRate.connect(bs.playbackRate)

    bs.loop = true
    params.loopStart.connect(bs, 'loopStart')
    params.loopEnd.connect(bs, 'loopEnd')

    bs.start(time, params.loopStart.value)

    connectAll(
      bs,
      this._volumeIn,
      ...Object.values(this.nodes).map(n => n.node),
      this._volumeOut,
      this._dest
    )
  },

  noteOff (time) {
    if (!this._bs) return
    this._bs.stop(time)
  }
}

module.exports = Instr
