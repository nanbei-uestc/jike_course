$(document).ready(function() {   

    //设置导航条各菜单的宽度
    var nav_ul = document.getElementsByClassName('mainMenu');
    var li_list = nav_ul[0].getElementsByTagName("li");
    for (var i = 0; i < li_list.length; i++) {
        if (i === 8) {
            var wid = (100 / 3).toString();
            li_list[i].style.width = wid + '%';
        } else {
            var wid_2 = (100 / 6).toString();
            li_list[i].style.width = wid_2 + '%';
        }
    }

    //获得文档宽度
    function getActualWidth() {
        var actualWidth = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth ||
            document.body.offsetWidth;

        return actualWidth;
    }

    //刷新获得新闻
    var refresh_news = function(type) {
        var lists = $("article ul");
        lists.empty();

        $.ajax({
            url: "./server/getnews.php",
            type: "get",
            datatype: "json",
            data:{newstype:type},
            success: function(data) {
                console.log(data);
                data.forEach(function(val, i) {
                    var list = $("<li></li>").addClass("news_list").prependTo(lists);
                    var newsimg = $("<div></div>").addClass("news_img").appendTo(list);
                    var img = $("<img>")
                        .attr({ "src": val.newsimg, "width": "100%", "height": "auto" })
                        .appendTo(newsimg);
                    var newscontent = $("<div></div>").addClass("news_content").appendTo(list);
                    var newstitle = $("<div></div>")
                        .html(val.newstitle)
                        .addClass("news_title")
                        .appendTo(newscontent);
                    var p = $("<p></p>").appendTo(newscontent);
                    var newstime = $("<span></span>")
                        .html(val.newstime)
                        .addClass("news_time")
                        .appendTo(p);
                    var newssource = $("<span></span>")
                        .html(val.newssrc)
                        .addClass("news_source")
                        .appendTo(p);
                });
            }
        });
    }

    refresh_news("精选");
    
    //根据类型获取新闻
    $("nav a").click(function(e){
        e.preventDefault();
        var type=$(this).attr("txt");
        //console.log(type);
        refresh_news(type);
    });



});
