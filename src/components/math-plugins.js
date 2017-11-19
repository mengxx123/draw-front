/**
 * Created by cjh1 on 2017/5/4.
 */
(function ($) {
    var typeId = DrawBoard.getTypeId();

    // 点插件
    DrawBoard.addPlugin({
        type: typeId,
        name: 'm-point',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                select: function () {

                },
                mousemove: function (potx, poty) {

                },
                mousedown: function (potx, poty) {
                    var pt = that.getCoor(potx, poty);
                    that.shapes.push({
                        id: new Date().getTime(),
                        type: 'point',
                        x: pt.x,
                        y: pt.y,
                        name: getLetter(),
                    });
                    that.clear();
                    that.drawAll();
                },
                mouseup: function (potx, poty) {
                },
            };
        }
    });

    // 移动插件
    DrawBoard.addPlugin({
        type: typeId,
        name: 'm-move',
        init: function () {
            var that = this;

            var downX;
            var downY;
            var cx;
            that.handlers[typeId] = {
                select: function () {

                },
                mousedown: function (potx, poty) {
                    console.log('down')
                    downX = potx;
                    downY = poty;
                    cx = that.cx;
                    cy = that.cy;
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.cx = cx + (potx - downX);
                        that.cy = cy + (poty - downY);
                        that.reDraw();
                    }
                },
                mouseup: function (potx, poty) {
                },
            };
        }
    });

    // 线段工具

    // 直线工具

    // 圆工具
})(jQuery);
