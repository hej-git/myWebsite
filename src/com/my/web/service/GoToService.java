package com.my.web.service;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class GoToService {
    private static String table = "my_link_visit";

    /**
     * 保存数据
     * @param record
     * @return
     */
    public static boolean save(Record record){
            return  Db.save(table,record);
    }

    /**
     * 查询链接地址
     * @param linkId
     * @return
     */
    public static String queryLink(String linkId){
        Record rd = Db.findFirst("select link from my_link where id="+linkId);
        return  rd.getStr("link");
    }
}
