/**
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define('moui/stick', [
   "jquery", 
   "mo/lang"
], function($, _){

    /**
     * 让一个元素出现在指定位置（紧贴另一个元素，或者指定坐标）
     * @param {Array|DOM} t是坐标或紧贴的对象
     * @param {DOM|Array} box是需要定位的元素，当它是数组的时候表示不改变元素位置，只返回坐标值
     * @param {int} * clock用时钟指针位置表示从哪个方向对齐，比如7点表示下方偏右
     * @return {Object} 返回坐标
     */
    function stick(t, box, clock){
        var pos = Array.isArray(t) ? { left: t[0], top: t[1] } : $(t).offset();
        var b = Array.isArray(box) ? { w: box[0], h: box[1] } : {
            w: box.offsetWidth,
            h: box.offsetHeight
        };
        var win = $(window);
        var v = {
            l : win.scrollLeft(),
            t : win.scrollTop(),
            w : win.width(),
            h : win.height()
        };
        var opt = clock;
        if (typeof opt === 'object') {
            clock = opt.clock;
        } else {
            opt = { clock: clock };
        }
        var top, left;
        if (clock !==  undefined) { // t必须为DOM元素
            var f = parseInt(++clock / 3, 10),
                o = clock % 3;
            var toAlign = function(e, v1, v2, v3){
                if (e === 0)
                    return v1;
                else if (e === 1) 
                    return v1 - ( v3 - v2 )/2; //居中对齐
                else if (e === 2) 
                    return v1 - ( v3 - v2 ); 
            };
            if (f === 0 || f === 4) { //顶部
                top = pos.top - b.h;
                left = toAlign(o, pos.left, t.offsetWidth, b.w);
            } else if (f === 1) { //右边
                top = toAlign(o, pos.top, t.offsetHeight, b.h);
                left = pos.left + (t.offsetWidth || 0);   
            } else if (f === 2) { //底部
                top = pos.top + (t.offsetHeight || 0);
                left = toAlign([2,1,0][o], pos.left, t.offsetWidth, b.w);
            } else if (f === 3) { //左边
                top = toAlign([2,1,0][o], pos.top, t.offsetHeight, b.h);
                left = pos.left - b.w;  
            }
        } else { //不需要对齐的时候，默认显示在目标下方，左对齐，并且根据窗口边界作出调整
            top = pos.top + (t.offsetHeight || 0);
            left = pos.left;
            opt.enableAlign = true;
        }
        if (opt.enableAlign) {
            if (top + b.h > v.t + v.h) {
                top = pos.top - b.h;
            } else if (top < 0) {
                top = 0;
            }
            if (left + b.w > v.l + v.w) {
                left = left + (t.offsetWidth || 0) - b.w;
            } else if (left < 0) {
                left = 0;
            }
        }
        
        if (box.constructor != Array) { //第二个参数是数组的时候表示不改变元素位置，只返回坐标值
            box.style.left = left + "px";
            box.style.top = top + "px";
        }
        
        return { t: top, l: left };
    }

    return stick;

});
