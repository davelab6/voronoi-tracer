function App(container, settings) {
    this.container = container;
    this.settings = settings;
    this.status = {
        time: {
            start: null,
            end: null
        }
    };
    this.points = [];
}

App.prototype.init = function() {
    this.toggleInfo($('#show-info')[0]);
    this.initModels();
    this.svg.create();
    this.drawCells();
};

App.prototype.loadImage = function (src) {
    var self = this;
    image.onload = function() {
        if (image.height > settings.image) {
            image.width = image.width * settings.image / image.height;
            image.height = settings.image.height;
        }
        if(image.complete) {
            $('#original-image').attr('src', src);
            self.drawCells();
        }
        else {
            $('#original-image').attr('src', src);
            self.drawCells();
        }
    };
    image.src = src;
};


App.prototype.initModels = function() {
    this.originalImage = new OriginalImage(this);
    this.svg = new Svg(this);
    this.sketchCanvas = new SketchCanvas(this);
};

App.prototype.again = function() {
    $('#tools').show();
    $('#again-button').hide();
    $('#start-button').show();
    $('#loading-info').hide();
};

App.prototype.fillCells = function() {
    var self = this;

    $('#again-button').hide();
    $('#start-button').hide();
    $('#loading-info').show();
    this.status.time.start = new Date().getTime();
    setTimeout(function(){
        self.svg.fillCells();
    }, 100);
};


App.prototype.drawCells = function() {
    var i = 0;
    this.points = [];
    while (i < this.settings.n) {
        var x = Math.round(Math.random() * this.originalImage.settings.width),
            y = Math.round(Math.random() * this.originalImage.settings.height);
        if (this.originalImage.isNear(x, y)) {
            this.generatePoint(x, y);
            i++;
        }

    }
    this.svg.redraw();

};


App.prototype.generatePoint = function(x, y) {
    var point = new Point(this, x, y);
    this.points.push(point);
};

App.prototype.finish = function() {
    var time;
    $('#tools').hide();
    this.status.time.end = new Date().getTime();
    time = ((this.status.time.end - this.status.time.start) / 1000).toFixed(1) + 's';
    $('#status-text').html('Computed time: ' + time);
    $('#again-button').show();
};

App.prototype.toggleInfo = function(element) {
    if ($(element).is(':checked')) {
        $('#voroni').addClass('show-info');
    } else {
        $('#voroni').removeClass('show-info');
    }
};

App.prototype.updateSize = function() {
    this.originalImage.updateSize();
    this.sketchCanvas.updateSize();
    this.svg.updateSize();
};



