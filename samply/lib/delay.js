module.exports = function (audioContext) {
  var input = audioContext.createGain()
  var merger = audioContext.createChannelMerger(2)
  var output = audioContext.createGain()

  var leftDelay = audioContext.createDelay()
  var rightDelay = audioContext.createDelay()
  var feedback = audioContext.createGain()

  input.connect(feedback, 0)
  leftDelay.connect(rightDelay)
  rightDelay.connect(feedback)
  feedback.connect(leftDelay)
  merger.connect(output)
  input.connect(output)

  feedback.gain.value = 0.2

  leftDelay.connect(merger, 0, 0)
  rightDelay.connect(merger, 0, 1)

  leftDelay.delayTime.value = 3 / 8
  rightDelay.delayTime.value = 3 / 8

  return {
    input,
    output
  }
}
