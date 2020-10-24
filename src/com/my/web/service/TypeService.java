package com.my.web.service;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class TypeService {
    public static Page<Record> queryList (int page,int limit ,String where){
        Page<Record> paginate = Db.paginate(page, limit, "select a.*,b.name pname ", " from my_type a left join my_type b on b.id = a.pid  "+where+" order by a.showorder asc,a.id desc");
        return paginate;
    }

    public static int delete(String id){
       return Db.update("update my_type set isdel=1 where id="+id);
    }

    public static boolean save(Record record,String id){
        if(StringUtils.isEmpty(id)){
            return  Db.update("insert into my_type (name,remark,pid,showorder,imgurl) values(?,?,?,?,?)",record.getStr("name"),
                    record.getStr("remark"),record.getStr("pid"),record.getStr("showorder"),record.getStr("imgurl"))>0?true:false;
        }else{
            return Db.update("my_type",record);
        }
    }

    public static Record  query(String id){
        String sql = "select * from my_type where id="+id;
        return Db.findFirst(sql);
    }

    /**
     * 查询数结构数据
     * @param type
     * @return
     */
    public static List<Record> queryTree(String type){
        /*查询主表*/
        String sql = "select name title,id,imgurl from my_type where isdel=2 and pid=0 order by showorder,id asc";
        List<Record> aList = Db.find(sql);
        if("type".equals(type)){//只查一级类别
            return aList;
        }
        /*查询分录表*/
        sql = "select name title,id,pid from my_type where isdel=2 and ifnull(pid,-1)<>-1  order by pid,showorder,id asc";
        List<Record> bList = Db.find(sql);
        /*查询所有链接*/
        sql = "select * from my_link ORDER BY typeid ,id asc ";
        List<Record> linkList = Db.find(sql);
        for(int i=0;i<aList.size();i++){
            Record r1 = aList.get(i);
            int id = r1.getInt("id");
            List<Record> children  = new ArrayList<Record>();
            for(int j=0;j<bList.size();j++){
                int pid = bList.get(j).getInt("pid");//一级类别id
                int cid = bList.get(j).getInt("id");//二级类别id
                if(pid==id){
                    if("all".equals(type)){//查询所有类别包括链接
                        List<Record> cLink  = new ArrayList<Record>();
                        for(int k=0;k<linkList.size();k++){//循环所有链接
                           Record link = linkList.get(k);
                           if(link.getInt("typeid")==cid){
                               cLink.add(link);
                           }
                        }
                        bList.get(j).set("children",cLink);
                    }
                    children.add(bList.get(j));
                }
            }
            aList.get(i).set("children",children);
        }
        return aList;
    }
    public static int queryCount(String id){
           return Db.find("select 1 from my_link where isdel=2 and  typeid="+id).size();
    }

    public static String queryOrderNum(String pid){
        Record rd = Db.findFirst("select ifnull(max(showorder),0)+1 num from my_type where pid="+pid);
        return  rd.getLong("num").toString();
    }

}
