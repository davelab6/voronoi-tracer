function SketchCanvas(app) {
    this.app = app;
    this.element = null;
    this.ctx = null;
    this.init();
}

SketchCanvas.prototype.init = function() {
    this.element = document.getElementById('canvas-sketch');
    this.ctx = this.element.getContext('2d');
    this.updateSize();
};

SketchCanvas.prototype.updateSize = function() {
    this.element.setAttribute ('width', this.app.originalImage.settings.width);
    this.element.setAttribute ('height', this.app.originalImage.settings.height);
};

SketchCanvas.prototype.overlaps = function(cell) {
    var pixels;
    this.clear();
    this.drawCell(cell);
    pixels = this.getPixels();
    return this.getPixelBalance(pixels);
};

SketchCanvas.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.app.originalImage.settings.width, this.app.originalImage.settings.height);
};

SketchCanvas.prototype.drawCell = function(cell) {
    var ctx = this.ctx;
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(cell[0][0], cell[0][1]);
    for (var i = 1, l = cell.length; i < l; i++) {
        var c = cell[i];
        ctx.lineTo(c[0], c[1]);
    }
    ctx.closePath();
    ctx.fill();
};

SketchCanvas.prototype.getPixels = function() {
    var pixels = [];
    for (var y = 0; y < this.app.originalImage.settings.height; y++) {
        for (var x = 0; x < this.app.originalImage.settings.width; x++) {
            if (this.ctx.isPointInPath(x,y)) {
                var c = y * this.app.originalImage.settings.width + x;
                pixels.push(c);
            }
        }
    }
    return pixels;
};

SketchCanvas.prototype.getPixelBalance = function(pixels) {
    var l = pixels.length,
        hits = 0,
        fails = 0;
    for (var i = 0; i < l; i++ ){
        var pixel = pixels[i];
        if (this.app.originalImage.isDarkPixel(pixel)) {
            hits++;
        } else {
            fails++;
        }
        if (hits > (l/2)) {
            return true;
        }
        if (fails > (l/2)) {
            return false;
        }
    }
    return false;
};



