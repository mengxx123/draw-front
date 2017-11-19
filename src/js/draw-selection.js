function getPixel(pixelData, x, y) {
    if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
        return NaN;
    }
    var pixels = pixelData.data;
    var i = (y * pixelData.width + x) * 4;
    return [pixels[i + 0], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
}

/*function setPixel(pixelData, x, y, color) {
    var i = (y * pixelData.width + x) * 4;
    var pixels = pixelData.data;
    pixels[i + 0] = (color >>> 24) & 0xFF;
    //console.log((color >>> 24) & 0xFF);
    pixels[i + 1] = (color >>> 16) & 0xFF;
    pixels[i + 2] = (color >>>  8) & 0xFF;
    pixels[i + 3] = (color >>>  0) & 0xFF;
}*/
function setPixel(pixelData, x, y, rgba) {
    var i = (y * pixelData.width + x) * 4;
    var pixels = pixelData.data;
    pixels[i + 0] = rgba[0];
    //console.log((color >>> 24) & 0xFF);
    pixels[i + 1] = rgba[1];
    pixels[i + 2] = rgba[2];
    pixels[i + 3] = rgba[3];
}

function diff(c1, c2) {
   /* if (isNaN(c1) || isNaN(c2)) {
        return Infinity;
    }*/

    var dr = c1[0] - c2[0];
    var dg = c1[1] - c2[1];
    var db = c1[2] - c2[2];
    var da = c1[3] - c2[3];

    return dr*dr + dg*dg + db*db + da*da;
}

function floodFill(canvas, x, y, replacementColor, delta) {
    var current, w, e, stack, color, cx, cy;
    var context = canvas.getContext("2d");
    var pixelData = context.getImageData(0, 0, canvas.width, canvas.height);
    /*console.log(pixelData)
    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            if (i == 0 && j == 0) {
                console.log(getPixel(pixelData, 0, 0))
            }
            setPixel(pixelData, i, j, 0xff0000ff);
        }

    }*/
    var done = [];
    for (var i = 0; i < canvas.width; i++) {
        done[i] = [];
    }

    var targetColor = getPixel(pixelData, x, y);
    delta *= delta;

    stack = [ [x, y] ];
    done[x][y] = true;
    while ((current = stack.pop())) {
        cx = current[0];
        cy = current[1];

        if (diff(getPixel(pixelData, cx, cy), targetColor) <= delta) {
            setPixel(pixelData, cx, cy, replacementColor);

            w = e = cx;
            while (w > 0 && diff(getPixel(pixelData, w - 1, cy), targetColor) <= delta) {
                --w;
                if (done[w][cy]) break;
                setPixel(pixelData, w, cy, replacementColor);
            }
            while (e < pixelData.width - 1 && diff(getPixel(pixelData, e + 1, cy), targetColor) <= delta) {
                ++e;
                if (done[e][cy]) break;
                setPixel(pixelData, e, cy, replacementColor);
            }

            for (cx = w; cx <= e; cx++) {
                if (cy > 0) {
                    color = getPixel(pixelData, cx, cy - 1);
                    if (diff(color, targetColor) <= delta) {
                        if (!done[cx][cy - 1]) {
                            stack.push([cx, cy - 1]);
                            done[cx][cy - 1] = true;
                        }
                    }
                }
                if (cy < canvas.height - 1) {
                    color = getPixel(pixelData, cx, cy + 1);
                    if (diff(color, targetColor) <= delta) {
                        if (!done[cx][cy + 1]) {
                            stack.push([cx, cy + 1]);
                            done[cx][cy + 1] = true;
                        }
                    }
                }
            }
        }
    }

    context.putImageData(pixelData, 0, 0, 0, 0, canvas.width, canvas.height);
}