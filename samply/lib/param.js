function Param (opts = {}) {
  this.min = opts.min
  this.max = opts.max
  this.step = opts.step || 1
  this.value = this.default = opts.default || 0
}

Param.prototype.connect = function (obj, key = 'value') {
  this.updateFunc = (value) => obj[key] = value
  obj[key] = this.value
  return this
}

Param.prototype.update = function (value) {
  this.value = value
  if (this.updateFunc) { this.updateFunc(value) }
}

module.exports = Param
