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
    'moui/actionview'
], function($, _, tpl, actionView) {

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
                    <article><img></article>\
                    <footer></footer>\
                </div>\
            </div>',

        default_config = {
            className: 'moui-imageview',
            closeDelay: 500,
            url: '',
            actionsText: 'More'
        };

    var ImageView = _.construct(actionView.ActionView);

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
            this._image = this._imageWrapper.find('img');
            this._actionsWrapper = this._wrapper.find('.options').eq(0);
            return this;
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

        applyOpen: function(){
            var re = this.superMethod('applyOpen', arguments);
            var h = this._imageWrapper.height();
            var v = this._image[0].offsetHeight;
            this._image.css({ 
                'margin-top': v < h ? (h - v) / 2 + 'px' : 0
            });
            return re;
        },

        applyClose: function(){
            this._imageWrapper[0].scrollTop = 0;
            return this.superMethod('applyClose', arguments);
        }

    });

    function exports(opt) {
        return new exports.ImageView(opt);
    }

    exports.ImageView = ImageView;

    return exports;

});

