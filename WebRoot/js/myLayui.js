var httpPath = "http://localhost:8081";

/**
 * 提示框
 * @param msg
 */
function myMsg(msg){
	layer.msg(msg);
}

/**
 * 确认框
 * @param msg 提示语
 * @param fuc  方法名
 * @param params 参数
 */
function myConfirm(msg,fuc,params) {
	top.layer.confirm(msg, {
		btn: ['确定', '取消']
	}, function(index, layero){
		fuc(params);
		top.layer.close(index);
	});
}
/**
 * 加载中
 * @param msg 提示语
 */
function myLoadding(msg) {
	var loadding = top.layer.msg(msg, {icon: 16, shade: 0.3, time:0});
	return loadding;
}

/**
 * 打开窗口
 * @param title
 * @param url
 * @param width
 * @param height
 * @param btn
 */
function myOpen(title,url,width,height,btn){
	if(!width||width==""){
		width = 700;
	}
	if(!height||height==""){
		height = 500;
	}
	top.layer.open({
		type: 2,
		title:title,
		area:[width+"px",height+"px"],
		id: 'LAY_layuipro', //设定一个id，防止重复弹出
		content: [url], //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
		btn: btn,
		yes:function(index,layero){
			var iframeWin = top[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
			iframeWin.save();
		},end:function () {
			reload();
		}
	});
}

function myClose(index) {
	if(index){
		top.layer.close(index);
	}else{
		top.layer.closeAll();
	}

}

function search() {
	reload();
}
function rSearch(t) {
	$(t).parent().find("input,select").val("");
}