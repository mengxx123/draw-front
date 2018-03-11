// 矩形插件
const DrawBoard = window.DrawBoard

var typeId = DrawBoard.getTypeId()

DrawBoard.addPlugin({
    type: typeId,
    name: 'rect',
    init: function () {
        var that = this

        that.handlers[typeId] = {
            select: function () {
                that.ctx.strokeStyle = that.color
            },
            mousedown(potx, poty) {
                that.layer2.show()
            },
            mousemove(potx, poty) {
                if (that.isDown) {
                    that.newx = potx
                    that.newy = poty

                    that.ctx2.clearRect(0, 0, that.width, that.height)
                    that.layer2.drawRect(that.oldx, that.oldy, that.newx, that.newy)
                }
            },
            mouseup(potx, poty) {
                that.layer2.clearRect()

                var newx = potx
                var newy = poty

                that.layer.drawRect(that.oldx, that.oldy, newx, newy)
                that.storage()
            }
        }
    }
})
