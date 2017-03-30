var image = new Image();

$(window).ready(function(){
    initSliders();
    loadImage();
});

function loadImage() {
    $('<img/>')
        .on('load', function() {
            var element = $('#voroni');
            window.app = new App(element, settings);
            app.init();
        })
        .on('error', function() { console.log('error loading image'); })
        .attr('src', $('#original-image').attr('src'))
    ;
}

function initSliders() {
    $("#cell-slider").slider({
        orientation: "horizontal",
        range: "min",
        min: 2,
        max: 3000,
        value: settings.n,
        slide: function(event, ui){
            app.settings.n = ui.value;
            app.drawCells();
        }
    });

    $("#resolution-slider").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 100,
        value: settings.resolution,
        slide: function(event, ui){
            app.settings.resolution = ui.value;
            app.drawCells();
        }
    });

    $("#scale-slider").slider({
        orientation: "horizontal",
        range: "min",
        min: 0.05,
        max: 2,
        step: 0.05,
        value: settings.scale,
        slide: function(event, ui){
            app.settings.scale = ui.value;
            app.updateSize();
            app.drawCells();
        }
    });
}

