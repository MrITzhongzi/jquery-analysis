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
                //���������push���ѻ�ȡ����domԪ�ذ�װ��һ�����飬��������this��
                push.apply(this, Sizzle(selector));
                //Ϊ�˿���ʹ����ʽ��̣����ص��ø÷����Ķ���
            }else {
                //������Ϊselector��һ��DOMԪ��--->{ 0:selector,length:1 }
                //�������һ��dom���󣬾Ͱ�����װ��jq���󣬼�α����
                this[0]=selector;
                this.length=1;
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

    //����each���� �������жϷ���
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
        }
    });

    //��¶����ȫ�ֱ��������Է��� jq�еķ���
    window.jQuery = window.$ = jQuery;
})(window);
