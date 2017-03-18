/**
 * Created by Administrator on 2017/3/17.
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
        class2type["[object "+type+"]"]=type.toLowerCase();
    }

    function Sizzle(seletcor) {
        return document.querySelectorAll(seletcor);
    }

    //定义jq的核心方法
    function jQuery(selector) {
        return new jQuery.fn.init(selector);
    }

    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        init: function (selector) {

            splice.call(this, 0, this.length);
            if(selector == null) return this;

            if(jQuery.isString(selector)){
                push.apply(this, Sizzle(selector));
            }else {
                this[0]=selector;
                this.length=1;
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

		var i;

            if(isLikeArray(array)){
                for (i = 0; i < array.length; i++) {

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
            return this;
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
            return this;
        }

    });

    //css模块
    jQuery.fn.extend({
        css: function () {

            var len = arguments.length;

            if (len == 0) return this;
            var arg0 = arguments[0];
            var arg1 = arguments[1];

            if (len == 1) {
                if (jQuery.isString(arg0)) {

                    var firstDom = this[0];
                    var styles = window.getComputedStyle(firstDom, null);
                    return styles[arg0];
                } else {
                    return this.each(function () {

                        var dom = this;

                        jQuery.each(arg0, function (styleName, styleValue) {
                            dom.style[styleName] = styleValue;
                        });
                    });

                }
            } else {

                return this.each(function () {
                    this.style[arg0] = arg1;
                })
            }
        },

        show:function(){
            return this.css('display','block');
        },

        hide:function(){
            return this.css('display','none');
        },

        toggle:function(){
            this.each(function(){
                var $dom = $(this);
                if($dom.css('display') === 'none'){
                    $dom.show();
                }else{
                    $dom.hide();
                }
            });
        }
    });

    //dom操作
    jQuery.fn.extend({

        get:function(){
            if(arguments.length == 0){
                return jQuery.makeArray(this);
            }else {
                var arg0 = arguments[0];
                if(arg0 >= 0){
                    return this[arg0];
                }else {
                    return this[this.length + arg0];
                }
            }
        },

        first:function(){
            var firstDom = this.get(0);
            return jQuery(firstDom);
        },

        last:function(){

            var lastDom = this.get(-1);
            return jQuery(lastDom);
        },

        eq:function(index){
            var dom = this.get(index);
            return jQuery(dom);
        },

        find:function(selector){
            var $ = jQuery();

            this.each(function(){
                var dom=this.querySelectorAll(selector);
                jQuery.merge($,dom);
            });

            return $;
        }
    });

    window.jQuery = window.$ = jQuery;
})(window);
