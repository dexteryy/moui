/**
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define('moui/drag', ['jquery'], function($){

    function Drag(opt){

        var clearTimeout = window.clearTimeout,
            setTimeout = window.setTimeout,
            abs = Math.abs,
            doc =$(document),

            start,
            start_time = 0,
            isMove = true,
            preventDefault = typeof opt.preventDefault === "undefined" ? true : false,
            whenDragStart = opt.whenDragStart || function(){},
            whenDraging = opt.whenDraging || function(){},
            whenDragEnd = opt.whenDragEnd || function(){},
            whenClick = opt.whenClick || function(){},
            handler = this.handler = $(opt.handler);

        this.dragHandle = function(e){
            if (!isMove || e.button == 2){
                return;
            }
            if (preventDefault) {
                e.preventDefault();
            }
            isMove = false;
            start = [e.pageX, e.pageY];
            start_time = +new Date();
            doc.bind('mousemove', draging).bind('mouseup', dragEnd);
        }; 

        function dragStart(e) {
            whenDragStart(start);
            handler.bind('mouseover', dragDisable)
                .bind('mouseout', dragDisable)
                .bind('click', clickDisable);
        }

        function draging(e){
            e.preventDefault();
            if (!isMove) {
                if (abs(e.pageX - start[0]) > 3 
                        || abs(e.pageY - start[1]) > 3 
                        || +new Date() - start_time > 500) {
                    isMove = true;
                    dragStart(e);
                } else {
                    return;
                }
            }
            var prev = start;
            start = [e.pageX, e.pageY];
            whenDraging(prev, start); 
        }

        function dragEnd(e){
            doc.unbind("mousemove", draging).unbind("mouseup", dragEnd);
            if (isMove) {
                handler.unbind("mouseover", dragDisable).unbind("mouseout", dragDisable);
                whenDragEnd(start);
            } else {
                whenClick(e);
                isMove = true;
            }
        }

        function dragDisable(){
            return false;
        }

        function clickDisable(){
            handler.unbind("click", clickDisable);
            return false;
        }

    }

    Drag.prototype = {

        enable: function(){
            if (!this.enabled) {
                this.handler.bind('mousedown', this.dragHandle);
                this.enabled = true;
            }
            return this;
        },

        disable: function(){
            if (this.enabled) {
                this.handler.unbind("mousedown", this.dragHandle);
                this.enabled = false;
            }
            return this;
        }

    };

    return function(opt){
        return new Drag(opt);
    };

});
