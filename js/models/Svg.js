function Svg(app) {
    this.app = app;
    this.data = null;
    this.selection = null;
    this.elements = {
        svg: null
    };
    this.settings = {
        width: 0,
        height: 0
    }


}

Svg.prototype.create = function() {
    this.elements.svg = d3.select(this.app.container[0]).append('svg').attr({
        width: '100%',
        height: '100%'
    });
    this.elements.points = this.elements.svg.append('g').attr('class', 'g-points');
    this.elements.cells = this.elements.svg.append('g').attr('class', 'g-cells');
};

Svg.prototype.redraw = function() {
    this.updateSize();
    this.clear();
    this.drawPoints();
    this.drawCells();
};

Svg.prototype.updateSize = function() {
    this.settings.width = this.app.originalImage.settings.width;
    this.settings.height = this.app.originalImage.settings.height;
    this.app.container.css({
        width: this.settings.width,
        height: this.settings.height
    });
};

Svg.prototype.clear = function() {
    this.elements.points.selectAll('*').remove();
    this.elements.cells.selectAll('*').remove();
};

Svg.prototype.drawPoints = function() {
    var self = this,
        dataset = this.app.points;
    this.elements.points.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .each(function (d) {
            d3.select(this).attr({
                cx: d[0],
                cy: d[1],
                r:  2
            });
        })
};

Svg.prototype.drawCells = function() {
    var self = this;

    this.data = cleanUp(d3.geom.voronoi()
        .clipExtent([[0,0], [this.settings.width, this.settings.height]])
        (this.app.points)
        .map(d3.geom.polygon));

    this.selection = this.elements.cells.append('g')
        .attr('class', 'cell')
        .selectAll('g')
        .data(this.data)
        .enter().append('g')
        .append('path');

    this.selection
        .attr('class', 'cell-border')
        .attr('d', function(d) {
            return 'M' + d.join('L') + 'Z';
        });
};



Svg.prototype.fillCells = function() {
    var self = this,
        current = 0,
        length = this.data.length;
    this.selection.attr('class', function(d) {
        if (current === length - 1) {
                self.app.finish();
            }
            current++;
        if (d && self.app.sketchCanvas.overlaps(d)) {
                return 'cell-border filled';
            } else {
                return 'cell-border';
            }

        });
};

function cleanUp(arr) {
    var newArr = [];
    for (var i = 0, l = arr.length; i < l; i++) {
        if (arr[i]) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
