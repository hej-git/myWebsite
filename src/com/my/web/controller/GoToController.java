package com.my.web.controller;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;
import com.my.web.service.GoToService;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.sql.Timestamp;
import java.util.Date;

/**
 * 去往链接
 */
public class GoToController extends Controller {
    public void index(){
        String lkid = getPara("lkid");
        if(StringUtils.isNotEmpty(lkid)){
            Record rd = getIp(getRequest());
            /*增加链接对应访问次数*/
            rd.set("linkid",lkid);
            rd.set("code","link");
            rd.set("createtime", new Timestamp(new Date().getTime()));
            GoToService.save(rd);
            /*查询对应链接信息*/
            String linkUrl = GoToService.queryLink(lkid);
            setAttr("title","正在导航...");
            setAttr("link",linkUrl);
        }else{
            setAttr("title","导航失败，正在前往首页");
            setAttr("link","/index");
        }
        renderTemplate("/goTo.html");
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