/**
 * Created by lihongwei on 2017/3/15.
 */

    //利用自执行函数封装jq代码，避免暴露太多的全局变量
(function (window) {
    //为了以后能方便借用数组的各种方法，提前存到变量中，全局都是用这一个数组，节约空间
    var arr = [];
    var push = arr.push;
    var splice = arr.splice;
    var slice = arr.slice;
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
            splice.call(this,0,this.length);
            //借用数组的push，把获取到的dom元素包装成一个数组，并保存在this中
            push.apply(this,Sizzle(selector));
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
    //jq中的extend方法是jq的非常核心的一个方法，在 jQuery和jQuery.prototype中都有这个方法的索引
    //entend方法使用示例：
    /*
     * 往jquery的原型中添加方法时，利用extend的特性。
     *
     * jQuery.extend({
     *   each:function(){},
     *   type:function(){},
     *   isString:function(){}
     * });
     *
     * jQuery中的工具方法一般加到jQuery中
     * jQuery中操作dom的方法一把加到jQuery.prototype中
     *
     * */

    /*
     * jq中比较核心的extend方法解析：
     *
     *
     * jQuery.extend();传入一个对象的话，就吧这个对象的属性加到jQuery上
     * jQuery.extend();传入多个对象的话，就把第2,3,4等等个对象，依次追加到第一个对象上
     *
     * jQuery.fn.extend():传入一个对象的话，就吧这个对象的属性加到jQuery.fn上
     * jQuery.fn.extend():传入多个对象的话，就把第2,3,4等等个对象，依次追加到第一个对象上
     *
     * */
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
    //暴露两个全局变量，可以访问 jq中的方法
    window.jQuery = window.$ = jQuery;
})(window);