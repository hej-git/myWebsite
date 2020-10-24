package com.my.web.controller;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;
import com.my.web.service.IndexService;
import com.my.web.service.LiuyanService;
import com.my.web.service.TypeService;
import org.apache.commons.lang3.StringUtils;

import java.sql.Timestamp;
import java.util.Date;

public class LiuyanController extends Controller {
    public void index(){
        String pageStr = getPara("p");
        if(StringUtils.isEmpty(pageStr)){
            pageStr = "1";
        }
        int page = Integer.parseInt(pageStr);
        setAttr("type", TypeService.queryTree("link"));
        setAttr("data",LiuyanService.queryPage(page));
        renderTemplate("/liuyan.html");
    }
    public void submit(){
        Record rd = new Record();
        rd.set("name",getPara("name").trim());
        rd.set("mcontent",getPara("mcontent").trim());
        rd.set("email",getPara("email").trim());
        rd.set("createtime",new Timestamp(new Date().getTime()));
        String imgurl = LiuyanService.saveImg(getPara("email").trim());
        Boolean flag = LiuyanService.submit(rd,getPara("commentid").trim());
        if(flag){
            renderJson(new Record().set("code","ok").set("msg","评论成功!").set("imgurl",imgurl));
        }else{
            renderJson(new Record().set("code","ok").set("msg","评论失败!"));
        }
    }

}
