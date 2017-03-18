function Svg(app) {
    this.app = app;
    this.elements = {
        svg: null
    };
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
    this.clear();
    this.drawPoints();
    this.drawCells();
};

Svg.prototype.clear = function() {
    this.elements.points.selectAll('*').remove();
    this.elements.cells.selectAll('*').remove();
};

Svg.prototype.drawPoints = function() {
    var dataset = this.app.points;
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

    var cells = cleanUp(d3.geom.voronoi()
        .clipExtent([[0,0], [this.app.settings.canvas.width, this.app.settings.canvas.height]])
        (this.app.points)
        .map(d3.geom.polygon));

    var cell = this.elements.cells.append('g')
        .attr('class', 'cell')
        .selectAll('g')
        .data(cells)
        .enter().append('g');

    cell.append('path')
        .attr('class', function(d) {
            if (d && self.app.sketchCanvas.overlaps(d)) {
                return 'cell-border filled';
            } else {
                return 'cell-border';
            }
        })
        .attr('d', function(d) {
            return 'M' + d.join('L') + 'Z';
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
