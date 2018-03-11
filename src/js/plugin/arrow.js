// 箭头插件
const DrawBoard = window.DrawBoard
var typeId = DrawBoard.getTypeId()

// 画箭头
function drawArrow(ctx, x1, y1, x2, y2) {
    var sta = [0, 0]
    var end = [x2 - x1, y1 - y2]

    var con = ctx
    con.save()
    con.translate(x1, y1) // 坐标源点

    con.beginPath()
    con.moveTo(sta[0], 0 - sta[1])
    con.lineTo(end[0], 0 - end[1])
    con.stroke()

    con.translate(end[0], 0 - end[1])
    if (end[1] - sta[1] >= 0) {
        con.rotate(Math.atan((end[0] - sta[0]) / (end[1] - sta[1])))
    } else {
        con.rotate(Math.PI + Math.atan((end[0] - sta[0]) / (end[1] - sta[1]))) // 旋转弧度
    }
    con.moveTo(-5, 10)
    con.lineTo(0, 5)
    con.lineTo(5, 10)
    con.lineTo(0, 0)
    con.fill()
    con.restore()
}

DrawBoard.addPlugin({
    type: typeId,
    name: 'arrow',
    init() {
        var that = this
        that.handlers[typeId] = {
            select() {
                that.ctx.strokeStyle = that.color
            },
            mousemove(potx, poty) {
                if (that.isDown) {
                    that.newx = potx
                    that.newy = poty

                    that.ctx2.clearRect(0, 0, that.width, that.height)
                    drawArrow(that.ctx2, that.oldx, that.oldy, that.newx, that.newy)
                }
            },
            mousedown(potx, poty) {
                that.layer2.show()
            },
            mouseup(potx, poty) {
                that.layer2.clearRect()

                drawArrow(that.ctx, that.oldx, that.oldy, that.newx, that.newy)
                // that.layer.drawLine(that.oldx, that.oldy, that.newx, that.newy)
                that.storage()
            }
        }
    }
})
