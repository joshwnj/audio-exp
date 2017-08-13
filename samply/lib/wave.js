const cmz = require('cmz')
const drawBuffer = require('draw-wave')

const hx = function (tag, style) {
  const el = document.createElement(tag)
  el.className = cmz(style)
  return el
}

module.exports = function () {
  const root = hx('div', `
    position: relative
    width: 100%`)
  
  const canvas = hx('canvas', `
    width: 100%
    height: 100px`)

  const highlight = hx('div', `
    position: absolute
    top: 0
    left: 0
    width: 0
    height: 100%
    background: hsla(150, 90%, 20%, .2)`)
  
  root.appendChild(canvas)
  root.appendChild(highlight)

  return {
    root,

    renderBuffer: function (buffer) {
      drawBuffer.canvas(canvas, buffer, '#52F6A4');
    },

    updateHighlight: function (opts) {
      highlight.style.left = opts.start + '%'
      highlight.style.width = opts.width + '%'
    }
  }
}
