// https://github.com/jareguo/curve-editor
// 钢笔插件
(function ($) {
    var typeId = DrawBoard.getTypeId();

    DrawBoard.addPlugin({
        type: typeId,
        name: 'pen',
        init: function () {
            var that = this;

            function v2 (x, y) {
                return {
                    x: x || 0,
                    y: y || 0
                };
            }
            v2.add = function (lhs, rhs) {
                return v2(lhs.x + rhs.x, lhs.y + rhs.y);
            };
            v2.sub = function (lhs, rhs) {
                return v2(lhs.x - rhs.x, lhs.y - rhs.y);
            };
            v2.mul = function (v, scaling) {
                return v2(v.x * scaling, v.y * scaling);
            };
            v2.div = function (v, scaling) {
                return v2(v.x / scaling, v.y / scaling);
            };
            v2.lerp = function (from, to, ratio) {
                return v2(from.x + (to.x - from.x) * ratio, from.y + (to.y - from.y) * ratio);
            };
            v2.sqrDistance = function (lhs, rhs) {
                var dx = lhs.x - rhs.x;
                var dy = lhs.y - rhs.y;
                return dx * dx + dy * dy;
            };
            v2.distance = function (lhs, rhs) {
                return Math.sqrt(v2.sqrDistance(lhs, rhs));
            };
            v2.dir = function (lhs, rhs) {
                var len = v2.distance(v2, {x: 0, y: 0});
                return v2(v2.x / len, v2.y / len);
            };

            function Curve (points) {
                this.points = points || [];
                this.beziers = [];
                this.ratios = [];
                this.progresses = [];

                this.length = 0;

                this.computeBeziers();
            }

            Curve.prototype.computeBeziers = function () {
                this.beziers.length = 0;
                this.ratios.length = 0;
                this.progresses.length = 0;
                this.length = 0;

                for (var i = 1; i < this.points.length; i++) {
                    var startPoint = this.points[i - 1];
                    var endPoint = this.points[i];
                    var bezier = new Bezier();
                    bezier.start = startPoint.pos;
                    bezier.startCtrlPoint = startPoint.out;
                    bezier.end = endPoint.pos;
                    bezier.endCtrlPoint = endPoint.in;
                    this.beziers.push(bezier);

                    this.length += bezier.getLength();
                }

                var current = 0;
                for (var i = 0; i < this.beziers.length; i++) {
                    var bezier = this.beziers[i];
                    this.ratios[i] = bezier.getLength() / this.length;
                    this.progresses[i] = current = current + this.ratios[i];
                }

                return this.beziers;
            };

            function Bezier () {
                this.start = v2();
                this.end = v2();
                this.startCtrlPoint = v2(); // cp0, cp1
                this.endCtrlPoint = v2();   // cp2, cp3
            }

            // Get point at relative position in curve according to arc length
            // - u [0 .. 1]
            Bezier.prototype.getPointAt = function ( u ) {
                var t = this.getUtoTmapping( u );
                return this.getPoint( t );
            };

            function bezierAt (C1, C2, C3, C4, t) {
                var t1 = 1 - t;
                return C1 * t1 * t1 * t1 +
                    C2 * 3 * t1 * t1 * t +
                    C3 * 3 * t1 * t * t +
                    C4 * t * t * t;
            }

            // Get point at time t
            //  - t [0 .. 1]
            Bezier.prototype.getPoint = function ( t ) {
                var x = bezierAt(this.start.x, this.startCtrlPoint.x, this.endCtrlPoint.x, this.end.x, t);
                var y = bezierAt(this.start.y, this.startCtrlPoint.y, this.endCtrlPoint.y, this.end.y, t);

                return new v2(x, y);
            };

            // Get total curve arc length
            Bezier.prototype.getLength = function () {

                var lengths = this.getLengths();
                return lengths[ lengths.length - 1 ];

            };

            // Get list of cumulative segment lengths
            Bezier.prototype.getLengths = function ( divisions ) {

                if ( ! divisions ) divisions = (this.__arcLengthDivisions) ? (this.__arcLengthDivisions): 200;

                if ( this.cacheArcLengths
                    && ( this.cacheArcLengths.length === divisions + 1 )) {

                    //console.log( "cached", this.cacheArcLengths );
                    return this.cacheArcLengths;

                }

                var cache = [];
                var current, last = this.getPoint( 0 );
                var p, sum = 0;

                cache.push( 0 );

                for ( p = 1; p <= divisions; p ++ ) {

                    current = this.getPoint ( p / divisions );
                    sum += v2.distance(current, last);
                    cache.push( sum );
                    last = current;

                }

                this.cacheArcLengths = cache;

                return cache; // { sums: cache, sum:sum }; Sum is in the last element.
            };

            Bezier.prototype.getUtoTmapping = function ( u, distance ) {

                var arcLengths = this.getLengths();

                var i = 0, il = arcLengths.length;

                var targetArcLength; // The targeted u distance value to get

                if ( distance ) {
                    targetArcLength = distance;
                } else {
                    targetArcLength = u * arcLengths[ il - 1 ];
                }

                //var time = Date.now();

                // binary search for the index with largest value smaller than target u distance

                var low = 0, high = il - 1, comparison;

                while ( low <= high ) {

                    i = Math.floor( low + ( high - low ) / 2 ); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

                    comparison = arcLengths[ i ] - targetArcLength;

                    if ( comparison < 0 ) {

                        low = i + 1;
                        continue;

                    } else if ( comparison > 0 ) {

                        high = i - 1;
                        continue;

                    } else {

                        high = i;
                        break;

                        // DONE

                    }

                }

                i = high;

                //console.log('b' , i, low, high, Date.now()- time);

                if ( arcLengths[ i ] == targetArcLength ) {

                    var t = i / ( il - 1 );
                    return t;

                }

                // we could get finer grain at lengths, or use simple interpolatation between two points

                var lengthBefore = arcLengths[ i ];
                var lengthAfter = arcLengths[ i + 1 ];

                var segmentLength = lengthAfter - lengthBefore;

                // determine where we are between the 'before' and 'after' points

                var segmentFraction = ( targetArcLength - lengthBefore ) / segmentLength;

                // add that fractional amount to t

                var t = ( i + segmentFraction ) / ( il -1 );

                return t;

            };

            // RENDERING
            function drawPoint (pos, strokeColor, fillColor, radius) {
                var radius = radius || 5;
                ctx.lineWidth = 1;
                ctx.strokeStyle = strokeColor;
                ctx.fillStyle = fillColor;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.stroke();
            }

            function drawLine (from, to) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#000";
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();
            }

            function getBezierPos (bezier, progress) {
                var p01 = v2.lerp(bezier.start, bezier.startCtrlPoint, progress);
                var p12 = v2.lerp(bezier.startCtrlPoint, bezier.endCtrlPoint, progress);
                var p23 = v2.lerp(bezier.endCtrlPoint, bezier.end, progress);
                var p012 = v2.lerp(p01, p12, progress);
                var p123 = v2.lerp(p12, p23, progress);
                var p0123 = v2.lerp(p012, p123, progress);
                return p0123;
            }

            /*function drawCanvas (Speed) {

                drawCanvas2(Speed);
            }*/
            function drawCanvas (Speed) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // 绘制锚点和控制点
                var bezierProgress = 0;
                var bezierIndex = 0;

                if (false) {
                    while (bezierProgress < 1) {
                        bezierProgress += Speed;
                        if (bezierProgress > curve.progresses[bezierIndex]) {
                            bezierIndex++;
                            bezierIndex %= curve.beziers.length;
                        }

                        var realProgress = (bezierProgress - (bezierIndex > 0 ? curve.progresses[bezierIndex - 1] : 0) ) / curve.ratios[bezierIndex];

                        var pos = curve.beziers[bezierIndex].getPointAt(realProgress);
                        drawPoint(pos, CurveColor, CurveColor, 1);
                    }
                } else {
                    drawPath();
                }

                // 画虚线
                var CurvePointStrokeColor = "#000";
                var ControlPointStrokeColor = "#090";
                var PointFillColor = "rgba(200,200,200,0.5)";
                var CurveColor = "#44F";

                // curve points
                for (var i = 0; i < curve.points.length; i++) {
                    var point = curve.points[i];
                    drawPoint(point.pos, CurvePointStrokeColor, PointFillColor);
                    if (point.in) {
                        drawPoint(point.in, CurvePointStrokeColor, PointFillColor);
                        drawLine(point.pos, point.in);
                    }

                    if (point.out) {
                        drawPoint(point.out, CurvePointStrokeColor, PointFillColor);
                        drawLine(point.pos, point.out);
                    }
                }
                console.log(curve.beziers.length);
                for (var i = 0; i < curve.beziers.length; i++) {
                    // control points
                    //drawPoint(bezier.startCtrlPoint, ControlPointStrokeColor, PointFillColor);
                    //drawPoint(bezier.endCtrlPoint, ControlPointStrokeColor, PointFillColor);
                    //drawLine(bezier.start, bezier.startCtrlPoint);
                    //drawLine(bezier.end, bezier.endCtrlPoint);
                }
            }

            // 画贝塞尔曲线
            function drawPath () {
                console.log(curve.points.length);
                for (var i = 0; i < curve.points.length; i++) {
                    var point = curve.points[i];
                    console.log(point);
                    if (i == 0) {
                        ctx.moveTo(point.pos.x, point.pos.y);
                    } else {
                        var prevPt = curve.points[i - 1];
                        ctx.bezierCurveTo(prevPt.out.x, prevPt.out.y, point.in.x, point.in.y,
                            point.pos.x, point.pos.y);
                    }
                }
                ctx.stroke();
            }

            // INIT
            var InitPoints = [
                /*{
                 in: v2(80, 100),
                 pos: v2(100, 100),
                 out: v2(120, 100)
                 },
                 {
                 in: v2(100, 200),
                 pos: v2(200, 200),
                 out: v2(300, 200),
                 },
                 {
                 in: v2(300, 100),
                 pos: v2(300, 100),
                 out: v2(400, 100)
                 }*/
            ];

            var canvas = that.layer2.canvas;
            var ctx = canvas.getContext("2d");
            var curve = new Curve(InitPoints);

            var MODE_PEN = 1; // 钢笔工具
            var MODE_OP = 2; // 锚点工具
            var MODE_DEL = 3; // 删除锚点工具
            var MODE_ADD = 4; // 添加锚点工具
            var MODE_MOVE = 5; // 移动锚点工具
            that.penMode = MODE_PEN;
            var drawing = false;

            var startX = 0;
            var startY = 0;
            drawCanvas();
            // CONTROL POSITION ==================
            var haveCtrl = false;
            var SqrHitRadius = Math.pow(9, 2);

            var draggingPoint = -1;
            var draggingType = '';

            function getMousePos2 (x, y) {
                return v2(x, y);
            }

            function dragStart (x, y, e) {
                startX = x;
                startY = y;

                var mousePos = getMousePos2(x, y);
                haveCtrl = e.ctrlKey;

                // 遍历每一个点
                for (var i = 0; i < curve.points.length; i++) {
                    var point = curve.points[i];

                    //points.push(bezier.start, bezier.startCtrlPoint, bezier.endCtrlPoint, bezier.end);
                    var dis = v2.sqrDistance(point.pos, mousePos);
                    if (dis < SqrHitRadius) {
                        draggingPoint = i;
                        draggingType = 'pos';
                        return;
                    }
                    if (point.in) {
                        dis = v2.sqrDistance(point.in, mousePos);
                        if (dis < SqrHitRadius) {
                            draggingPoint = i;
                            draggingType = 'in';
                            return;
                        }
                    }
                    if (point.out) {
                        dis = v2.sqrDistance(point.out, mousePos);
                        if (dis < SqrHitRadius) {
                            draggingPoint = i;
                            draggingType = 'out';
                            return;
                        }
                    }
                }
            }

            function keepSmooth (point, mousePos, oldPos) {
                if (draggingType === 'pos') {
                    var delta = v2.sub(mousePos, oldPos);
                    if (point.in) {
                        point.in = v2.add(point.in, delta);
                    }
                    if (point.out) {
                        point.out = v2.add(point.out, delta);
                    }
                } else {
                    /*var another;
                     var anotherType;
                     if (draggingType === 'in') {
                     anotherType = 'out';
                     }
                     else if (draggingType === 'out') {
                     anotherType = 'in';
                     }
                     another = point[anotherType];
                     if (another) {
                     var dir = v2.sub(point.pos, mousePos);
                     var len = v2.distance(mousePos, point.pos);
                     if (len > 0.01) {
                     dir = v2.div(dir, len);
                     var anotherLen = v2.distance(another, point.pos);
                     dir = v2.mul(dir, anotherLen);
                     point[anotherType] = v2.add(dir, point.pos);
                     }
                     }*/
                }
            }

            function dragging (x, y) {
                console.log(drawing)
                if (that.penMode === MODE_PEN && drawing) {
                    var points = curve.points;
                    if (points.length) {
                        var prev = points[points.length - 1];

                        that.layer2.clearRect();
                        drawCanvas();
                        ctx.strokeStyle = that.color;
                        ctx.fillStyle = that.color;
                        that.layer2.drawLine(prev.pos.x, prev.pos.y, x, y);
                    }
                }

                if (draggingType) {
                    if (that.penMode === MODE_MOVE || (that.penMode === MODE_OP && haveCtrl)) {
                        //var mousePos = getMousePos(event);
                        var mousePos = getMousePos2(x, y);

                        var point = curve.points[draggingPoint];
                        var oldPos = point[draggingType];

                        point[draggingType] = mousePos;
                        keepSmooth(point, mousePos, oldPos);

                        curve.computeBeziers();
                        drawCanvas();
                    } else if (that.penMode === MODE_OP) {
                        if (draggingType === 'pos') {

                            var mousePos = getMousePos2(x, y);

                            var p = curve.points[draggingPoint];
                            p.out = mousePos;
                            p.in =
                                v2.add(p.pos, v2.sub(p.pos, p.out));

                            curve.computeBeziers();
                            drawCanvas();
                        } else {
                            var mousePos = getMousePos2(x, y);

                            var point = curve.points[draggingPoint];
                            var oldPos = point[draggingType];

                            point[draggingType] = mousePos;

                            curve.computeBeziers();
                            drawCanvas();
                        }
                    } else if (that.penMode === MODE_DEL) {

                    }

                }
            }

            function dragEnd (x, y, event) {
                if (that.penMode === MODE_OP) {
                    if (x == startX && y == startY) {
                        if (draggingType === 'pos') {
                            var mousePos = getMousePos2(x, y);

                            var p = curve.points[draggingPoint];
                            p.out = p.pos;
                            p.in = p.pos;

                            curve.computeBeziers();
                            drawCanvas();
                        } else if (draggingType === 'in') {
                            var mousePos = getMousePos2(x, y);

                            var p = curve.points[draggingPoint];
                            p.in = p.pos;

                            curve.computeBeziers();
                            drawCanvas();
                        }  else if (draggingType === 'out') {
                            var mousePos = getMousePos2(x, y);

                            var p = curve.points[draggingPoint];
                            p.out = p.pos;

                            curve.computeBeziers();
                            drawCanvas();
                        }

                    }
                } else if (that.penMode === MODE_DEL) {

                }

                if (that.penMode === MODE_DEL || event.ctrlKey) {
                    if (draggingType) {

                        if (draggingType === 'pos') {
                            curve.points.splice(draggingPoint, 1);

                            curve.computeBeziers();
                            drawCanvas();
                        } else {
                            ui.msg('请针对路径的描点进行删除描点工具');
                        }
                    }
                }



                if (that.penMode === MODE_ADD || event.shiftKey) {

                    var points = curve.points;
                    if (points.length > 1) {
                        var prev = points[points.length - 1];
                        prev.out = v2.add(prev.pos, v2.sub(prev.pos, prev.in));
                    }


                    var newPos = getMousePos2(x, y);
                    curve.points.push({
                        pos: newPos,
                        //in: v2.lerp(newPos, prev.out, 0.3)
                        in: newPos,
                        out: newPos
                    });

                    curve.computeBeziers();
                    drawCanvas();

                    event.stopImmediatePropagation();
                }

                if (that.penMode === MODE_PEN) {

                    var points = curve.points;
                    console.log(points.length);
                    if (points.length) {
                        var prev = points[points.length - 1];
                        prev.out = v2.add(prev.pos, v2.sub(prev.pos, prev.in));
                    }


                    var newPos = getMousePos2(x, y);
                    curve.points.push({
                        pos: newPos,
                        //in: v2.lerp(newPos, prev.out, 0.3)
                        in: newPos,
                        out: newPos
                    });

                    drawing = true;

                    curve.computeBeziers();
                    drawCanvas();

                    event.stopImmediatePropagation();
                }

                if (draggingType) {
                    draggingType = '';
                    draggingPoint = -1;
                    //event.stopImmediatePropagation();
                }

            }

            that.handlers[typeId] = {
                select: function () {
                    curve.points = [];
                    ctx = that.layer2.ctx;
                    that.ctx.strokeStyle = that.color;
                    $('#pen-tools').show();
                },
                unselect: function () {
                    that.layer2.clearRect();
                    ctx = that.layer.ctx;
                    drawPath();
                    $('#pen-tools').hide();
                },
                mousedown: dragStart,
                mousemove: dragging,
                mouseup: dragEnd,
                mouseout: function () {
                    that.layer2.clearRect();
                    drawCanvas();
                }
            };


            // ANIMATION
            var Speed = 0.01;
            var PointColor = "#F22";

            var bezierIndex = 0;
            var bezierProgress = 0;
            function animate () {
                window.requestAnimationFrame(animate);

                bezierProgress += Speed;
                if (bezierProgress > curve.progresses[bezierIndex]) {
                    if (bezierProgress > 1) {
                        bezierProgress -= 1;
                    }

                    bezierIndex++;
                    bezierIndex %= curve.beziers.length;
                }

                var realProgress = (bezierProgress - (bezierIndex > 0 ? curve.progresses[bezierIndex - 1] : 0) ) / curve.ratios[bezierIndex];

                var pos = curve.beziers[bezierIndex].getPointAt(realProgress);

                drawCanvas(Speed);
                drawPoint(pos, PointColor, PointColor, 6);
            }
            //window.requestAnimationFrame(animate);
        }
    });

    DrawBoard.fn.setPenMode = function (mode) {
        var that = this;
        that.penMode = mode;
    }
})(jQuery);