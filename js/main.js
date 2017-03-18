$(window).ready(function(){
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

