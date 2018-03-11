// 直线插件
const DrawBoard = window.DrawBoard

var typeId = DrawBoard.getTypeId()

DrawBoard.addPlugin({
    type: typeId,
    name: 'line',
    init() {
        this.handlers[typeId] = {
            select: () => {
                this.ctx.strokeStyle = this.color
            },
            mousemove: (potx, poty) => {
                if (this.isDown) {
                    this.newx = potx
                    this.newy = poty

                    this.ctx2.clearRect(0, 0, this.width, this.height)
                    this.layer2.drawLine(this.oldx, this.oldy, this.newx, this.newy)
                }
            },
            mousedown: (potx, poty) => {
                this.layer2.show()
            },
            mouseup: (potx, poty) => {
                this.layer2.clearRect()
                this.layer.drawLine(this.oldx, this.oldy, this.newx, this.newy)
                this.storage()
            }
        }
    }
})
