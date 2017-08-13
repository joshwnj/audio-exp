const ac = require('./audiocontext')

module.exports = function loadSample (url, cb) {
  var request = new XMLHttpRequest()
  request.open('GET', url)
  request.responseType = 'arraybuffer'
  request.onload = function () {
    ac.decodeAudioData(request.response, cb)
  }

  request.send()
}
