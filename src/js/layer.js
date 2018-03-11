// Layer class
function Layer (draw, canvas) {
  var that = this

  that.canvas = canvas
  that.width = draw.width
  that.height = draw.height
  that.canvas.width = that.width
  that.canvas.height = that.height
  // 图层属性
  that.visibility = true // 可见性
  that.opacity = 1 // 不透明度
  that.type = 0 // 图层类型

  that.ctx = that.canvas.getContext('2d')
  that.ctx.lineJoin = 'round'
  that.ctx.lineCap = 'round' // 设置笔迹边角，否则笔迹会出现断层
}

Layer.prototype.show = function () {
  this.visibility = true
  this.canvas.style.display = 'block'
}

Layer.prototype.hide = function () {
  this.visibility = false
  this.canvas.style.display = 'none'
}

Layer.prototype.drawLine = function (x1, y1, x2, y2) {
  var that = this

  var ctx = that.ctx
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.lineCap = 'round'
  ctx.stroke()
}

Layer.prototype.drawRect = function (x1, y1, x2, y2, type) {
  var that = this

  var ctx = that.ctx
  ctx.beginPath()
  var width = Math.abs(x1 - x2)
  var height = Math.abs(y1 - y2)
  var minx = Math.min(x1, x2)
  var miny = Math.min(y1, y2)
  ctx.rect(minx, miny, width, height)
  if (type) {
    ctx.fill()
  } else {
    ctx.stroke()
  }
}

Layer.prototype.drawRound = function (x, y, radius, fill) {
  var that = this

  var ctx = that.ctx
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)

  if (fill) {
    ctx.fill()
  } else {
    ctx.stroke()
  }
}

Layer.prototype.clearRect = function (x, y, w, h) {
  if (x) {
    this.ctx.clearRect(x, y, w, h)
  } else {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}

export default Layer
