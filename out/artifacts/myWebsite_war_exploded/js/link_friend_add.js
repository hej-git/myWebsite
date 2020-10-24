$(function () {
    layui.use(['form','upload'], function(){
    });
});
function save() {
    if($("#name").val()==""){
        myMsg("链接名称未填写!");
        return ;
    }
    if($("#link").val()==""){
        myMsg("链接地址未填写!");
        return ;
    }
    myLoadding("正在保存中...");
    $.post("/yl/save",$("#myForm").serialize(),function (res) {
        myMsg(res.msg);
        if(res.code=="ok"){
            myClose();
        }
    });
}