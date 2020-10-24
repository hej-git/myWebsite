package com.my.web.controller;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.render.Render;
import com.my.web.service.GoToService;
import com.my.web.service.IndexService;
import com.my.web.service.TypeService;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.sql.Timestamp;
import java.util.Date;

public class IndexController extends Controller {
    public void index(){
        /*保存访问量*/
        Record rd = getIp(getRequest());
        rd.set("code","index");
        rd.set("createtime", new Timestamp(new Date().getTime()));
        GoToService.save(rd);
        setAttr("type", TypeService.queryTree("link"));
        setAttr("list",TypeService.queryTree("all"));
        String term = getPara("term");
        if(StringUtils.isNotEmpty(term)){
            redirect("/index#"+term);
        }else{
            renderTemplate("/index.html");
        }

    }
    public void login(){
        render("/login.html");
    }
    public void loginCheck(){
        String password = getPara("password");
        Record record = new Record();
        if(IndexService.queryPassWord(password)){
            getSession().setAttribute("ps",password);
            record.set("code","ok");
        }else{
            record.set("code","fail");
            record.set("msg","进入密码错误,请重新输入!");
        }
        renderJson(record);
    }

    public void queryInfo(){
        renderJson(IndexService.queryInfo());
    }

    public void home(){
        /*判断当前页面是否存在session*/
        String ps = (String)getSession().getAttribute("ps");
        if(StringUtils.isNotEmpty(ps)){
            render("/home.html");
        }else{
            redirect("/index/login");
        }
    }
    public Record getIp(HttpServletRequest request){
        Record rd = new Record();
        String ip = request.getHeader("x-forwarded-for");
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("PRoxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        rd.set("ipaddress",ip);
        InetAddress a;
        try {
            a = InetAddress.getLocalHost();
            //System.out.println("主机名称: " + a.getHostName()+"ip:"+ip);
            rd.set("devicename",a.getHostName());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rd;
    }
}
