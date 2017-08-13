module.exports = function (ac) {
  const analyser = ac.createAnalyser()
  analyser.fftSize = 32
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)


  // Get a canvas defined with ID "oscilloscope"
  var canvas = document.getElementById("scope");
  var canvasCtx = canvas.getContext("2d");

  function draw() {

    drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = canvas.width * 1.0 / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {

      var v = dataArray[i] / 255.0;
      var y = canvas.height - (canvas.height * v)

      canvasCtx.moveTo(x, y);
      canvasCtx.lineTo(x + sliceWidth, y);

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  };

  draw()
  return analyser
}
