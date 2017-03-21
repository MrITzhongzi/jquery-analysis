/**
 * Created by Administrator on 2017/3/17.
 */

    //������ִ�к�����װjq���룬���Ⱪ¶̫���ȫ�ֱ���
(function (window) {
    //Ϊ���Ժ��ܷ����������ĸ��ַ�������ǰ�浽�����У�ȫ�ֶ�������һ�����飬��Լ�ռ�
    var arr = [];
    var push = arr.push;
    var splice = arr.splice;
    var slice = arr.slice;

    //�ж�����������׼��������
    var types="Number String Boolean Array RegExp Function Math Date Object".split(" ");
    var class2type={};//{ "[object Xxxx]":"xxxx" }
    for (var i = 0; i < types.length; i++) {
        var type = types[i];//type�Ǵ�д����������
        class2type["[object "+type+"]"]=type.toLowerCase();//class2type["[object Number]"]="number"
    }



    //ģ��jQuery�е�Sizzle���棬����ѡ������ȡԪ��
    function Sizzle(seletcor) {
        return document.querySelectorAll(seletcor);
    }

    //����jq�ĺ��ķ���
    function jQuery(selector) {
        //����jq����ԭ���е�F��ʵ������Ϊ���潫 init����(��ʼ������)��ԭ��ָ���� jq��ԭ�ͣ����Ĳ���������������F��ʵ��������
        //����jq�еķ���
        return new jQuery.fn.init(selector);
    }

    //ʹ��ԭ���滻����jq����ԭ�ͣ����Ұ�jqԭ�͵��������Ƹ�jQuery.fn����  jQuery.prototype == jQuery.fn
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        //�����ʼ������
        init: function (selector) {

            //Ϊ�˰ѻ�ȡ����domԪ�أ����ѻ�ȡ����domԪ�ذ�װ��һ�����飬��������this��
            //���������splice���������this���մ洢������
            splice.call(this, 0, this.length);

            if(selector == null) return this;//ѡ����Ϊundefined��nullʱ��ֱ�ӷ���


            //�жϴ������һ��ѡ��������һ��dom����
            if(jQuery.isString(selector)){
                //�жϴ�����ַ����Ƿ��ϱ�ǩ����� �ı�������һ����ͨ���ַ���
                if(selector[0]==="<" && selector[selector.length-1]===">" && selector.length>=3){
                    //selector��һ��html��ǩ-->����һ��html��ǩת��ΪDOMԪ��
                    //dom.innerHTML="html��ǩ"
                    //Ҫ�ҵ�һ��domԪ�أ��Ͳ���ʹ��HTMLҳ�����Ѿ����ڵı�ǩ���������ڴ��д�����������DOMԪ��
                    var div=document.createElement("div");
                    div.innerHTML=selector;//��һ�д���ִ����ϣ�div�ͻ�ӵ��һϵ�е��ӽڵ�

                    //��div���ӽڵ����׷�ӵ�this��
                    //div.childNodes����ȡ�����е��ӽڵ�

                    var nodes=div.childNodes;
                    push.apply(this,nodes);
                }else{
                    //���������push���ѻ�ȡ����domԪ�ذ�װ��һ�����飬��������this��
                    push.apply(this, Sizzle(selector));
                    //Ϊ�˿���ʹ����ʽ��̣����ص��ø÷����Ķ���
                }
            }else if(selector.nodeType) {  //�ж�selector�ǲ���һ��domԪ��,?�Ļ�Ĭ����jq����

                //�������һ��dom���󣬾Ͱ�����װ��jq���󣬼�α����
                this[0]=selector;
                this.length=1;
            }else{
                //�������jq����ֱ����ӵ�this�з���
                jQuery.merge(this,selector);
            }

            //������һ������Ƿ�������ģʽ��thisָ����ø÷����Ķ���return this�Ӷ�ʵ����ʽ���
            //     ��������ǹ��캯�����ã�Ĭ�Ϸ���this��return this�Ͳ�����ûʲô����
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

    //���Ĳ��� ���Ĳ��� ���Ĳ���  ��init��ԭ��ָ�� jquery��ԭ�ͣ��������κ�init��ʵ���������Է���
    // jqԭ���е����з���
    jQuery.fn.init.prototype = jQuery.fn;

    /**
     * �ж�array�Ƿ����������α����
     * @param array
     * @returns {boolean}
     */
    function isLikeArray(array){
        var len = array.length
        return typeof len == 'number' && len >= 0 && len - 1 in array
    }

    //������
    jQuery.extend({
        each: function (array,callback) {

		var i;
            //����if�ж�array��һ�������α���飬���� һ����ֵ�ԵĶ�����������飬α���飬��forѭ������
            //����Ƕ�����for in����
            if(isLikeArray(array)){
                for (i = 0; i < array.length; i++) {
                    //���������ĵ���ģʽ���ú����ڲ���ָ��ָ��������Ǹ�Ԫ�أ�������������domԪ�ص�ʱ��
                    // ���Բ��ô�������ֱ��ʹ��this����
                    var result = callback.call(array[i],i,array[i]);
                    //����ĳ������ʱ������ѭ��
                    if(result === false){
                        break;
                    }
                }
            }else{
                for (i in array) {
                    //else�ڲ����߼���if�ڵ��߼���ͬ��
                    var result = callback.call(array[i],i,array[i]);
                    if(result === false){
                        break;
                    }
                }
            }
            return this;
        },

        //�ж��Ƿ����ַ�������
        isString: function (str) {
            return typeof str === 'string';
        },

        //�ж��Ƿ��Ǻ�������
        isFunction: function (fn) {
            return typeof fn === 'function';
        },

        //��Ϊ������Ѿ���ES5��ԭ��֧����Array.isArray��������ES5֮ǰû�и÷���(Array.isArrayֵΪundefined)
        isArray: Array.isArray || function (array) {
            return Object.prototype.toString.call(array) == '[object Array]';
        },

        /**
         * @param data
         * return �ַ�����ֵ���Ǹ����ݵ��������͵����Ƶ�Сд��ʽ
         */
        type:function(data){
            //1��������ݶ�����
            //var result=Object.prototype.toString.call(data);//"[object Xxxx]"
            // //2������result���þ���class2type�е��������ƣ���type�����ķ���ֵҲ����class2type������ֵ
            //  return class2type[result];

            //�򻯺�
            //return class2type[Object.prototype.toString.call(data)];
            //��Ϊ Object.prototype.toString.call���� null��undefined���ж�����ES5֮�����ģ�
            // Ϊ�˼���֮ǰ�İ汾����null��undefined�ó��������жϡ� undefined == null Ϊtrue��
            //String()���Խ�null��undefinedת��Ϊ�ַ������͵� null��undefined��
            return data == null?
                    String(data):
                    class2type[Object.prototype.toString.call(data)];
        },

        /**
         *merge������һ���������α�����ֵ������ӵ���һ���������α������
         * @param target ���� or α����
         * @param source ���� or α����
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
         *������ת��Ϊ����
         * 1������������ or α����-->ֱ��ת��Ϊ����
         * 2�������������>����������һ������ŵ�һ��������
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
         * ȥ���ַ����������ߵĿո�
         * @param str
         * @returns {XML|void|string}
         */
        trim:function(str){
            return str.replace(/^\s+|\s+$/g,"");
        },

        /**
         * ��ȡdom�ֵ�Ԫ��
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
         * �����õݹ飩��ȡ��һ���ֵ�Ԫ��
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

    //cssģ��
    jQuery.fn.extend({
        css: function () {
            /*
             *����һ������ ��ʱ��
             *      ������������ַ�����ʱ��ֱ�ӻ�ȡ��һ��dom�ĸ���ʽ��ֵ��������
             *       ����������Ƕ����ʱ��ѭ������obj��Ϊÿ��dom������Ӧ������
             *���������������ʱ�򣬱������е�dom������Ӧ��dom������Ӧ����ʽ
             *
             * */

            /*
             * ����css����ʵ�εĳ��ȣ�������
             * */
            var len = arguments.length;

            /*
             * ���û�д�������Ļ�������ԭjq���󣬼�this���Ա�ʵ����ʽ���
             * */
            if (len == 0) return this;
            /*
             * �Ѵ���css�Ĳ����е�ǰ����ȡ�����������ĺ��ԡ�
             *
             * */
            var arg0 = arguments[0];
            var arg1 = arguments[1];
            /*
             * ��css��ʵ�εĸ���Ϊһ����ʱ���ж�һ�´�������ַ��������Ƕ���
             * ������ַ����������this�е�ÿһ��domԪ�أ����������������ʽ��
             * ����Ƕ������ȱ����˶����ڱ��������и�this�е�ÿ��domԪ�����ô����ԡ�
             *
             * */
            if (len == 1) {
                if (jQuery.isString(arg0)) {
                    //this��init��ʵ���������˻�ȡ�������е�domԪ�أ��Ǹ�α���飬
                    // �ڴ���һ���ַ���ʱ��Ĭ�ϻ�ȡ��һ��domԪ�صĸ�����
                    var firstDom = this[0];
                    var styles = window.getComputedStyle(firstDom, null); //��ȡĳdomԪ�ؼ�������ʽ
                    //styles�д洢��firstDom�����е���ʽ��ȡ��������Ҫ����ʽ����arg0
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
                 * �������������������������this�����е�domԪ�أ����������ô���ʽ�����õ�����ʽ��
                 * */
                return this.each(function () {
                    this.style[arg0] = arg1;
                })
            }
        },
        /*
         * ����Ԫ����ʾ
         * */
        show:function(){
            return this.css('display','block');
        },
        /*
         * ����Ԫ������
         * */
        hide:function(){
            return this.css('display','none');
        },
        /*
         * ����Ԫ����ʾ��������
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

    //dom����
    jQuery.fn.extend({

        get:function(){
            //1��û�в���������ֵ�ǽ�F��ʵ��ת��Ϊ������
            //2���вΣ�
            //      ����Ϊ�Ǹ�����ֱ�ӷ���F��ʵ����ָ��������DOMԪ��
            //      ����Ϊ���������ص����ڼ���Ԫ��
            if(arguments.length == 0){
                //����makeArray���� �ѵ��ø÷����Ķ������α����ת����������
                return jQuery.makeArray(this);
            }else {
                //ȡ����һ����ȥ��ʵ��
                var arg0 = arguments[0];
                if(arg0 >= 0){
                    return this[arg0];
                }else {
                    return this[this.length + arg0];
                }
            }
        },

        first:function(){
            //��ȡjq�����еĵ�һ��domԪ�أ�����װ��jq���󷵻�
            //��ȡ��һ��DomԪ��
            var firstDom = this.get(0);
            //����ȡ����DomԪ��ת����jQ���󣬲�����
            return jQuery(firstDom);
        },

        last:function(){
            //��ȡjq�����е����һ��domԪ�أ�����װ��jq���󷵻�
            var lastDom = this.get(-1);
            return jQuery(lastDom);
        },

        eq:function(index){
            //��ȡjq����������Ϊindex��dom���󣬲���װ��jq���󷵻�
            var dom = this.get(index);
            return jQuery(dom);
        },

        find:function(selector){
            //ϣ������this����ЩDOMԪ�ص�����ķ���ָ����������Ԫ�أ�����Щ��Ԫ�ع���һ��jquery����

            //ʵ��˼·��Ӧ����Ҫ���ȱ�����ÿһ��div��Ȼ�������ÿһ��div����Ԫ��
            var $ = jQuery();

            this.each(function(){
                var dom=this.querySelectorAll(selector);
                jQuery.merge($,dom);
            });

            return $;
        },

        insert:function(parent,child,isAppend){
            /*
             * insert��һ�������࣬���Խ�childԪ�ز���parent��Ԫ�صĿ�ʼ���߽�β
             * �� isAppendΪtrueʱ����child���뵽��Ԫ����ǰ�棬Ϊfalseʱ���뵽��Ԫ�������
             * */

            /*�����ܵ��Ĳ���ͳһ�����jq����
             * */
            var $parent = jQuery(parent);
            var $child = jQuery(child);
            /*
             * ����ÿһ����Ԫ��
             * */
            $parent.each(function(){
                /*
                 * ��ÿһ����Ԫ�صĵ�һ����Ԫ�ش�����
                 * */
                var parent = this;
                var firstChild = parent.firstChild;
                $child.each(function(){
                    /*
                     * ����ÿһ����Ԫ�ز���ӵ���Ԫ����
                     * */
                    var child = this;
                    //��isAppendΪtrue�Ƿ���appendChild�ַ�������ִ�д˷���
                    //��isAppendΪfalseʱ������insertBefore�ַ�������ִ�д˷���
                    var fnName = isAppend?'appendChild':'insertBefore';
                    parent[fnName](child.cloneNode(true),firstChild);
                });
            });
        },

        append:function(){
            /*
            * ���÷�ʽ����Ԫ��.append����Ԫ�أ�
            * ����Ԫ��׷�ӵ���Ԫ�ص�ĩβ
            * */
            var parent = this;
            var child = arguments[0];
            this.insert(parent,child,true)
            return this;
        },

        appendTo:function(){
            /*
             * ���÷�ʽ����Ԫ��.appendTo����Ԫ�أ�
             * ����Ԫ��׷�ӵ���Ԫ�ص�ĩβ
             * */
            var parent = arguments[0];
            var child = this;
            this.insert(parent,child,true);
            return this;
        },

        prepend:function(){
            /*
             * ���÷�ʽ����Ԫ��.prepend����Ԫ�أ�
             * ����Ԫ��׷�ӵ���Ԫ�ص��ʼ
             * */
            var child = arguments[0];
            this.insert(this,child);
            return this;
        },

        prependTo:function(){
            /*
             * ���÷�ʽ����Ԫ��.prependTo����Ԫ�أ�
             * ����Ԫ��׷�ӵ���Ԫ�ص��ʼ
             * */
            var child = this;
            var parent = arguments[0];
            this.insert(parent,child);
            return this;
        },

        remove:function(){
            //��Ԫ��.remove����Ԫ�أ�
            //ԭ��JS����Ԫ��.removeChild(��Ԫ��)
            //��Ԫ�أ������this�У���Ҫ����this��ȡÿһ����Ԫ��
            //��Ԫ�أ�������Ԫ�ص�parentNode���Ӷ���ȡ��Ԫ��
            this.each(function(){
                var child = this;
                var parent = child.parentNode;
                parent.removeChild(child);
            });
        },

        before:function(){
            /*
             * ���÷�ʽ��
             * nextSibline.before(prevSibling)
             *
             * ��һ��Ԫ����Ϊ�ֵ�Ԫ�ز���ĳԪ��ǰ��
             * ��Ϊnext����֪�ģ�prev��Ҫ�����Ԫ��-->ʵ�ֽ�prev���뵽next֮ǰ
             * ԭ��JS�����ڵ�.insertBefore(prev,next)
             * Ҫ�ҵ����ڵ㣬��Ϊnext����֪�ģ�����ͨ��next.parentNode�ҵ����ǵĸ��ڵ�
             * (����prev���У���Ϊprev��Ҫ����Ľڵ㣬����ʱû�и��ڵ�)
             * */
            var $previousSibling = jQuery(arguments[0]);
            var $next = jQuery(this);
            //����ÿһ����Ԫ��
            $next.each(function(){
                var next = this;
                //����ÿһ����Ԫ�ذ�������ӵ���Ԫ����
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
             * ��ĳԪ����Ϊ�ֵܽڵ���뵽ĳԪ�غ���
             *
             * ����ԭ��js�е�   ��Ԫ��.insertBefore(��Ԫ��)���з�װ
             *
             * �ҵ�previousSibling����һ���ֵܽڵ㣬������һ���ֵܽڵ�֮ǰ����ڵ㣬���������������ڵ���
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
                    //��֪����prev��Ҫ��next���뵽prev֮��ʵ���Ͼ���Ҫ��next����
                    // ��prev����һ���ֵܽڵ��ǰ��
                    parent.insertBefore(next.cloneNode(true),nextSibling);

                });
            });
            return this;
        },

        //2.4
        /**
         * �����������(���ߴ���undefined)��ʱ�򣬻�ȡthis�е�һ��domԪ���ڲ���html����
         * ������һ������������this�����е�domԪ�أ��������ǵ�html����
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
         * a: ��������������ߴ���undefinedʱ����ȡthis������domԪ���ڲ����ı���������
         * b: ���������ʱ������this�����е�domԪ���ڲ����ı������д���null�͡����������Ԫ�ص�����
         *    ��󷵻� thisʵ����ʽ���
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
         * ���÷�ʽ�� $('xxx').siblings(filter);
         * ����������
         *       a:�����������ʱ������this�������ֵ�Ԫ�أ�������
         *       b:�������ʱ��Ѱ�ҽڵ����ֽ���filter���ֵ�Ԫ�أ�������
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
            var doms = []; //���ɸѡ���domԪ��
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
         * ���÷�ʽ��$('xxx').next()
         *  Ҫ��ȡ��ÿһ��Ԫ�ص���һ���ֵ�Ԫ��
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
            //��nexts�е�Ԫ�ر���׷�ӵ�$next��
            jQuery.merge($next,nexts);

            if(!filter) return $next;

            var arr2=[];//�������ɸѡ���Ԫ��
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

    //����ģ��
    jQuery.fn.extend({
        attr:function(){
            /*
             * ����������
             *   a�����������ʱ��ֱ�ӷ���this�Ա�ʵ����ʽ���
             *   b������һ������ʱ��
             *       1��������һ���ַ���ʱ����ȡthis�е�һ��dom��ĳ���Ե�ֵ
             *       2��������һ������ʱ������this�ж��dom�Ķ�����Ե�ֵ
             *   c������2������ʱ������this������domԪ��ĳ���Ե�ֵ
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

    //��¶����ȫ�ֱ��������Է��� jq�еķ���
    window.jQuery = window.$ = jQuery;
})(window);
