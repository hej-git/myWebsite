package com.my.web;

import com.jfinal.config.*;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.c3p0.C3p0Plugin;
import com.jfinal.template.Engine;
import com.my.web.controller.*;

public class JfinalConfig extends JFinalConfig {
    // 配置常量值  `如开发模式常量 devMode 的配置，默认视图类型 ViewType的配置`
    public void configConstant(Constants me) {
        loadPropertyFile("datasource.properties");
        //me.setBaseUploadPath("upload");
        me.setEncoding("UTF-8");
        me.setDevMode(true);
    }

    // 配置 JFinal 访问路由  如下代码配置了将”/hello”映射到 HelloController 这个控制器  http://localhost/hello 将 访 问 HelloController.index() 方
    public void configRoute(Routes me) {
        me.add("/index", IndexController.class);
        me.add("/type", TypeController.class);
        me.add("/link", LinkController.class);
        me.add("/ly", LiuyanController.class);
        me.add("/yl", LinkFriendController.class);
        me.add("/go", GoToController.class);
    }

    @Override
    public void configEngine(Engine engine) {


    }

    // 配置 JFinal 的 Plugin 如数据库访问插件
    public void configPlugin(Plugins me) {
        C3p0Plugin c3p0Plugin = new C3p0Plugin(getProperty("url"),getProperty("username"),getProperty("password")) ;
        me.add(c3p0Plugin);
        ActiveRecordPlugin arp = new ActiveRecordPlugin(c3p0Plugin);
        me.add(arp);
    }

    // 配置 JFinal 的全局拦截器
    public void configInterceptor(Interceptors me) {
    }

    // 配置JFinal的Handler
    public void configHandler(Handlers me) {
    }
}
