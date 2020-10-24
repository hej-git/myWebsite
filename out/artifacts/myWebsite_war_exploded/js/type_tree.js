$(function () {
    initTree();
});


//初始控件
var tree;
function initTree() {
    layui.use('tree', function () {
        tree = layui.tree;
        //常规用法
        tree.render({
            elem: '#test1' //默认是点击节点可进行收缩
            , data: queryTree()
            ,click: function(obj){
                var data = obj.data;  //获取当前点击的节点数据
                var id = data.id;
                var pid = data.pid||"0";
                if($("#type").val()=="type"){
                    $("#list", window.parent.document).attr("src","/type/index?pid="+id);
                }else{
                    if(pid!=""){
                        $("#list", window.parent.document).attr("src","/link/index?typeid="+id);
                    }
                }

            }
        });
    });
}

function queryTree() {
    var type = $("#type").val();
    var dataArr = [];
    var b = {};
    b.title="全部类别";
    b.id="";
    b.children = [];
    b.spread = true;
    $.ajax({
        url:"/type/queryTree",
        type:"post",
        data:{type:type},
        dataType:"json",
        async:false,
        success: function(res){
            if(res.length){
                for(var i=0;i<res.length;i++){
                    b.children.push(res[i]);
                }
            }
        }
    });
    dataArr.push(b);
    return dataArr;
}