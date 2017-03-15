/**
 * Created by lihongwei on 2017/3/15.
 */
(function (window) {
    var arr = [];
    var push = arr.push;
    var splice = arr.splice;
    var slice = arr.slice;

    function Sizzle(seletcor) {
        return document.querySelectorAll(seletcor);
    }

    function jQuery(selector) {
        return new jQuery.fn.F(selector);
    }

    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        F: function (selector) {

            splice.call(this,0,this.length);

            push.apply(this,Sizzle(selector));

            return this;
        },
        css: function (styleName, styleValue) {
            for (var i = 0; i < this.length; i++) {
                var ele = this[i];
                ele.style[styleName] = styleValue;
            }

            //为了实现链式编程
            return this;
        }
    };

    jQuery.fn.extend = jQuery.extend = function () {
        var target, sources;
        var arg0 = arguments[0];
        if (arg0.length == 0) return this;

        if (arguments.length == 1) {
            target = this;
            sources = [arg0];
        } else {
            target = arg0;
            sources = slice.call(arguments, 1);
        }
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            for (var key in source) {
                target[key] = source[key];
            }
        }
        return target;
    }

    jQuery.fn.F.prototype = jQuery.fn;

    window.jQuery = window.$ = jQuery;
})(window);
