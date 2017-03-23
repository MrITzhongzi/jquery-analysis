/**
 * Created by lihongwei on 2017/3/17.
 */


(function (window) {
    var arr = [];
    var push = arr.push;
    var splice = arr.splice;
    var slice = arr.slice;

    var types = "Number String Boolean Array RegExp Function Math Date Object".split(" ");
    var class2type = {};
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        class2type["[object " + type + "]"] = type.toLowerCase();
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
            if (selector == null) return this;

            if (jQuery.isString(selector)) {
                if (selector[0]==="<" && selector[selector.length-1]===">" && selector.length>=3) {
                    var div = document.createElement('div');
                    div.innerHTML = selector;
                    var nodes = div.childNodes;
                    push.apply(this,nodes);
                } else {
                    push.apply(this, Sizzle(selector));
                }
            } else if (selector.nodeType) {
                this[0] = selector;
                this.length = 1;
            } else {
                jQuery.merge(this, selector)
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

    function isLikeArray(array) {
        var len = array.length
        return typeof len == 'number' && len >= 0 && len - 1 in array
    }
    /*
    * 工具类
    * */
    jQuery.extend({
        each: function (array, callback) {

            var i;

            if (isLikeArray(array)) {
                for (i = 0; i < array.length; i++) {

                    var result = callback.call(array[i], i, array[i]);
                    if (result === false) {
                        break;
                    }
                }
            } else {
                for (i in array) {
                    var result = callback.call(array[i], i, array[i]);
                    if (result === false) {
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

        type: function (data) {

            return data == null ?
                String(data) :
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

        makeArray: function (data) {

            if (isLikeArray(data)) {
                return $.merge([], data);
            } else {
                return [data];
            }
        },

        trim: function (str) {
            return str.replace(/^\s+|\s+$/g, "");
        },

        //2.4

        siblingsElement: function (dom) {
            /*
             * 获取dom兄弟元素
             * */
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

        nextSiblingElement: function (dom) {
            /*
             * （利用递归）获取下一个兄弟元素
             * */
            var next = dom.nextSibling;

            if (next == null) return null;
            if (next.nodeType == 1) return next;

            return jQuery.nextSiblingElement(next);
        },

        //2.5
        valHooks:{
            /*
             * 为val（）方法设置的表单标签的get和set方法，使表单的代码更具有语义性
             * */
            input:{
                get:function(dom){
                    return dom.value;
                },
                set:function(dom,value){
                    if (dom.type == 'checkbox' || dom.type == 'radio') {
                        if (dom.value == value) {
                            dom.checked = true;
                        }
                    } else {
                        dom.value = value;
                    }
                }
            },
            option:{
                get:function(dom){
                    return dom.value || dom.innerText;
                },
                set:function(dom,value){
                    dom.value = value;
                }
            },
            select:{
                get:function(dom){
                    if (!dom.multiple) {
                        return dom.value;
                    }

                    var result = [];
                    var options = dom.getElementsByTagName('option');
                    jQuery.each(options, function (i, option) {
                        if (option.selected) {
                            result.push(option.value || option.innerText);
                        }
                    });

                    return result;
                },
                set:function(dom,value){
                    var isExist = false;

                    var options = dom.getElementsByTagName('option');
                    jQuery.each(options,function(i,option){
                        if(option.value == value){
                            option.selected = true;

                            isExist = true;
                        }
                    });
                    if(!isExist) dom.selectedIndex = -1;
                }
            }
        }
    });

    jQuery.fn.extend({
        each: function (callback) {
            jQuery.each(this, callback);
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

        show: function () {
            return this.css('display', 'block');
        },

        hide: function () {
            return this.css('display', 'none');
        },

        toggle: function () {
            this.each(function () {
                var $dom = $(this);
                if ($dom.css('display') === 'none') {
                    $dom.show();
                } else {
                    $dom.hide();
                }
            });
        }
    });

    //dom操作
    jQuery.fn.extend({

        get: function () {
            if (arguments.length == 0) {
                return jQuery.makeArray(this);
            } else {
                var arg0 = arguments[0];
                if (arg0 >= 0) {
                    return this[arg0];
                } else {
                    return this[this.length + arg0];
                }
            }
        },

        first: function () {
            var firstDom = this.get(0);
            return jQuery(firstDom);
        },

        last: function () {

            var lastDom = this.get(-1);
            return jQuery(lastDom);
        },

        eq: function (index) {
            var dom = this.get(index);
            return jQuery(dom);
        },

        find: function (selector) {
            var $ = jQuery();

            this.each(function () {
                var dom = this.querySelectorAll(selector);
                jQuery.merge($, dom);
            });

            return $;
        },

        insert: function (parent, child, isAppend) {
            var $parent = jQuery(parent);
            var $child = jQuery(child);
            $parent.each(function () {

                var parent = this;
                var firstChild = parent.firstChild;
                $child.each(function () {

                    var child = this;

                    var fnName = isAppend ? 'appendChild' : 'insertBefore';
                    parent[fnName](child.cloneNode(true), firstChild);
                });
            });
        },

        append: function () {
            var parent = this;
            var child = arguments[0];
            this.insert(parent, child, true)
            return this;
        },

        appendTo: function () {
            var parent = arguments[0];
            var child = this;
            this.insert(parent, child, true);
            return this;
        },

        prepend: function () {
            var child = arguments[0];
            this.insert(this, child);
            return this;
        },

        prependTo: function () {
            var child = this;
            var parent = arguments[0];
            this.insert(parent, child);
            return this;
        },

        remove:function(){
            this.each(function(){
                var child = this;
                var parent = child.parentNode;
                parent.removeChild(child);
            });
        },

        before:function(){
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

            var $prev = $(this);
            var $next = $(arguments[0]);
            $prev.each(function(){
                var prev = this;
                var nextSibling = this.nextSibling;
                var parent = prev.parentNode;
                $next.each(function(){
                    var next = this;
                    parent.insertBefore(next.cloneNode(true),nextSibling);

                });
            });
            return this;
        },

        //2.4

        html: function (arg) {
            /*
             * 当不传入参数(或者传入undefined)的时候，获取this中第一个dom元素内部的html内容
             * 当传入一个参数，遍历this中所有的dom元素，设置他们的html内容
             *
             * */
            if (arg === undefined) {
                return this[0].innerHTML;
            }
            return this.each(function () {
                var dom = this;
                dom.innerHTML = arg;
            });
        },

        text: function (text) {
            /*
             * a: 当不传入参数或者传入undefined时，获取this中所有dom元素内部的文本，并返回
             * b: 当传入参数时，设置this中所有的dom元素内部的文本，其中传入null和‘’都会清空元素的内容
             *    最后返回 this实现链式编程
             * */
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

        siblings: function (filter) {
            /*
             * 调用方式： $('xxx').siblings(filter);
             * 功能描述：
             *       a:不传入参数的时，返回this的所有兄弟元素，并返回
             *       b:传入参数时，寻找节点名字叫做filter的兄弟元素，并返回
             * */

            var $siblings = jQuery();
            this.each(function () {
                var dom = this;
                var sibs = jQuery.siblingsElement(dom);

                jQuery.each(sibs, function () {
                    var dom2 = this;
                    if ($siblings.indexOf(dom2) == -1) {
                        [].push.call($siblings,dom2);
                    }
                });
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

        next: function (filter) {
            /*
             * 调用方式：$('xxx').next()
             * */
            //要获取到每一个元素的下一个兄弟元素

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

        },

        //2.5
        indexOf: function (dom) {
            /*
             * 父元素.indexOf（子元素）
             * 判断子元素是否在父元素中，有的话返回索引，没有的话返回-1
             * */
            var index = -1;
            this.each(function (i) {
                if (this == dom) {
                    index = i;
                    return false;
                }
            });
            return index;
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
        },

        removeAttr: function (attrName) {
            return this.each(function () {
                var dom = this;
                dom.removeAttribute(attrName);
            });
        },

        prop: function () {
            var length = arguments.length;
            var arg0 = arguments[0];
            var arg1 = arguments[1];

            //1、参数个数为0：
            if (length == 0) return this;

            //2、参数个数为1；
            if (length == 1) {
                if (jQuery.isString(arg0)) {
                    //2.1、参数是字符串类型：获取第一个DOM元素的指定属性
                    var firstDom = this.get(0);
                    //2.2、获取该DOM元素的指定属性：原生JS：dom.getAttribute("属性名称")
                    return firstDom[arg0];

                } else {
                    //2.2、参数是其他类型（当成对象来处理） $("div").attr({ tag:10 })
                    return this.each(function () {
                        var dom = this;
                        jQuery.each(arg0, function (attrName, attrValue) {
                            dom[attrName] = attrValue;
                        })
                    })
                }
            } else {
                //3、参数个数>1：-->设置单个属性 $("div").attr("tag","10")
                return this.each(function () {
                    var dom = this;
                    dom[arg0] = arg1;
                });
            }

        },

        //2.5

        removeProp: function (propName) {
            return this.each(function () {
                var dom = this;
                delete dom[propName];
            });
        },

        hasClass: function (className) {
            //只要有一个元素存在指定的类名，就返回true
            //如果每一个元素都不存在该类名，就返回false
            var isExist = false;
            className = ' ' + className + ' ';
            this.each(function () {

                //要判断dom是否存在指定的类名
                //类名的判定条件：
                //1、该类名左边是字符串边界，右边是空格 class="a b"-->认为存在a类名
                //2、左边是空格，右边是字符串边界，class="a b"-->认为存在b类名
                //3、左右两边都是空格，class=" b "-->认为存在类名b

                //如果给class属性的值补充一个空格，要判断dom是否存在该类名，那么必须左右两边都是空格

                var dom = this;
                //判断dom元素是否存在该类名
                var classNameStr = ' ' + dom.className + ' ';
                if (classNameStr.indexOf(className) >= 0) {
                    isExist = true;
                    return false;
                }

            });
            return isExist;
        },

        addClass: function (str) {
            var classNames = str.split(' ');

            return this.each(function () {
                var dom = this;
                jQuery.each(classNames, function (i, v) {
                    if (!jQuery(dom).hasClass(v)) {
                        dom.className += ' ' + v;
                    }
                });
            });
        },

        removeClass: function (str) {
            if (arguments.length == 0) {
                return this.each(function () {
                    var dom = this;
                    dom.className = '';
                });
            }

            var classNames = str.split(' ');
            return this.each(function () {
                var dom = this;
                var domClassNameChange = ' ' + dom.className + ' ';
                jQuery.each(classNames, function (i, v) {
                    var singleNameChange = ' ' + v + ' ';
                    domClassNameChange = domClassNameChange.replace(singleNameChange, ' ');
                });
                dom.className = domClassNameChange;
            });
        },

        toggleClass: function (str) {
            var classNames = str.split(' ');

            return this.each(function () {
                var $dom = jQuery(this);
                jQuery.each(classNames, function (i, v) {
                    if ($dom.hasClass(v)) {
                        $dom.removeClass(v);
                    } else {
                        $dom.addClass(v);
                    }
                });
            });
        },

        val: function (value) {

            //如果value为undefined说明用户没有传入参数，获取属性
            if (!value) {
                var firstDom = this.get(0);
                var nodeName = firstDom.nodeName.toLowerCase();

                return jQuery.valHooks[nodeName].get(firstDom);
            }

            //设置数值
            return this.each(function () {
                var dom = this;
                var nodeName = this.nodeName.toLowerCase();

                jQuery.valHooks[nodeName].set(dom,value);
            });
        }
    });

    /*
     * jq事件封装原理：
     *   将所有的时间的名字都保存在一个字符串里，然后用 空格分割一下存到数组中，然后遍历数组中每一个元素
     *   给jq。fn添加方法
     * */

    var eventTypes = "click dblclick mouseenter mouseleave mouseover mouseout mousemove keydown keyup keypress load".split(" ");
    jQuery.fn.extend({
        on: function (type, callback) {
            return this.each(function () {
                var dom = this;
                dom.addEventListener(type, callback)
            });
        }
    });

    jQuery.each(eventTypes, function (i, eventType) {
        jQuery.fn[eventType] = function (callback) {
            return this.on(eventType, callback);
        }
    });

    window.jQuery = window.$ = jQuery;
})(window);
