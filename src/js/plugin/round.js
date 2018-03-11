// 圆形插件
const DrawBoard = window.DrawBoard

var typeId = DrawBoard.getTypeId()

DrawBoard.addPlugin({
    type: typeId,
    name: 'round',
    init: function () {
        var that = this

        that.handlers[typeId] = {
            select() {
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
                    var radius = Math.sqrt(((that.oldx - that.newx) * (that.oldx - that.newx)) + ((that.oldy - that.newy) * (that.oldy - that.newy)))
                    that.layer2.drawRound(that.oldx, that.oldy, radius)
                }
            },
            mouseup(potx, poty) {
                that.layer2.clearRect()

                var newx = potx
                var newy = poty

                var radius = Math.sqrt(((that.oldx - newx) * (that.oldx - newx)) + ((that.oldy - newy) * (that.oldy - newy)))
                that.layer.drawRound(that.oldx, that.oldy, radius)
                that.storage()
            }
        }
    }
})
