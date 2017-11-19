/**
 * draw.js 插件，每个插件相互独立
 * Created by cjh1 on 2017/5/1.
 */

// 铅笔插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    var linex = [];
    var liney = [];

    var $elemMenu = $('#pencil-dialog');

    DrawBoard.addPlugin({
        type: typeId,
        name: 'pencil',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                    //that.ctx.strokeStyle = 'rgba(0,0,0,.5)';
                    that.cursorLayer.ctx.fillStyle = "#999999";
                    that.cursorLayer.ctx.strokeStyle = that.color;
                    that.cursorLayer.ctx.lineWidth = 1;
                    that.$elem.css('cursor', 'none');
                },
                unselect: function () {
                    that.ctx.strokeStyle = 'rgba(250,250,250,1)';
                    that.$elem.css('cursor', 'default');
                },
                mousedown: function (potx, poty) {
                    linex.push(potx);
                    liney.push(poty);



                    that.ctx2.beginPath();
                    that.ctx2.moveTo(potx, poty);

                },
                mouseout: function (potx, poty) {
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                },
                mousemove: function (x, y) {
                    if (that.isDown) {
                        linex.push(x);
                        liney.push(y);
                        that.ctx2.lineTo(x,y);
                        lastX = x;
                        lastY = y;

                        that.ctx2.lineCap="round";
                        that.ctx2.lineJoin="round";
                        that.ctx2.lineWidth = that.lineWidth;

                        var rgb = Color.hex2Rbg(that.color);
                        var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')';

                        that.ctx2.strokeStyle = "rgba(254,0,0,1)";
                        that.ctx2.globalCompositeOperation="destination-out";
                        that.ctx2.stroke();

                        that.ctx2.strokeStyle = rgba;
                        that.ctx2.globalCompositeOperation="source-over";
                        that.ctx2.stroke();
                    }

                    //that.cursorLayer.ctx.strokeStyle = that.color;
                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                    that.cursorLayer.drawRound(x, y, that.lineWidth / 2, false);
                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.drawLine(x - 4, y, x + 4, y);
                    that.cursorLayer.drawLine(x, y - 4, x, y + 4);
                },
                mouseup: function (potx, poty) {
                    that.ctx2.clearRect(0, 0, that.width, that.height);

                    if(linex.length > 0){
                        var x = linex[0];
                        var y = liney[0];
                        that.ctx.beginPath();
                        that.ctx.moveTo(x,y);

                        for(var i=1; i<linex.length; i++){
                            x = linex[i];
                            y = liney[i];
                            that.ctx.lineTo(x,y);
                        }
                        linex.length = 0;
                        liney.length = 0;

                        that.ctx.lineCap="round";
                        that.ctx.lineJoin="round";
                        that.ctx.lineWidth = that.lineWidth;
                        var rgb = Color.hex2Rbg(that.color);
                        var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')';
                        that.ctx.strokeStyle = rgba;
                        that.ctx.stroke();
                    }

                    if (potx === that.oldx && poty === that.oldy) {
                        var rgb = Color.hex2Rbg(that.color);
                        var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')';
                        that.ctx.fillStyle = rgba;
                        that.layer.drawRound(potx, poty, that.lineWidth / 2, true);
                    }
                    that.storage();
                },
                contextmenu: function (potx, poty, e) {
                    context($elemMenu, e);
                },
                mousewheel: function (x, y, delta) {
                    if (delta > 0) {
                        that.lineWidth += 2;
                    } else {
                        that.lineWidth -= 2;
                    }

                    if (that.lineWidth < 1) {
                        that.lineWidth = 1;
                    }
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                    that.cursorLayer.drawRound(x, y, that.lineWidth / 2, false);
                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.drawLine(x - 4, y, x + 4, y);
                    that.cursorLayer.drawLine(x, y - 4, x, y + 4);
                },
            };
        }
    });
})(jQuery);

// 橡皮檫插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    var $elemMenu = $('#eraser-dialog');

    DrawBoard.addPlugin({
        type: typeId,
        name: 'eraser',
        init: function () {
            var that = this;
            that.handlers[typeId] = {
                select: function () {
                    that.cursorLayer.ctx.fillStyle = "#999999";
                    that.cursorLayer.ctx.strokeStyle = 'rgba(0,0,0,5)';
                    that.cursorLayer.ctx.lineWidth = 1;

                    that.$elem.css('cursor', 'none');
                },
                unselect: function () {
                    that.ctx.strokeStyle = 'rgba(250,250,250,1)';
                    that.$elem.css('cursor', 'default');
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.newx = potx;
                        that.newy = poty;

                        that.resetEraser(that.oldx,that.oldy,that.newx,that.newy);
                        that.cursorLayer.show();

                        that.oldx = that.newx;
                        that.oldy = that.newy;
                    }

                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                    var half = that.eraserWidth / 2;
                    //that.drawRect(potx - half, poty - half, potx + half, poty + half, that.ctx2, true);
                    that.cursorLayer.drawRound(potx, poty, that.eraserWidth / 2, false);
                },
                click: function (potx, poty) {
                    that.eraserCircle(potx, poty, that.eraserWidth / 2);
                },
                mouseout: function (potx, poty) {
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                },
                mousewheel: function (potx, poty, delta) {
                    if (delta > 0) {
                        that.eraserWidth += 2;
                    } else {
                        that.eraserWidth -= 2;
                    }

                    if (that.eraserWidth < 1) {
                        that.eraserWidth = 1;
                    }
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                    var half = that.eraserWidth / 2;
                    //that.drawRect(potx - half, poty - half, potx + half, poty + half, that.ctx2, true);
                    that.cursorLayer.drawRound(potx, poty, that.eraserWidth / 2, false);
                },
                mouseup: function (potx, poty) {
                    that.storage();
                },
                contextmenu: function (potx, poty, e) {
                    context($elemMenu, e);
                }
            };
        }
    });
})(jQuery);

// 模糊橡皮檫插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    DrawBoard.addPlugin({
        type: typeId,
        name: 'vague_eraser',
        init: function () {
            var that = this;
            that.handlers[typeId] = {
                select: function () {
                    that.cursorLayer.ctx.fillStyle = "#999999";
                    that.cursorLayer.ctx.strokeStyle = 'rgba(0,0,0,5)';
                    that.cursorLayer.ctx.lineWidth = 1;

                    that.$elem.css('cursor', 'none');
                },
                unselect: function () {
                    that.ctx.strokeStyle = 'rgba(250,250,250,1)';
                    that.$elem.css('cursor', 'default');
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {


                        that.newx = potx;
                        that.newy = poty;

                        that.resetEraser2(that.oldx,that.oldy,that.newx,that.newy);
                        that.cursorLayer.show();

                        that.oldx = that.newx;
                        that.oldy = that.newy;
                    }

                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                    var half = that.eraserWidth / 2;
                    //that.drawRect(potx - half, poty - half, potx + half, poty + half, that.ctx2, true);
                    that.cursorLayer.drawRound(potx, poty, that.eraserWidth / 2, false);
                },
                click: function (potx, poty) {
                    that.resetEraser2(that.oldx, that.oldy, potx, poty);
                },
                mouseout: function (potx, poty) {
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                },
                mousewheel: function (potx, poty, delta) {
                    if (delta > 0) {
                        that.eraserWidth += 2;
                    } else {
                        that.eraserWidth -= 2;
                    }

                    if (that.eraserWidth < 1) {
                        that.eraserWidth = 1;
                    }
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                    var half = that.eraserWidth / 2;
                    //that.drawRect(potx - half, poty - half, potx + half, poty + half, that.ctx2, true);
                    that.cursorLayer.drawRound(potx, poty, that.eraserWidth / 2, false);
                },
                mouseup: function (potx, poty) {
                    that.storage();
                },
                contextmenu: function (potx, poty, e) {
                    context($elemMenu, e);
                }
            };
        }
    });
})(jQuery);

// 蜡笔插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    DrawBoard.addPlugin({
        type: typeId,
        name: 'crayon',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.newx = potx;
                        that.newy = poty;

                        that.size = 8;
                        var s = Math.ceil(that.size / 2);       //算出粒子的单位长度
                        var vlength = Math.sqrt((that.oldx - that.newx)*(that.oldx - that.newx)+(that.oldy-that.newy)*(that.oldy-that.newy));
                        var stepNum = Math.floor(vlength / s) + 1;   //算出步长  vlength为斜线长度



                        that._latestStrokeLength = vlength;

                        var INK_AMOUNT = 15; // 画笔的粒子数量，控制笔划的浓密程度

                        var sep = 1.5; // 分割数  控制画笔的浓密程度  关键所在
                        //粒子的大小 根据画笔描绘的速度（画笔的停留时间）进行调整
                        var dotSize = sep * Math.min(INK_AMOUNT / that._latestStrokeLength * 3, 1);
                        var dotNum = Math.ceil(that.size * sep);
                        var range = that.size / 2;
                        var i, j, r, c, x, y;


                        that.ctx.save();

                        //log(currentColor);//获取当前颜色值

                        that.ctx.beginPath();

                        var nx = (that.newx - that.oldx) / vlength * s;
                        var ny = (that.newy - that.oldy) / vlength * s;

                        for (i = 0; i < dotNum; i++) {
                            for (j = 0; j < stepNum; j++) {
                                //p = this._latest.add(v.scale(j));

                                var px = that.oldx + nx * j;
                                var py = that.oldy + ny * j;
                                r = random(range);
                                c = random(Math.PI * 2);
                                var w = random(dotSize, dotSize / 2);
                                var h = random(dotSize, dotSize / 2);
                                x = px + r * Math.sin(c) - w / 2;
                                y = py + r * Math.cos(c) - h / 2;
                                that.ctx.rect(x, y, w, h);
                                //ctx.arc(x,y,w,0,Math.PI * 2,true);
                            }
                        }
                        that.ctx.fill();

                        that.oldx = that.newx;
                        that.oldy = that.newy;

                    }
                },
                mouseup: function (potx, poty) {
                    that.storage();
                },
            };
        }
    });
})(jQuery);

// 取色工具插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    DrawBoard.addPlugin({
        type: typeId,
        name: 'straw',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                mousedown: function (potx, poty) {
                    var imgData = that.ctx.getImageData(potx, poty, 10, 10);
                    var red = imgData.data[0];
                    var green = imgData.data[1];
                    var blue = imgData.data[2];
                    var alpha = imgData.data[3];

                    var rgb = Color.rbg2Hex([red, green, blue]);
                    that.setColor(rgb);
                    $('#editor-color').colorpicker('setValue', rgb); // TODO 分离
                    //$('#current-color').css('background-color', rgb);
                }
            };
        }
    });
})(jQuery);

// 区域选择插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    var linex = [];
    var liney = [];

    DrawBoard.addPlugin({
        type: typeId,
        name: 'select',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                    that.fillStroke = '#333';

                    that.cursorLayer.ctx.fillStyle = "#999999";
                    that.cursorLayer.ctx.strokeStyle = that.color;
                    that.cursorLayer.ctx.lineWidth = 1;
                    that.$elem.css('cursor', 'none');
                },
                unselect: function () {
                    that.ctx.strokeStyle = 'rgba(250,250,250,1)';
                    that.$elem.css('cursor', 'default');
                },
                mousedown: function (potx, poty) {
                    linex.push(potx);
                    liney.push(poty);



                    that.ctx2.beginPath();
                    that.ctx2.moveTo(potx, poty);

                },
                mouseout: function (potx, poty) {
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                },
                mousemove: function (x, y) {
                    if (that.isDown) {
                        linex.push(x);
                        liney.push(y);
                        that.ctx2.lineTo(x,y);
                        lastX = x;
                        lastY = y;

                        that.ctx2.lineCap="round";
                        that.ctx2.lineJoin="round";
                        that.ctx2.lineWidth = 1;

                        var rgb = Color.hex2Rbg(that.color);
                        var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')';

                        that.ctx2.strokeStyle = "rgba(254,0,0,1)";
                        that.ctx2.globalCompositeOperation="destination-out";
                        that.ctx2.stroke();

                        that.ctx2.strokeStyle = rgba;
                        that.ctx2.globalCompositeOperation="source-over";
                        that.ctx2.stroke();
                    }

                    //that.cursorLayer.ctx.strokeStyle = that.color;
                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.drawLine(x - 4, y, x + 4, y);
                    that.cursorLayer.drawLine(x, y - 4, x, y + 4);
                },
                mouseup: function (potx, poty) {
                    that.ctx2.clearRect(0, 0, that.width, that.height);

                    if(linex.length > 0){
                        var x = linex[0];
                        var y = liney[0];
                        that.ctx.beginPath();
                        that.ctx.moveTo(x,y);

                        for(var i=1; i<linex.length; i++){
                            x = linex[i];
                            y = liney[i];
                            that.ctx.lineTo(x,y);
                        }
                        linex.length = 0;
                        liney.length = 0;

                        that.ctx.lineCap="round";
                        that.ctx.lineJoin="round";
                        that.ctx.lineWidth = that.lineWidth;
                        var rgb = Color.hex2Rbg(that.color);
                        var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')';
                        that.ctx.strokeStyle = rgba;
                        //that.ctx.fill();

                        var context = that.ctx;
                        var canvasData = context.getImageData(0, 0, that.width, that.height);
                        var binaryData = canvasData;
                        context.putImageData(canvasData, 0, 0);
                        for ( var x = 0; x < binaryData.width; x++) {
                            for ( var y = 0; y < binaryData.height; y++) {

                                if (that.ctx.isPointInPath(x, y)) {

                                } else {
                                    var idx = (x + y * binaryData.width) * 4;

                                    // assign gray scale value
                                    binaryData.data[idx + 0] = 255; // Red channel
                                    binaryData.data[idx + 1] = 255; // Green channel
                                    binaryData.data[idx + 2] = 255; // Blue channel
                                    binaryData.data[idx + 3] = 0; // Blue channel
                                }
                                // Index of the pixel in the array
                                /*var idx = (x + y * binaryData.width) * 4;
                                 var r = binaryData.data[idx + 0];
                                 var g = binaryData.data[idx + 1];
                                 var b = binaryData.data[idx + 2];*/

                                // calculate gray scale value
                                //var gray = .299 * r + .587 * g + .114 * b;


                            }
                        }
                        context.putImageData(canvasData, 0, 0);
                    }


                    that.storage();
                },
                contextmenu: function (potx, poty, e) {
                    context($elemMenu, e);
                }
            };
        }
    });
})(jQuery);

// 直线插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    DrawBoard.addPlugin({
        type: typeId,
        name: 'line',
        init: function () {
            var that = this;
            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.newx = potx;
                        that.newy = poty;

                        that.ctx2.clearRect(0, 0, that.width, that.height);
                        that.layer2.drawLine(that.oldx, that.oldy, that.newx, that.newy);
                    }
                },
                mousedown: function (potx, poty) {
                    that.layer2.show();
                },
                mouseup: function (potx, poty) {
                    that.layer2.clearRect();

                    var newx = potx;
                    var newy = poty;

                    that.layer.drawLine(that.oldx, that.oldy, that.newx, that.newy);
                    that.storage();
                }
            };
        }
    });
})(jQuery);

// 圆形插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    DrawBoard.addPlugin({
        type: typeId,
        name: 'round',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                },
                mousedown: function (potx, poty) {
                    that.layer2.show();
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.newx = potx;
                        that.newy = poty;

                        that.ctx2.clearRect(0, 0, that.width, that.height);
                        var radius = Math.sqrt(((that.oldx - that.newx) * (that.oldx - that.newx)) + ((that.oldy - that.newy) * (that.oldy - that.newy)));
                        that.layer2.drawRound(that.oldx, that.oldy, radius);
                    }
                },
                mouseup: function (potx, poty) {
                    that.layer2.clearRect();

                    var newx = potx;
                    var newy = poty;

                    var radius = Math.sqrt(((that.oldx - newx) * (that.oldx - newx)) + ((that.oldy - newy) * (that.oldy - newy)));
                    that.layer.drawRound(that.oldx, that.oldy, radius);
                    that.storage();
                },
            };
        }
    });
})(jQuery);

// 矩形插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    DrawBoard.addPlugin({
        type: typeId,
        name: 'rect',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                },
                mousedown: function (potx, poty) {
                    that.layer2.show();
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.newx = potx;
                        that.newy = poty;

                        that.ctx2.clearRect(0, 0, that.width, that.height);
                        that.layer2.drawRect(that.oldx, that.oldy, that.newx, that.newy);
                    }
                },
                mouseup: function (potx, poty) {
                    that.layer2.clearRect();

                    var newx = potx;
                    var newy = poty;

                    that.layer.drawRect(that.oldx, that.oldy, newx, newy);
                    that.storage();
                }
            }
        }
    });
})(jQuery);

// 椭圆插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    // 绘制椭圆
    function ellipse(context, x, y, a, b) {
        context.save();
        var r = (a > b) ? a : b;
        var ratioX = a / r;
        var ratioY = b / r;
        context.scale(ratioX, ratioY);
        context.beginPath();
        context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
        context.closePath();
        context.restore();
        context.stroke();
    }

    DrawBoard.addPlugin({
        type: typeId,
        name: 'ellipse',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                },
                mousedown: function (potx, poty) {
                    that.layer2.show();
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.newx = potx;
                        that.newy = poty;

                        that.ctx2.clearRect(0, 0, that.width, that.height);
                        ellipse(that.layer2.ctx, (that.oldx + that.newx) / 2, (that.oldy + that.newy) / 2,
                            (that.newx - that.oldx) / 2, (that.newy - that.oldy) / 2);
                        //that.layer2.drawRect(that.oldx, that.oldy, that.newx, that.newy);
                    }
                },
                mouseup: function (potx, poty) {
                    that.layer2.clearRect();

                    var newx = potx;
                    var newy = poty;

                    ellipse(that.layer.ctx, (that.oldx + that.newx) / 2, (that.oldy + that.newy) / 2,
                        (that.newx - that.oldx) / 2, (that.newy - that.oldy) / 2);
                    //that.layer.drawRect(that.oldx, that.oldy, newx, newy);
                    that.storage();
                }
            }
        }
    });
})(jQuery);

// 剪切插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    DrawBoard.addPlugin({
        type: typeId,
        name: 'cut',
        init: function () {
            var that = this;

            that.cutDate = {
                isCut: false
            };
            var $elemMenu = $('#cut-menu');

            $('#cut-menu-cancel').on('click', function (e) {
                e.preventDefault();

                $elemMenu.hide();
                contextHide($('#cut-box'));
                that.cutDate.isCut = false;
            });

            $('#cut-menu-cut').on('click', function (e) {
                e.preventDefault();

                $elemMenu.hide();
                contextHide($('#cut-box'));
                that.cutDate.isCut = false;

                var width = that.cutDate.endX - that.cutDate.startX;
                var height = that.cutDate.endY - that.cutDate.startY;
                that.ctx.drawImage(that.layer.canvas, that.cutDate.startX,
                    that.cutDate.startY,
                    width,
                    height,
                    0, 0, width, height);

                that.canvasSize(width, height);
                that.storage();
            });

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                    that.ctx2.strokeStyle = that.color;
                    that.ctx2.lineWidth = 1;
                },
                click2: function (potx, poty) {
                    $elemMenu.hide();
                },
                mousedown: function (potx, poty) {
                    that.layer2.show();
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.newx = potx;
                        that.newy = poty;

                        that.ctx2.clearRect(0, 0, that.width, that.height);
                        that.layer2.drawRect(that.oldx, that.oldy, that.newx, that.newy);

                    }
                },
                mouseup: function (potx, poty) {


                    var newx = potx;
                    var newy = poty;

                    var startX = that.oldx < potx ? that.oldx : potx;
                    var startY = that.oldy < poty ? that.oldy : poty;
                    var endX = that.oldx < potx ? potx : that.oldx;
                    var endY = that.oldy < poty ? poty : that.oldy;

                    that.cutDate.startX = startX;
                    that.cutDate.startY = startY;
                    that.cutDate.endX = endX;
                    that.cutDate.endY = endY;

                    //that.layer.drawRect(that.oldx, that.oldy, newx, newy);

                    $('#cut-box').show();

                    $('#cut-box').find('.ui-cut').css({
                        left: startX,
                        top: startY,
                        width: endX - startX,
                        height: endY - startY
                    });
                    $('#cut-box').find('.cut-overlay-top').height(startY);
                    $('#cut-box').find('.cut-overlay-bottom').css({
                        top: endY + 'px',
                        left: startX + 'px'
                    });
                    $('#cut-box').find('.cut-overlay-left').css({
                        top: startY + 'px',
                        width: startX + 'px'
                    });
                    $('#cut-box').find('.cut-overlay-right').css({
                        top: startY + 'px',
                        left: endX + 'px',
                        height: (endY - startY) + 'px'
                    });
                    that.layer2.clearRect();

                    that.cutDate.isCut = true;
                },
                contextmenu: function (potx, poty, e) {


                    if (that.cutDate.isCut) {
                        context($elemMenu, e);
                    }

                }
            }
        }
    });
})(jQuery);

// 魔术橡皮檫工具插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    DrawBoard.addPlugin({
        type: typeId,
        name: 'magic_eraser',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                mousedown: function (potx, poty) {
                    floodFill(that.layer.canvas, potx, poty, [0,0,0,0], 30);
                }
            };
        }
    });
})(jQuery);

// 颜料桶工具插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    DrawBoard.addPlugin({
        type: typeId,
        name: 'paint_bucket',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                mousedown: function (potx, poty) {
                    var color = that.color;
                    var rgb = Color.hex2Rbg(color);
                    var rgba = [rgb[0], rgb[1], rgb[2], 255];
                    floodFill(that.layer.canvas, potx, poty, rgba, 30);
                },
                mouseup: function (potx, poty) {
                    that.storage();
                }
            };
        }
    });
})(jQuery);

// 指针插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    var startX;
    var startY;
    var endX;
    var endY;
    var hasMove = false;

    DrawBoard.addPlugin({
        type: typeId,
        name: 'pointer',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                mousedown: function (potx, poty) {
                    startX = potx;
                    startY = poty;
                },
                mouseout: function (potx, poty) {
                },
                mousemove: function (x, y) {
                    if (that.isDown) {
                        hasMove = true;
                        that.layer.canvas.style.left = (x - startX) + 'px';
                        that.layer.canvas.style.top = (y - startY) + 'px';
                        endX = x;
                        endY = y;
                    }
                },
                mouseup: function (potx, poty) {
                    if (hasMove) {
                        that.layer.canvas.style.left = '0px';
                        that.layer.canvas.style.top = '0px';
                        var x = endX - startX;
                        var y = endY - startY;
                        that.layer2.ctx.drawImage(that.layer.canvas, 0, 0, that.width - x, that.height - y,
                            x, y, that.width - x, that.height - y);
                        that.layer.clearRect(0, 0, that.width, that.height);
                        that.layer.ctx.drawImage(that.layer2.canvas, 0, 0, that.width, that.height,
                            0, 0, that.width, that.height);
                        that.layer2.clearRect(0, 0, that.width, that.height);
                    }
                    //that.storage();
                },
            };
        }
    });
})(jQuery);

// 柳叶笔插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    var linex = [];
    var liney = [];

    DrawBoard.addPlugin({
        type: typeId,
        name: 'liuye',
        init: function () {
            var that = this;
            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                    //that.ctx.strokeStyle = 'rgba(0,0,0,.5)';


                    that.cursorLayer.ctx.fillStyle = "#999999";
                    that.cursorLayer.ctx.strokeStyle = that.color;
                    that.cursorLayer.ctx.lineWidth = 1;
                    that.$elem.css('cursor', 'none');
                },
                unselect: function () {
                    that.ctx.strokeStyle = 'rgba(250,250,250,1)';
                    that.$elem.css('cursor', 'default');
                },
                mousedown: function (potx, poty) {
                    linex.push(potx);
                    liney.push(poty);

                    that.ctx2.beginPath();
                    that.ctx2.moveTo(potx, poty);

                },
                mouseout: function (potx, poty) {
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                },
                mousemove: function (x, y) {
                    if (that.isDown) {
                        linex.push(x);
                        liney.push(y);
                        that.ctx2.lineTo(x,y);
                        lastX = x;
                        lastY = y;

                        that.ctx2.lineCap="round";
                        that.ctx2.lineJoin="round";
                        that.ctx2.lineWidth = that.lineWidth;
                        var rgb = Color.hex2Rbg(that.color);
                        var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')';
                        that.ctx2.fillStyle = rgba;

                        that.ctx2.clearRect(0, 0, that.width, that.height);
                        that.ctx2.beginPath();
                        for (var i = 0; i < linex.length; i++) {
                            if (i == 0) {
                                that.ctx2.moveTo(linex[i], liney[i]);
                            } else {
                                that.ctx2.lineTo(linex[i], liney[i]);
                            }
                        }
                        that.ctx2.fill();



                        /*that.ctx2.strokeStyle = "rgba(254,0,0,1)";
                         that.ctx2.globalCompositeOperation="destination-out";
                         that.ctx2.stroke();*/

                        /*that.ctx2.strokeStyle = rgba;
                         that.ctx2.globalCompositeOperation="source-over";
                         that.ctx2.stroke();*/
                    }

                    //that.cursorLayer.ctx.strokeStyle = that.color;
                    that.cursorLayer.ctx.strokeStyle = '#999';

                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.drawLine(x - 4, y, x + 4, y);
                    that.cursorLayer.drawLine(x, y - 4, x, y + 4);
                },
                mouseup: function (potx, poty) {
                    that.ctx2.clearRect(0, 0, that.width, that.height);

                    if(linex.length > 0){
                        var x = linex[0];
                        var y = liney[0];
                        that.ctx.beginPath();
                        that.ctx.moveTo(x,y);

                        for(var i=1; i<linex.length; i++){
                            x = linex[i];
                            y = liney[i];
                            that.ctx.lineTo(x,y);
                        }
                        linex.length = 0;
                        liney.length = 0;

                        that.ctx.lineCap="round";
                        that.ctx.lineJoin="round";
                        that.ctx.lineWidth = that.lineWidth;
                        var rgb = Color.hex2Rbg(that.color);
                        var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')';
                        that.ctx.strokeStyle = rgba;
                        that.ctx.fill();
                    }
                    that.storage();
                },
                contextmenu: function (potx, poty, e) {
                    context($elemMenu, e);
                }
            };
        }
    });
})(jQuery);

// 抓手插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    var downX;
    var downY;

    DrawBoard.addPlugin({
        type: typeId,
        name: 'hand',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                mousedown: function (potx, poty) {
                    downX = potx;
                    downY = poty;
                },
                mousemove: function (x, y) {
                    if (that.isDown) {
                        var elem = document.getElementById('drawboard');
                        elem.scrollTop = downY - y;
                        //elem.scrollLeft = x - downX;
                    }
                },
                mouseup: function (potx, poty) {
                }
            };
        }
    });
})(jQuery);

// 毛刷、喷枪插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    var linex = [];
    var liney = [];

    var $elemMenu = $('#pencil-dialog');

    DrawBoard.addPlugin({
        type: typeId,
        name: 'brush',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                    //that.ctx.strokeStyle = 'rgba(0,0,0,.5)';


                    that.cursorLayer.ctx.fillStyle = "#999999";
                    that.cursorLayer.ctx.strokeStyle = that.color;
                    that.cursorLayer.ctx.lineWidth = 1;
                    that.$elem.css('cursor', 'none');
                },
                unselect: function () {
                    that.ctx.strokeStyle = 'rgba(250,250,250,1)';
                    that.$elem.css('cursor', 'default');
                },
                mousedown: function (potx, poty) {
                    linex.push(potx);
                    liney.push(poty);



                    that.ctx2.beginPath();
                    that.ctx2.moveTo(potx, poty);

                },
                mouseout: function (potx, poty) {
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                },
                mousemove: function (x, y) {
                    if (that.isDown) {
                        linex.push(x);
                        liney.push(y);
                        that.ctx2.lineTo(x,y);


                        that.ctx2.lineCap="round";
                        that.ctx2.lineJoin="round";
                        that.ctx2.lineWidth = that.lineWidth;

                        var rgb = Color.hex2Rbg(that.color);
                        var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')';

                        var radialGradient = that.ctx2.createRadialGradient ((lastX + x) / 2, (lastY + y) / 2, 0,
                            (lastX + x) / 2, (lastY + y) / 2, that.lineWidth / 2);
                        radialGradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
                        radialGradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.6)');
                        radialGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                        that.ctx2.beginPath();
                        that.ctx2.arc(x, y, that.lineWidth / 2, 0, Math.PI * 2, true);
                        that.ctx2.closePath();
                        that.ctx2.strokeStyle = radialGradient;

                        //that.ctx2.strokeStyle = "rgba(254,0,0,1)";
                        that.ctx2.globalCompositeOperation="destination-out";
                        that.ctx2.stroke();

                        that.ctx2.strokeStyle = rgba;
                        that.ctx2.globalCompositeOperation="source-over";
                        that.ctx2.stroke();

                        /*var radialGradient = that.ctx2.createRadialGradient (x, y, 0, x, y, that.lineWidth / 2);
                         radialGradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
                         radialGradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.6)');
                         radialGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                         that.ctx2.beginPath();
                         that.ctx2.arc(x, y, that.lineWidth / 2, 0, Math.PI * 2, true);
                         that.ctx2.closePath();
                         that.ctx2.fillStyle = radialGradient;
                         that.ctx2.fill();*/

                        lastX = x;
                        lastY = y;
                    }

                    //that.cursorLayer.ctx.strokeStyle = that.color;
                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                    that.cursorLayer.drawRound(x, y, that.lineWidth / 2, false);
                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.drawLine(x - 4, y, x + 4, y);
                    that.cursorLayer.drawLine(x, y - 4, x, y + 4);
                },
                mouseup: function (potx, poty) {
                    that.ctx2.clearRect(0, 0, that.width, that.height);

                    if(linex.length > 0){
                        var x = linex[0];
                        var y = liney[0];
                        that.ctx.beginPath();
                        that.ctx.moveTo(x,y);

                        for(var i=1; i<linex.length; i++){
                            x = linex[i];
                            y = liney[i];
                            that.ctx.lineTo(x,y);
                        }
                        linex.length = 0;
                        liney.length = 0;

                        that.ctx.lineCap="round";
                        that.ctx.lineJoin="round";
                        that.ctx.lineWidth = that.lineWidth;
                        var rgb = Color.hex2Rbg(that.color);
                        var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')';
                        that.ctx.strokeStyle = rgba;
                        that.ctx.stroke();
                    }

                    if (potx === that.oldx && poty === that.oldy) {
                        var rgb = Color.hex2Rbg(that.color);
                        var rgba = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + that.opacity + ')';
                        that.ctx.fillStyle = rgba;
                        that.layer.drawRound(potx, poty, that.lineWidth / 2, true);
                    }
                    that.storage();
                },
                contextmenu: function (potx, poty, e) {
                    context($elemMenu, e);
                }
            };
        }
    });
})(jQuery);

// 墨水笔插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    var linex = [];
    var liney = [];

    var $elemMenu = $('#pencil-dialog');

    DrawBoard.addPlugin({
        type: typeId,
        name: 'ink',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.newx = potx;
                        that.newy = poty;

                        that.size = 8;
                        var s = Math.ceil(that.size / 2);       //算出粒子的单位长度
                        var vlength = Math.sqrt((that.oldx - that.newx)*(that.oldx - that.newx)+(that.oldy-that.newy)*(that.oldy-that.newy));
                        var stepNum = Math.floor(vlength / s) + 1;   //算出步长  vlength为斜线长度



                        that._latestStrokeLength = vlength;

                        var INK_AMOUNT = 15; // 画笔的粒子数量，控制笔划的浓密程度

                        var sep = 1.5; // 分割数  控制画笔的浓密程度  关键所在
                        //粒子的大小 根据画笔描绘的速度（画笔的停留时间）进行调整
                        var dotSize = sep * Math.min(INK_AMOUNT / that._latestStrokeLength * 3, 1);
                        var dotNum = Math.ceil(that.size * sep);
                        var range = that.size / 2;
                        var i, j, r, c, x, y;


                        that.ctx.save();

                        //log(currentColor);//获取当前颜色值

                        that.ctx.beginPath();

                        var nx = (that.newx - that.oldx) / vlength * s;
                        var ny = (that.newy - that.oldy) / vlength * s;

                        // 如果间距过大，补充过度点
                        if (vlength > that.lineWidth) {
                            var num = vlength / that.lineWidth * 3;
                            var x, y;
                            for (var i = 0; i < num - 1; i++) {
                                x = that.oldx + (potx - that.oldx) / num * (i + 1);
                                y = that.oldy + (poty - that.oldy) / num * (i + 1);
                                that.ctx.arc(x, y, that.lineWidth / 2, 0, Math.PI * 2, true);
                            }
                        }
                        // 画最后一点
                        that.ctx.arc(potx, poty, that.lineWidth / 2, 0, Math.PI * 2, true);
                        that.ctx.fill();

                        that.oldx = that.newx;
                        that.oldy = that.newy;
                    }
                    //that.cursorLayer.ctx.strokeStyle = that.color;
                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.ctx.clearRect(0, 0, that.width, that.height);
                    that.cursorLayer.drawRound(x, y, that.lineWidth / 2, false);
                    that.cursorLayer.ctx.strokeStyle = '#999';
                    that.cursorLayer.drawLine(x - 4, y, x + 4, y);
                    that.cursorLayer.drawLine(x, y - 4, x, y + 4);
                },
                mouseup: function (potx, poty) {
                    that.storage();
                },
            };
        }
    });
})(jQuery);

// 文字插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    var downX;
    var downY;
    var editing = false;

    DrawBoard.addPlugin({
        type: typeId,
        name: 'text',
        init: function () {
            var that = this;

            that.handlers[typeId] = {
                select: function () {
                    /*that.ctx.strokeStyle = that.color;
                     //that.ctx.strokeStyle = 'rgba(0,0,0,.5)';


                     that.cursorLayer.ctx.fillStyle = "#999999";
                     that.cursorLayer.ctx.strokeStyle = that.color;
                     that.cursorLayer.ctx.lineWidth = 1;
                     that.$elem.css('cursor', 'none');*/
                },
                unselect: function () {
                    that.ctx.strokeStyle = 'rgba(250,250,250,1)';
                    that.$elem.css('cursor', 'default');
                },
                click: function (potx, poty) {
                    if (!editing) {
                        editing = true;
                        var $textBox = $('#text-box');
                        $textBox.show();
                        $textBox.css({
                            left: potx + that.offsetX - 8,
                            top: poty + that.offsetY - 8
                        });
                        $('#text-box-input').focus().val('');
                        $('#text-box-input').one('blur', function () {
                            editing = false;
                            $textBox.hide();
                            var text = this.value;
                            if (text) {
                                that.ctx.font="18px '宋体'";
                                that.ctx.fillText(text, potx, poty);
                            }
                        });
                    }
                },
                mousedown: function (potx, poty) {
                    downX = potx;
                    downY = poty;
                },
                mousemove: function (x, y) {
                    if (that.isDown) {
                        var elem = document.getElementById('drawboard');
                        elem.scrollTop = downY - y;
                        //elem.scrollLeft = x - downX;
                    }
                },
                mouseup: function (potx, poty) {
                    that.storage();
                }
            };
        }
    });
})(jQuery);

// 箭头插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    // 画箭头
    function drawArrow(ctx, x1, y1, x2, y2) {
        var sta = [0 , 0];
        var end = [x2 - x1, y1 - y2];

        var con = ctx;
        con.save();
        con.translate(x1, y1); //坐标源点


        con.beginPath();
        con.moveTo(sta[0],-sta[1]);
        con.lineTo(end[0],-end[1]);
        con.stroke();

        con.translate(end[0],-end[1]);
        (end[1]-sta[1] >= 0) ?
            con.rotate(Math.atan((end[0]-sta[0])/(end[1]-sta[1]))) :
            con.rotate(Math.PI+Math.atan((end[0]-sta[0])/(end[1]-sta[1]))); //旋转弧度
        con.moveTo(-5,10);
        con.lineTo(0,5);
        con.lineTo(5,10);
        con.lineTo(0,0);
        con.fill();
        con.restore();
    }

    DrawBoard.addPlugin({
        type: typeId,
        name: 'arrow',
        init: function () {
            var that = this;
            that.handlers[typeId] = {
                select: function () {
                    that.ctx.strokeStyle = that.color;
                },
                mousemove: function (potx, poty) {
                    if (that.isDown) {
                        that.newx = potx;
                        that.newy = poty;

                        that.ctx2.clearRect(0, 0, that.width, that.height);
                        drawArrow(that.ctx2, that.oldx, that.oldy, that.newx, that.newy);
                    }
                },
                mousedown: function (potx, poty) {
                    that.layer2.show();
                },
                mouseup: function (potx, poty) {
                    that.layer2.clearRect();

                    var newx = potx;
                    var newy = poty;

                    drawArrow(that.ctx, that.oldx, that.oldy, that.newx, that.newy);
                    //that.layer.drawLine(that.oldx, that.oldy, that.newx, that.newy);
                    that.storage();
                }
            };
        }
    });
})(jQuery);
