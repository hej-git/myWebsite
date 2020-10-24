package com.my.web.service;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

import java.util.ArrayList;
import java.util.List;

public class IndexService {
        public static Record query() {
            return Db.findFirst("select * from ww_user");
        }

    public static Boolean queryPassWord(String password) {
            long count = Db.queryLong("select count(1) from my_user where password=?",password);
         return count>0?true:false;
    }

    public static List<Record> queryInfo(){
            List<Record> list = Db.find("select a.name typename,b.name,b.link,b.remark,b.typeid,b.imgurl from my_type a left join my_link b on a.id = b.typeid where a.isdel=2 and b.isdel=2 order by a.id,b.id asc");
            String typename = "";
            List<Record> objList = new ArrayList<Record>();
            List<Record> rdList = new ArrayList<Record>();
            Record obj = new Record();
            for (int i=0;i<list.size();i++){
                Record rd = list.get(i);
                String name = rd.getStr("typename");
                if("".equals(typename)){
                    typename = name;
                    obj.set("typename",typename);
                }
                if(!typename.equals(name)){
                    typename = name;
                    obj.set("list",rdList);
                    objList.add(obj);
                    obj = new Record();
                    rdList = new ArrayList<Record>();
                    obj.set("typename",typename);
                }
                rdList.add(rd);
                if(i==list.size()-1){
                    obj.set("list",rdList);
                    objList.add(obj);
                }
            }
          return objList   ;
    }

}
