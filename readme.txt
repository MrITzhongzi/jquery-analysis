source code中存放的是封装的jquery源代码。
	其中包括一个myJquery1.0.js和一个介绍的readme.txt文件

source code annotation 中存放的是jquery源代码的解析，注释和说明。
	其中包括一个myJqueryannotation1.0.js和readme.txt介绍文件

test文件夹存放的是测试我封装的jQuery框架。
	其中包括myJquery1.0.js和一个测试的test.html文件




*********************************************************************************

jQuery的初始化方法 init的设计思路：

1、清空之前的DOM元素
    2、排除了selector为null/undefined--->直接返回
    3、判断selector的类型
      3.1、如果selector是字符串类型
          3.1.1、判断selector是否是html标签
              3.1.1.1、如果是，当成html标签来处理
                  a、在内存中创建了一个div标签
                  b、设置div标签的内容(innerHTML)
                  c、获取div标签的子节点(div.childNodes)
                  d、将这些子节点遍历追加到this中
              3.1.1.2、如果不是，当成选择器来处理
                  a、通过选择器函数来获取元素，将结果保存在elements中
                  b、将elements中的每一个元素遍历追加到this中
      3.2、selector是其他类型
          3.2.1、认为sleector是一个DOM元素，将该DOM元素添加到this中
              a、this[0]=selector this.length=1
    4、返回this
*********************************************************************************

1.0版本


搭建了jQUery框架，并添加了核心方法jQuery.extend  jQuery.fn.extend.
，也填了css方法， 和Sizzle引擎。


**********************************************************************************
2.0版本
******1、$中增加了each方法，

******2、增加了工具类 isString ,isFuncton, isArray, type

******3、增加了makeArray 方法 ，增加了merge方法

******4、增加了公共方法 isLikeArray

******5、增加了 trim方法



************************************************************************************
2.1版本 增加了css模块

1、i:删除了jQ.fn中原来的测试的css方法，增加了 和jq完全相同的css方法。
   ii:新css方法说明：
        传入一个参数时，a:如果是一个字符串获取该样式的值。
                  b:如果传入了一个对象，则遍历该对象，同时，遍历每个dom元素，给每个dom设置对象中的属性值
        传入两参数时： 遍历每个dom元素，给每个dom元素设置相应的样式

2、需要在 each方法中增加 返回值this，以便实现链式编程。

3、在jq的初始化方法中增加了  判断条件，判断传入的是一个选择器还是一个dom元素，传入选择器，返回一个jQ的伪数组对象，传入dom元素的话，把他包装成一个jq伪数组对象。

3、增加show方法，hide方法，以及toggle方法让元素显示或者隐藏



************************************************************************************
2.2 Dom模块

1、增加了 get方法
          //1、没有参数：返回值是将F的实例转换为真数组
         //2、有参：
         //      参数为非负数：直接返回F的实例中指定索引的DOM元素
         //      参数为负数：返回倒数第几个元素
    first方法
        //获取jq对象中的第一个dom元素，并包装成jq对象返回
    last方法
         //获取jq对象中的最后一个dom元素，并包装成jq对象返回
    eq方法
        //获取jq对象中索引为index的dom对象，并包装成jq对象返回

2、增加了find方法
        //希望查找this中这些DOM元素的下面的符合指定条件的子元素，由这些子元素构成一个jquery对象

         //实现思路：应该需要首先遍历出每一个div；然后遍历出每一个div的子元素

************************************************************************************************************

    2.3  增加了Dom方法，改进了css选择器

1、增加了一个jq初始化方法init选择器的判断，区分传入普通的字符串和符合标签文本的字符串做出不同的操作。
    a、传入普通的字符串作为选择器时，直接找到符合规则的dom并把它们包装成一个jq对象返回。
    b、传入符合html的标签是，首先在内存中创建一个dom元素，用innerHTML方法把传入的html结构添加到该dom中，
        然后用querySelectorAll（），查找符合选择器的dom元素，存储在this中（借用数组的push方法）

    增加了init对于传入 jq对象的判断，如果传去一个jq对象，则 将此jq对象直接存在一个空this中，直接返回。

2、增加了insert方法
    insert:function(parent,child,isAppend)
        insert是一个工具类，可以将child元素插入parent父元素的开始或者结尾
        当 isAppend为true时，将child插入到父元素最前面，为false时插入到父元素最后面

3、基于insert又增加了 :
       A：     append:function(){
                    var parent = this;
                    var child = arguments[0];
                    this.insert(parent,child,true)
                   return this;
               }
        增加了append方法，调用方式：parentElement.append(childElement);
               此方法将子元素追加到父元素末尾


       B：     appendTo:function(){
                   var parent = arguments[0];
                   var child = this;
                   this.insert(parent,child,true);
                   return this;
               }

        增加了appendTo方法，调用方式：childElement.append(parentElement);
               此方法将子元素追加到父元素末尾  （和append的追加方式相反，作用相同）

       C：      prepend:function(){
                    var child = arguments[0];
                    this.insert(this,child);
                    return this;
                }
        增加了prepend方法，调用方式：parentElement.prepend(childElement);
                此方法将子元素追加到父元素第一个子元素之前
       D：    prependTo:function(){
                   var child = this;
                   var parent = arguments[0];
                   this.insert(parent,child);
                   return this;
               }
        增加了prependTo方法，调用方式：childElement.prepend(parentElement);
                        此方法将子元素追加到父元素第一个子元素之前
                        
4、增加了before和after方法
    
           A: before:function(){
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
            }
             增加了before方式，  调用方式：nextSibling.before(prevSibling); 
                         将一个节点作为兄弟节点插入到另一个节点的前面
    
            B:  after:function(){
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
            }
            增加了after方式，  调用方式：prevSibling.before(nextSibling); 
                                     将一个节点作为兄弟节点插入到另一个节点的后面

*************************************************************************************************************************************
           2.4 版本 增加了操作dom的方法 增加了  属性模块

           1、 html（）
           方法描述：
                 a、 当不传入参数(或者传入undefined)的时候，获取this中第一个dom元素内部的html内容
                 b、 当传入一个参数，遍历this中所有的dom元素，设置他们的html内容
           调用方式：  $('xxx').html();

           2、text（）
           方法描述：
                a: 当不传入参数或者传入undefined时，获取this中所有dom元素内部的文本，并返回
                b: 当传入参数时，设置this中所有的dom元素内部的文本，其中传入null和‘’都会清空元素的内容
                    最后返回 this实现链式编程

            3、 siblings() 获取兄弟元素

           方法描述：    调用方式： $('xxx').siblings(filter);

                        当不传入参数或者传入undefined时，获取this中所有dom元素内部的文本，并返回
                        b: 当传入参数时，设置this中所有的dom元素内部的文本，其中传入null和‘’都会清空元素的内容
                          最后返回 this实现链式编程

           4、 next()  获取下一个元素节点

            方法描述： 调用方式：$('xxx').next()
            功能描述： 要获取到每一个元素的下一个兄弟元素

            增加的工具类
          5、   siblingsElement（dom）   获取dom兄弟元素
                调用方式： jQuery.siblingsElement
                 功能描述： 获取传入元素的所有兄弟元素


          6、nextSiblingElement（dom） 获取下一个兄弟元素
                  调用方式： jQuery.nextSiblingElement()
                  功能描述： 获取传入dom元素的下一个兄弟元素，没有的话就返回 null

          增加的 属性模块

           7、 attr（）  获取或者设置标签的属性
            调用方式： $('xxx').attr();

            功能描述：
                  a、不传入参数时，直接返回this以便实现链式编程
                  b、传入一个参数时：
                       1、当初入一个字符串时，获取this中第一个dom的某属性的值
                       2、当传入一个对象时，设置this中多个dom的多个属性的值
                  c、传入2个参数时，设置this中所有dom元素某属性的值


********************************************************

         2.5 版本  扩展了属性模块的功能  增加了工具类valHooks，扩展了dom操作的indexOf方法

          1、工具类valHooks对象：
                为了使 表单的各种操作更加具有语义化，而封装的一个工具类
                 其中包含了 input option select 的set和get方法，
                 可以设置和获取各种表单的属性值

          2、 dom的方法  indexOf（）
                调用方式：父元素.indexOf（子元素）
                功能描述：
                       判断子元素是否在父元素中，有的话返回索引，没有的话返回-1
          3、增加了 removeAttr 方法
                   调用方式：$('xxx').removeAttr(attr)
                    功能描述：遍历每个元素，然后删除他的attr属性

                    attr和removeAttr实现原理是利用  getAttribute 和setAttribute

          4、增加了 prop方法
                    调用方式： $('xxx').prop(attr);
                    功能描述：遍历每个元素，然后设置他的 attr属性
                    实现原理是利用点语法。
          5、增加了removeProp方法
                    调用方式： $('xxx').prop(attr);
                    功能描述：遍历每个元素，然后删除他的 attr属性
                    实现原理是利用点语法。

          6、 增加了 hasClass方法
                    调用方式： $('xxx').hasClass(className);
                    功能描述： 遍历每个dom对象，如果有某个类名返回true，没有返回false

          7、增加了addClass方法
                     调用方式： $('xxx').addClass(className);
                     功能描述： 遍历每个dom对象，为他们添加某个类名，
                                也可以添加多个类名，如果原来有的话，就不添加，没有的话就添加

          8、增加了removeClass方法
                    调用方式： $('xxx').removeClass(className);
                    功能描述： 遍历每个dom对象，为他们添加删除类名
          9、增加了toogleClass 方法：
                    调用方式： $('xxx').toggleClass(className);
                    功能描述： 遍历每个dom对象，传入一个或者多个类名，
                                如果dom原来有就删除，原来没有就添加类名

          10、增加了val方法：
                    调用方式： $('xxx').removeClass(value);
                    功能描述：
                    当不传入参数时，获取某属性值，当传入value时，设置某属性
                         的值，和  工具类中的valHooks相关联

                    获取：获取第一个DOM元素的值 $("input").val()
                        文本框、按钮、textarea checkbox/radio：返回value属性的值
                        select：如果单选返回选中的option的value，如果是多选返回选中的文本组成数组
                        option：返回value属性的值或者文本

                    设置：设置每一个DOM元素的值
                        文本框、按钮、textarea：直接设置value属性的值
                        checkbox/radio：如果设置的值与checkbox的value属性匹配，就选中它(checked=true)
                        select：如果设置的值与下面的某个option的value值匹配就选中某个option，
                        如果都不匹配就取消选中（selectedIndex = -1;）


**************************************************************************

        2.6 版本 增加了jq中的 事件封装

        实现原理：
        
              jq事件封装原理：
                将所有的时间的名字都保存在一个字符串里，然后用 空格分割一下存到数组中，然后遍历数组中每一个元素
                给jq。fn添加方法


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

