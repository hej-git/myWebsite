package com.my.web.controller;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.upload.UploadFile;
import com.my.web.service.IndexService;
import com.my.web.service.LinkService;
import com.my.web.service.TypeService;
import org.apache.commons.lang3.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class LinkController extends Controller {
    public void index(){
        setAttr("typeid",getPara("typeid"));
        render("/link_list.html");
    }

    public void linkTab(){
        render("/link_tab.html");
    }
    public void addAndView(){
        setAttr("id",getPara("id"));
        String id = getPara("id");
        setAttr("typeid",getPara("typeid"));
        setAttr("link", LinkService.query(id));
        renderTemplate("/link_add.html");
    }

    public void queryList(){
        int page = getParaToInt("page");
        int limit = getParaToInt("limit");
        String name = getPara("name");
        String typeId = getPara("typeId");
        String where  = " where a.isdel=2  ";
        if(StringUtils.isNotEmpty(name)){
            where += " and a.name like '%"+name+"%'";
        }
        if(StringUtils.isNotEmpty(typeId)){
            where += " and a.typeid="+typeId;
        }
        Page<Record> pg = LinkService.queryList(page,limit,where);
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
        record.set("typeid",getPara("typeid"));
        record.set("imgurl",getPara("imgurl"));
        boolean flag = LinkService.save(record,id);
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
        int count = LinkService.delete(id);
        if(count>0){
            record.set("code","ok");
            record.set("msg","删除成功!");
        }else{
            record.set("code","fail");
            record.set("msg","删除失败!");
        }
        renderJson(record);
    }
    public void queryLink(){
        renderJson(LinkService.queryLink(getPara("typeid")));
    }

    public void search(){
        String pageStr = getPara("p");
        int size = 10;
        if(StringUtils.isEmpty(pageStr)){
            pageStr = "1";
        }
        int page = Integer.parseInt(pageStr);//页数
        String text = getPara("t");
        String where = " where  a.isdel=2 ";
        if(StringUtils.isNotEmpty(text)){
            where+=" and (a.name like'%"+text.trim()+"%' or a.remark like '%"+text.trim()+"%' or a.link like '%"+text.trim()+"%')";
        }
        Page<Record>pg = LinkService.querySearch(where,page,size);
        int maxPage = new BigDecimal(pg.getTotalRow()).divide(new BigDecimal(size),0,BigDecimal.ROUND_UP).intValue();
        setAttr("list",pg.getList());
        setAttr("maxPage",maxPage);
        setAttr("page",page+"");
        setAttr("text",text);
        List<String> list = new ArrayList<>();
        //当前页左侧
        if(page-3>1){
                list.add("1");
                list.add("…");
                for(int i=page-2;i<page;i++){
                    list.add(i+"");
                }
        }else{
            for(int i=1;i<page;i++){
                list.add(i+"");
            }
        }
        list.add(page+"");
        //当前页右侧
        if(page<(maxPage-3)){
            for(int i=page+1;i<page+3;i++){
                list.add(i+"");
            }
            list.add("…");
        }else{
            for(int i=page+1;i<maxPage;i++){
                list.add(i+"");
            }
        }
        if(page!=maxPage){
            list.add(maxPage+"");
        }
        setAttr("pageList",list);
        setAttr("type", TypeService.queryTree("link"));
        renderTemplate("/search.html");
    }

    public void upload(){
        List<UploadFile> pacts = getFiles();
        String fileName = pacts.get(0).getOriginalFileName();
        renderJson(new Record().set("path","/upload/"+fileName).set("name",fileName));
    }
}
