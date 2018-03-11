// 抓手插件
/* eslint-disable */
(function ($) {
    var typeId = DrawBoard.getTypeId()

    var downX
    var downY

    DrawBoard.addPlugin({
        type: typeId,
        name: 'hand',
        init: function () {
            var that = this

            that.handlers[typeId] = {
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
                }
            }
        }
    })
})(jQuery)