$(function () {
    layui.use(['form'], function(){

    });
});
function save() {
    if($("#name").val()==""){
        myMsg("类别名称未填写!");
        return ;
    }
    myLoadding("正在保存中...");
    $.post("/type/save",$("#myForm").serialize(),function (res) {
        myMsg(res.msg);
        if(res.code=="ok"){
            myClose();
        }
    });
}