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

            if(selector == null) return this;//选择器为undefined或null时，直接返回


            //判断传入的是一个选择器还是一个dom对象
            if(jQuery.isString(selector)){
                //借用数组的push，把获取到的dom元素包装成一个数组，并保存在this中
                push.apply(this, Sizzle(selector));
                //为了可以使用链式编程，返回调用该方法的对象。
            }else {
                //暂且认为selector是一个DOM元素--->{ 0:selector,length:1 }
                //如果传入一个dom对象，就把他包装成jq对象，即伪数组
                this[0]=selector;
                this.length=1;
            }

            //解析：一、如果是方法调用模式，this指向调用该方法的对象，return this从而实现链式编程
            //     二、如果是构造函数调用，默认返回this，return this和不返回没什么区别。
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

    //增加each方法 和类型判断方法
    jQuery.extend({
        each: function (array,callback) {

		var i;
            //利用if判断array是一个数组和伪数组，还是 一个键值对的对象，如果是数组，伪数组，用for循环遍历
            //如果是对象，用for in遍历
            if(isLikeArray(array)){
                for (i = 0; i < array.length; i++) {
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
            return this;
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
            return this;
        }

    });

    //css模块
    jQuery.fn.extend({
        css: function () {
            /*
             *传入一个参数 的时候：
             *      当这个参数是字符串的时候，直接获取第一个dom的该样式的值，并返回
             *       当这个参数是对象的时候，循环遍历obj，为每个dom设置响应的属性
             *当传入二个参数的时候，遍历所有的dom，给响应的dom设置响应的样式
             *
             * */

            /*
             * 保存css传入实参的长度（个数）
             * */
            var len = arguments.length;

            /*
             * 如果没有传入参数的话，返回原jq对象，即this，以便实现链式编程
             * */
            if (len == 0) return this;
            /*
             * 把传入css的参数中的前两个取出来，其他的忽略。
             *
             * */
            var arg0 = arguments[0];
            var arg1 = arguments[1];
            /*
             * 传css的实参的个数为一个的时候判断一下传入的是字符串，还是对象
             * 如果是字符串，则遍历this中的每一个dom元素，给他们设置这个样式。
             * 如果是对象，则先遍历此对象，在遍历过程中给this中的每个dom元素设置此属性。
             *
             * */
            if (len == 1) {
                if (jQuery.isString(arg0)) {
                    //this是init的实例，保存了获取到的所有的dom元素，是个伪数组，
                    // 在传入一个字符串时，默认获取第一个dom元素的该属性
                    var firstDom = this[0];
                    var styles = window.getComputedStyle(firstDom, null); //获取某dom元素计算后的样式
                    //styles中存储了firstDom的所有的样式，取出我们需要的样式，即arg0
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

                /*
                 * 如果传入的是两个参数，则遍历this中所有的dom元素，给他们设置此样式（设置单个样式）
                 * */
                return this.each(function () {
                    this.style[arg0] = arg1;
                })
            }
        },
        /*
         * 设置元素显示
         * */
        show:function(){
            return this.css('display','block');
        },
        /*
         * 设置元素隐藏
         * */
        hide:function(){
            return this.css('display','none');
        },
        /*
         * 设置元素显示或者隐藏
         * */
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
            //1、没有参数：返回值是将F的实例转换为真数组
            //2、有参：
            //      参数为非负数：直接返回F的实例中指定索引的DOM元素
            //      参数为负数：返回倒数第几个元素
            if(arguments.length == 0){
                //调用makeArray函数 把调用该方法的对象或者伪数组转换成真数组
                return jQuery.makeArray(this);
            }else {
                //取出第一个传去的实参
                var arg0 = arguments[0];
                if(arg0 >= 0){
                    return this[arg0];
                }else {
                    return this[this.length + arg0];
                }
            }
        },

        first:function(){
            //获取jq对象中的第一个dom元素，并包装成jq对象返回
            //获取第一个Dom元素
            var firstDom = this.get(0);
            //将获取到的Dom元素转换成jQ对象，并返回
            return jQuery(firstDom);
        },

        last:function(){
            //获取jq对象中的最后一个dom元素，并包装成jq对象返回
            var lastDom = this.get(-1);
            return jQuery(lastDom);
        },

        eq:function(index){
            //获取jq对象中索引为index的dom对象，并包装成jq对象返回
            var dom = this.get(index);
            return jQuery(dom);
        },

        find:function(selector){
            //希望查找this中这些DOM元素的下面的符合指定条件的子元素，由这些子元素构成一个jquery对象

            //实现思路：应该需要首先遍历出每一个div；然后遍历出每一个div的子元素
            var $ = jQuery();

            this.each(function(){
                var dom=this.querySelectorAll(selector);
                jQuery.merge($,dom);
            });

            return $;
        }
    });

    //暴露两个全局变量，可以访问 jq中的方法
    window.jQuery = window.$ = jQuery;
})(window);
