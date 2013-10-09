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
    'moui/overlay'
], function($, _, tpl, mousewheel, overlay) {

    var NS = 'mouiImageView',
        TPL_VIEW =
           '<div id="{{id}}" class="{{cname}}">\
                <div class="shd"></div>\
                <div class="wrapper">\
                    <header>\
                        <span class="btn cancel"></span>\
                        <span class="group resize">\
                            <span class="btn bigger"></span>\
                            <span class="btn reset"></span>\
                            <span class="btn smaller"></span>\
                        </span>\
                        <span class="group pager">\
                            <span class="btn next"></span>\
                            <span class="btn prev"></span>\
                        </span>\
                        <h1></h1>\
                    </header>\
                    <article>\
                        <div class="max">\
                            <img>\
                            <div class="mask"></div>\
                        </div>\
                    </article>\
                    <div class="loading"></div>\
                    <footer></footer>\
                </div>\
            </div>',

        _piclib = {},
        _img_loader_tm,

        default_config = {
            className: 'moui-imageview',
            closeDelay: 400,
            images: [],
            offset: 0,
            maxScale: 3,
            minScale: 0.5,
            scaleStep: 0.05,
            allowDrag: true,
            allowWheel: true,
            allowSave: true,
            loadingContent: 'Loading...',
            cancelText: 'x',
            smallerText: '—',
            resetText: '1x',
            biggerText: '+',
            nextText: '&#8250;',
            prevText: '&#8249;'
        };

    var ImageView = _.construct(overlay.Overlay, function(){
        this.superConstructor.apply(this, arguments);
        this.initMousewheel();
        this.initDrag();
    });

    _.mix(ImageView.prototype, {

        _ns: NS,
        _template: TPL_VIEW,
        _defaults: _.mix({}, ImageView.prototype._defaults, default_config),

        init: function(opt) {
            this.superMethod('init', [opt]);
            this._wrapper = this._node.find('.wrapper').eq(0);
            this._content = this._node.find('footer').eq(-1);
            this._imageWrapper = this._node.find('article').eq(0);
            this._imageMax = this._imageWrapper.find('.max');
            this._imageMask = this._imageMax.find('.mask');
            this._image = this._imageMax.find('img');
            this._loading = this._node.find('.loading').eq(0);
            return this;
        },

        initMousewheel: function(){
            var self = this;
            this.event.on('open', function(){
                if (self._config.allowWheel) {
                    mousewheel(self._imageWrapper[0]).on(when_wheel);
                }
            }).on('close', function(){
                if (self._config.allowWheel) {
                    mousewheel(self._imageWrapper[0]).off(when_wheel);
                }
            });
            function when_wheel(e){
                e.preventDefault();
                var data = mousewheel.fix(e);
                self.zoomImage(data[2] || data[0] > 0 && 2 || -2);
            }
        },

        initDrag: function(){
            var x, y, 
                self = this,
                handler = self._config.allowSave 
                    ? self._image 
                    : self._imageMask,
                box = self._imageWrapper[0];
            handler.on('mousedown', function(e){
                var which = e.button;
                if (!self._config.allowDrag
                        || which > 0 && which !== 0
                        || which < 0 && which !== -1) {
                    return;
                }
                e.preventDefault();
                x = e.clientX;
                y = e.clientY;
                $(document).off('mousemove', when_drag)
                    .on('mousemove', when_drag)
                    .once('mouseup', function(){
                        $(document).off('mousemove', when_drag);
                    });
                function when_drag(e){
                    e.preventDefault();
                    box.scrollLeft -= e.clientX - x;
                    box.scrollTop -= e.clientY - y;
                    x = e.clientX;
                    y = e.clientY;
                }
            });
        },

        set: function(opt) {
            if (!opt) {
                return this;
            }
            this.superMethod('set', [opt]);

            if (opt.allowSave !== undefined) {
                if (opt.allowSave) {
                    this._node.removeClass('disable-save');
                } else {
                    this._node.addClass('disable-save');
                }
            }

            if (opt.content !== undefined) {
                if (!opt.content) {
                    this._content.hide();
                } else {
                    this._content.show();
                }
            }

            if (opt.loadingContent) {
                this._loading.html(opt.loadingContent);
            }

            _.each(opt, function(str, prop){
                var name = /^(\w+)Text$/.exec(prop);
                if (name && name[1]) {
                    this._header.find('.btn.' + name[1]).html(str);
                }
            }, this);

            return this;
        },

        next: function(){
            this.setImage(this._imagesOffset + 1);
        },

        prev: function(){
            this.setImage(this._imagesOffset - 1);
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

        zoomIn: function(n){
            this.zoomImage((n || 1) * 2.5);
        },

        zoomOut: function(n){
            this.zoomImage(-(n || 1) * 2.5);
        },

        zoomReset: function(){
            this._changeImageScale(1);
        },

        zoomImage: function(delta){
            var max_scale = this._config.maxScale,
                min_scale = this._config.minScale,
                w = this._imageWidth,
                h = this._imageHeight,
                r = w / h;
            w = (this._imageScale 
                + delta * this._config.scaleStep) * w;
            if (w < this._imageWidth * min_scale 
                    || w > this._wrapperWidth * max_scale) {
                return;
            }
            h = w / r;
            if (h < this._imageHeight * min_scale 
                    || h > this._wrapperHeight * max_scale) {
                return;
            }
            this._changeImageScale(w / this._imageWidth);
        },

        _changeImageScale: function(scale){
            var max_scale = this._config.maxScale,
                w = scale * this._imageWidth,
                h = w / (this._imageWidth / this._imageHeight);
            this._imageScale = scale;
            var values = {
                width: w,
                left: (this._wrapperWidth * max_scale - w) / 2,
                top: (this._wrapperHeight * max_scale - h) / 2
            };
            this._image.css(values);
            if (!this._config.allowSave) {
                this._imageMask.css(_.mix(values, {
                    height: h
                }));
            }
        },

        updateImageSize: function(w, h){
            w = w || this._image[0].width;
            h = h || this._image[0].height;
            if (!w || !h 
                    || w <= 0 || h <= 0) {
                return false;
            }
            var max_scale = this._config.maxScale,
                win_w = this._wrapper.width(),
                win_h = this._wrapper.height(),
                size = adapted_size(w, h, win_w, win_h);
            this._imageMax.css({
                width: win_w * max_scale,
                height: win_h * max_scale
            });
            this._imageWidth = size[0];
            this._imageHeight = size[1];
            this._wrapperWidth = win_w;
            this._wrapperHeight = win_h;
            this._changeImageScale(1);
            this._imageWrapper[0].scrollLeft = (win_w * max_scale - win_w) / 2;
            this._imageWrapper[0].scrollTop = (win_h * max_scale - win_h) / 2;
            return true;
        },

        setImage: function(offset){
            var self = this,
                images = this._config.images,
                url = images[offset];
            if (!url) {
                return;
            }
            this._image.attr('src', '');
            this._loading.show();
            this._imagesOffset = offset;
            if (offset <= 0) {
                this._header.find('.prev').addClass('disabled');
            } else {
                this._header.find('.prev').removeClass('disabled');
            }
            if (offset >= images.length - 1) {
                this._header.find('.next').addClass('disabled');
            } else {
                this._header.find('.next').removeClass('disabled');
            }
            var tm = +new Date();
            _img_loader_tm = tm;
            preload_image(url, function(url, w, h){
                if (_img_loader_tm !== tm) {
                    return;
                }
                self._image.attr('src', url);
                var show_pic = function(){
                    if (!self.updateImageSize(w, h)) {
                        setTimeout(show_pic, 200);
                    } else {
                        self._loading.hide();
                        self._image.addClass('ready');
                    }
                };
                show_pic();
                preload_image(images[offset - 1]);
                preload_image(images[offset + 1]);
            });
            this.event.fire('changeImage', [url, offset]);
        },

        getCurrentImage: function(){
            return {
                url: this._image.attr('src'),
                offset: this._imagesOffset
            };
        },

        cancel: function(){
            this.event.fire('cancel', [this]);
            this.close();
            return this.event.promise('close');
        },

        applyOpen: function(){
            var re = this.superMethod('applyOpen', arguments);
            this.setImage(this._config.offset);
            return re;
        },

        applyClose: function(){
            this._image.removeClass('ready');
            return this.superMethod('applyClose', arguments);
        }

    });

    function preload_image(url, fn){
        if (!url) {
            return;
        }
        var img = _piclib[url];
        if (Array.isArray(img)) {
            setTimeout(done, 0);
        } else if (img) {
            $(img).on('load', function(){
                img = _piclib[url] = [img.width, img.height];
                done();
            });
        } else {
            img = new Image();
            _piclib[url] = $(img).on('load', function(){
                img = _piclib[url] = [img.width, img.height];
                done();
            })[0];
            img.src = url;
        }
        function done(){
            if (fn) {
                fn(url, img[0], img[1]);
            }
        }
    }
    
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
            w = h * r;
        } else {
            if (h !== max_h) {
                h = max_h;
            }
            w = h * r;
            if (w > max_w) {
                w = max_w;
            }
            h = w / r;
        }
        return [w, h];
    }

    function exports(opt) {
        return new exports.ImageView(opt);
    }

    exports.ImageView = ImageView;
    exports.adaptedSize = adapted_size;
    exports.preloadImage = preload_image;

    return exports;

});

