// 指针插件（移动图像）
const DrawBoard = window.DrawBoard

var typeId = DrawBoard.getTypeId()

var startX
var startY
var endX
var endY
var hasMove = false

DrawBoard.addPlugin({
    type: typeId,
    name: 'pointer',
    init: function () {
        var that = this

        that.handlers[typeId] = {
            mousedown: function (potx, poty) {
                startX = potx
                startY = poty
            },
            mouseout: function (potx, poty) {
            },
            mousemove: function (x, y) {
                if (that.isDown) {
                    hasMove = true
                    that.layer.canvas.style.left = (x - startX) + 'px'
                    that.layer.canvas.style.top = (y - startY) + 'px'
                    endX = x
                    endY = y
                }
            },
            mouseup: function (potx, poty) {
                if (hasMove) {
                    that.layer.canvas.style.left = '0px'
                    that.layer.canvas.style.top = '0px'
                    var x = endX - startX
                    var y = endY - startY
                    that.layer2.ctx.drawImage(that.layer.canvas, 0, 0, that.width - x, that.height - y,
                        x, y, that.width - x, that.height - y)
                    that.layer.clearRect(0, 0, that.width, that.height)
                    that.layer.ctx.drawImage(that.layer2.canvas, 0, 0, that.width, that.height,
                        0, 0, that.width, that.height)
                    that.layer2.clearRect(0, 0, that.width, that.height)
                }
                // that.storage()
            }
        }
    }
})
