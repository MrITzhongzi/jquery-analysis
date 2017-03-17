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
            //���������push���ѻ�ȡ����domԪ�ذ�װ��һ�����飬��������this��
            push.apply(this, Sizzle(selector));
            //Ϊ�˿���ʹ����ʽ��̣����ص��ø÷����Ķ���
            //������һ������Ƿ�������ģʽ��thisָ����ø÷����Ķ���return this�Ӷ�ʵ����ʽ���
            //     ��������ǹ��캯�����ã�Ĭ�Ϸ���this��return this�Ͳ�����ûʲô����
            return this;
        },
        //ģ��jq�е�css����������dom����ʽ
        css: function (styleName, styleValue) {
            for (var i = 0; i < this.length; i++) {
                var ele = this[i];
                ele.style[styleName] = styleValue;
            }

            //Ϊ��ʵ����ʽ���
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

    //����each����
    jQuery.extend({
        each: function (array,callback) {
            //����if�ж�array��һ�������α���飬���� һ����ֵ�ԵĶ�����������飬α���飬��forѭ������
            //����Ƕ�����for in����
            if(isLikeArray(array)){
                for (var i = 0; i < array.length; i++) {
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
        }
    });

    //��¶����ȫ�ֱ��������Է��� jq�еķ���
    window.jQuery = window.$ = jQuery;
})(window);
