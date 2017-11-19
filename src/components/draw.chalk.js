
// 粉笔插件
(function ($) {
    var TYPE_CHALK = 12; // 钢笔 TODO ID

    DrawBoard.fn.initChalk = function () {
        var that = this;

        console.log('初始化');

        var canvas = that.layer.canvas;
        


        //canvas.width = $(window).width();
        //canvas.height = $(window).height();

        var ctx = canvas.getContext("2d");

        var width = canvas.width;
        var height = canvas.height;
        var mouseX = 0;
        var mouseY = 0;
        var mouseD = false;
        var eraser = false;
        var xLast = 0;
        var yLast = 0;
        var brushDiameter = 7;
        var eraserWidth = 50;
        var eraserHeight = 100;

        $('#chalkboard').css('cursor','none');

        document.onselectstart = function(){ return false; };

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = brushDiameter;
        ctx.lineCap = 'round';

        var patImg = document.getElementById('pattern');

        /*document.addEventListener('touchmove', function(evt) {
            var touch = evt.touches[0];
            mouseX = touch.pageX;
            mouseY = touch.pageY;
            if (mouseY < height && mouseX < width) {
                evt.preventDefault();
                $('.chalk').css('left', mouseX + 'px');
                $('.chalk').css('top', mouseY + 'px');
                //$('.chalk').css('display', 'none');
                if (mouseD) {
                    draw(mouseX, mouseY);
                }
            }
        }, false);
        document.addEventListener('touchstart', function(evt) {
            //evt.preventDefault();
            var touch = evt.touches[0];
            mouseD = true;
            mouseX = touch.pageX;
            mouseY = touch.pageY;
            xLast = mouseX;
            yLast = mouseY;
            draw(mouseX + 1, mouseY + 1);
        }, false);
        document.addEventListener('touchend', function(evt) {
            mouseD = false;
        }, false);*/


        $('#chalkboard').css('cursor','none');
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = brushDiameter;
        ctx.lineCap = 'round';

        var $chalk = $('#chalk');


        document.oncontextmenu = function() {return false;};

        function draw(x,y){

            ctx.strokeStyle = 'rgba(255,255,255,'+(0.4+Math.random()*0.2)+')';
            ctx.beginPath();
            ctx.moveTo(xLast, yLast);
            ctx.lineTo(x, y);
            ctx.stroke();

            // Chalk Effect
            var length = Math.round(Math.sqrt(Math.pow(x-xLast,2)+Math.pow(y-yLast,2))/(5/brushDiameter));
            var xUnit = (x-xLast)/length;
            var yUnit = (y-yLast)/length;
            for(var i=0; i<length; i++ ){
                var xCurrent = xLast+(i*xUnit);
                var yCurrent = yLast+(i*yUnit);
                var xRandom = xCurrent+(Math.random()-0.5)*brushDiameter*1.2;
                var yRandom = yCurrent+(Math.random()-0.5)*brushDiameter*1.2;
                ctx.clearRect( xRandom, yRandom, Math.random()*2+2, Math.random()+1);
            }

            xLast = x;
            yLast = y;
        }

        function erase(x,y){
            ctx.clearRect (x-0.5*eraserWidth,y-0.5*eraserHeight,eraserWidth,eraserHeight);
        }

        that.handlers[TYPE_CHALK] = {
            select: function () {
                that.ctx.strokeStyle = that.color;
            },
            mousedown: function (x, y, e) {
                console.log('down');
                mouseD = true;
                xLast = mouseX;
                yLast = mouseY;
                if(e.button == 2){
                    console.log('查出')
                    erase(mouseX,mouseY);
                    eraser = true;
                    $chalk.addClass('eraser');
                }
            },
            mousemove: function (x, y, e) {
                mouseX = x;
                mouseY = y;
                if(mouseY<height && mouseX<width){
                    $chalk.css('left',(mouseX-0.5*brushDiameter)+'px');
                    $chalk.css('top',(mouseY-0.5*brushDiameter)+'px');
                    if(mouseD){
                        if(eraser){
                            erase(mouseX,mouseY);
                        }else{
                            draw(mouseX,mouseY);
                        }
                    }
                }else{
                    $chalk.css('top',height-10);
                }
            },
            mouseup: function (x, y, e) {

                mouseD = false;
                if(e.button == 2){
                    eraser = false;
                    $chalk.removeClass('eraser');
                }
            }
        };


        
    };

    DrawBoard.fn.useChalk = function () {
        if (!this.isInitChalk) {
            this.initChalk();
            this.isInitChalk = true;
        }

        this._setType(TYPE_CHALK);
        this.addLog({
            type: 'type',
            value: TYPE_CHALK
        });
    };

})(jQuery);