$.extend(ui.Dialog.DEFAULTS, {
    //btn: false
});

;(function ($) {

    DrawBoard.fn.loadImageFile = function (file) {
        var that = this;

        var oImg = document.createElement('img'),
            reader = new FileReader();

        reader.onload = function (e) {
            oImg.src = this.result;
            console.log(oImg.width);
            
            that.canvasSize(oImg.width , oImg.height);
            //that.ctx.drawImage(oImg , 0 ,0 , oImg.width , oImg.height , 0 ,0 , that.width, that.height);
            that.ctx.drawImage(oImg , 0 ,0 , oImg.width , oImg.height , 0 ,0 , oImg.width, oImg.height);
            //oDropBox.appendChild(oImg);
            that.storage();
        };
        reader.readAsDataURL(file);
    };

    DrawBoard.fn.dropImage = function () {
        var that = this;

        that.elem.addEventListener("dragenter", function(e){
            e.stopPropagation();
            e.preventDefault();
            $(e.target).addClass("box-shadow");
            $(e.target).next().show();
        }, false);
        that.elem.addEventListener('dragover', function(e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        that.elem.addEventListener('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var fileList = e.dataTransfer.files;　　//获取拖拽文件
            that.loadImageFile(fileList[0]); // 这里只取拖拽的第一个，实际中你可以遍历处理file列表

        }, false);
    }
})(jQuery);