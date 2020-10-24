package com.my.web.controller;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.upload.UploadFile;
import com.my.web.service.LinkFriendService;
import com.my.web.service.LinkFriendService;
import com.my.web.service.TypeService;
import org.apache.commons.lang3.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class LinkFriendController extends Controller {
    public void index(){
        setAttr("type", TypeService.queryTree("link"));
        setAttr("link",LinkFriendService.queryLink());
        renderTemplate("/youlian.html");
    }

    public void list(){
        setAttr("type", TypeService.queryTree("link"));
        renderTemplate("/link_friend_list.html");
    }
    public void addAndView(){
        setAttr("id",getPara("id"));
        String id = getPara("id");
        setAttr("link", LinkFriendService.query(id));
        renderTemplate("/link_friend_add.html");
    }

    public void queryList(){
        int page = getParaToInt("page");
        int limit = getParaToInt("limit");
        String name = getPara("name");
        String where  = " where a.isdel=2  ";
        if(StringUtils.isNotEmpty(name)){
            where += " and a.name like '%"+name+"%'";
        }
        Page<Record> pg = LinkFriendService.queryList(page,limit,where);
        Record data = new Record();
        data.set("data",pg.getList());
        data.set("code",0);
        data.set("count",pg.getTotalRow());
        renderJson(data);
    }


    public void save(){
        String id = getPara("id");
        Record record = new Record();
        if(StringUtils.isNotEmpty(id)){
            record.set("id",id);
        }
        record.set("name",getPara("name"));
        record.set("remark",getPara("remark"));
        record.set("link",getPara("link"));
        record.set("imgurl",getPara("imgurl"));
        boolean flag = LinkFriendService.save(record,id);
        record = new Record();
        if(flag){
            record.set("code","ok");
            record.set("msg","保存成功!");
        }else{
            record.set("code","fail");
            record.set("msg","保存失败!");
        }
        renderJson(record);
    }

    public void delete(){
        String id = getPara("id");
        Record record = new Record();
        int count = LinkFriendService.delete(id);
        if(count>0){
            record.set("code","ok");
            record.set("msg","删除成功!");
        }else{
            record.set("code","fail");
            record.set("msg","删除失败!");
        }
        renderJson(record);
    }
}
