package com.my.web.service;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class LinkFriendService {
    public static Page<Record> queryList (int page, int limit , String where){
        Page<Record> paginate = Db.paginate(page, limit, "select a.* ", " from my_link_friend a "+where+" order by a.id desc");
        return paginate;
    }

    public static int delete(String id){
        return Db.update("update my_link_friend set isdel=1 where id="+id);
    }
    public static boolean save(Record record,String id){
        if(StringUtils.isEmpty(id)){
            return  Db.save("my_link_friend",record);
        }else{
            return Db.update("my_link_friend",record);
        }
    }

    public static Record query(String id){
        String sql = "select * from my_link_friend where id="+id;
        return Db.findFirst(sql);
    }


    public static List<Record> queryLink(){
        String sql = "select * from my_link_friend where  isdel=2 order by id asc";
        return Db.find(sql);
    }

}
