// 颜料桶工具插件
import floodFill from '../draw-selection'
const DrawBoard = window.DrawBoard
const Color = window.Color
var typeId = DrawBoard.getTypeId()

DrawBoard.addPlugin({
  type: typeId,
  name: 'paint_bucket',
  init: function () {
    var that = this

    that.handlers[typeId] = {
      mousedown: function (potx, poty) {
        var color = that.color
        var rgb = Color.hex2Rbg(color)
        var rgba = [rgb[0], rgb[1], rgb[2], 255]
        floodFill(that.layer.canvas, potx, poty, rgba, 30)
      },
      mouseup: function (potx, poty) {
        that.storage()
      }
    }
  }
})
