package com.my.web.service;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.my.web.util.RelativeDateFormat;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class LiuyanService {

        public static boolean   submit(Record rd,String commentid){
            String email = rd.getStr("email");
            /*保存评论*/
            String table = "my_comment";
            if(StringUtils.isNotEmpty(commentid)){//有回复id的
                table = "my_reply";
                rd.set("commentid",commentid);
            }
            try{
                boolean flag = Db.save(table,rd);
                return flag;
            }catch (Exception e){
                return false;
            }
        }

        public static   String getImg(){
            String[] doc = {"/images/tx1.png", "/images/tx2.png", "/images/tx3.png", "/images/tx4.png"};
            int index = (int) (Math.random() * doc.length);
            return doc[index];
        }

        public static String saveImg(String email){
            /*查询该邮箱是否已经有过头像*/
            String sql = "select imgurl from my_portrait where email='"+email+"' ";
            Record rd = Db.findFirst(sql);
            if(rd!=null){
                return  rd.getStr("imgurl");
            }else{
                String img = getImg();
                Db.update("insert into my_portrait(email,imgurl)values(?,?)",email,img);
                return img;
            }
        }

        public static Record queryPage(int page){
            /*查询评论表*/
            Record data = new Record();
            Page<Record> pg = Db.paginate(page,5,"select a.*,b.imgurl "," from my_comment a left join my_portrait b on b.email = a.email  order  by a.createtime desc");
            List<Record>alist = pg.getList();
            String ids = "";
            for(int i=0;i<alist.size();i++){
                ids+=alist.get(i).getInt("id")+",";
            }
            /*查询评论回复表*/
            List<Record> objList = new ArrayList<Record>();
            if(ids.length()>0){
                String sql = "select a.*,b.imgurl from my_reply a left join my_portrait b on b.email = a.email where commentid in("+ids.substring(0,ids.length()-1)+") order by commentid,createtime asc ";
                List<Record>hfList = Db.find(sql);
                for(int i=0;i<alist.size();i++){
                    int  id = alist.get(i).getInt("id");
                    Date date = alist.get(i).getDate("createtime");
                    alist.get(i).set("createtimestr", RelativeDateFormat.format(date));
                    for(int j=0;j<hfList.size();j++){
                        Record hf = hfList.get(j);
                        if(id==hf.getInt("commentid")){
                            hf.set("createtimestr",RelativeDateFormat.format(hf.getDate("createtime")));
                            objList.add(hf);
                        }
                    }
                    alist.get(i).set("children",objList);
                    objList = new ArrayList<Record>();
                }
            }
            int maxPage = pg.getTotalPage();
            List<String> list = new ArrayList<>();
            data.set("list",alist);
            data.set("page",page);
            data.set("total",pg.getTotalRow());
            data.set("maxPage",pg.getTotalPage());
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
            if(page!=maxPage&&maxPage>0){
                list.add(maxPage+"");
            }
            data.set("pageList",list);
            return data;
        }

}
