/**
 * Created by lihongwei on 2017/3/15.
 */

    //������ִ�к�����װjq���룬���Ⱪ¶̫���ȫ�ֱ���
(function (window) {
    //Ϊ���Ժ��ܷ����������ĸ��ַ�������ǰ�浽�����У�ȫ�ֶ�������һ�����飬��Լ�ռ�
    var arr = [];
    var push = arr.push;
    var splice = arr.splice;
    var slice = arr.slice;
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
            splice.call(this,0,this.length);
            //���������push���ѻ�ȡ����domԪ�ذ�װ��һ�����飬��������this��
            push.apply(this,Sizzle(selector));
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
    //jq�е�extend������jq�ķǳ����ĵ�һ���������� jQuery��jQuery.prototype�ж����������������
    //entend����ʹ��ʾ����
    /*
     * ��jquery��ԭ������ӷ���ʱ������extend�����ԡ�
     *
     * jQuery.extend({
     *   each:function(){},
     *   type:function(){},
     *   isString:function(){}
     * });
     *
     * jQuery�еĹ��߷���һ��ӵ�jQuery��
     * jQuery�в���dom�ķ���һ�Ѽӵ�jQuery.prototype��
     *
     * */

    /*
     * jq�бȽϺ��ĵ�extend����������
     *
     *
     * jQuery.extend();����һ������Ļ����Ͱ������������Լӵ�jQuery��
     * jQuery.extend();����������Ļ����Ͱѵ�2,3,4�ȵȸ���������׷�ӵ���һ��������
     *
     * jQuery.fn.extend():����һ������Ļ����Ͱ������������Լӵ�jQuery.fn��
     * jQuery.fn.extend():����������Ļ����Ͱѵ�2,3,4�ȵȸ���������׷�ӵ���һ��������
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
    //���Ĳ��� ���Ĳ��� ���Ĳ���  ��init��ԭ��ָ�� jquery��ԭ�ͣ��������κ�init��ʵ���������Է���
    // jqԭ���е����з���
    jQuery.fn.init.prototype = jQuery.fn;
    //��¶����ȫ�ֱ��������Է��� jq�еķ���
    window.jQuery = window.$ = jQuery;
})(window);