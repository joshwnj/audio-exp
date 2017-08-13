const WaveRecorder = require('wave-recorder')
const fs = require('fs')

module.exports = function (ac, filePath) {
  // create the recorder instance 
  const recorder = WaveRecorder(ac, {
    channels: 2,
    bitDepth: 32
  })

  const fileStream = fs.createWriteStream(filePath)
  recorder.pipe(fileStream)

  recorder.on('header', function (header) { 
    const headerStream = fs.createWriteStream(filePath, {
      start: 0,
      flags: 'r+'
    })
    
    headerStream.write(header)
    headerStream.end()
  })

  return recorder
}
