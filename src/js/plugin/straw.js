// 取色工具插件
const DrawBoard = window.DrawBoard
const $ = window.jQuery
const Color = window.Color

var typeId = DrawBoard.getTypeId()

DrawBoard.addPlugin({
    type: typeId,
    name: 'straw',
    init() {
        var that = this

        that.handlers[typeId] = {
            mousedown(potx, poty) {
                var imgData = that.ctx.getImageData(potx, poty, 10, 10)
                var red = imgData.data[0]
                var green = imgData.data[1]
                var blue = imgData.data[2]
                // var alpha = imgData.data[3]

                var rgb = Color.rbg2Hex([red, green, blue])
                that.setColor(rgb)
                $('#editor-color').colorpicker('setValue', rgb) // TODO 分离
                // $('#current-color').css('background-color', rgb)
            }
        }
    }
})
