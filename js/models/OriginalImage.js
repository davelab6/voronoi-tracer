function OriginalImage(app, src) {
    this.app = app;
    this.element = null;
    this.ctx = null;
    this.data = null;
    this.img = null;
    this.original = {
        width: 0,
        height: 0
    };
    this.settings = {
        width: 0,
        height: 0
    };
    this.init();
}

OriginalImage.prototype.init = function() {
    this.element = document.getElementById('canvas-original');
    this.ctx = this.element.getContext('2d');
    this.load();
};

OriginalImage.prototype.load = function() {
    this.img = document.getElementById("original-image");
    $(this.img).removeClass('loaded');
    this.original.width = this.img.clientWidth;
    this.original.height = this.img.clientHeight;
    this.updateSize();
    $(this.img).addClass('loaded');
};

OriginalImage.prototype.updateSize = function() {
    this.settings.width = this.original.width * this.app.settings.scale;
    this.settings.height = this.original.height * this.app.settings.scale;
    this.element.setAttribute ('width', this.settings.width);
    this.element.setAttribute ('height', this.settings.height);
    this.ctx.drawImage(this.img, 0, 0, this.settings.width, this.settings.height);
    this.data = this.ctx.getImageData (0, 0, this.settings.width, this.settings.height).data;
};

OriginalImage.prototype.isNear = function(x, y) {
    var range = Math.round(((100 - this.app.settings.resolution) / 200) * this.settings.width) + 1,
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
    if (endX > this.settings.width) {
        endX = this.settings.width;
    }
    if (endY > this.settings.height) {
        endY = this.settings.height;
    }
    for (var cy = startY; cy < endY; cy++) {
        for (var cx = startX; cx < endX; cx++) {
            var pixel = cy * this.settings.width + cx;
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
