// 椭圆插件
const DrawBoard = window.DrawBoard
var typeId = DrawBoard.getTypeId()

// 绘制椭圆
function ellipse(context, x, y, a, b) {
    context.save()
    var r = (a > b) ? a : b
    var ratioX = a / r
    var ratioY = b / r
    context.scale(ratioX, ratioY)
    context.beginPath()
    context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false)
    context.closePath()
    context.restore()
    context.stroke()
}

DrawBoard.addPlugin({
    type: typeId,
    name: 'ellipse',
    init() {
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
                    ellipse(that.layer2.ctx, (that.oldx + that.newx) / 2, (that.oldy + that.newy) / 2,
                        (that.newx - that.oldx) / 2, (that.newy - that.oldy) / 2)
                }
            },
            mouseup(potx, poty) {
                that.layer2.clearRect()
                ellipse(that.layer.ctx, (that.oldx + that.newx) / 2, (that.oldy + that.newy) / 2,
                    (that.newx - that.oldx) / 2, (that.newy - that.oldy) / 2)
                that.storage()
            }
        }
    }
})
