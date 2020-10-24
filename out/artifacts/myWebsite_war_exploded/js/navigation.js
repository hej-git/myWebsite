
$(function () {
    initContent();
    $(".content-list-link").hover(function () {
        $(this).addClass("content-list-link1");
    },function () {
        $(this).removeClass("content-list-link1");
    });
});
function initContent() {
    $.post("/index/queryInfo",{},function (res) {
        if(res.length){
            for(var i=0;i<res.length;i++){
                var title = res[i].typename;
                var list = res[i].list;
                var $se = $("#div-hide .content-item").clone(true);
                var bsId = "se00"+i;
                $se.find("h3").text(title);
                $se.attr("id",bsId);
                $(".nav-ul").append("<li><a class='li-a' href='javascript:;' linkId='"+bsId+"'>"+title+"</a></li>");
                var $div = $se.find(".content-list");
                for(var j=0;j<list.length;j++){
                    var d = list[j];
                    var $a = $("#div-hide .content-list-link").clone(true);
                    $a.attr("href",d.link).attr("title",d.remark);
                    $a.find(".text").text(d.name);
                    $a.find(".ico").attr("src",d.imgurl);
                    $a.find(".info").text(d.remark);
                    $div.append($a);
                }
                $(".bd-content").append($se);
            }
            $(".li-a").click(function () {
                var baseId = $(this).attr("linkId");
                var $div = $('#' + baseId);
                var top = $div.offset().top || 0;
                $('html,body').animate({
                    'scroll-top': top - 70
                }, 500);

            });
        }
    });
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