/* eslint-disable */

// 文字插件
(function ($) {
    var typeId = DrawBoard.getTypeId()

    var downX
    var downY
    var editing = false

    DrawBoard.addPlugin({
        type: typeId,
        name: 'text',
        init: function () {
            var that = this

            that.handlers[typeId] = {
                select: function () {
                    /*that.ctx.strokeStyle = that.color
                     //that.ctx.strokeStyle = 'rgba(0,0,0,.5)'


                     that.cursorLayer.ctx.fillStyle = "#999999"
                     that.cursorLayer.ctx.strokeStyle = that.color
                     that.cursorLayer.ctx.lineWidth = 1
                     that.$elem.css('cursor', 'none');*/
                },
                unselect: function () {
                    that.ctx.strokeStyle = 'rgba(250,250,250,1)'
                    that.$elem.css('cursor', 'default')
                },
                click: function (potx, poty) {
                    if (!editing) {
                        editing = true
                        var $textBox = $('#text-box')
                        $textBox.show()
                        $textBox.css({
                            left: potx + that.offsetX - 8,
                            top: poty + that.offsetY - 8
                        })
                        $('#text-box-input').focus().val('')
                        $('#text-box-input').one('blur', function () {
                            editing = false
                            $textBox.hide()
                            var text = this.value
                            if (text) {
                                that.ctx.font="18px '宋体'"
                                that.ctx.fillText(text, potx, poty)
                            }
                        })
                    }
                },
                mousedown: function (potx, poty) {
                    downX = potx
                    downY = poty
                },
                mousemove: function (x, y) {
                    if (that.isDown) {
                        var elem = document.getElementById('drawboard')
                        elem.scrollTop = downY - y
                        //elem.scrollLeft = x - downX
                    }
                },
                mouseup: function (potx, poty) {
                    that.storage()
                }
            }
        }
    })
})(jQuery)