// 蜡笔插件
import { random } from '../tool'
const DrawBoard = window.DrawBoard

var typeId = DrawBoard.getTypeId()

DrawBoard.addPlugin({
    type: typeId,
    name: 'crayon',
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
                    var s = Math.ceil(that.size / 2) // 算出粒子的单位长度
                    var vlength = Math.sqrt((that.oldx - that.newx) * (that.oldx - that.newx) + (that.oldy - that.newy) * (that.oldy - that.newy))
                    var stepNum = Math.floor(vlength / s) + 1 // 算出步长  vlength为斜线长度

                    that._latestStrokeLength = vlength

                    var INK_AMOUNT = 15 // 画笔的粒子数量，控制笔划的浓密程度

                    var sep = 1.5 // 分割数  控制画笔的浓密程度  关键所在
                    // 粒子的大小 根据画笔描绘的速度（画笔的停留时间）进行调整
                    var dotSize = sep * Math.min(INK_AMOUNT / that._latestStrokeLength * 3, 1)
                    var dotNum = Math.ceil(that.size * sep)
                    var range = that.size / 2
                    var i, j, r, c, x, y

                    that.ctx.save()

                    that.ctx.beginPath()

                    var nx = (that.newx - that.oldx) / vlength * s
                    var ny = (that.newy - that.oldy) / vlength * s

                    for (i = 0; i < dotNum; i++) {
                        for (j = 0; j < stepNum; j++) {
                            // p = this._latest.add(v.scale(j))

                            var px = that.oldx + nx * j
                            var py = that.oldy + ny * j
                            r = random(range)
                            c = random(Math.PI * 2)
                            var w = random(dotSize, dotSize / 2)
                            var h = random(dotSize, dotSize / 2)
                            x = px + r * Math.sin(c) - w / 2
                            y = py + r * Math.cos(c) - h / 2
                            that.ctx.rect(x, y, w, h)
                            // ctx.arc(x,y,w,0,Math.PI * 2,true)
                        }
                    }
                    that.ctx.fill()

                    that.oldx = that.newx
                    that.oldy = that.newy
                }
            },
            mouseup: function (potx, poty) {
                that.storage()
            }
        }
    }
})
