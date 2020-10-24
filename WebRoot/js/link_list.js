$(function () {
    initTable();
});

function reload(){
    table.reload('myTable', {
        url: '/link/queryList' //数据接口
        ,where: {
            name:$("#name").val()||"",
            typeId:$("#typeid").val()||""
        },page:{
            curr:1
        }
    });
}

//初始控件
function initTable(){
    //初始化表格控件
    layui.use(['table'], function(){
        table = layui.table;
        table.render({
            elem: '#table'
            ,url: '/link/queryList' //数据接口
            ,where:{
                name:$("#name").val()||"",
                typeId:$("#typeid").val()||""
            }
            ,method:'post'
            ,page: true //开启分页
            ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
            ,cols: [[ //表头
                {field: 'name', title: '链接名称',sort:true},
                {field: 'typename', title: '类型',sort:true},
                {field: 'link', title: '链接地址',sort:true},
                {field: 'remark', title: '备注',sort:true},
                {field: 'opt', title: '操作',toolbar:"#opt",width:'15%'}
            ]],
            id:"myTable",
            height:'full-120'
        });
        //工具条监听事件
        table.on('tool(myTable)', function(obj){
            var data = obj.data;
            switch(obj.event){
                case 'edit':
                    edit(data.id);
                    break;
                case 'del':
                    myConfirm("确认删除该链接吗?",del,data.id);
                    break;
            }
        });
    });
}

/**
 * 编辑
 * @param id
 */
function edit(id) {
    myOpen("编辑链接","/link/addAndView?id="+id,500,400,['保存','取消']);
}

function add() {
    myOpen("编辑链接","/link/addAndView?typeid="+$("#typeid").val(),500,400,['保存','取消']);
}
/**
 * 删除
 * @param id
 */
function del(id) {
    $.post("/link/delete",{id:id},function (res) {
        myMsg(res.msg);
        if(res.code=="ok"){
            reload();
        }
    });
}