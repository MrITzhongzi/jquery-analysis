/**
 * Created by Administrator on 2017/3/17.
 */

    //利用自执行函数封装jq代码，避免暴露太多的全局变量
(function (window) {
    //为了以后能方便借用数组的各种方法，提前存到变量中，全局都是用这一个数组，节约空间
    var arr = [];
    var push = arr.push;
    var splice = arr.splice;
    var slice = arr.slice;

    //判断是数据类型准备的数据
    var types="Number String Boolean Array RegExp Function Math Date Object".split(" ");
    var class2type={};//{ "[object Xxxx]":"xxxx" }
    for (var i = 0; i < types.length; i++) {
        var type = types[i];//type是大写的类型名称
        class2type["[object "+type+"]"]=type.toLowerCase();//class2type["[object Number]"]="number"
    }



    //模拟jQuery中的Sizzle引擎，利用选择器获取元素
    function Sizzle(seletcor) {
        return document.querySelectorAll(seletcor);
    }

    //定义jq的核心方法
    function jQuery(selector) {
        //创建jq函数原型中的F的实例，因为后面将 init函数(初始化函数)的原型指向了 jq的原型（核心操作），所以所有F的实例都可以
        //访问jq中的方法
        return new jQuery.fn.init(selector);
    }

    //使用原型替换，给jq定义原型，并且把jq原型的索引复制给jQuery.fn，即  jQuery.prototype == jQuery.fn
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        //定义初始化函数
        init: function (selector) {
            //为了把获取到的dom元素，并把获取到的dom元素包装成一个数组，并保存在this中
            //借用数组的splice方法，清空this最终存储的属性
            splice.call(this, 0, this.length);
            //借用数组的push，把获取到的dom元素包装成一个数组，并保存在this中
            push.apply(this, Sizzle(selector));
            //为了可以使用链式编程，返回调用该方法的对象。
            //解析：一、如果是方法调用模式，this指向调用该方法的对象，return this从而实现链式编程
            //     二、如果是构造函数调用，默认返回this，return this和不返回没什么区别。
            return this;
        },
        //模仿jq中的css方法，设置dom的样式
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
    //核心操作 核心操作 核心操作  让init的原型指向 jquery的原型，这样，任何init的实例，都可以访问
    // jq原型中的所有方法
    jQuery.fn.init.prototype = jQuery.fn;

    /**
     * 判断array是否是数组或者伪数组
     * @param array
     * @returns {boolean}
     */
    function isLikeArray(array){
        var len = array.length
        return typeof len == 'number' && len >= 0 && len - 1 in array
    }

    //增加each方法
    jQuery.extend({
        each: function (array,callback) {
            //利用if判断array是一个数组和伪数组，还是 一个键值对的对象，如果是数组，伪数组，用for循环遍历
            //如果是对象，用for in遍历
            if(isLikeArray(array)){
                for (var i = 0; i < array.length; i++) {
                    //采用上下文调用模式，让函数内部的指针指向遍历的那个元素，这样，当遍历dom元素的时候，
                    // 可以不用穿参数，直接使用this代替
                    var result = callback.call(array[i],i,array[i]);
                    //满足某条件的时候跳出循环
                    if(result === false){
                        break;
                    }
                }
            }else{
                for (i in array) {
                    //else内部的逻辑和if内的逻辑相同。
                    var result = callback.call(array[i],i,array[i]);
                    if(result === false){
                        break;
                    }
                }
            }

        },

        //判断是否是字符串类型
        isString: function (str) {
            return typeof str === 'string';
        },

        //判断是否是函数类型
        isFunction: function (fn) {
            return typeof fn === 'function';
        },

        //因为浏览器已经在ES5中原生支持了Array.isArray方法，在ES5之前没有该方法(Array.isArray值为undefined)
        isArray: Array.isArray || function (array) {
            return Object.prototype.toString.call(array) == '[object Array]';
        },

        /**
         * @param data
         * return 字符串的值，是该数据的数据类型的名称的小写格式
         */
        type:function(data){
            //1、检测数据额类型
            //var result=Object.prototype.toString.call(data);//"[object Xxxx]"
            // //2、发现result正好就是class2type中的属性名称，而type方法的返回值也就是class2type的属性值
            //  return class2type[result];

            //简化后：
            //return class2type[Object.prototype.toString.call(data)];
            //因为 Object.prototype.toString.call对于 null和undefined的判断是在ES5之后加入的，
            // 为了兼容之前的版本，将null和undefined拿出来单独判断。 undefined == null 为true。
            //String()可以将null和undefined转换为字符串类型的 null和undefined。
            return data == null?
                    String(data):
                    class2type[Object.prototype.toString.call(data)];
        },

        /**
         *merge方法将一个数组或者伪数组的值依次添加到另一个数组或者伪数组中
         * @param target 数组 or 伪数组
         * @param source 数组 or 伪数组
         * @returns {*}
         */
        merge: function (target, source) {
            var len = target.length;
            for (var i = 0; i < source.length; i++) {
                target[len] = source[i];
                len++;
            }
            target.length = len;

            return target;
        },

        /**
         *将参数转换为数组
         * 1、参数是数组 or 伪数组-->直接转换为数组
         * 2、其他情况——>将参数当成一个整体放到一个数组中
         * @param data
         * @returns {*}
         */
        makeArray:function(data){

            if(isLikeArray(data)){
                return $.merge([],data);
            }else{
                return [data];
            }
        },

        /**
         * 去除字符串左右两边的空格
         * @param str
         * @returns {XML|void|string}
         */
        trim:function(str){
            return str.replace(/^\s+|\s+$/g,"");
        }
    });

    jQuery.fn.extend({
        each:function(callback){
            jQuery.each(this,callback);
        }
    });

    //暴露两个全局变量，可以访问 jq中的方法
    window.jQuery = window.$ = jQuery;
})(window);
