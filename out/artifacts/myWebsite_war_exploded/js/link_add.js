$(function () {
    layui.use(['form','upload'], function(){
        var upload = layui.upload;
        //创建一个上传组件
        upload.render({
            elem: '#fileBtn'
            ,url: '/link/upload'
            ,accept: 'file'
            ,done: function(res, index, upload){ //上传后的回调
                $('#demo1').attr('src', res.path); //图片链接（base64）
                $('#imgurl').val(res.path); //图片链接（base64）
                $("#demoText").text(res.name);
            }
        });
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
    $.post("/link/save",$("#myForm").serialize(),function (res) {
        myMsg(res.msg);
        if(res.code=="ok"){
            myClose();
        }
    });
}