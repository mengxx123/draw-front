/* eslint-disable */

// 模糊橡皮檫插件
(function ($) {
    var typeId = DrawBoard.getTypeId()

    DrawBoard.addPlugin({
        type: typeId,
        name: 'vague_eraser',
        init: function () {
            var that = this
            that.handlers[typeId] = {
                select: function () {
                    that.cursorLayer.ctx.fillStyle = "#999999"
                    that.cursorLayer.ctx.strokeStyle = 'rgba(0,0,0,5)'
                    that.cursorLayer.ctx.lineWidth = 1

                    that.$elem.css('cursor', 'none')
                },
                unselect: function () {
                    that.ctx.strokeStyle = 'rgba(250,250,250,1)'
                    that.$elem.css('cursor', 'default')
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {


                        that.newx = potx
                        that.newy = poty

                        that.resetEraser2(that.oldx,that.oldy,that.newx,that.newy)
                        that.cursorLayer.show()

                        that.oldx = that.newx
                        that.oldy = that.newy
                    }

                    that.cursorLayer.ctx.strokeStyle = '#999'
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height)
                    var half = that.eraserWidth / 2
                    //that.drawRect(potx - half, poty - half, potx + half, poty + half, that.ctx2, true)
                    that.cursorLayer.drawRound(potx, poty, that.eraserWidth / 2, false)
                },
                click: function (potx, poty) {
                    that.resetEraser2(that.oldx, that.oldy, potx, poty)
                },
                mouseout: function (potx, poty) {
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height)
                },
                mousewheel: function (potx, poty, delta) {
                    if (delta > 0) {
                        that.eraserWidth += 2
                    } else {
                        that.eraserWidth -= 2
                    }

                    if (that.eraserWidth < 1) {
                        that.eraserWidth = 1
                    }
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height)
                    var half = that.eraserWidth / 2
                    //that.drawRect(potx - half, poty - half, potx + half, poty + half, that.ctx2, true)
                    that.cursorLayer.drawRound(potx, poty, that.eraserWidth / 2, false)
                },
                mouseup: function (potx, poty) {
                    that.storage()
                },
                contextmenu: function (potx, poty, e) {
                    context($elemMenu, e)
                }
            }
        }
    })
})(jQuery)