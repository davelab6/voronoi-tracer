function App(container, settings) {
    this.container = container;
    this.settings = settings;
    this.timer = null;
    this.points = [];
}

App.prototype.init = function() {
    this.measure();
    this.initModels();
    this.svg.create();
    this.atOnce();
};

App.prototype.initModels = function() {
    this.svg = new Svg(this);
    this.originalImage = new OriginalImage(this);
    this.sketchCanvas = new SketchCanvas(this);
};

App.prototype.measure = function() {
    this.settings.canvas.width = this.container.outerWidth();
    this.settings.canvas.height = this.container.outerHeight();
};

App.prototype.atOnce = function() {
    var i = 0;
    while (i < this.settings.n) {
        var x = Math.round(Math.random() * this.settings.canvas.width),
            y = Math.round(Math.random() * this.settings.canvas.height);
        if (this.originalImage.isNear(x, y)) {
            this.generatePoint(x, y);
            i++;
        }

    }
    this.svg.redraw();
};


App.prototype.start = function() {
    var self = this;
    this.stop();
    this.timer = setInterval(function(){
        self.generatePoint();
        self.svg.redraw();
        if (self.points.length > self.settings.n) {
            self.stop();
        }
    }, this.settings.interval)
};

App.prototype.stop = function() {
    if (this.timer) {
        clearInterval(this.timer);
    }
};


App.prototype.generatePoint = function(x, y) {
    var point = new Point(this, x, y);
    this.points.push(point);
};


