(function($){ 
    $(document).ready(function(){
        // 侧栏菜单初始状态设置
        if(theme.minNav != '1')trigger_resizable(true);
        $("[data-toggle='tooltip']").tooltip();
        // 主题状态
        intoSearch();
        //粘性页脚
        stickFooter();
        // 网址块提示 
        if(isPC()){ $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'}); }else{ $('.qr-img[data-toggle="tooltip"]').tooltip({trigger: 'hover'}); }
        // 初始化tab滑块
        intoSlider();
        // 初始化theiaStickySidebar
        $('.sidebar').theiaStickySidebar({
            additionalMarginTop: 90,
            additionalMarginBottom: 20
        });
        initActive();
        var href = window.location.href;
        var hrefArr = href.split("#");
        if(hrefArr.length>0){
            $("a[href=#"+hrefArr[1]+"]").click();
        }

    });
    // Enable/Disable Resizable Event
    var wid = 0;
    $(window).resize(function() {
		clearTimeout(wid);
        wid = setTimeout(go_resize, 200); 
    });
    function go_resize() {
        stickFooter(); 
        //if(theme.minNav != '1'){
            trigger_resizable();
        //}
    }
    // count-a数字动画
    $('.count-a').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
    $(document).on('click', "a[target!='_blank']", function() {
        if( theme.loading=='1' && $(this).attr('href') && $(this).attr('href').indexOf("#") != 0 && $(this).attr('href').indexOf("java") != 0 && !$(this).data('fancybox') ){
            var load = $('<div id="load-loading"></div>');
            $("body").prepend(load);
            load.animate({opacity:'1'},200,'swing').delay(3000).hide(300,function(){ load.remove() });
        }
    });
    //返回顶部
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 50) {
            $('#go-to-up').fadeIn(200);
        } else {
            $('#go-to-up').fadeOut(200);
        }
    });
    $('.go-up').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    return false;
    }); 

    //滑块菜单
    $('.slider_menu').children("ul").children("li").not(".anchor").hover(function() {
        $(this).addClass("hover");
        //$('li.anchor').css({
        //    transform: "scale(1.05)",
        //}),
        toTarget($(this).parent()) 
    }, function() {
        //$('li.anchor').css({
        //    transform: "scale(1)",
        //}),
        $(this).removeClass("hover") 
    });
    $('.slider_menu').mouseleave(function(e) {
        var menu = $(this).children("ul");
        window.setTimeout(function() { 
            toTarget(menu) 
        }, 50)
    }) ;  
    function intoSlider() {
        $(".slider_menu[sliderTab]").each(function() {
            if(!$(this).hasClass('into')){
                var menu = $(this).children("ul");
                menu.prepend('<li class="anchor" style="position:absolute;width:0;height:28px"></li>');
                var target = menu.find('.active').parent();
                if(0 < target.length){
                    menu.children(".anchor").css({
                        left: target.position().left + target.scrollLeft() + "px",
                        width: target.outerWidth() + "px",
                        height: target.height() + "px",
                        opacity: "1"
                    })
                }
                $(this).addClass('into');
            }
        })
    }
    //粘性页脚
    function stickFooter() {
        $('.main-footer').attr('style', '');
	    if($('.main-footer').hasClass('text-xs'))
	    {
	    	var win_height				 = jQuery(window).height(),
	    		footer_height			 = $('.main-footer').outerHeight(true),
	    		main_content_height	     = $('.main-footer').position().top + footer_height ;
	    	if(win_height > main_content_height - parseInt($('.main-footer').css('marginTop'), 10))
	    	{
	    		$('.main-footer').css({
	    			marginTop: win_height - main_content_height  
	    		});
	    	}
        }
    }
 

    $('#sidebar-switch').on('click',function(){
        $('#sidebar').removeClass('mini-sidebar');

    }); 
 
    // Trigger Resizable Function
    var isMin = false,
        isMobileMin = false;
    function trigger_resizable( isNoAnim=false ) {
        if( (theme.minNav == '1' && !isMin && 767.98<$(window).width() )||(!isMin && 767.98<$(window).width() && $(window).width()<1024) ){
            //$('#mini-button').removeAttr('checked');
            $('#mini-button').prop('checked', false);
            trigger_lsm_mini(isNoAnim);
            isMin = true;
            if(isMobileMin){
                $('#sidebar').addClass('mini-sidebar');
                isMobileMin = false;
            }
        }
        else if( ( theme.minNav != '1')&&((isMin && $(window).width()>=1024) || ( isMobileMin && !isMin && $(window).width()>=1024 ) ) ){
            $('#mini-button').prop('checked', true);
            trigger_lsm_mini(isNoAnim);
            isMin = false;
            if(isMobileMin){
                isMobileMin = false;
            }
        }
        else if($(window).width() < 767.98 && $('#sidebar').hasClass('mini-sidebar')){
            $('#sidebar').removeClass('mini-sidebar');
            isMobileMin = true;
            isMin = false;
        }
    }
    // sidebar-menu-inner收缩展开
    $('.sidebar-menu-inner a').on('click',function(){//.sidebar-menu-inner a //.has-sub a  

        //console.log('--->>>'+$(this).find('span').text());
        if (!$('.sidebar-nav').hasClass('mini-sidebar')) {//菜单栏没有最小化   
            $(this).parent("li").siblings("li.sidebar-item").children('ul').slideUp(200);
            if ($(this).next().css('display') == "none") { //展开
                //展开未展开
                // $('.sidebar-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(200);
                $(this).parent('li').addClass('sidebar-show').siblings('li').removeClass('sidebar-show');
            }else{ //收缩
                //收缩已展开
                $(this).next('ul').slideUp(200);
                //$('.sidebar-item.sidebar-show').removeClass('sidebar-show');
                $(this).parent('li').removeClass('sidebar-show');
            }
        }
    });
    //菜单栏最小化
    $('#mini-button').on('click',function(){
        trigger_lsm_mini();

    });
    function trigger_lsm_mini( isNoAnim = false){
        if ($('.header-mini-btn input[type="checkbox"]').prop("checked")) {
            $('.sidebar-nav').removeClass('mini-sidebar');
            $('.sidebar-menu ul ul').css("display", "none");
            if(isNoAnim)
            $('.sidebar-nav').width(220);
            else
            $('.sidebar-nav').stop().animate({width: 220},100);
        }else{
            $('.sidebar-item.sidebar-show').removeClass('sidebar-show');
            $('.sidebar-menu ul').removeAttr('style');
            $('.sidebar-nav').addClass('mini-sidebar');
            if(isNoAnim)
            $('.sidebar-nav').width(60);
            else
            $('.sidebar-nav').stop().animate({width : 60},100);
        }
        //$('.sidebar-nav').css("transition","width .3s");
    }
    //显示2级悬浮菜单
    $(document).on('mouseover','.mini-sidebar .sidebar-menu ul:first>li,.mini-sidebar .flex-bottom ul:first>li',function(){
        var offset = 2;
        if($(this).parents('.flex-bottom').length!=0)
            offset = -3;
        var $div = $(this).clone(true);
        $div.find(".my-a").addClass("my-a1");
        $(".sidebar-popup.second").length == 0 && ($("body").append("<div class='second sidebar-popup sidebar-menu-inner text-sm'><div></div></div>"));
        $(".sidebar-popup.second>div").html($div.html());
        $(".sidebar-popup.second").show();
        var top = $(this).offset().top - $(window).scrollTop() + offset; 
        var d = $(window).height() - $(".sidebar-popup.second>div").height();
        if(d - top <= 0 ){
            top  = d >= 0 ?  d - 8 : 0;
        }
        smoothClick();
        $(".sidebar-popup.second").stop().animate({"top":top}, 50);
    });
    //隐藏悬浮菜单面板
    $(document).on('mouseleave','.mini-sidebar .sidebar-menu ul:first, .mini-sidebar .slimScrollBar,.second.sidebar-popup',function(){
        $(".sidebar-popup.second").hide();
    });
    //常驻2级悬浮菜单面板
    $(document).on('mouseover','.mini-sidebar .slimScrollBar,.second.sidebar-popup',function(){
        $(".sidebar-popup.second").show();
    });

    //首页tab模式请求内容
    $(document).on('click', '.ajax-list a', function(event) {
        event.preventDefault();
        loadAjax( $(this), $(this).parents('.ajax-list') , '.'+$(this).data('target'));
    });

    $(document).on('click', '.ajax-list-home a', function(event) {
        event.preventDefault();
        loadAjax( $(this), $(this).parents('.ajax-list-home'), '.ajax-'+$(this).parents('.ajax-list-home').data('id') );
    });

    function loadAjax(t,parent,body = ".ajax-list-body"){
        if( !t.hasClass('active') ){
            parent.find('a').removeClass('active');
            t.addClass('active');
            if($(body).children(".ajax-loading").length == 0)
                $(body).append('<div class="ajax-loading text-center rounded" style="position:absolute;display:flex;width:100%;top:-1rem;bottom:.5rem;background:rgba(125,125,125,.5)"><div class="col align-self-center"><i class="iconfont icon-loading icon-spin icon-2x"></i></div></div>');
            $.ajax({
                url: theme.ajaxurl,
                type: 'POST', 
                dataType: 'json',
                data : {typeid:t.attr("data-id")},
                cache: true
            })
            .done(function(data) {
                if (data) {
                    $(body).html('');
                    for(var i=0;i<data.length;i++){
                        var d = data[i];
                        var $div = getDiv();
                        $div.find(".card").attr("href","/go?lkid="+d.id)
                            .attr("data-id",d.id)
                            .attr("title",d.remark)
                            .addClass("site-"+d.id);
                        $div.find("strong").text(d.name);
                        $div.find("p").text(d.remark);
                        $div.find(".lazy").attr("src",d.imgurl);
                        $div.find(".togo").attr("href","/go?lkid="+d.id).attr("data-id",d.id);
                        $(body).append($div);
                    }
                    if(isPC()){ $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'}); }
                } else {
                    $('.ajax-loading').remove();
                }
            })
            .fail(function() { 
                $('.ajax-loading').remove();
            }) 
        }
    }
    var isEdit = false;
    function getItem(key = "myLinks") {
        var a = window.localStorage.getItem(key);
        return a ? a = JSON.parse(a) : [];
    }
    function setItem(sites,key = "myLinks") {
        window.localStorage.setItem(key, JSON.stringify(sites));
    }
    function removeSite() {
        var id = $(this).data("id"), 
            sites = getItem();
        for (var i = 0; i < sites.length; i++){
            if ( parseInt(sites[i].id) === parseInt(id)) {
                console.log(sites[i].id, id);
                sites.splice(i, 1);
                break;
            }
        }
        setItem(sites);
        $(this).parent().remove();
    }
    function removeLiveSite() {
        var id = $(this).data("id"), 
            sites = getItem("livelists");
        for (var i = 0; i < sites.length; i++){
            if ( parseInt(sites[i].id) === parseInt(id)) {
                console.log(sites[i].id, id);
                sites.splice(i, 1);
                break;
            }
        }
        setItem(sites,"livelists");
        $(this).parent().remove();
    }
    $(document).on('click', '.url-card a.card', function(event) {
        var site = {
            id: $(this).data("id"),
            name: $(this).find("strong").html(),
            url: $(this).data("url")
        };
        if(site.url==="")
            return;
        var liveList = getItem("livelists");
        var isNew = true;
        for (var i = 0; i < liveList.length; i++){
            if (liveList[i].name === site.name) {
                isNew = false;
            }
        }
        if(isNew){
            var maxSite = theme.customizemax;
            if(liveList.length > maxSite-1){
                $(".my-click-list .site-"+liveList[maxSite-1].id).parent().remove();
                liveList.splice(maxSite-1, 1);
            }
            //addSite(site,true,true);
            liveList.unshift(site);
            setItem(liveList,"livelists");
        }
    });
    $.fn.textSlider = function(settings) {
		settings = jQuery.extend({
			speed: "normal",
			line: 2,
			timer: 1000
		},
		settings);
		return this.each(function() {
			scllor($(this), settings)
		})
	};
	function scllor($this, settings) {
		var ul = $("ul:eq(0)", $this);
		var timerID;
		var li = ul.children();
		var _btnUp = $(".up:eq(0)", $this);
		var _btnDown = $(".down:eq(0)", $this);
		var liHight = $(li[0]).height();
		var upHeight = 0 - settings.line * liHight;
		var scrollUp = function() {
			_btnUp.unbind("click", scrollUp);
			ul.animate({
				marginTop: upHeight
			},
			settings.speed,
			function() {
				for (i = 0; i < settings.line; i++) {
					ul.find("li:first").appendTo(ul)
				}
				ul.css({
					marginTop: 0
				});
				_btnUp.bind("click", scrollUp)
			})
		};
		var scrollDown = function() {
			_btnDown.unbind("click", scrollDown);
			ul.css({
				marginTop: upHeight
			});
			for (i = 0; i < settings.line; i++) {
				ul.find("li:last").prependTo(ul)
			}
			ul.animate({
				marginTop: 0
			},
			settings.speed,
			function() {
				_btnDown.bind("click", scrollDown)
			})
		};
		var autoPlay = function() {
			timerID = window.setInterval(scrollUp, settings.timer)
		};
		var autoStop = function() {
			window.clearInterval(timerID)
		};
		ul.hover(autoStop, autoPlay).mouseout();
		_btnUp.css("cursor", "pointer").click(scrollUp);
		_btnUp.hover(autoStop, autoPlay);
		_btnDown.css("cursor", "pointer").click(scrollDown);
        _btnDown.hover(autoStop, autoPlay);
         
        document.addEventListener('visibilitychange',function(){
            if(document.visibilityState=='hidden') {
                autoStop;
            }else {
                autoPlay;
            }
        });
    }
    
    // 搜索模块 -----------------------
    function intoSearch() {
        toTarget($(".s-type-list.big"),false,false);
        $('.hide-type-list .s-current').removeClass("s-current");
        $('.hide-type-list input:radio[name="type"]:checked').parents(".search-group").addClass("s-current"); 
        $('.hide-type-list input:radio[name="type2"]:checked').parents(".search-group").addClass("s-current");
        $(".super-search-fm").attr("action",$('.hide-type-list input:radio:checked').val());
        $(".search-key").attr("placeholder",$('.hide-type-list input:radio:checked').data("placeholder")); 
    }
    $(document).on('click', '.s-type-list label', function(event) {
        //event.preventDefault();
        $('.s-type-list.big label').removeClass('active');
        $(this).addClass('active');
        window.localStorage.setItem("searchlistmenu", $(this).data("id"));
        var parent = $(this).parents(".s-search");
        parent.find('.search-group').removeClass("s-current");
        parent.find('#'+$(this).attr("for")).parents(".search-group").addClass("s-current"); 
        toTarget($(this).parents(".s-type-list"),false,false);
    });
    $('.hide-type-list .search-group input').on('click', function() {
        var parent = $(this).parents(".s-search");
        window.localStorage.setItem("searchlist", $(this).attr("id").replace("m_",""));
        parent.children(".super-search-fm").attr("action",$(this).val());
        parent.find(".search-key").attr("placeholder",$(this).data("placeholder"));
        parent.find(".search-key").attr("zhannei",$(this).attr("zhannei"));
        parent.find(".search-key").select();
        parent.find(".search-key").focus();
    });
    $(document).on("click", "#searchBtn", function() {
        var key = $(this).parent().find(".search-key").val();
        if(key == "")
            return false;
        else{
            var zhannei = $(this).parent().find(".search-key").attr("zhannei")=="true"?true:false;
            if(zhannei){//站内搜索
                   searchContent();
            }else{
                window.open( $(this).parent().attr("action") + key);
            }
            return false;
        }
    });
    function getSmartTips(value,parents) {
        $.ajax({
            type: "GET",
            url: "//sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su",
            async: true,
            data: { wd: value },
            dataType: "jsonp",
            jsonp: "cb",
            success: function(res) {
                var list = parents.children(".search-smart-tips");
                list.children("ul").text("");
                tipsList = res.s.length;
                if (tipsList) {
                    for (var i = 0; i < tipsList; i++) {
                        list.children("ul").append("<li>" + res.s[i] + "</li>");
                        list.find("li").eq(i).click(function() {
                            var keyword = $(this).html();
                            parents.find(".smart-tips.search-key").val(keyword);
                            parents.children(".super-search-fm").submit();
                            list.slideUp(200);
                        });
                    };
                    list.slideDown(200);
                } else {
                    list.slideUp(200)
                }
            },
            error: function(res) {
                tipsList = 0;
            }
        })
    }
    var listIndex = -1;
    var parent;
    var tipsList = 0;
    var isZhannei = false;
    $(document).on("blur", ".smart-tips.search-key", function() {
        parent = '';
        $(".search-smart-tips").slideUp(200)
    });
    $(document).on("focus", ".smart-tips.search-key", function() {
        isZhannei = $(this).attr('zhannei')!=''?true:false;
        parent = $(this).parents('#search');
        if ($(this).val() && !isZhannei) {
            getSmartTips($(this).val(),parent)
        }
    });
    $(document).on("keyup", ".smart-tips.search-key", function(e) {
        isZhannei = $(this).attr('zhannei')!=''?true:false;
        parent = $(this).parents('#search');
        if ($(this).val()) {
            if (e.keyCode == 38 || e.keyCode == 40 || isZhannei) {
                return
            }
            getSmartTips($(this).val(),parent);
            listIndex = -1;
        } else {
            $(".search-smart-tips").slideUp(200)
        }
    });
    $(document).on("keydown", ".smart-tips.search-key", function(e) {
        parent = $(this).parents('#search');
        if (e.keyCode === 40) {
            listIndex === (tipsList - 1) ? listIndex = 0 : listIndex++;
            parent.find(".search-smart-tips ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = parent.find(".search-smart-tips ul li").eq(listIndex).html();
            parent.find(".smart-tips.search-key").val(hotValue)
        }
        if (e.keyCode === 38) {
            if (e.preventDefault) {
                e.preventDefault()
            }
            if (e.returnValue) {
                e.returnValue = false
            }
            listIndex === 0 || listIndex === -1 ? listIndex = (tipsList - 1) : listIndex--;
            parent.find(".search-smart-tips ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = parent.find(".search-smart-tips ul li").eq(listIndex).html();
            parent.find(".smart-tips.search-key").val(hotValue)
        }
    });
})(jQuery);
function isPC() {
    let u = navigator.userAgent;
    let Agents = ["Android", "iPhone", "webOS", "BlackBerry", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    let flag = true;
    for (let i = 0; i < Agents.length; i++) {
      if (u.indexOf(Agents[i]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
}
function toTarget(menu, padding = true, isMult = true) {
    var slider =  menu.children(".anchor");
    var target = menu.children(".hover").first() ;
    if (target && 0 < target.length){
    }
    else{
        if(isMult)
            target = menu.find('.active').parent();
        else
            target = menu.find('.active');
    }
    if(0 < target.length){
        if(padding)
        slider.css({
            left: target.position().left + target.scrollLeft() + "px",
            width: target.outerWidth() + "px",
            opacity: "1"
        });
        else
        slider.css({
            left: target.position().left + target.scrollLeft() + (target.outerWidth()/4) + "px",
            width: target.outerWidth()/2 + "px",
            opacity: "1"
        });
    }
    else{
        slider.css({
            opacity: "0"
        })
    }
}
  
function initActive() {
    $(".navbar-nav li").click(function () {
        $(".navliAvtive").removeClass("navliAvtive");
        $(this).addClass("navliAvtive");
    });
    smoothClick();
}

function smoothClick() {
    $(".smooth").click(function () {
        $("#searchContent").remove();
        $("#initContent").show();
        var id = $(this).attr("href");
        $(id).parents(".menu").find(".hover").removeClass("hover");
        $(id).parent().addClass("hover");
        toTarget($(id).parents(".menu"));
        $(id).click();
    });
}

function searchContent() {
    var text = $("#search-text").val()||"";
    //隐藏页面主体内容
    window.location.href="/link/search?t="+text+"&p=1";
}

function getDiv() {
    var $div = $('\t<div class="url-card col-6 col-sm-6 col-md-4 col-xl-5a col-xxl-6a ajax-url mycard">\n' +
        '<div class="url-body default">\n' +
        '<a href="" target="_blank" data-id="" class="card no-c mb-4 " data-toggle="tooltip" data-placement="bottom" title="">\n' +
        '<div class="card-body">\n' +
        '<div class="url-content d-flex align-items-center">\n' +
        '<div class="url-img rounded-circle mr-2 d-flex align-items-center justify-content-center"> <img class="lazy" src=""> </div>\n' +
        '<div class="url-info flex-fill">\n' +
        '<div class="text-sm overflowClip_1"> <strong></strong> </div>\n' +
        '<p class="overflowClip_1 m-0 text-muted text-xs"></p>\n' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</a>' +
        '<a href="" class="togo text-center text-muted is-views" target="_blank" data-id="" data-toggle="tooltip" data-placement="right" title="直达"><i class="iconfont icon-goto"></i></a>' +
        '</div>' +
        '</div>');
    return $div;
}


/*博客园线条样式*/
! function() {

    function n(n, e, t) {

        return n.getAttribute(e) || t

    }

    function e(n) {

        return document.getElementsByTagName(n)

    }

    function t() {

        var t = e("script"),
            o = t.length,
            i = t[o - 1];

        return {

            l: o,
            z: n(i, "zIndex", -1),
            o: n(i, "opacity", .5),
            c: n(i, "color", "0,0,0"),
            n: n(i, "count", 99)

        }

    }

    function o() {

        a = m.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,

            c = m.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

    }

    function i() {

        r.clearRect(0, 0, a, c);

        var n, e, t, o, m, l;

        s.forEach(function(i, x) {

            for(i.x += i.xa, i.y += i.ya, i.xa *= i.x > a || i.x < 0 ? -1 : 1, i.ya *= i.y > c || i.y < 0 ? -1 : 1, r.fillRect(i.x - .5, i.y - .5, 1, 1), e = x + 1; e < u.length; e++) n = u[e],

            null !== n.x && null !== n.y && (o = i.x - n.x, m = i.y - n.y,

                l = o * o + m * m, l < n.max && (n === y && l >= n.max / 2 && (i.x -= .03 * o, i.y -= .03 * m),

                t = (n.max - l) / n.max, r.beginPath(), r.lineWidth = t / 2, r.strokeStyle = "rgba(" + d.c + "," + (t + .2) + ")", r.moveTo(i.x, i.y), r.lineTo(n.x, n.y), r.stroke()))

        }),

            x(i)

    }

    var a, c, u, m = document.createElement("canvas"),

        d = t(),
        l = "c_n" + d.l,
        r = m.getContext("2d"),
        x = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||

            function(n) {

                window.setTimeout(n, 1e3 / 45)

            },

        w = Math.random,
        y = {
            x: null,
            y: null,
            max: 2e4
        };
    m.id = l, m.style.cssText = "position:fixed;top:0;left:0;z-index:" + d.z + ";opacity:" + d.o, e("body")[0].appendChild(m), o(), window.onresize = o,

        window.onmousemove = function(n) {

            n = n || window.event, y.x = n.clientX, y.y = n.clientY

        },

        window.onmouseout = function() {

            y.x = null, y.y = null

        };

    for(var s = [], f = 0; d.n > f; f++) {

        var h = w() * a,
            g = w() * c,
            v = 2 * w() - 1,
            p = 2 * w() - 1;
        s.push({
            x: h,
            y: g,
            xa: v,
            ya: p,
            max: 6e3
        })

    }

    u = s.concat([y]),

        setTimeout(function() {
            i()
        }, 100)

}();