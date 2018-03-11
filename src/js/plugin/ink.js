// 墨水笔插件
/* eslint-disable */
(function ($) {
    var typeId = DrawBoard.getTypeId()

    var linex = []
    var liney = []

    var $elemMenu = $('#pencil-dialog')

    DrawBoard.addPlugin({
        type: typeId,
        name: 'ink',
        init: function () {
            var that = this

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.newx = potx
                        that.newy = poty

                        that.size = 8
                        var s = Math.ceil(that.size / 2);       //算出粒子的单位长度
                        var vlength = Math.sqrt((that.oldx - that.newx)*(that.oldx - that.newx)+(that.oldy-that.newy)*(that.oldy-that.newy))
                        var stepNum = Math.floor(vlength / s) + 1;   //算出步长  vlength为斜线长度



                        that._latestStrokeLength = vlength

                        var INK_AMOUNT = 15; // 画笔的粒子数量，控制笔划的浓密程度

                        var sep = 1.5; // 分割数  控制画笔的浓密程度  关键所在
                        //粒子的大小 根据画笔描绘的速度（画笔的停留时间）进行调整
                        var dotSize = sep * Math.min(INK_AMOUNT / that._latestStrokeLength * 3, 1)
                        var dotNum = Math.ceil(that.size * sep)
                        var range = that.size / 2
                        var i, j, r, c, x, y


                        that.ctx.save()

                        //log(currentColor);//获取当前颜色值

                        that.ctx.beginPath()

                        var nx = (that.newx - that.oldx) / vlength * s
                        var ny = (that.newy - that.oldy) / vlength * s

                        // 如果间距过大，补充过度点
                        if (vlength > that.lineWidth) {
                            var num = vlength / that.lineWidth * 3
                            var x, y
                            for (var i = 0; i < num - 1; i++) {
                                x = that.oldx + (potx - that.oldx) / num * (i + 1)
                                y = that.oldy + (poty - that.oldy) / num * (i + 1)
                                that.ctx.arc(x, y, that.lineWidth / 2, 0, Math.PI * 2, true)
                            }
                        }
                        // 画最后一点
                        that.ctx.arc(potx, poty, that.lineWidth / 2, 0, Math.PI * 2, true)
                        that.ctx.fill()

                        that.oldx = that.newx
                        that.oldy = that.newy
                    }
                    //that.cursorLayer.ctx.strokeStyle = that.color
                    that.cursorLayer.ctx.strokeStyle = '#999'
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height)
                    that.cursorLayer.drawRound(x, y, that.lineWidth / 2, false)
                    that.cursorLayer.ctx.strokeStyle = '#999'
                    that.cursorLayer.drawLine(x - 4, y, x + 4, y)
                    that.cursorLayer.drawLine(x, y - 4, x, y + 4)
                },
                mouseup: function (potx, poty) {
                    that.storage()
                },
            }
        }
    })
})(jQuery)