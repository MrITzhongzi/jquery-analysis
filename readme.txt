source code�д�ŵ��Ƿ�װ��jqueryԴ���롣
	���а���һ��myJquery1.0.js��һ�����ܵ�readme.txt�ļ�

source code annotation �д�ŵ���jqueryԴ����Ľ�����ע�ͺ�˵����
	���а���һ��myJqueryannotation1.0.js��readme.txt�����ļ�

test�ļ��д�ŵ��ǲ����ҷ�װ��jQuery��ܡ�
	���а���myJquery1.0.js��һ�����Ե�test.html�ļ�




*********************************************************************************

jQuery�ĳ�ʼ������ init�����˼·��

1�����֮ǰ��DOMԪ��
    2���ų���selectorΪnull/undefined--->ֱ�ӷ���
    3���ж�selector������
      3.1�����selector���ַ�������
          3.1.1���ж�selector�Ƿ���html��ǩ
              3.1.1.1������ǣ�����html��ǩ������
                  a�����ڴ��д�����һ��div��ǩ
                  b������div��ǩ������(innerHTML)
                  c����ȡdiv��ǩ���ӽڵ�(div.childNodes)
                  d������Щ�ӽڵ����׷�ӵ�this��
              3.1.1.2��������ǣ�����ѡ����������
                  a��ͨ��ѡ������������ȡԪ�أ������������elements��
                  b����elements�е�ÿһ��Ԫ�ر���׷�ӵ�this��
      3.2��selector����������
          3.2.1����Ϊsleector��һ��DOMԪ�أ�����DOMԪ����ӵ�this��
              a��this[0]=selector this.length=1
    4������this
*********************************************************************************

1.0�汾


���jQUery��ܣ�������˺��ķ���jQuery.extend  jQuery.fn.extend.
��Ҳ����css������ ��Sizzle���档


**********************************************************************************
2.0�汾
******1��$��������each������

******2�������˹����� isString ,isFuncton, isArray, type

******3��������makeArray ���� ��������merge����

******4�������˹������� isLikeArray

******5�������� trim����



************************************************************************************
2.1�汾 ������cssģ��

1��i:ɾ����jQ.fn��ԭ���Ĳ��Ե�css������������ ��jq��ȫ��ͬ��css������
   ii:��css����˵����
        ����һ������ʱ��a:�����һ���ַ�����ȡ����ʽ��ֵ��
                  b:���������һ������������ö���ͬʱ������ÿ��domԪ�أ���ÿ��dom���ö����е�����ֵ
        ����������ʱ�� ����ÿ��domԪ�أ���ÿ��domԪ��������Ӧ����ʽ

2����Ҫ�� each���������� ����ֵthis���Ա�ʵ����ʽ��̡�

3����jq�ĳ�ʼ��������������  �ж��������жϴ������һ��ѡ��������һ��domԪ�أ�����ѡ����������һ��jQ��α������󣬴���domԪ�صĻ���������װ��һ��jqα�������

3������show������hide�������Լ�toggle������Ԫ����ʾ��������



************************************************************************************
2.2 Domģ��

1�������� get����
          //1��û�в���������ֵ�ǽ�F��ʵ��ת��Ϊ������
         //2���вΣ�
         //      ����Ϊ�Ǹ�����ֱ�ӷ���F��ʵ����ָ��������DOMԪ��
         //      ����Ϊ���������ص����ڼ���Ԫ��
    first����
        //��ȡjq�����еĵ�һ��domԪ�أ�����װ��jq���󷵻�
    last����
         //��ȡjq�����е����һ��domԪ�أ�����װ��jq���󷵻�
    eq����
        //��ȡjq����������Ϊindex��dom���󣬲���װ��jq���󷵻�

2��������find����
        //ϣ������this����ЩDOMԪ�ص�����ķ���ָ����������Ԫ�أ�����Щ��Ԫ�ع���һ��jquery����

         //ʵ��˼·��Ӧ����Ҫ���ȱ�����ÿһ��div��Ȼ�������ÿһ��div����Ԫ��

************************************************************************************************************

    2.3  ������Dom�������Ľ���cssѡ����

1��������һ��jq��ʼ������initѡ�������жϣ����ִ�����ͨ���ַ����ͷ��ϱ�ǩ�ı����ַ���������ͬ�Ĳ�����
    a��������ͨ���ַ�����Ϊѡ����ʱ��ֱ���ҵ����Ϲ����dom�������ǰ�װ��һ��jq���󷵻ء�
    b���������html�ı�ǩ�ǣ��������ڴ��д���һ��domԪ�أ���innerHTML�����Ѵ����html�ṹ��ӵ���dom�У�
        Ȼ����querySelectorAll���������ҷ���ѡ������domԪ�أ��洢��this�У����������push������

    ������init���ڴ��� jq������жϣ������ȥһ��jq������ ����jq����ֱ�Ӵ���һ����this�У�ֱ�ӷ��ء�

2��������insert����
    insert:function(parent,child,isAppend)
        insert��һ�������࣬���Խ�childԪ�ز���parent��Ԫ�صĿ�ʼ���߽�β
        �� isAppendΪtrueʱ����child���뵽��Ԫ����ǰ�棬Ϊfalseʱ���뵽��Ԫ�������

3������insert�������� :
       A��     append:function(){
                    var parent = this;
                    var child = arguments[0];
                    this.insert(parent,child,true)
                   return this;
               }
        ������append���������÷�ʽ��parentElement.append(childElement);
               �˷�������Ԫ��׷�ӵ���Ԫ��ĩβ


       B��     appendTo:function(){
                   var parent = arguments[0];
                   var child = this;
                   this.insert(parent,child,true);
                   return this;
               }

        ������appendTo���������÷�ʽ��childElement.append(parentElement);
               �˷�������Ԫ��׷�ӵ���Ԫ��ĩβ  ����append��׷�ӷ�ʽ�෴��������ͬ��

       C��      prepend:function(){
                    var child = arguments[0];
                    this.insert(this,child);
                    return this;
                }
        ������prepend���������÷�ʽ��parentElement.prepend(childElement);
                �˷�������Ԫ��׷�ӵ���Ԫ�ص�һ����Ԫ��֮ǰ
       D��    prependTo:function(){
                   var child = this;
                   var parent = arguments[0];
                   this.insert(parent,child);
                   return this;
               }
        ������prependTo���������÷�ʽ��childElement.prepend(parentElement);
                        �˷�������Ԫ��׷�ӵ���Ԫ�ص�һ����Ԫ��֮ǰ
                        
4��������before��after����
    
           A: before:function(){
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
            }
             ������before��ʽ��  ���÷�ʽ��nextSibling.before(prevSibling); 
                         ��һ���ڵ���Ϊ�ֵܽڵ���뵽��һ���ڵ��ǰ��
    
            B:  after:function(){
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
            }
            ������after��ʽ��  ���÷�ʽ��prevSibling.before(nextSibling); 
                                     ��һ���ڵ���Ϊ�ֵܽڵ���뵽��һ���ڵ�ĺ���
