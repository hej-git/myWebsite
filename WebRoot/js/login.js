$(function(){
	$("#loginSub").click(function(){
		var ps = $("#lgPwd").val();
		if(ps==""){
			myMsg("请输入密码!");
			$("#lgPwd").focus();
			return;
		}
		$.post(httpPath+"/index/loginCheck",{password:ps},function(res){
			if(res.code=="ok"){
				location.href="/index/home";
			}else{
				myMsg(res.msg);
				$("#lgPwd").focus();
			}
		});
		
	});
});
