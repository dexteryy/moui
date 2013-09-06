/**
 * Moui
 * OO-based UI behavior modules behind CardKit(mobile webapp framework)'s view components
 * 
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2013, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define('moui/imageview', [
    'dollar',
    'mo/lang',
    'mo/template/string',
    'moui/util/mousewheel',
    'moui/actionview'
], function($, _, tpl, mousewheel, actionView) {

    var NS = 'mouiImageView',
        TPL_VIEW =
           '<div id="{{id}}" class="{{cname}}">\
                <div class="options"></div>\
                <div class="shd"></div>\
                <div class="wrapper">\
                    <header>\
                        <span class="btn cancel"></span>\
                        <span class="btn moreactions"></span>\
                        <h1></h1>\
                    </header>\
                    <article><div class="max"><img></div></article>\
                    <footer></footer>\
                </div>\
            </div>',

        default_config = {
            className: 'moui-imageview',
            closeDelay: 500,
            url: '',
            maxScale: 3,
            minScale: 0.5,
            scaleStep: 0.05,
            mousewheel: true,
            actionsText: 'More'
        };

    var ImageView = _.construct(actionView.ActionView, function(){
        this.superConstructor.apply(this, arguments);
        this.initMousewheel();
    });

    _.mix(ImageView.prototype, {

        _ns: NS,
        _template: TPL_VIEW,
        _defaults: _.mix({}, ImageView.prototype._defaults, default_config),

        init: function(opt) {
            this.superMethod('init', [opt]);
            this._wrapper = this._node.find('.wrapper').eq(0);
            this._content = this._node.find('footer').eq(-1);
            this._cancelBtn = this._header.find('.cancel').eq(0);
            this._actionsBtn = this._header.find('.moreactions');
            this._imageWrapper = this._node.find('article').eq(0);
            this._imageMax = this._imageWrapper.find('.max');
            this._image = this._imageWrapper.find('img');
            this._actionsWrapper = this._wrapper.find('.options').eq(0);
            return this;
        },

        initMousewheel: function(){
            var self = this,
                scale_step = self._config.scaleStep,
                max_scale = self._config.maxScale,
                min_scale = self._config.minScale;
            this._imageScale = 1;
            this.event.on('open', function(){
                if (self._config.mousewheel) {
                    mousewheel(self._imageWrapper[0]).on(when_wheel);
                }
            }).on('close', function(){
                if (self._config.mousewheel) {
                    mousewheel(self._imageWrapper[0]).off(when_wheel);
                }
            });
            function when_wheel(e){
                e.preventDefault();
                var deltaY = mousewheel.fix(e)[2],
                    win_w = self._wrapperWidth,
                    win_h = self._wrapperHeight,
                    w = self._imageWidth,
                    h = self._imageHeight,
                    r = w / h;
                w = (self._imageScale + deltaY * scale_step) * w;
                if (w < self._imageWidth * min_scale 
                        || w > win_w * max_scale) {
                    return;
                }
                h = w / r;
                if (h < self._imageHeight * min_scale 
                        || h > win_h * max_scale) {
                    return;
                }
                self._imageScale = w / self._imageWidth;
                self._image.css({
                    left: (win_w * max_scale - w) / 2 + 'px',
                    top: (win_h * max_scale - h) / 2 + 'px',
                    width: w + 'px'
                });
            }
        },

        set: function(opt) {
            if (!opt) {
                return this;
            }
            this.superMethod('set', [opt]);

            if (opt.url) {
                this._image.attr('src', opt.url);
            }

            if (opt.content !== undefined) {
                if (!opt.content) {
                    this._content.hide();
                } else {
                    this._content.show();
                }
            }

            if (opt.actionsText) {
                this._actionsBtn.html(opt.actionsText);
            }

            return this;
        },


        startFocus: function(){
            this._node.addClass('focus-image');
        },

        stopFocus: function(){
            this._node.removeClass('focus-image');
        },
        
        toggleFocus: function(){
            this._node.toggleClass('focus-image');
        },

        updateImageSize: function(){
            var max_scale = this._config.maxScale,
                win_w = this._wrapper.width(),
                win_h = this._wrapper.height(),
                w = this._image[0].width,
                h = this._image[0].height,
                size = adapted_size(w, h, win_w, win_h);
            w = size[0];
            h = size[1];
            this._imageMax.css({
                width: win_w * max_scale + 'px',
                height: win_h * max_scale + 'px'
            });
            this._image.css({ 
                width: w + 'px',
                left: (win_w * max_scale - w) / 2 + 'px',
                top: (win_h * max_scale - h) / 2 + 'px'
            });
            this._imageWrapper[0].scrollLeft = (win_w * max_scale - win_w) / 2;
            this._imageWrapper[0].scrollTop = (win_h * max_scale - win_h) / 2;
            this._imageWidth = w;
            this._imageHeight = h;
            this._wrapperWidth = win_w;
            this._wrapperHeight = win_h;
        },

        applyOpen: function(){
            var re = this.superMethod('applyOpen', arguments);
            this.updateImageSize();
            return re;
        },

        applyClose: function(){
            return this.superMethod('applyClose', arguments);
        }

    });

    function adapted_size(w, h, max_w, max_h){
        var r = w / h;
        if (r > 1) {
            if (w !== max_w) {
                w = max_w;
            }
            h = w / r;
            if (h > max_h) {
                h = max_h;
            }
        } else {
            if (h !== max_h) {
                h = max_h;
            }
            w = h * r;
            if (w > max_w) {
                w = max_w;
            }
        }
        return [w, h];
    }

    function exports(opt) {
        return new exports.ImageView(opt);
    }

    exports.ImageView = ImageView;
    exports.adaptedSize = adapted_size;

    return exports;

});

