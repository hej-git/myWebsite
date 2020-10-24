$(function () {
    var storage_name =  window.localStorage.getItem("name")||"";
    var storage_email =  window.localStorage.getItem("email")||"";
    if(storage_name!=""){
        $("#name").val(storage_name);
    }
    if(storage_email!=""){
        $("#email").val(storage_email);
    }
    //点击回复事件
    $(".comment-reply-link").click(function () {
        //隐藏上级评论框
        var id = $(this).parents(".comment_body").attr("dataid");
        var $comment = $(this).parents(".comment_body");
        $("#respond").find("#cancel-comment-reply-link").show();
        $("#commentid").val(id);
        $("#mcontent").val("");
        $comment.after($("#respond"));
    });
//点击再想想事件
  $(document).on("click","#cancel-comment-reply-link",function () {
      initContent($(this));
  });

  //点击发表评论
    $(document).on("click","#submit",function () {
        if(!check()) return;
        var time = formatMsgTime(new Date());
        var loadding =  myLoadding("评论提交中...");
        $.post("/ly/submit",$("#respondForm").serialize(),function (res) {
            if(res.code=="ok"){
                //将评论内容添加到评论区并重置评论区
                var name = $("#name").val();
                var mcontent = $("#mcontent").val();
                var commentid = $("#commentid").val()||"";
                if(commentid==""){//评论
                    var $li = $("#my-hide").find(".my-li-pl").clone(true);
                    $li.find(".photo").attr("alt",name).attr("src",res.imgurl);
                    $li.find(".comment-author").text(name);
                    $li.find(".comment-content").find("p").text(mcontent);
                    $li.find(".info time").text(time);
                    $(".comment-list").prepend($li);
                    $("#total").text(Number($("#total").text())+1);
                }else{//回复
                    var $li = $("#my-hide").find(".my-li-hf").clone(true);
                    $li.find(".comment_body").attr("dataid",commentid);
                    $li.find(".photo").attr("alt",name).attr("src",res.imgurl);
                    $li.find(".comment-author").text(name);
                    $li.find(".comment-content").find("p").text(mcontent);
                    $li.find(".info time").text(time);
                    var $li_c =  $("#li-comment-"+commentid);
                    if(($li_c.find(".children").attr("class")||"")!=""){
                        $li_c.find(".children").append($li);
                    }else{
                        $li_c.append($("<ul class='children'></ul>").append($li));
                    }
                }
                initContent($(this).parent().find(".cancel-comment-reply-link"));
            }
            layer.close(loadding);
            myMsg(res.msg);
        });
    });
    //昵称，邮箱
    $(document).on("change","#name,#email",function () {
        var val = $(this).val();
        var id = $(this).attr("id");
        window.localStorage.setItem(id,val);
    });


});

function initContent($this) {//还原评论区
    $("#commentid").val("");//重置回复
    $("#mcontent").val("");//重置内容
    $("#liuyanDiv").append($("#respond"));
    $this.hide();
}

function check() {
    if($("#name").val()==""){
        myMsg("请输入您的昵称!");
        $("#name").focus();
        return false;
    }
    if($("#email").val()==""){
        myMsg("请输入您的邮箱!");
        $("#email").focus();
        return false;
    }else{
        //校验邮箱格式
        var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
        if(!myReg.test($("#email").val())){
            myMsg("您的邮箱格式错误,请重新输入!");
            return false;
        }

    }
    if($("#mcontent").val()==""){
        myMsg("请输入您要评论的内容!");
        return false;
    }
    return  true;
}

function formatMsgTime (dateTime) {
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1;
    var day = dateTime.getDate();
    var hour = dateTime.getHours();
    var minute = dateTime.getMinutes();
    var second = dateTime.getSeconds();
    var now = new Date();
    var now_new = Date.parse(now.toDateString());  //typescript转换写法

    var milliseconds = 0;
    var timeSpanStr;

    milliseconds = now_new - dateTime;

    if (milliseconds <= 1000 * 60 * 1) {
        timeSpanStr = '刚刚';
    }
    else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
        timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
    }
    else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
    }
    else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
    }
    else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
        timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
    } else {
        timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    }
    return timeSpanStr;
};