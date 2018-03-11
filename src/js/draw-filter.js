
/**
 * draw-filter.js
 * Created by cjh1 on 2016/11/10.
 */
// 滤镜
import { clamp } from './tool'
const DrawBoard = window.DrawBoard

var gfilter = {
  type: 'canvas',
  name: 'filters',
  author: 'zhigang',
  getInfo: function () {
    return this.author + ' ' + this.type + ' ' + this.name
  },

  /**
   * invert color value of pixel, new pixel = RGB(255-r, 255-g, 255 - b)
   *
   * @param binaryData - canvas's imagedata.data
   * @param l - length of data (width * height of image data)
   */
  invert: function (context, binaryData, l) {
    for (var x = 0; x < binaryData.width; x++) {
      for (var y = 0; y < binaryData.height; y++) {
        // Index of the pixel in the array
        var idx = (x + y * binaryData.width) * 4
        var r = binaryData.data[idx + 0]
        var g = binaryData.data[idx + 1]
        var b = binaryData.data[idx + 2]

        // calculate gray scale value
        // var gray = 0.299 * r + 0.587 * g + 0.114 * b

        // assign gray scale value
        binaryData.data[idx + 0] = 255 - r // Red channel
        binaryData.data[idx + 1] = 255 - g // Green channel
        binaryData.data[idx + 2] = 255 - b // Blue channel
      }
    }
  },

  /**
   * adjust color values and make it more darker and gray...
   *
   * @param binaryData
   * @param l
   */
  colorAdjustProcess: function (binaryData, l) {
    for (var i = 0; i < l; i += 4) {
      var r = binaryData[i]
      var g = binaryData[i + 1]
      var b = binaryData[i + 2]

      binaryData[i] = (r * 0.272) + (g * 0.534) + (b * 0.131)
      binaryData[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168)
      binaryData[i + 2] = (r * 0.393) + (g * 0.769) + (b * 0.189)
    }
  },

  /**
   * deep clone image data of canvas
   *
   * @param context
   * @param src
   * @returns
   */
  copyImageData: function (context, src) {
    var dst = context.createImageData(src.width, src.height)
    dst.data.set(src.data)
    return dst
  },

  /**
   * convolution - keneral size 5*5 - blur effect filter(模糊效果)
   *
   * @param context
   * @param canvasData
   */
  blur: function (context, canvasData) {
    console.log('Canvas Filter - blur process')
    var tempCanvasData = this.copyImageData(context, canvasData)
    var sumred = 0.0
    let sumgreen = 0.0
    let sumblue = 0.0
    for (var x = 0; x < tempCanvasData.width; x++) {
      for (var y = 0; y < tempCanvasData.height; y++) {
        // Index of the pixel in the array
        var idx = (x + y * tempCanvasData.width) * 4
        for (var subCol = -2; subCol <= 2; subCol++) {
          var colOff = subCol + x
          if (colOff < 0 || colOff >= tempCanvasData.width) {
            colOff = 0
          }
          for (var subRow = -2; subRow <= 2; subRow++) {
            var rowOff = subRow + y
            if (rowOff < 0 || rowOff >= tempCanvasData.height) {
              rowOff = 0
            }
            var idx2 = (colOff + rowOff * tempCanvasData.width) * 4
            var r = tempCanvasData.data[idx2 + 0]
            var g = tempCanvasData.data[idx2 + 1]
            var b = tempCanvasData.data[idx2 + 2]
            sumred += r
            sumgreen += g
            sumblue += b
          }
        }

        // calculate new RGB value
        var nr = (sumred / 25.0)
        var ng = (sumgreen / 25.0)
        var nb = (sumblue / 25.0)

        // clear previous for next pixel point
        sumred = 0.0
        sumgreen = 0.0
        sumblue = 0.0

        // assign new pixel value
        canvasData.data[idx + 0] = nr // Red channel
        canvasData.data[idx + 1] = ng // Green channel
        canvasData.data[idx + 2] = nb // Blue channel
        canvasData.data[idx + 3] = 255 // Alpha channel
      }
    }
  },

  /**
   * after pixel value - before pixel value + 128
   * 浮雕效果
   */
  relief: function (context, canvasData) {
    console.log('Canvas Filter - relief process')
    var tempCanvasData = this.copyImageData(context, canvasData)
    for (var x = 1; x < tempCanvasData.width - 1; x++) {
      for (var y = 1; y < tempCanvasData.height - 1; y++) {
        // Index of the pixel in the array
        var idx = (x + y * tempCanvasData.width) * 4
        var bidx = ((x - 1) + y * tempCanvasData.width) * 4
        var aidx = ((x + 1) + y * tempCanvasData.width) * 4

        // calculate new RGB value
        var nr = tempCanvasData.data[aidx + 0] - tempCanvasData.data[bidx + 0] + 128
        var ng = tempCanvasData.data[aidx + 1] - tempCanvasData.data[bidx + 1] + 128
        var nb = tempCanvasData.data[aidx + 2] - tempCanvasData.data[bidx + 2] + 128
        nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr)
        ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng)
        nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb)

        // assign new pixel value
        canvasData.data[idx + 0] = nr // Red channel
        canvasData.data[idx + 1] = ng // Green channel
        canvasData.data[idx + 2] = nb // Blue channel
        canvasData.data[idx + 3] = 255 // Alpha channel
      }
    }
  },

  /**
   *  before pixel value - after pixel value + 128
   *  雕刻效果
   *
   * @param canvasData
   */
  diaokeProcess: function (context, canvasData) {
    console.log('Canvas Filter - process')
    var tempCanvasData = this.copyImageData(context, canvasData)
    for (var x = 1; x < tempCanvasData.width - 1; x++) {
      for (var y = 1; y < tempCanvasData.height - 1; y++) {
        // Index of the pixel in the array
        var idx = (x + y * tempCanvasData.width) * 4
        var bidx = ((x - 1) + y * tempCanvasData.width) * 4
        var aidx = ((x + 1) + y * tempCanvasData.width) * 4

        // calculate new RGB value
        var nr = tempCanvasData.data[bidx + 0] - tempCanvasData.data[aidx + 0] + 128
        var ng = tempCanvasData.data[bidx + 1] - tempCanvasData.data[aidx + 1] + 128
        var nb = tempCanvasData.data[bidx + 2] - tempCanvasData.data[aidx + 2] + 128
        nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr)
        ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng)
        nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb)

        // assign new pixel value
        canvasData.data[idx + 0] = nr // Red channel
        canvasData.data[idx + 1] = ng // Green channel
        canvasData.data[idx + 2] = nb // Blue channel
        canvasData.data[idx + 3] = 255 // Alpha channel
      }
    }
  },

  /**
   * mirror reflect flipv
   *
   * @param context
   * @param canvasData
   */
  mirror: function (context, canvasData) {
    console.log('Canvas Filter - process')
    var tempCanvasData = this.copyImageData(context, canvasData)
    for (var x = 0; x < tempCanvasData.width; x++) {
      for (var y = 0; y < tempCanvasData.height; y++) {
        // Index of the pixel in the array
        var idx = (x + y * tempCanvasData.width) * 4
        var midx = (((tempCanvasData.width - 1) - x) + y * tempCanvasData.width) * 4

        // assign new pixel value
        canvasData.data[midx + 0] = tempCanvasData.data[idx + 0] // Red channel
        canvasData.data[midx + 1] = tempCanvasData.data[idx + 1] // Green channel
        canvasData.data[midx + 2] = tempCanvasData.data[idx + 2] // Blue channel
        canvasData.data[midx + 3] = 255 // Alpha channel
      }
    }
  },
  fliph: function (context, canvasData) {
    console.log('Canvas Filter - process')
    var tempCanvasData = this.copyImageData(context, canvasData)
    for (var x = 0; x < tempCanvasData.width; x++) {
      for (var y = 0; y < tempCanvasData.height; y++) {
        // Index of the pixel in the array
        var idx = (x + y * tempCanvasData.width) * 4
        var midx = ((tempCanvasData.height - y - 1) * tempCanvasData.width + x) * 4

        // assign new pixel value
        canvasData.data[midx + 0] = tempCanvasData.data[idx + 0] // Red channel
        canvasData.data[midx + 1] = tempCanvasData.data[idx + 1] // Green channel
        canvasData.data[midx + 2] = tempCanvasData.data[idx + 2] // Blue channel
        canvasData.data[midx + 3] = 255 // Alpha channel
      }
    }
  },
  // 通用简单滤镜
  simpleFiler: function (binaryData, handler) {
    var start = new Date().getTime()
    for (var x = 0; x < binaryData.width; x++) {
      for (var y = 0; y < binaryData.height; y++) {
        // Index of the pixel in the array
        var idx = (x + y * binaryData.width) * 4
        var r = binaryData.data[idx + 0]
        var g = binaryData.data[idx + 1]
        var b = binaryData.data[idx + 2]
        var a = binaryData.data[idx + 3]

        var arr = handler(r, g, b, a)
        binaryData.data[idx + 0] = arr[0] // Red channel
        binaryData.data[idx + 1] = arr[1] // Green channel
        binaryData.data[idx + 2] = arr[2] // Blue channel
        binaryData.data[idx + 3] = arr[3] // Blue channel
      }
    }
    console.log((new Date().getTime() - start) + 'ms')
  },
  gray: function (context, binaryData) {
    this.simpleFiler(binaryData, function (r, g, b, a) {
      var gray = 0.299 * r + 0.587 * g + 0.114 * b
      return [gray, gray, gray, a]
    })
  },
  // 明度
  grayLigtness: function (context, binaryData, l) {
    this.simpleFiler(binaryData, function (r, g, b, a) {
      var val = parseInt(
        (Math.max(r, g, b) + Math.min(r, g, b)) * 0.5
      )
      return [val, val, val, a]
    })
  },
  // 亮度
  grayLuminosity: function (context, binaryData, l) {
    this.simpleFiler(binaryData, function (r, g, b, a) {
      var val = parseInt(r * 0.21) + (g * 0.71) + (b * 0.07)
      return [val, val, val, val, a]
    })
  },
  // 平均亮度
  grayLuminosity2: function (context, binaryData, l) {
    this.simpleFiler(binaryData, function (r, g, b, a) {
      var val = parseInt((r + g + b) / 3.0)
      return [val, val, val, a]
    })
  },
  // 棕褐色灰度图sepia
  sepiaTone: function (context, binaryData, l) {
    this.simpleFiler(binaryData, function (r, g, b, a) {
      var rs = (r * 0.393) + (g * 0.769) + (b * 0.189)
      var gs = (r * 0.349) + (g * 0.686) + (b * 0.168)
      var bs = (r * 0.272) + (g * 0.534) + (b * 0.131)
      return [
        (rs > 255) ? 255 : parseInt(rs),
        (gs > 255) ? 255 : parseInt(gs),
        (bs > 255) ? 255 : parseInt(bs),
        a
      ]
    })
  },
  // 滤镜,修改颜色通道的顺序,例如:order=[2,0,1,3]
  swapChannels: function (context, binaryData, l) {
    this.simpleFiler(binaryData, function (r, g, b, a) {
      var rgba = [r, g, b, a]
      var order = [2, 0, 1, 3] // TODO 这里写死了
      return [
        rgba[order[0]],
        rgba[order[1]],
        rgba[order[2]],
        rgba[order[3]]
      ]
    })
  },
  // 起始像素的灰度作为alpha值,将每个像素的RGB设为特定颜色,第四个参数被定时为期望颜色的RGB值数组-
  // 例如:color=[0,0,255]为蓝色,[0,0,0]灰色
  monoColor: function (context, binaryData, l) {
    this.simpleFiler(binaryData, function (r, g, b, a) {
      var color = [0, 0, 255] // TODO 这里写死
      return [
        color[0],
        color[1],
        color[2],
        255 - (parseInt(r + g + b) / 3)
      ]
    })
  },
  // 正片叠底 C=(A*B)/255
  multiply: function (context, binaryData, binaryData2) {
    for (var x = 0; x < binaryData.width; x++) {
      for (var y = 0; y < binaryData.height; y++) {
        // Index of the pixel in the array
        var idx = (x + y * binaryData.width) * 4
        var r = binaryData.data[idx + 0]
        var g = binaryData.data[idx + 1]
        var b = binaryData.data[idx + 2]
        var a = binaryData.data[idx + 3]

        var r2 = binaryData2.data[idx + 0]
        var g2 = binaryData2.data[idx + 1]
        var b2 = binaryData2.data[idx + 2]
        // var a2 = binaryData2.data[idx + 3]

        var arr = [
          (r * r2) / 255,
          (g * g2) / 255,
          (b * b2) / 255,
          a
        ]

        binaryData.data[idx + 0] = arr[0] // Red channel
        binaryData.data[idx + 1] = arr[1] // Green channel
        binaryData.data[idx + 2] = arr[2] // Blue channel
        binaryData.data[idx + 3] = arr[3] // Blue channel
      }
    }
  },
  // 颜色加深 C=A-((255-A)*(255-B)/B)
  colorBurn: function (context, binaryData, l) {
    this.simpleFiler(binaryData, function (r, g, b, a) {
      return [
        r - ((255 - r) * (255 - r) / r),
        g - ((255 - g) * (255 - g) / g),
        b - ((255 - b) * (255 - b) / b),
        a
      ]
    })
  },
  // 线性减淡
  linearDodge: function (context, binaryData, l) {
    function cal (a, b) {
      return a + b
    }

    this.simpleFiler(binaryData, function (r, g, b, a) {
      return [
        cal(r, r),
        cal(g, g),
        cal(b, b),
        a
      ]
    })
  },
  // 柔光
  softLight: function (context, binaryData, l) {
    function cal (a, b) {
      if (b <= 128) {
        return (a * b / 128) + (a / 255) * (a / 255) * (255 - 2 * b)
      } else {
        return a * (255 - b) / 128 + Math.sqrt(a / 255) * (2 * b - 255)
      }
    }

    this.simpleFiler(binaryData, function (r, g, b, a) {
      return [
        cal(r, r),
        cal(g, g),
        cal(b, b),
        a
      ]
    })
  },
  // 差值
  difference: function (context, binaryData, l) {
    function cal (a, b) {
      return Math.abs(a - b)
    }

    this.simpleFiler(binaryData, function (r, g, b, a) {
      return [
        cal(r, r),
        cal(g, g),
        cal(b, b),
        a
      ]
    })
  },
  // 溶解
  dissolve: function (context, binaryData, l) {
    this.simpleFiler(binaryData, function (r, g, b, a) {
      if (Math.random() < 0.1) {
        return [255, 255, 255, 0]
      } else {
        return [r, g, b, a]
      }
    })
  },
  // 马赛克
  mosaic: function (context, binaryData) {
    var options = {
      blockSize: 8
    }

    var width = binaryData.width
    var height = binaryData.height

    var blockSize = clamp(options.blockSize, 1, Math.max(width, height))
    let yBlocks = Math.ceil(height / blockSize)
    let xBlocks = Math.ceil(width / blockSize)
    let y1
    let x1
    let idx
    let pidx

    for (let i = 0, y0 = 0, bidx = 0; i < yBlocks; i++) {
      y1 = clamp(y0 + blockSize, 0, height)
      for (let j = 0, x0 = 0; j < xBlocks; j++, bidx++) {
        x1 = clamp(x0 + blockSize, 0, width)

        idx = (y0 * width + x0) << 2
        var r = binaryData[idx]
        let g = binaryData[idx + 1]
        let b = binaryData[idx + 2]

        for (let bi = y0; bi < y1; bi++) {
          for (let bj = x0; bj < x1; bj++) {
            pidx = (bi * width + bj) << 2
            binaryData[pidx] = r
            binaryData[pidx + 1] = g
            binaryData[pidx + 2] = b
            binaryData[pidx + 3] = binaryData[pidx + 3]
          }
        }
        x0 = x1
      }
      y0 = y1
    }
  }
}

// 滤镜和调整
DrawBoard.fn.filter = function (name) {
  var that = this
  var canvas = that.layer.canvas
  var context = canvas.getContext('2d')
  var canvasData = context.getImageData(0, 0, canvas.width, canvas.height)
  gfilter[name](context, canvasData)
  context.putImageData(canvasData, 0, 0)

  that.storage()
}

// 混合模式
DrawBoard.fn.filter2 = function (name) {
  var that = this
  var canvas = that.layer.canvas
  var context = canvas.getContext('2d')
  var canvasData = that.layers[0].ctx.getImageData(0, 0, canvas.width, canvas.height)
  var canvasData2 = that.layers[1].ctx.getImageData(0, 0, canvas.width, canvas.height)
  gfilter[name](context, canvasData, canvasData2)
  context.putImageData(canvasData, 0, 0)

  that.storage()
}
