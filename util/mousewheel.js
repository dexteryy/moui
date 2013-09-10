
define([], function(){

    var lowestDelta, lowestDeltaXY;
    var toBind = 'onwheel' in document || document.documentMode >= 9 
        ? ['wheel'] 
        : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];

    function Mousewheel(elm){
        this._node = elm;
    }

    Mousewheel.prototype = {

        on: function(fn){
            for (var i = toBind.length; i;) {
                exports.on(this._node, toBind[--i], fn);
            }
        },

        off: function(fn){
            for (var i = toBind.length; i;) {
                exports.off(this._node, toBind[--i], fn);
            }
        },

    };

    function exports(elm, opt){
        return new exports.Class(elm, opt);
    }

    exports.on = function(elm, subject, fn){
        elm.addEventListener(subject, fn, false);
    };

    exports.off = function(elm, subject, fn){
        elm.removeEventListener(subject, fn, false);
    };

    exports.fix = function(orgEvent) {
        orgEvent = orgEvent.originalEvent || orgEvent;
        var delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            absDeltaXY = 0,
            fn;

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta; }
        if ( orgEvent.detail )     { delta = orgEvent.detail * -1; }

        // New school wheel delta (wheel event)
        if ( orgEvent.deltaY ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( orgEvent.deltaX ) {
            deltaX = orgEvent.deltaX;
            delta  = deltaX * -1;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if ( !lowestDelta || absDelta < lowestDelta ) { lowestDelta = absDelta; }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if ( !lowestDeltaXY || absDeltaXY < lowestDeltaXY ) { lowestDeltaXY = absDeltaXY; }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta  = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);

        return [delta, deltaX, deltaY];
    };

    exports.Class = Mousewheel;

    return exports;

});
