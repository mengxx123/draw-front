const $ = window.jQuery
const DrawBoard = window.DrawBoard
const ui = window.ui

$.extend(ui.Dialog.DEFAULTS, {
  // btn: false
})

DrawBoard.fn.loadImageFile = function (file) {
  var that = this
  let reader = new FileReader()
  reader.onload = function (e) {
    var oImg = document.createElement('img')
    oImg.onload = function () {
      that.canvasSize(oImg.width, oImg.height)
      // that.ctx.drawImage(oImg , 0 ,0 , oImg.width , oImg.height , 0 ,0 , that.width, that.height)
      that.ctx.drawImage(oImg, 0, 0, oImg.width, oImg.height, 0, 0, oImg.width, oImg.height)
      // oDropBox.appendChild(oImg)
      that.storage()
    }
    oImg.src = this.result
  }
  reader.readAsDataURL(file)
}

DrawBoard.fn.loadDataUrl = function (dataUrl) {
  let oImg = document.createElement('img')
  oImg.onload = () => {
    this.canvasSize(oImg.width, oImg.height)
    // that.ctx.drawImage(oImg , 0 ,0 , oImg.width , oImg.height , 0 ,0 , that.width, that.height)
    this.ctx.drawImage(oImg, 0, 0, oImg.width, oImg.height, 0, 0, oImg.width, oImg.height)
    // oDropBox.appendChild(oImg)
    this.storage()
  }
  oImg.src = dataUrl
}

DrawBoard.fn.dropImage = function () {
  var that = this

  that.elem.addEventListener('dragenter', function (e) {
    e.stopPropagation()
    e.preventDefault()
    $(e.target).addClass('box-shadow')
    $(e.target).next().show()
  }, false)
  that.elem.addEventListener('dragover', function (e) {
    e.stopPropagation()
    e.preventDefault()
  }, false)
  that.elem.addEventListener('drop', function (e) {
    e.stopPropagation()
    e.preventDefault()

    var fileList = e.dataTransfer.files
    that.clear()
    that.loadImageFile(fileList[0]) // 这里只取拖拽的第一个，实际中你可以遍历处理file列表
  }, false)
}
