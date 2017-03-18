function OriginalImage(app, src) {
    this.app = app;
    this.element = null;
    this.ctx = null;
    this.data = null;
    this.init();
}

OriginalImage.prototype.init = function() {
    this.element = document.getElementById('canvas-original');
    this.ctx = this.element.getContext('2d');
    this.element.setAttribute ('width', this.app.settings.canvas.width);
    this.element.setAttribute ('height', this.app.settings.canvas.height);
    this.load();
};

OriginalImage.prototype.load = function() {
    var img = document.getElementById("original-image");
    this.ctx.drawImage(img, 0, 0, this.app.settings.canvas.width, this.app.settings.canvas.height);
    this.data = this.ctx.getImageData (0, 0, this.app.settings.canvas.width, this.app.settings.canvas.height).data;
};

OriginalImage.prototype.isNear = function(x, y) {
    var range = this.app.settings.canvas.width / this.app.settings.resolution,
        startX = x - range,
        startY = y - range,
        endX = x + range,
        endY = y + range;
    if (startX < 0) {
        startX = 0;
    }
    if (startY < 0) {
        startY = 0;
    }
    if (endX > this.app.settings.canvas.width) {
        endX = this.app.settings.canvas.width;
    }
    if (endY > this.app.settings.canvas.height) {
        endY = this.app.settings.canvas.height;
    }
    for (var cy = startY; cy < endY; cy++) {
        for (var cx = startX; cx < endX; cx++) {
            var pixel = cy * this.app.settings.canvas.width + cx;
            if (this.isDarkPixel(pixel)) {
                return true;
            }
        }
    }
    return false;
};

OriginalImage.prototype.isDarkPixel = function(pixel) {
    var data = this.data,
        position = pixel * 4,
        r = data[position],
        g = data[position + 1],
        b = data[position + 2],
        colorValue = r + g + b;
    return colorValue < 382;
};