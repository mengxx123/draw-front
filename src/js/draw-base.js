/**
 * Created by cjh1 on 2016/10/10.
 */
function random(max, min) {
    if (typeof max !== 'number') {
        return Math.random();
    } else if (typeof min !== 'number') {
        min = 0;
    }
    return Math.random() * (max - min) + min;
}
function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
}

var storage = {
    setItem: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    getItem: function (key, defaultValue) {
        defaultValue = defaultValue || null;
        try {
            var data = localStorage.getItem(key);
            if (!data) {
                return defaultValue;
            }
            return JSON.parse(data);
        } catch (e) {
            return defaultValue;
        }
    }
};

// Layer class
(function () {

    function Layer(draw, canvas) {
        var that = this;

        that.canvas = canvas;
        that.width = draw.width;
        that.height = draw.height;
        that.canvas.width = that.width;
        that.canvas.height = that.height;
        // 图层属性
        that.visibility = true; // 可见性
        that.opacity = 1; // 不透明度
        that.type = 0; // 图层类型

        that.ctx = that.canvas.getContext("2d");
        that.ctx.lineJoin = "round";
        that.ctx.lineCap="round";//设置笔迹边角，否则笔迹会出现断层
    }

    Layer.prototype.show = function () {
        this.visibility = true;
        this.canvas.style.display = 'block';
    };

    Layer.prototype.hide = function () {
        this.visibility = false;
        this.canvas.style.display = 'none';
    };

    Layer.prototype.drawLine = function (x1, y1, x2, y2) {
        var that = this;

        var ctx = that.ctx;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineCap = "round";
        ctx.stroke();
    };

    Layer.prototype.drawRect = function (x1, y1, x2, y2, type) {
        var that = this;

        var ctx = that.ctx;
        ctx.beginPath();
        var width = Math.abs(x1 - x2);
        var height = Math.abs(y1 - y2);
        var minx = Math.min(x1, x2);
        var miny = Math.min(y1, y2);
        ctx.rect(minx, miny, width, height);
        if (type) {
            ctx.fill();
        } else {
            ctx.stroke();
        }

    };

    Layer.prototype.drawRound = function (x, y, radius, fill) {
        var that = this;

        var ctx = that.ctx;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (fill) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    };

    Layer.prototype.clearRect = function (x, y, w, h) {
        if (x) {
            this.ctx.clearRect(x, y, w, h);
        } else {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    };

    window.Layer = Layer;

})();

// DrawBoard class
(function ($) {
    'use strict';

    function DrawBoard(elem, option) {
        var that = this;

        var opts = $.extend({}, DrawBoard.DEFAULTS, option);
        that.opts = opts;

        that.$elem = $('#' + elem);
        that.elem = that.$elem[0];

        that.setSize(opts.width || 600, opts.height || 600);

        that.totalLayer = 0; // 图层数

        that.$box = $('<div></div>');
        that.$elem.append(that.$box);
        that.$box.css({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        });

        that.layer_1 = that.createLayer(0);
        that.layer_2 = that.createLayer(1);
        that.layer2 = that.createLayer(10, true); // 辅助图层
        that.cursorLayer = that.createLayer(9, true); // 鼠标绘制图层

        //that.curLayer = 1;
        that.layersEx = [that.layer2, that.cursorLayer];
        that.layers = [that.layer_1, that.layer_2];
        that.setLayer(2);

        that.ctx = that.layer.ctx;
        that.ctx2 = that.layer2.ctx;

        that.offsetX = that.$elem.offset().left;
        that.offsetY = that.$elem.offset().top;

        that.isDown = false; //按下标记
        that.oldx = -10;
        that.oldy = -10;

        // 初始化
        that.type = -1; // TODO 重要
        that._setColor("#000");
        that.eraserWidth = 5;
        that.bgColor = '#fff';

        that.isPlaying = false;

        that.lineWidth = 1;
        that.opacity = 1;

        that.ctx.lineWidth = that.lineWidth;
        that.ctx2.lineWidth = that.lineWidth;

        that.initHistory();

        that.log = [];

        that.startState = that.getState();

        that.handlers = {};

        that.event();

        /*var path = new Path2D("M10 10 h 80 v 80 h -80 Z");
        that.ctx.fill(path)*/
    }

    window.DrawBoard = DrawBoard;

    DrawBoard.DEFAULTS = {
        log: false // 是否保存历史记录
    };

    var fn = DrawBoard.prototype;
    DrawBoard.fn = fn;

    // 清空历史记录
    fn.clearHistory = function () {
        var that = this;
        that.history = [];
        that.historyCount = -1;
        that.curHistory = -1;
    };

    // 初始化历史记录
    fn.initHistory = function () {
        var that = this;

        // 保存历史记录
        that.history = []; // 保存历史记录，索引0保存最初的状态
        that.historyCount = -1;
        that.curHistory = -1;
        that.startStorage = that.storage(true);
    };

    // 获取历史记录
    fn.getHistory = function (index) {
        var that = this;
        return that.history[index];
    };

    // 保存当前状态
    fn.storage = function (init) {
        var that = this;
        if (!that.opts.log) {
            return;
        }

        var dataUrl =  that.layer.canvas.toDataURL();
        if (init) {
            that.historyCount = 1;
            that.curHistory = 0;
        } else {
            that.historyCount++;
            that.curHistory++;
            // 撤销多步时
            if (that.historyCount > that.curHistory + 1) {
                that.historyCount = that.curHistory + 1;
            }
        }

        that.history[that.curHistory] = {
            data: dataUrl,
            width: that.width,
            height: that.height
        };

        return that.curHistory;
    };

    // 创建图层
    fn.createLayer = function (id, isTemp) {
        var that = this;

        var $canvas = $('<canvas id="mycanvas-' + id + '" class="canvas">您的浏览器不支持 canvas 标签</canvas>');
        if (isTemp) {
            that.$elem.append($canvas);
        } else {
            that.$box.append($canvas);
        }

        $canvas.css({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
        });

        // 临时图层则
        if (isTemp) {
            //
        } else {

            that.totalLayer += 1;
        }

        return new Layer(that, $canvas[0]);
    };

    // 设置当前图层
    fn.setLayer = function (index) {
        var that = this;

        that.curLayer = index;
        that.layer = that.layers[index - 1];
        that.ctx = that.layer.ctx;

        that.layer.ctx.lineWidth = that.lineWidth;
        that.layer.ctx.strokeStyle = that.color;
        that.layer.ctx.fillStyle = that.color;
    };

    // 删除图层
    fn.removeLayer = function (index) {
        var that = this;
        that.totalLayer--;
        that.layers.splice(index - 1, 1);
        console.log(index - 1)
        $('#mycanvas' + (index - 1)).remove();
        $('#layer-list').find('[data-layer=' + (index - 1) + ']').remove();
    };

    // 添加图层
    fn.addLayer = function (index) {
        var that = this;
        var layer = that.createLayer(3); // TODO
        that.layers.push(layer);
    };

    fn.event = function () {
        var that = this;

        var $position = $('#position');

        var workplaceBox = document.getElementById('workplace-box');
        function coord(e) {
            return {
                x: e.pageX - that.offsetX + workplaceBox.scrollLeft,
                y: e.pageY - that.offsetY + workplaceBox.scrollTop
            }
        }

        // 事件
        that.$elem.on('mousemove', function draw(e){
            var pt = coord(e);
            $position.text('(' + pt.x + ', ' + pt.y + ')');

            if (that.isPlaying) {
                return;
            }

            that.move(pt.x, pt.y, e);

        });

        fn.move = function (x, y) {
            var that = this;

            if (that.handlers[that.type] && that.handlers[that.type].mousemove) {
                that.handlers[that.type].mousemove(x, y);
            }

            if (that.isDown) {
                that.addLog({
                    type: 'move',
                    x: x,
                    y: y
                });
            }
        };

        that.$elem.on('mousedown', function (e) {
            if (e.button === 2) {
                return;
            }
            var pt = coord(e);

            if (that.isPlaying) {
                return;
            }

            that.downA(pt.x, pt.y, e);

            that.addLog({
                type: 'down',
                x: pt.x,
                y: pt.y
            });
        });

        that.$elem.on('mouseup', function (e) {
            if (e.button === 2) {
                return;
            }

            var pt = coord(e);

            if (that.isPlaying) {
                return;
            }

            that.up(pt.x, pt.y, e);

            that.addLog({
                type: 'up',
                x: pt.x,
                y: pt.y
            });
        });

        that.$elem.on('mouseout', function (e) {
            var pt = coord(e);
            that.out(pt.x, pt.y);
        });


        that.$elem.on('click', function (e) {
            if (that.handlers[that.type] && that.handlers[that.type].click) {
                var pt = coord(e);

                that.handlers[that.type].click(pt.x, pt.y);
            }
        });
        var $workplace = $('#workplace');
        $workplace.on('click', function (e) {
            if (that.handlers[that.type] && that.handlers[that.type].click2) {
                var pt = coord(e);

                that.handlers[that.type].click2(pt.x, pt.y);
            }
            return true;
        });
        $workplace.on('contextmenu', function (e) {
            if (that.handlers[that.type] && that.handlers[that.type].contextmenu) {
                var pt = coord(e);

                that.handlers[that.type].contextmenu(pt.x, pt.y, e);

                return false;
            }

            return true;
        });

        that.$elem.on('mousewheel', function(e, delta) {
            var pt = coord(e);

            if (that.handlers[that.type] && that.handlers[that.type].mousewheel) {
                that.handlers[that.type].mousewheel(pt.x, pt.y, delta);
                return false;
            }

            // 禁止网页缩放
            return !e.ctrlKey;
        });
    };

    // 加载本地存储
    fn.loadStorage = function () {
        var that = this;

        var width = storage.getItem('width');
        var height = storage.getItem('height');
        if (width && height) {
            that.canvasSize(width, height);
        }
        var layers = storage.getItem('canvas');
        if (layers) {
            var loadNum = 0;
            for (var i = 0; i < layers.length; i++) {
                var image = new Image();
                image.src = layers[i].dataUrl;
                (function (idx, img) {

                    img.onload = function() {
                        that.layers[idx].ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, that.width, that.height);
                        // 等所有图层加载完后，保存记录
                        loadNum++;
                        if (loadNum === layers.length) {
                            that.storage(true);
                        }
                    }
                })(i, image);
            }
        }

        // 加载配置
        that._setEraserWidth(storage.getItem('eraserWidth'));
        that._setElemBgColor(storage.getItem('bgColor', '#fff'));

        // 加载历史
        var log = storage.getItem('log');
        if (log) {
            //that.log = log; TODO 还有bug
        }
    };

    // 设置画板大小
    fn.setSize = function (width, height) {
        var that = this;

        that.width = width;
        that.height = height;

        that.$elem.width(width);
        that.$elem.height(height);
    };

    DrawBoard.fn.canvasSize = function (width, height) {
        var that = this;

        var canvasData = that.ctx.getImageData(0, 0, that.width, that.height);

        that.setSize(width, height);
        $('#editor-canvas-width').text(width + 'px');
        $('#editor-canvas-height').text(height + 'px');
        /*for (var i = 0, len = that.layers.length; i < len; i++) {
            that.layers[i].width = width;
            that.layers[i].height = height;
        }
        for (var i = 0, len = that.layersEx.length; i < len; i++) {
            that.layersEx[i].width = width;
            that.layersEx[i].height = height;
        }*/
        that.layer.canvas.width = width;
        that.layer.canvas.height = height;
        that.layer2.canvas.width = width;
        that.layer2.canvas.height = height;
        that.cursorLayer.canvas.width = width;
        that.cursorLayer.canvas.height = height;

        that.ctx.putImageData(canvasData, 0, 0);
    };
    
    // 保存开始设置
    fn.getState = function () {
        var that = this;

        return {
            color: that.color,
            type: that.type,
            lineWidth: that.lineWidth
        };
    };

    // 选择
    fn.select = function () {
        var that = this;

        // 绘制蚂蚁线
        function ants() {
            var canvas = that.layers[1].canvas;
            var context = canvas.getContext("2d");

            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            var outlineMask = createOutlineMask(imageData, 0xC0);
            var offset = 0;
            var TIME = 167;
            setInterval(function() {
                that.ctx2.putImageData(renderMarchingAnts(imageData, outlineMask, offset -= 2), 0, 0);
            }, TIME);
        }

        function renderMarchingAnts(imageData, outlineMask, antOffset) {
            var data = imageData.data;
            var width = imageData.width, height = imageData.height;
            var outline = outlineMask.data;

            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var offset = ((y * width) + x) * 4;
                    var isEdge = outline[offset] == 0x00;

                    if (isEdge) {
                        var value = ant(x, y, antOffset);
                        data[offset] = value;
                        data[offset + 1] = value;
                        data[offset + 2] = value;
                        data[offset + 3] = 0xFF;
                    } else {
                        data[offset + 3] = 0x00;
                    }
                }
            }

            return imageData;
        }

        function ant(x, y, offset) {
            return ((6 + y + offset % 12) + x) % 12 > 6 ? 0x00 : 0xFF;
        }

        function createOutlineMask(srcImageData, threshold) {
            var srcData = srcImageData.data;
            var width = srcImageData.width, height = srcImageData.height;

            function get(x, y) {
                if (x < 0 || x >= width || y < 0 || y >= height) return;
                var offset = ((y * width) + x) * 4;
                return srcData[offset + 3];
            }

            var context = createContext(width, height);
            var dstImageData = context.getImageData(0, 0, width, height);
            var dstData = dstImageData.data;

            function set(x, y, value) {
                var offset = ((y * width) + x) * 4;
                dstData[offset] = value;
                dstData[offset + 1] = value;
                dstData[offset + 2] = value;
                dstData[offset + 3] = 0xFF;
            }

            function match(x, y) {
                var alpha = get(x, y);
                return alpha == null || alpha >= threshold;
            }

            function isEdge(x, y) {
                return !match(x-1, y-1) || !match(x+0, y-1) || !match(x+1, y-1) ||
                    !match(x-1, y+0) ||      false       || !match(x+1, y+0) ||
                    !match(x-1, y+1) || !match(x+0, y+1) || !match(x+1, y+1);
            }

            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    if (match(x, y) && isEdge(x, y)) {
                        set(x, y, 0x00);
                    } else {
                        set(x, y, 0xFF);
                    }
                }
            }

            return dstImageData;
        }

        function createContext(width, height) {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            return context;
        }

        ants();
    };

    fn.loadState = function (state) {
        var that = this;

        that.setColor(state.color);
        that._setType(state.type);
        that._setWidth(state.lineWidth);
    };

    fn.downA = function (potx, poty, e) {
        var that = this;

        that.isDown = true;

        that.oldx = potx;
        that.oldy = poty;

        if (that.handlers[that.type] && that.handlers[that.type].mousedown) {
            that.handlers[that.type].mousedown(potx, poty, e);
        }
    };

    fn.out = function (potx, poty, e) {
        var that = this;

        if (that.handlers[that.type] && that.handlers[that.type].mouseout) {
            that.handlers[that.type].mouseout(potx, poty, e);
        }
    };

    fn.up = function (potx, poty, e) {
        var that = this;

        that.isDown = false;
        if (that.handlers[that.type] && that.handlers[that.type].mouseup) {
            that.handlers[that.type].mouseup(potx, poty, e);
        }
    };

    fn.save = function () {
        var that = this;
        // 存储图层信息
        var layers = [];
        for (var i = 0; i < that.layers.length; i++) {
            layers.push({
                dataUrl: that.layers[i].canvas.toDataURL("image/png")
            });
        }
        // 本地存储
        storage.setItem('canvas', layers);
        storage.setItem('width', that.width);
        storage.setItem('height', that.height);
        storage.setItem('bgColor', that.bgColor);

        // 把所有图层绘制到临时图层上
        that.layer2.hide();
        that.layer2.clearRect();
        if (that.bgColor !== 'transparent') {
            that.ctx2.fillStyle = that.bgColor;
            that.ctx2.fillRect(0, 0, that.width, that.height);
        }
        that.ctx2.drawImage(that.layer.canvas, 0, 0, that.width, that.height);
        $("#download")[0].href = that.layer2.canvas.toDataURL('image/png');
        that.layer2.clearRect();
        that.layer2.show();

        // 播放操作记录
        storage.setItem('log', that.log);
    };

    fn.small = function () {
        ui.msg('小')
    };

    fn.rotate = function () {
        var that = this;

        var ctx = this.layer.ctx;
        /*var imgData = ctx.getImageData(0, 0, 500, 250);
        ctx.rotate(90);
        ctx.translate(100, 100);
        ctx.putImageData(imgData, 0, 250);*/

        var canvas = this.layer.canvas;
        var imageObject = new Image();
        imageObject.src = canvas.toDataURL();
        imageObject.onload=function(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            //ctx.rotate(10);
            ctx.scale(1.2,1.2);
            ctx.drawImage(imageObject,0,0);

        }
    };

    fn.setBgColor = function (color) {
        var that = this;
        that.bgColor = color;
        that.$elem.css('background-color', color);

        // log     TODO
    };

    fn.setColor = function (color) {
        var that = this;

        that._setColor(color);
        that.addLog({
            type: 'color',
            color: color
        });
    };

    // 设置画笔颜色
    fn._setColor = function (color) {
        var that = this;

        that.color = color;

        that.ctx.strokeStyle = color;
        that.ctx2.strokeStyle = color;
        that.ctx.fillStyle = color;
        that.ctx2.fillStyle = color;
    };

    fn._setElemBgColor = function (color) {
        var that = this;
        if (color === 'transparent') {
            that.$elem.css({
                'background-image': 'url("/static/img/canvas-bg.jpg")',
                'background-color': 'transparent'
            });
            that.bgColor = 'transparent';
        } else {
            that.$elem.css({
                'background-image': 'none',
                'background-color': color
            });
            that.bgColor = color;
        }
    };

    // 新建
    fn.new = function (width, height, bg) {
        var that = this;
        that.clear(); // TODO 多图层删除
        that.canvasSize(width, height);
        var bgColor = (bg == 0) ?  '#fff' : 'transparent';
        that._setElemBgColor(bgColor);

        //that.storage(); TODO delete
        that.clearHistory();
        that.log = [];
    };

    fn.open = function (img) {
        var that = this;
        var  image = new Image();
        image.src = img.src;
        image.onload = function(){
            that.canvasSize(image.width , image.height);
            that.ctx.drawImage(image , 0 ,0 , image.width , image.height , 0 ,0 , that.width, that.height);
        };

        //that.canvasSize(image.width , image.height);
        //that.ctx.drawImage(image , 0 ,0 , image.width , image.height , 0 ,0 , that.width, that.height);
    };

    fn.setWidth = function (width) {
        var that = this;

        that._setWidth(width);
        that.addLog({
            type: 'lineWidth',
            value: width
        });
    };

    fn.setOpacity = function (opacity) {
        var that = this;

        that.opacity = opacity;
        // TODO log
        /*that._setWidth(width);
        that.addLog({
            type: 'lineWidth',
            value: width
        });*/
    };

    fn._setWidth = function (width) {
        var that = this;

        that.lineWidth = width;
        that.ctx.lineWidth = width;
        that.ctx2.lineWidth = width;
    };

    fn.setEraserWidth = function (width) {
        var that = this;

        storage.setItem('eraserWidth', width);
        that._setEraserWidth(width);
        that.addLog({
            type: 'eraserWidth',
            value: width
        });
    };

    fn._setEraserWidth = function (width) {
        this.eraserWidth = width;
    };

    fn.clear = function () {
        this.layer.clearRect();
        this.addLog({
            type: 'clear'
        });
    };

    fn._setType = function (type) {
        var that = this;

        if (type == that.type) {
            return;
        }
        // TODO 这里的代码移到 usePlugin ?
        if (that.handlers[that.type] && typeof that.handlers[that.type].unselect === 'function') {
            that.handlers[that.type].unselect();
        }
        if (that.handlers[type] && typeof that.handlers[type].select === 'function') {
            that.handlers[type].select();
        }
        that.type = type;
    };



    fn.undo = function () {
        this._undo();
        this.addLog({
            type: 'undo'
        });
    };


    // 撤销
    fn._undo = function () {
        var that = this;

        if (that.curHistory > 0) {
            that.curHistory--;
            var history = that.history[that.curHistory];
            var dataUrl = history.data;

            that.canvasSize(history.width, history.height);

            that.layer.clearRect();
            var  image = new Image();
            image.src = dataUrl;
            image.onload = function(){
                that.ctx.drawImage(image , 0 ,0 , image.width , image.height , 0 ,0 , that.width, that.height);
            }
        } else {
            ui.msg('不能再回退了');
        }
    };

    fn.loadStorage2 = function (index) {
        var that = this;

        if (index < 0) {
            return;
        }

        var dataUrl = that.history[index].data;
        var  image = new Image();
        image.src = dataUrl;
        image.onload = function(){
            that.ctx.drawImage(image , 0 ,0 , image.width , image.height , 0 ,0 , that.width, that.height);
        }
    };

    fn.addLog = function (log) {
        var that = this;

        if (!that.isPlaying) {
            that.log.push(log);
        }
    };

    // 回放
    fn.play = function () {
        var that = this;
        that.cancelPlayTag = false;

        if (that.log.length ==- 0) {
            ui.msg('没内容可以播放，请先绘画再播放');
            return;
        }

        that.isPlaying = true;

        that.curState = that.getState();
        that.loadState(that.startState);

        that.layer.clearRect();
        that.loadStorage2(that.startStorage);

        var i = 0;
        var id = setInterval(function(){
            console.log('12');
            if (i < that.log.length && !that.cancelPlayTag) {
                var log = that.log[i];
                switch (log.type) {
                    case 'move':
                        that.move(log.x, log.y);
                        break;
                    case 'up':
                        that.up(log.x, log.y);
                        break;
                    case 'down':
                        that.downA(log.x, log.y);
                        break;
                    case 'color':
                        that.setColor(log.color);
                        break;
                    case 'type':
                        that._setType(log.value);
                        break;
                    case 'lineWidth':
                        that._setWidth(log.value);
                        break;
                    case 'redo':
                        that._redo();
                        break;
                    case 'undo':
                        that._undo();
                        break;
                    case 'clear':
                        that.layer.clearRect();
                        break;
                    case 'EraserWidth':
                        that._setEraserWidth(log.value);
                        break;
                }
                i++;
            } else {
                that.cancelPlayTag = false;
                that.isPlaying = false;
                clearInterval(id);
                that.loadState(that.curState);
                //that.loadState(that.curState);
            }
        }, 10);
    };

    // 取消回放
    fn.cancelPlay = function () {
        var that = this;
        that.cancelPlayTag = true;
    };

    fn.redo = function () {
        this._redo();
        this.addLog({
            type: 'redo'
        });
    };

    // 重做
    fn._redo = function () {
        var that = this;

        if (that.curHistory < that.historyCount - 1) {
            that.curHistory++;

            var history = that.history[that.curHistory];
            var dataUrl = history.data;

            that.canvasSize(history.width, history.height);

            that.layer.clearRect();
            var  image = new Image();
            image.src = dataUrl;
            image.onload = function(){
                that.ctx.drawImage(image , 0 ,0 , image.width , image.height , 0 ,0 , that.width, that.height);
            };
        } else {
            ui.msg('没有可恢复的内容了')
        }
    };

    // 擦除两点之间的图像
    fn.resetEraser = function(oldx, oldy, newx, newy) {
        var ctx = this.ctx;
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.lineWidth = this.eraserWidth;
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.moveTo(oldx, oldy);
        ctx.lineTo(newx, newy);
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over"
    };

    fn.resetEraser = function(oldx, oldy, newx, newy) {
        var ctx = this.ctx;
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.lineWidth = this.eraserWidth;
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.moveTo(oldx, oldy);
        ctx.lineTo(newx, newy);
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over"
    };

    fn.eraserCircle = function(x, y, r) {
        var ctx = this.ctx;
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.lineWidth = this.eraserWidth;
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over"
    };

    // 透明度擦除（TODO 模糊擦除）
    fn.resetEraser2 = function(oldx, oldy, newx, newy) {
        var ctx = this.ctx;
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.lineWidth = this.eraserWidth;
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.moveTo(oldx, oldy);
        ctx.lineTo(newx, newy);
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over"
    };

    /// 插件相关
    DrawBoard.plugins = {};
    DrawBoard.typeId = 100000;
    DrawBoard.getTypeId = function () {
        return DrawBoard.typeId++;
    };
    DrawBoard.addPlugin = function (plugin) {
        //plugin.type = DrawBoard._getTypeId();
        DrawBoard.plugins[plugin.name] = plugin;
    };
    fn.usePlugin = function (pluginName) {
        var plugin = DrawBoard.plugins[pluginName];
        if (!plugin) {
            console.error('加载不到插件：' + pluginName);
            return;
        }
        if (!plugin.hasInit) {
            plugin.hasInit = true;
            plugin.init.call(this);
        }

        this._setType(plugin.type);
        this.addLog({
            type: 'type',
            value: plugin.type
        });
    };

    function Plugin(option) {
        new DrawBoard(this, option);
    }

    $.fn.drawBoard = Plugin;

    window.DrawBoard = DrawBoard;

})(jQuery);