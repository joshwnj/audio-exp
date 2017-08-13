module.exports = function Node (node, params={}) {
  this.node = node
  this.params = params

  Object.keys(params).forEach(k => {
    if (typeof params[k] === 'string') {
      node[k] = params[k]
      return
    }
    
    params[k].connect(node[k])
  })
}
