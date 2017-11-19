/**
 * draw.js 数学插件
 */

// 坐标插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    DrawBoard.addPlugin({
        type: typeId,
        name: 'coor',
        init: function () {
            var that = this;

            that.cx = that.width / 2 - 20;
            that.cy = that.height / 2 + 50;

            that.shapes = [
                {
                    id: '12131312',
                    type: 'point',
                    x: 1,
                    y: 2,
                    name: 'A',
                    color: '#f00'
                },
                {
                    id: '12121342',
                    type: 'point',
                    x: 2,
                    y: 0,
                    name: 'B',
                },
                {
                    id: '18596385',
                    type: 'line',
                    define: '直线[A, B]',
                    x: 2,
                    y: 0,
                    name: 'f',
                }
            ];

            that.scale = 1;
            that.originX = 0;
            that.originX = 0;

            //that.danweiWidth = 50;
            that.danweiWidth = 50;

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.log.push({
                            type: 'move',
                            x: potx,
                            y: poty,
                        });

                        that.newx = potx;
                        that.newy = poty;

                        that.ctx2.clearRect(0, 0, that.width, that.height);

                        if (that.curElem) {
                            var pt = that.getCoor(potx, poty);
                            that.curElem.x = pt.x;
                            that.curElem.y = pt.y;
                            that.reDraw();
                        } else {
                            that.layer2.drawRect(that.oldx, that.oldy, that.newx, that.newy);
                        }
                    } else {
                        that.ctx2.clearRect(0, 0, that.width, that.height);
                        var pt = that.getCoor(potx, poty);
                        for (var i = 0; i < that.shapes.length; i++) {
                            var shape = that.shapes[i];
                            if (shape.type === 'point') {
                                if (Math.abs(shape.x - pt.x) < 0.1 && Math.abs(shape.y - pt.y) < 0.1) {
                                    var pPt = that.change(shape.x, shape.y);
                                    that.ctx2.fillStyle = 'rgba(0, 0, 0, .3)';
                                    that.ctx2.beginPath();
                                    that.ctx2.arc(pPt.x, pPt.y, 10, 0, Math.PI * 2);
                                    that.ctx2.fill();
                                }
                            }
                        }
                    }
                },
                mousedown: function (potx, poty) {
                    var pt = that.getCoor(potx, poty);
                    var found = false;
                    for (var i = 0; i < that.shapes.length; i++) {
                        var shape = that.shapes[i];
                        if (shape.type === 'point') {
                            if (Math.abs(shape.x - pt.x) < 0.1 && Math.abs(shape.y - pt.y) < 0.1) {
                                found = true;

                                if (that.curElem) {
                                    that.curElem.selected = false;
                                }
                                that.curElem = that.shapes[i];
                                that.curElem.selected = true;
                                that.reDraw();
                                $('#editor-name').val(shape.name);
                                $('#editor-define').val('(' + shape.x + ',' + shape.y + ')');
                                $('#regular-box').show();
                                break;
                            }
                        }
                    }
                    if (!found) {
                        if (that.curElem) {
                            that.curElem.selected = false;
                            that.curElem = null;
                            that.reDraw();
                            $('#regular-box').hide();
                        }
                    }
                    that.layer2.show();
                },
                mouseup: function (potx, poty) {
                    that.ctx2.clearRect(0, 0, that.width, that.height);
                },
                mousewheel: function (potx, poty, delta) {
                    if (delta > 0) {
                        console.log(that.danweiWidth);
                        //that.danweiWidth += 10;
                        that.danweiWidth = 100;
                        //that.clear();
                        that.ctx.clearRect(0, 0, that.width, that.height);
                        //that.layer.ctx.clearRect(0, 0, 500, 500);
                        that.drawCoor();
                    } else {
                        that.danweiWidth = 25;
                        //that.danweiWidth -= 10;
                        that.layer.clearRect();
                        that.drawCoor();
                    }
                },
            };
        }
    });

    //var TYPE_COOR = 122; // 直线

    var fn = DrawBoard.prototype;

    fn.empty = function () {
        var that = this;
        that.shapes = [];
        that.curElem = null;
    };

    fn.getCoor = function (x, y) {
        var that = this;
        return {
            x: (x - that.cx) / that.danweiWidth,
            y: (that.cy - y) / that.danweiWidth
        };
    };

    fn.reDraw = function () {
        var that = this;
        that.clear();
        that.drawAll();
    };

    fn.drawAll = function () {
        var that = this;
        var start = new Date().getTime();
        that.drawCoor();
        //console.log((new Date().getTime() - start) + 'ms');
    };

    fn.drawShapes = function () {
        var that = this;

        var shape;
        for (var i = 0; i < that.shapes.length; i++) {
            shape = that.shapes[i];
            if (shape.type === 'point') {
                var ptA = that.change(shape.x, shape.y);

                that.ctx.beginPath();
                that.ctx.arc(ptA.x, ptA.y, 4, 0, Math.PI * 2);
                that.ctx.fillStyle = shape.color || '#000';
                that.ctx.fill();

                that.ctx.fillStyle = '#09c';
                that.ctx.font = '18px "微软雅黑"';
                that.ctx.fillText(shape.name, ptA.x + 10, ptA.y - 10);

                if (shape.selected) {
                    that.ctx.fillStyle = 'rgba(0,0,0,.2)';
                    that.ctx.arc(ptA.x, ptA.y, 8, 0, Math.PI * 2);
                    that.ctx.fill();
                }

            }
        }

        /*
        // y = x + 2
        for (var i = 0; i < that.width; i += 2) {

            var x = (i - that.cx) / that.danweiWidth;
            var y = x + 2;
            var pt = that.change(i, y);

            if (i === 0) {
                that.ctx.moveTo(i, pt.y);
            } else {
                that.ctx.lineTo(i, pt.y);
            }
        }
        that.ctx.stroke();

        // y = x ^ 2
        for (var i = 0; i < that.width; i += 2) {

            var x = (i - that.cx) / that.danweiWidth;
            var y = x * x;
            var pt = that.change(i, y);

            if (i === 0) {
                that.ctx.moveTo(i, pt.y);
            } else {
                that.ctx.lineTo(i, pt.y);
            }
        }
        that.ctx.stroke();

        // y = 1 / x
        for (var i = 0; i < that.width; i += 2) {
            var x = (i - that.cx) / that.danweiWidth;
            if (x == 0) {
                continue;
            }
            var y = 1 / x;
            var pt = that.change(i, y);

            if (i === 0) {
                that.ctx.moveTo(i, pt.y);
            } else {
                that.ctx.lineTo(i, pt.y);
            }
        }
        that.ctx.stroke();*/
    };

    fn.change = function (x, y) {
        var that = this;
        return {
            x: that.cx + x * that.danweiWidth,
            y: that.cy - y * that.danweiWidth
        }
    };

    // 画坐标系
    DrawBoard.prototype.drawCoor = function () {
        var that = this;

        that.ctx.beginPath(); // TODO 主要

        that.ctx.fillStyle = '#000';
        that.ctx.strokeStyle = that.color;
        that.lineWidth = 1;

        var danweiWidth = that.danweiWidth; // 1个单位的像素大小

        var totalNum = 10;
        var gridDanwei = Math.floor(that.width / totalNum / danweiWidth);
        var dridWidth = gridDanwei * danweiWidth;
        that.danweiWidth = danweiWidth;
        var gridNum = that.width / totalNum;

        dridWidth = 20;
        //that.width = 50;
        console.log('??' + 50 / 20)

        that.drawShapes();

        that.ctx.font = '16px "微软雅黑"';

        var showXAxis = true;
        var showYAxis = true;

        // x轴
        if (showXAxis) {
            // 网格
            that.ctx.beginPath();
            that.ctx.strokeStyle = '#ccc';
            that.ctx.lineWidth = 1;
            for (var i = 0 - gridNum / 2; i < gridNum / 2; i++) {
                var length = 10;
                /*if (i % 10 == 0) {
                 length = 15;
                 }*/

                that.ctx.moveTo(that.cx + dridWidth * i + 0.5, 0);
                that.ctx.lineTo(that.cx + dridWidth * i + 0.5, that.height);
            }
            that.ctx.stroke();

            // x轴
            that.ctx.beginPath();
            that.ctx.strokeStyle = '#666';
            that.ctx.lineWidth = 1;
            that.ctx.moveTo(0, that.cy);
            that.ctx.lineTo(that.width, that.cy);

            // 轴刻度
            for (var i = 0 - gridNum / 2; i < gridNum / 2; i++) {
                var length = 10;
                /*if (i % 10 == 0) {
                 length = 15;
                 }*/
                that.ctx.fillStyle = '#000';
                that.ctx.moveTo(that.cx + dridWidth * i, that.cy - length);
                that.ctx.lineTo(that.cx + dridWidth * i, that.cy);
                that.ctx.fillText('' + (gridDanwei * i),
                    that.cx + dridWidth * i  - 4, that.cy - length + 30)
            }
            that.ctx.stroke();
        }

        // y轴
        if (showYAxis) {
            // 网格
            that.ctx.beginPath();
            that.ctx.strokeStyle = '#ccc';
            that.ctx.lineWidth = 1;
            for (var i = 0 - gridNum / 2; i < gridNum / 2; i++) {
                var length = 10;
                /*if (i % 10 == 0) {
                 length = 15;
                 }*/
                that.ctx.moveTo(0, that.cy + dridWidth * i);
                that.ctx.lineTo(that.width, that.cy + dridWidth * i);
            }

            // 纵坐标
            that.ctx.moveTo(that.cx, 0);
            that.ctx.lineTo(that.cx, that.height);
            for (var i = 0 - gridNum / 2; i < gridNum / 2; i++) {
                var length = 10;
                /*if (i % 10 == 0) {
                 length = 15;
                 }*/

                that.ctx.moveTo(that.cx, that.cy + dridWidth * i);
                that.ctx.lineTo(that.cx + length, that.cy + dridWidth * i);
                that.ctx.fillText('' + (i * gridDanwei * -1), that.cx + length + 5, that.cy + dridWidth * i)
            }
            that.ctx.stroke();
        }
    };

    /*DrawBoard.fn.initCoor = function () {

    };

    DrawBoard.fn.useCood = function () {
        var that = this;

        if (!this.isInitCoor) {
            this.initCoor();
            this.isInitCoor = true;
        }

        that._setType(TYPE_COOR);
    };*/

})(jQuery);

$(function () {
    var db = new DrawBoard('drawboard', {
        width: 500,
        height: 500
    });
    db.usePlugin('coor');
    db.drawAll();
    //db.usePlugin('m-move');

    // 工具栏选择
    $('#tool-box').selectable({
        item: '.btn'
    });
    $(document).on('click', '[data-type]', function () {
        var type = $(this).data('type');
        db.usePlugin(type);
    });

    $('#clear').on('click', function () {
        db.clear();
        db.empty();
        db.drawCoor();
    });

    $('#download').on('click', function () {
        db.save();
    });

    $('#editor-name').on('input', function () {
        db.curElem.name = this.value;
        db.clear();
        db.drawAll();
    });
    $('#editor-remove').on('click', function () {
        for (var i = 0; i < db.shapes.length; i++) {
            if (db.shapes[i].id === db.curElem.id) {
                db.shapes.splice(i, 1);
                db.reDraw();
                break;
            }
        }
    });

    $("[data-toggle='tooltip']").tooltip();
});

var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var letterIdx = 0;
function getLetter() {
    return letters.charAt(letterIdx++);
}
