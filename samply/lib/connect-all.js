module.exports = function connectAll (...args) {
  for (var i = 0; i < args.length - 1; i += 1) {
    args[i].connect(args[i + 1])
  }
}
