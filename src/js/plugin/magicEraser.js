// 魔术橡皮檫工具插件
import floodFill from '../draw-selection'
const DrawBoard = window.DrawBoard
var typeId = DrawBoard.getTypeId()

DrawBoard.addPlugin({
  type: typeId,
  name: 'magic_eraser',
  init: function () {
    var that = this

    that.handlers[typeId] = {
      mousedown: function (potx, poty) {
        floodFill(that.layer.canvas, potx, poty, [0, 0, 0, 0], 30)
      }
    }
  }
})
