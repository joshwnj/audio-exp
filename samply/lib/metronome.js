function worker () {
  var timerId

  self.onmessage = function (e) {
	  if (e.data === 'start') {
      timerId = setInterval(postMessage.bind(null, 'tick'), 25)
	  }
	  else if (e.data === 'stop') {
		  clearInterval(timerId)
		  timerId = null
	  }
  }
}

function funcToString (func) {
  return func.toString().replace(/^[\w\W]*?\{([\w\W]*)\}[\w\W]*$/, '$1')
}

function setupWorker (onTick) {
  const blob = new Blob([funcToString(worker)], {type: 'application/javascript'})
  const w = new Worker(URL.createObjectURL(blob))

  w.onmessage = function (e) {
    if (e.data === 'tick') {
      onTick()
    }
    else {
      console.log('message:', e.data)
    }
  }

  return w
}

module.exports = function (ac, scheduleNote) {
  // how far ahead to schedule
  const scheduleAheadTime = 0.1
  var currentNote = 0
  var nextNoteTime = 0.0
  var bpm = 60

  const w = setupWorker(scheduleNotes)

  return {
    setBpm: function (value) {
      bpm = value
    },

    start: function () {
      currentNote = 0
      nextNoteTime = ac.currentTime
      w.postMessage('start')
    },

    stop: function () {
      w.postMessage('stop')
    }
  }

  // ----

  function nextNote () {
    const secondsPerBeat = 60.0 / bpm
    nextNoteTime += 0.25 * secondsPerBeat
    currentNote += 1
  }

  function scheduleNotes () {
    while (nextNoteTime < ac.currentTime + scheduleAheadTime) {
      scheduleNote(currentNote, nextNoteTime)
      nextNote()
    }
  }
}
