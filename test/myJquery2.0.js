/**
 * Created by lihongwei on 2017/3/17.
 */

(function (window) {
    var arr = [];
    var push = arr.push;
    var splice = arr.splice;
    var slice = arr.slice;

    var types="Number String Boolean Array RegExp Function Math Date Object".split(" ");
    var class2type={};
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        class2type["[object "+type+"]"]=type.toLowerCase();//class2type["[object Number]"]="number"
    }

    function Sizzle(seletcor) {
        return document.querySelectorAll(seletcor);
    }

    function jQuery(selector) {
        return new jQuery.fn.init(selector);
    }

    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        init: function (selector) {

            splice.call(this, 0, this.length);
            push.apply(this, Sizzle(selector));
            return this;
        },
        css: function (styleName, styleValue) {
            for (var i = 0; i < this.length; i++) {
                var ele = this[i];
                ele.style[styleName] = styleValue;
            }

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
    jQuery.fn.init.prototype = jQuery.fn;

    function isLikeArray(array){
        var len = array.length
        return typeof len == 'number' && len >= 0 && len - 1 in array
    }

    jQuery.extend({
        each: function (array,callback) {
            if(isLikeArray(array)){
                for (var i = 0; i < array.length; i++) {

                    var result = callback.call(array[i],i,array[i]);
                    if(result === false){
                        break;
                    }
                }
            }else{
                for (i in array) {
                    var result = callback.call(array[i],i,array[i]);
                    if(result === false){
                        break;
                    }
                }
            }

        },

        isString: function (str) {
            return typeof str === 'string';
        },

        isFunction: function (fn) {
            return typeof fn === 'function';
        },

        isArray: Array.isArray || function (array) {
            return Object.prototype.toString.call(array) == '[object Array]';
        },

        type:function(data){

            return data == null?
                    String(data):
                    class2type[Object.prototype.toString.call(data)];
        },

        merge: function (target, source) {
            var len = target.length;
            for (var i = 0; i < source.length; i++) {
                target[len] = source[i];
                len++;
            }
            target.length = len;

            return target;
        },

        makeArray:function(data){

            if(isLikeArray(data)){
                return $.merge([],data);
            }else{
                return [data];
            }
        },

        trim:function(str){
            return str.replace(/^\s+|\s+$/g,"");
        }
    });

    jQuery.fn.extend({
        each:function(callback){
            jQuery.each(this,callback);
        }
    });

    window.jQuery = window.$ = jQuery;
})(window);
