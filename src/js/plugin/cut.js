// 剪切插件
/* eslint-disable */
(function ($) {
    var typeId = DrawBoard.getTypeId()

    DrawBoard.addPlugin({
        type: typeId,
        name: 'cut',
        init: function () {
            var that = this

            that.cutDate = {
                isCut: false
            }
            var $elemMenu = $('#cut-menu')

            $('#cut-menu-cancel').on('click', function (e) {
                e.preventDefault()

                $elemMenu.hide()
                contextHide($('#cut-box'))
                that.cutDate.isCut = false
            })

            $('#cut-menu-cut').on('click', function (e) {
                e.preventDefault()

                $elemMenu.hide()
                contextHide($('#cut-box'))
                that.cutDate.isCut = false

                var width = that.cutDate.endX - that.cutDate.startX
                var height = that.cutDate.endY - that.cutDate.startY
                that.ctx.drawImage(that.layer.canvas, that.cutDate.startX,
                    that.cutDate.startY,
                    width,
                    height,
                    0, 0, width, height)

                that.canvasSize(width, height)
                that.storage()
            })

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color
                    that.ctx2.strokeStyle = that.color
                    that.ctx2.lineWidth = 1
                },
                click2: function (potx, poty) {
                    $elemMenu.hide()
                },
                mousedown: function (potx, poty) {
                    that.layer2.show()
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.newx = potx
                        that.newy = poty

                        that.ctx2.clearRect(0, 0, that.width, that.height)
                        that.layer2.drawRect(that.oldx, that.oldy, that.newx, that.newy)

                    }
                },
                mouseup: function (potx, poty) {


                    var newx = potx
                    var newy = poty

                    var startX = that.oldx < potx ? that.oldx : potx
                    var startY = that.oldy < poty ? that.oldy : poty
                    var endX = that.oldx < potx ? potx : that.oldx
                    var endY = that.oldy < poty ? poty : that.oldy

                    that.cutDate.startX = startX
                    that.cutDate.startY = startY
                    that.cutDate.endX = endX
                    that.cutDate.endY = endY

                    //that.layer.drawRect(that.oldx, that.oldy, newx, newy)

                    $('#cut-box').show()

                    $('#cut-box').find('.ui-cut').css({
                        left: startX,
                        top: startY,
                        width: endX - startX,
                        height: endY - startY
                    })
                    $('#cut-box').find('.cut-overlay-top').height(startY)
                    $('#cut-box').find('.cut-overlay-bottom').css({
                        top: endY + 'px',
                        left: startX + 'px'
                    })
                    $('#cut-box').find('.cut-overlay-left').css({
                        top: startY + 'px',
                        width: startX + 'px'
                    })
                    $('#cut-box').find('.cut-overlay-right').css({
                        top: startY + 'px',
                        left: endX + 'px',
                        height: (endY - startY) + 'px'
                    })
                    that.layer2.clearRect()

                    that.cutDate.isCut = true
                },
                contextmenu: function (potx, poty, e) {


                    if (that.cutDate.isCut) {
                        context($elemMenu, e)
                    }

                }
            }
        }
    })
})(jQuery)