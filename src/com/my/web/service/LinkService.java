package com.my.web.service;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class LinkService {
    public static Page<Record> queryList (int page, int limit , String where){
        Page<Record> paginate = Db.paginate(page, limit, "select a.*,b.name typename ", " from my_link a left join my_type b on b.id = a.typeid "+where+" order by a.id desc");
        return paginate;
    }

    public static int delete(String id){
        return Db.update("update my_link set isdel=1 where id="+id);
    }
    public static boolean save(Record record,String id){
        if(StringUtils.isEmpty(id)){
            return  Db.save("my_link",record);
        }else{
            return Db.update("my_link",record);
        }
    }

    public static Record query(String id){
        String sql = "select * from my_link where id="+id;
        return Db.findFirst(sql);
    }


    public static List<Record> queryLink(String typeid){
        String sql = "select * from my_link where  isdel=2 and  typeid ="+typeid;
        return Db.find(sql);
    }
    public static Page<Record> querySearch(String where,int page,int size){
        return Db.paginate(page,size,"select a.* ","from  my_link a left join my_type b on b.id = a.typeid "+where);
    }
}
