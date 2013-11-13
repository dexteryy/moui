
define(["mo/browsers"], function(browsers){

    var exports = {
        touch: browsers.isTouch,
        overflowScroll: "webkitOverflowScrolling" in document.body.style
    };

    return exports;

});

