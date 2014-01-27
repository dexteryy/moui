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
define('moui/control', [
    'mo/lang',
    'dollar',
    'eventmaster'
], function(_, $, event){

    var default_config = {
        field: null,
        label: null,
        numField: null,
        numStep: 1,
        enableVal: 1,
        disableVal: 0,
        enableLabel: '',
        disableLabel: '',
        loadingLabel: 'Loading...'
    };

    function Control(elm, opt){
        this.init(elm, opt);
        this.set(this._config);
    }

    Control.prototype = {

        _defaults: default_config,

        init: function(elm, opt){
            this.event = event();
            var node = this._node = $(elm);
            if (node.hasClass('enabled')) {
                this.isEnabled = true;
            }
            this._numField = [];
            opt = _.mix({
                field: node,
                label: node
            }, this.data(), opt);
            this.setNodes(opt);
            if (this._label[0]) {
                this._isLabelClose = is_empty(this._label[0]);
            }
            if (this._numField[0]) {
                this._isNumFieldClose = is_empty(this._numField[0]);
            }
            if (opt.enableVal === undefined) {
                opt.enableVal = this.val();
            }
            if (opt.enableLabel === undefined) {
                opt.enableLabel = this.label();
            }
            if (opt.disableVal === undefined) {
                opt.disableVal = this.val();
            }
            if (opt.disableLabel === undefined) {
                opt.disableLabel = this.label();
            }
            this._disableAttrs = {};
            this._enableAttrs = {};
            _.each(opt, function(value, name){
                var k;
                if (k = /^enableAttr([A-Z]\w*)/.exec(name)) {
                    k = k[1].toLowerCase();
                    this._disableAttrs[k] = node.attr(k);
                    if (!this._enableAttrs[k]) {
                        this._enableAttrs[k] = value;
                    }
                } else if (k = /^disableAttr([A-Z]\w*)/.exec(name)) {
                    k = k[1].toLowerCase();
                    this._enableAttrs[k] = node.attr(k);
                    if (!this._disableAttrs[k]) {
                        this._disableAttrs[k] = value;
                    }
                }
            }, this);
            this._config = _.config({}, opt, this._defaults);
        },

        set: function(opt){
            if (!opt) {
                return this;
            }
            _.mix(this._config, opt);
            this.setNodes(opt);
            return this;
        },

        setNodes: function(opt){
            if (opt.field !== undefined) {
                if (opt.field) {
                    this._field = $(opt.field, 
                        typeof opt.field === 'string' && this._node).eq(0);
                } else {
                    this._field = [];
                }
            }
            if (opt.label !== undefined) {
                if (opt.label) {
                    this._label = $(opt.label, 
                        typeof opt.label === 'string' && this._node).eq(0);
                } else {
                    this._label = [];
                }
            }
            if (opt.numField !== undefined) {
                if (opt.numField) {
                    this._numField = $(opt.numField, 
                        typeof opt.numField === 'string' && this._node).eq(0);
                } else {
                    this._numField = [];
                }
            }
            return this;
        },

        val: function(){
            var field = this._field;
            if (!field[0]) {
                return;
            }
            var re, args = [].slice.call(arguments);
            if (field[0].nodeName === 'A') {
                args.unshift('href');
                re = field.attr.apply(field, args);
                return re === field ? field[0].href : re;
            } else {
                re = field.val.apply(field, args);
                return re === field ? field.val() : re;
            }
        },

        label: function(){
            var label = this._label;
            if (!label[0]) {
                return;
            }
            var args = [].slice.call(arguments),
                method = this._isLabelClose ? 'val' : 'html',
                re = label[method].apply(label, args);
            return re === label ? label[method]() : re;
        },

        num: function(n) {
            var numfield = this._numField;
            if (!numfield[0]) {
                return;
            }
            var args = [],
                method = this._isNumFieldClose ? 'val' : 'html';
            if (n != null) {
                args.push(parseFloat(numfield[method]()) + n);
            }
            var re = numfield[method].apply(numfield, args);
            return re === numfield ? numfield[method]() : re;
        },

        data: function(){
            return this._node.data();
        },

        showLoading: function(){
            this._node.addClass('loading');
            this.label(this._config.loadingLabel);
            return this;
        },

        hideLoading: function(){
            this._node.removeClass('loading');
            return this;
        },

        toggle: function(){
            if (this.isEnabled) {
                this.disable();
            } else {
                this.enable();
            }
            return this;
        },

        enable: function(){
            if (this.isEnabled) {
                return this;
            }
            this.isEnabled = true;
            this._node.addClass('enabled');
            this.val(this._config.enableVal);
            this.num(this._config.numStep);
            if (this._config.enableLabel) {
                this.label(this._config.enableLabel);
            }
            _.each(this._enableAttrs, function(value, name){
                this._node.attr(name, value);
            }, this);
            this.event.reset('disable')
                .resolve('enable', [this]);
            return this;
        },

        disable: function(){
            if (!this.isEnabled) {
                return this;
            }
            this.isEnabled = false;
            this._node.removeClass('enabled');
            this.val(this._config.disableVal);
            this.num(0 - this._config.numStep);
            if (this._config.disableLabel) {
                this.label(this._config.disableLabel);
            }
            _.each(this._disableAttrs, function(value, name){
                this._node.attr(name, value);
            }, this);
            this.event.reset('enable')
                .resolve('disable', [this]);
            return this;
        }
    
    };

    function is_empty(elm){
        if (!elm.innerHTML) {
            elm.innerHTML = ' ';
            if (!elm.innerHTML) {
                return true;
            }
            elm.innerHTML = '';
        }
        return false;
    }

    function exports(elm, opt){
        return new exports.Control(elm, opt);
    }

    exports.Control = Control;

    return exports;

});

