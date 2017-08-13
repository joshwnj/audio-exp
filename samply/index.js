const ac = require('./lib/audiocontext')
const loadSample = require('./lib/load-sample')
const createScope = require('./lib/scope')
const Instr = require('./lib/instr')
const Node = require('./lib/node')
const Param = require('./lib/param')
const recordWav = require('./lib/record')
const clamp = require('./lib/clamp')

const rootEl = document.getElementById('root')
rootEl.innerHTML = `
<style>
body {
  font: normal 16px/1 sans-serif;
  margin: 0;
  padding: 0;
}
</style>

<canvas id="scope" width="600" height="100"></canvas>
<canvas class="visualizer" width="600" height="100"></canvas>
`

// ----

const masterVolume = ac.createGain()
masterVolume.gain.value = 1
masterVolume.connect(ac.destination)

const delay = require('./lib/delay')(ac)
delay.output.connect(masterVolume)

const analyser = createScope(ac)
masterVolume.connect(analyser)

const recorder = recordWav(ac, 'output.wav')
masterVolume.connect(recorder.input)

const wave = require('./lib/wave')()
rootEl.appendChild(wave.root)

// ----

const sample = new Instr(ac)

sample.connect(delay.input)
sample.addNodes({
  filter: new Node(ac.createBiquadFilter(), {
    type: 'lowpass',
    frequency: new Param(),
    Q: new Param()
  })
})

sample.load('./assets/sample.mp3', (err, buffer) => {
  if (err) { throw err }

  wave.renderBuffer(buffer)
})

// ----

const percent = {
  x: 0,
  y: 0
}

window.onmousewheel = (event) => {
  percent.x += event.deltaX
  percent.x = clamp(percent.x, 0, 100)

  percent.y += event.deltaY
  percent.y = clamp(percent.y, 0, 100)

  const start = (percent.x / 100) * sample.duration
  const end = start + (percent.y / 100) * sample.duration

  sample.params.loopStart.update(start)
  sample.params.loopEnd.update(clamp(end, start + 0.01, sample.duration))

  wave.updateHighlight({
    start: percent.x,
    width: percent.y
  })
}

window.onmousemove = (event) => {
  const pos = {
    x: event.clientX / window.innerWidth,
    y: event.clientY / window.innerHeight
  }

  sample.nodes.filter.params.frequency.update(pos.x * 1000)
  sample.nodes.filter.params.Q.update(pos.y * 20)

  sample.params.playbackRate.update(pos.y)
}

// ----

window.onkeydown = (event) => {
  if (event.ctrlKey) {
    sample.noteOn(ac.currentTime)
  }
}

window.onkeyup = (event) => {
  if (!event.ctrlKey) {
    sample.noteOff(ac.currentTime)
  }
}
