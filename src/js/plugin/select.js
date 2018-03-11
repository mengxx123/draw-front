// 区域剪裁插件
const DrawBoard = window.DrawBoard
const context = window.context // TODO
const $elemMenu = window.$elemMenu // TODO
const Color = window.Color
var typeId = DrawBoard.getTypeId()

var linex = []
var liney = []

DrawBoard.addPlugin({
  type: typeId,
  name: 'select',
  init: function () {
    var that = this

    that.handlers[typeId] = {
      select: function () {
        console.log('选择2')
        that.ctx.strokeStyle = '#000'
        that.fillStroke = '#333'

        that.cursorLayer.ctx.fillStyle = '#999999'
        that.cursorLayer.ctx.strokeStyle = that.color
        that.cursorLayer.ctx.lineWidth = 1
        that.$elem.css('cursor', 'none')
      },
      unselect: function () {
        that.ctx.strokeStyle = 'rgba(250,250,250,1)'
        that.$elem.css('cursor', 'default')
      },
      mousedown: function (potx, poty) {
        linex.push(potx)
        liney.push(poty)

        that.ctx2.beginPath()
        that.ctx2.moveTo(potx, poty)
      },
      mouseout: function (potx, poty) {
        that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height)
      },
      mousemove: function (x, y) {
        if (that.isDown) {
          linex.push(x)
          liney.push(y)
          that.ctx2.lineTo(x, y)

          that.ctx2.lineCap = 'round'
          that.ctx2.lineJoin = 'round'
          that.ctx2.lineWidth = 1

          var rgb = Color.hex2Rbg(that.color)
          var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')'

          that.ctx2.strokeStyle = 'rgba(254,0,0,1)'
          that.ctx2.globalCompositeOperation = 'destination-out'
          that.ctx2.stroke()

          that.ctx2.strokeStyle = rgba
          that.ctx2.globalCompositeOperation = 'source-over'
          that.ctx2.stroke()
        }

        // that.cursorLayer.ctx.strokeStyle = that.color
        that.cursorLayer.ctx.strokeStyle = '#999'
        that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height)
        that.cursorLayer.ctx.strokeStyle = '#999'
        that.cursorLayer.drawLine(x - 4, y, x + 4, y)
        that.cursorLayer.drawLine(x, y - 4, x, y + 4)
      },
      mouseup: function (potx, poty) {
        that.ctx2.clearRect(0, 0, that.width, that.height)

        if (linex.length > 0) {
          var x = linex[0]
          var y = liney[0]
          that.ctx.beginPath()
          that.ctx.moveTo(x, y)

          for (var i = 1; i < linex.length; i++) {
            x = linex[i]
            y = liney[i]
            that.ctx.lineTo(x, y)
          }
          linex.length = 0
          liney.length = 0

          that.ctx.lineCap = 'round'
          that.ctx.lineJoin = 'round'
          that.ctx.lineWidth = that.lineWidth
          var rgb = Color.hex2Rbg(that.color)
          var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')'
          that.ctx.strokeStyle = rgba
          // that.ctx.fill()

          var context = that.ctx
          var canvasData = context.getImageData(0, 0, that.width, that.height)
          var binaryData = canvasData
          context.putImageData(canvasData, 0, 0)
          for (let x = 0; x < binaryData.width; x++) {
            for (let y = 0; y < binaryData.height; y++) {
              if (!that.ctx.isPointInPath(x, y)) {
                var idx = (x + y * binaryData.width) * 4
                binaryData.data[idx + 0] = 255 // Red channel
                binaryData.data[idx + 1] = 255 // Green channel
                binaryData.data[idx + 2] = 255 // Blue channel
                binaryData.data[idx + 3] = 0 // Alpha
              }
            }
          }
          context.putImageData(canvasData, 0, 0)
        }
        that.storage()
      },
      contextmenu: function (potx, poty, e) {
        context($elemMenu, e)
      }
    }
  }
})
