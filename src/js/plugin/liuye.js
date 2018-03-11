// 柳叶笔插件

const DrawBoard = window.DrawBoard
const Color = window.Color
const context = window.context // TODO
let $elemMenu = window.$elemMenu // TODO

var typeId = DrawBoard.getTypeId()

var linex = []
var liney = []

DrawBoard.addPlugin({
  type: typeId,
  name: 'liuye',
  init: function () {
    var that = this
    that.handlers[typeId] = {
      select: function () {
        that.ctx.strokeStyle = that.color

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
          that.ctx2.lineWidth = that.lineWidth
          var rgb = Color.hex2Rbg(that.color)
          var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')'
          that.ctx2.fillStyle = rgba

          that.ctx2.clearRect(0, 0, that.width, that.height)
          that.ctx2.beginPath()
          for (var i = 0; i < linex.length; i++) {
            if (i === 0) {
              that.ctx2.moveTo(linex[i], liney[i])
            } else {
              that.ctx2.lineTo(linex[i], liney[i])
            }
          }
          that.ctx2.fill()

          /*
          that.ctx2.strokeStyle = "rgba(254,0,0,1)"
              that.ctx2.globalCompositeOperation="destination-out"
              that.ctx2.stroke()
              */

        /*
        that.ctx2.strokeStyle = rgba
            that.ctx2.globalCompositeOperation="source-over"
            that.ctx2.stroke()
            */
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
          that.ctx.fill()
        }
        that.storage()
      },
      contextmenu: function (potx, poty, e) {
        context($elemMenu, e)
      }
    }
  }
})