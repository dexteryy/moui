
define([], function(){

    var SUPPORT_TOUCH = false;

    try {
        document.createEvent("TouchEvent");  
        SUPPORT_TOUCH = true;
    } catch (e) {}

    var exports = {
        touch: SUPPORT_TOUCH,
        overflowScroll: "webkitOverflowScrolling" in document.body.style
    };

    return exports;

});

