package com.my.web.controller;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.my.web.service.TypeService;
import org.apache.commons.lang3.StringUtils;

public class TypeController extends Controller {
    public void index(){
        setAttr("pid",getPara("pid"));
        renderTemplate("/type_list.html");
    }
    public void indexTab(){
        setAttr("pid",getPara("pid"));
        renderTemplate("/type_tab.html");
    }

    public void addAndView(){
        setAttr("id",getPara("id"));
        String id = getPara("id");
        String pid = getPara("pid");
        Record type = TypeService.query(id);
        //默认生成顺序
        if(StringUtils.isEmpty(id)){
            if(type == null){
                type = new Record();
            }
            type.set("showorder",TypeService.queryOrderNum(pid));
            type.set("pid",pid);
        }
        setAttr("type",type);
        renderTemplate("/type_add.html");
    }

    public void typeTree(){
        setAttr("type",getPara("type"));
        renderTemplate("/type_tree.html");
    }

    public void queryList(){
        int page = getParaToInt("page");
        int limit = getParaToInt("limit");
        String name = getPara("name");
        String pid = getPara("pid");
        String where  = " where a.isdel=2  ";
        if(StringUtils.isNotEmpty(name)){
            where += " and a.name like '%"+name+"%'";
        }
        if(StringUtils.isNotEmpty(pid)){
            where += " and a.pid ="+pid;
        }
        Page<Record> pg = TypeService.queryList(page,limit,where);
        Record data = new Record();
        data.set("data",pg.getList());
        data.set("code",0);
        data.set("count",pg.getTotalRow());
        renderJson(data);
    }
    public void queryTree(){
        renderJson(TypeService.queryTree(getPara("type")));
    }

    public void save(){
        String id = getPara("id");
        String pid = getPara("pid");
        Record record = new Record();
        record.set("id",id);
        record.set("name",getPara("name"));
        record.set("remark",getPara("remark"));
        record.set("imgurl",getPara("imgurl"));
        record.set("showorder",getPara("showorder"));
        record.set("pid",StringUtils.isNotEmpty(pid)?pid:"0");
        boolean flag = TypeService.save(record,id);
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
        if(TypeService.queryCount(id)>0){
            record.set("code","fail");
            record.set("msg","删除失败!该类别已被引用!");
        }else{
            int count = TypeService.delete(id);
            if(count>0){
                record.set("code","ok");
                record.set("msg","删除成功!");
            }else{
                record.set("code","fail");
                record.set("msg","删除失败!");
            }
        }
        renderJson(record);
    }
}
