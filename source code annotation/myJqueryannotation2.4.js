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
                //判断传入的字符串是符合标签规则的 文本，还是一个普通的字符串
                if(selector[0]==="<" && selector[selector.length-1]===">" && selector.length>=3){
                    //selector是一个html标签-->将这一段html标签转换为DOM元素
                    //dom.innerHTML="html标签"
                    //要找到一个dom元素，就不能使用HTML页面中已经存在的标签，可以在内存中创建出这样的DOM元素
                    var div=document.createElement("div");
                    div.innerHTML=selector;//这一行代码执行完毕，div就会拥有一系列的子节点

                    //将div的子节点遍历追加到this中
                    //div.childNodes：获取到所有的子节点

                    var nodes=div.childNodes;
                    push.apply(this,nodes);
                }else{
                    //借用数组的push，把获取到的dom元素包装成一个数组，并保存在this中
                    push.apply(this, Sizzle(selector));
                    //为了可以使用链式编程，返回调用该方法的对象。
                }
            }else if(selector.nodeType) {  //判断selector是不是一个dom元素,?的话默认是jq对象

                //如果传入一个dom对象，就把他包装成jq对象，即伪数组
                this[0]=selector;
                this.length=1;
            }else{
                //如果传入jq对象，直接添加到this中返回
                jQuery.merge(this,selector);
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

    //工具类
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
        },

        /**
         * 获取dom兄弟元素
         * @param dom
         * @returns {Array}
         */
        siblingsElement: function (dom) {
            var result = [];
            var parent = dom.parentNode;
            var children = parent.childNodes;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.nodeType == 1 && child !== dom) {
                    result.push(child);
                }
            }

            return result;
        },
        /**
         * （利用递归）获取下一个兄弟元素
         * @param dom
         * @returns {*}
         */
        nextSiblingElement: function (dom) {
            var next = dom.nextSibling;

            if (next == null) return null;
            if (next.nodeType == 1) return next;

            return jQuery.nextSiblingElement(next);
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
        },

        insert:function(parent,child,isAppend){
            /*
             * insert是一个工具类，可以将child元素插入parent父元素的开始或者结尾
             * 当 isAppend为true时，将child插入到父元素最前面，为false时插入到父元素最后面
             * */

            /*将接受到的参数统一处理成jq对象
             * */
            var $parent = jQuery(parent);
            var $child = jQuery(child);
            /*
             * 遍历每一个父元素
             * */
            $parent.each(function(){
                /*
                 * 将每一个父元素的第一个子元素存起啦
                 * */
                var parent = this;
                var firstChild = parent.firstChild;
                $child.each(function(){
                    /*
                     * 遍历每一个子元素并添加到父元素中
                     * */
                    var child = this;
                    //当isAppend为true是返回appendChild字符串，并执行此方法
                    //当isAppend为false时，返回insertBefore字符串，并执行此方法
                    var fnName = isAppend?'appendChild':'insertBefore';
                    parent[fnName](child.cloneNode(true),firstChild);
                });
            });
        },

        append:function(){
            /*
            * 调用方式：父元素.append（子元素）
            * 将子元素追加到父元素的末尾
            * */
            var parent = this;
            var child = arguments[0];
            this.insert(parent,child,true)
            return this;
        },

        appendTo:function(){
            /*
             * 调用方式：子元素.appendTo（父元素）
             * 将子元素追加到父元素的末尾
             * */
            var parent = arguments[0];
            var child = this;
            this.insert(parent,child,true);
            return this;
        },

        prepend:function(){
            /*
             * 调用方式：父元素.prepend（子元素）
             * 将子元素追加到父元素的最开始
             * */
            var child = arguments[0];
            this.insert(this,child);
            return this;
        },

        prependTo:function(){
            /*
             * 调用方式：子元素.prependTo（父元素）
             * 将子元素追加到父元素的最开始
             * */
            var child = this;
            var parent = arguments[0];
            this.insert(parent,child);
            return this;
        },

        remove:function(){
            //父元素.remove（子元素）
            //原生JS：父元素.removeChild(子元素)
            //子元素：存放于this中，需要遍历this获取每一个子元素
            //父元素：根据子元素的parentNode，从而获取父元素
            this.each(function(){
                var child = this;
                var parent = child.parentNode;
                parent.removeChild(child);
            });
        },

        before:function(){
            /*
             * 调用方式：
             * nextSibline.before(prevSibling)
             *
             * 将一个元素作为兄弟元素插在某元素前面
             * 因为next是已知的，prev是要插入的元素-->实现将prev插入到next之前
             * 原生JS：父节点.insertBefore(prev,next)
             * 要找到父节点，因为next是已知的，可以通过next.parentNode找到他们的父节点
             * (但是prev不行，因为prev是要插入的节点，它暂时没有父节点)
             * */
            var $previousSibling = jQuery(arguments[0]);
            var $next = jQuery(this);
            //遍历每一个父元素
            $next.each(function(){
                var next = this;
                //遍历每一个子元素把他们添加到父元素中
                $previousSibling.each(function(){
                    var prev = this;
                    var parent = next.parentNode;
                    parent.insertBefore(prev.cloneNode(true),next);
                });
            });

            return this;
        },

        after:function(){
            /*
             * previousSibling.after(nextSibling)
             * 把某元素作为兄弟节点插入到某元素后面
             *
             * 利用原生js中的   父元素.insertBefore(子元素)进行封装
             *
             * 找到previousSibling的下一个兄弟节点，在他下一个兄弟节点之前插入节点，就是在他后面插入节点了
             *
             * */
            var $prev = $(this);
            var $next = $(arguments[0]);
            $prev.each(function(){
                var prev = this;
                var nextSibling = this.nextSibling;
                var parent = prev.parentNode;
                $next.each(function(){
                    var next = this;
                    //已知的是prev，要将next插入到prev之后，实际上就是要将next插入
                    // 到prev的下一个兄弟节点的前面
                    parent.insertBefore(next.cloneNode(true),nextSibling);

                });
            });
            return this;
        },

        //2.4
        /**
         * 当不传入参数(或者传入undefined)的时候，获取this中第一个dom元素内部的html内容
         * 当传入一个参数，遍历this中所有的dom元素，设置他们的html内容
         * @param arg
         * @returns {*}
         */
        html: function (arg) {
            if (arg === undefined) {
                return this[0].innerHTML;
            }
            return this.each(function () {
                var dom = this;
                dom.innerHTML = arg;
            });
        },
        /**
         * a: 当不传入参数或者传入undefined时，获取this中所有dom元素内部的文本，并返回
         * b: 当传入参数时，设置this中所有的dom元素内部的文本，其中传入null和‘’都会清空元素的内容
         *    最后返回 this实现链式编程
         * @param text
         * @returns {*}
         */
        text: function (text) {
            var str = '';
            this.each(function () {
                if (text === undefined) {
                    str += this.innerText;
                    return;
                }
                this.innerText = text;
            });

            return text === undefined ? str : this;
        },
        /**
         * 调用方式： $('xxx').siblings(filter);
         * 功能描述：
         *       a:不传入参数的时，返回this的所有兄弟元素，并返回
         *       b:传入参数时，寻找节点名字叫做filter的兄弟元素，并返回
         * @param filter
         * @returns {*}
         */
        siblings: function (filter) {

            var $siblings = jQuery();
            this.each(function () {
                var dom = this;
                var sibs = jQuery.siblingsElement(dom);
                jQuery.merge($siblings, sibs);
            });


            if (!filter) {

                return $siblings;
            }
            var $result = jQuery();
            var $filter = jQuery(filter);
            var doms = []; //存放筛选后的dom元素
            $siblings.each(function () {
                var sibling = this;
                $filter.each(function () {
                    var filter = this;
                    if (sibling == filter) {
                        doms.push(sibling);
                    }
                });
            });
            return jQuery.merge($result, doms);
        },

        /**
         *
         * 调用方式：$('xxx').next()
         *  要获取到每一个元素的下一个兄弟元素
         * @param filter
         * @returns {*}
         */
        next: function (filter) {

            var $next=jQuery();
            var nexts=[];
            this.each(function(){
                var dom=this;

                var nextElement=jQuery.nextSiblingElement(dom);

                nexts.push(nextElement);

            });
            //将nexts中的元素遍历追加到$next中
            jQuery.merge($next,nexts);

            if(!filter) return $next;

            var arr2=[];//存放所有筛选后的元素
            var $filter=jQuery(filter);
            $next.each(function(){
                var next=this;
                $filter.each(function(){
                    var filter=this;
                    if(next==filter){
                        arr2.push(next);
                    }
                })
            });

            return jQuery.merge(jQuery(),arr2);

        }
    });

    //属性模块
    jQuery.fn.extend({
        attr:function(){
            /*
             * 功能描述：
             *   a、不传入参数时，直接返回this以便实现链式编程
             *   b、传入一个参数时：
             *       1、当初入一个字符串时，获取this中第一个dom的某属性的值
             *       2、当传入一个对象时，设置this中多个dom的多个属性的值
             *   c、传入2个参数时，设置this中所有dom元素某属性的值
             * */
            var len = arguments.length;
            var arg0 = arguments[0];
            var arg1 = arguments[1];
            if(len == 0) return this;
            if(len == 1){
                if(jQuery.isString(arg0)){
                    var firstDom = this.get(0);
                    return firstDom.getAttribute(arg0);
                }else{
                    return this.each(function(){
                        var dom = this;
                        jQuery.each(arg0,function(styleName,styleValue){
                            dom.setAttribute(styleName,styleValue);
                        });
                    });
                }
            }else{
                return this.each(function(){
                    var dom = this;
                    dom.setAttribute(arg0,arg1);
                });
            }
        }
    });

    //暴露两个全局变量，可以访问 jq中的方法
    window.jQuery = window.$ = jQuery;
})(window);
