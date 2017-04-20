$(document).ready(function() { 
    //切换搜索框
    $(".search_icon").click(function() {
        $("header .searchbox").addClass("scale");
        console.log("sfsf");
    });
    $("#close-btn").click(function() {
        $("header .searchbox").removeClass("scale");
    })

    //切换课程显示方式 
    $(".kuai-icon").click(function() {
        if (!$("#changeid").hasClass("lesson-list")) {
            $("#changeid").removeClass();
            $("#changeid").addClass("lesson-list");
        }
    });
    $(".list-icon").click(function() {
        if (!$("#changeid").hasClass("lesson-list2")) {
            $("#changeid").removeClass();
            $("#changeid").addClass("lesson-list2");
            $(".lesson-list2 .lesson-infor .lessonicon-box").css("bottom", "");
        }
    });
    //切换到别的页面
    $("#page-nav .pages").delegate(".page-number", "click", function() {
        if (!$(this).hasClass("pgCurrent")) {
            var page_num = $(this).text();
            //console.log(page_num);
            window.location.href = "http://www.jikexueyuan.com/course/?pageNum=" + page_num;
        }
    });
    $("#page-nav .pages li:nth-child(11)").click(function() {
        var page_num = parseInt($("#page-nav .pages .pgCurrent").text())+1;
        window.location.href = "http://www.jikexueyuan.com/course/?pageNum=" + page_num;
    })
    $("#page-nav .pages li:nth-child(12)").click(function() {
        var page_num = 95;
        window.location.href = "http://www.jikexueyuan.com/course/?pageNum=" + page_num;
    })
    $("#page-nav .pages .go").click(function() {
        var page_num = $("#page-nav .pages .pagenow input").val();
        window.location.href = "http://www.jikexueyuan.com/course/?pageNum=" + page_num;
    })

    //回到顶部
    $(document).scroll(function() {
        //设置当用户滚动30px时，把回到顶部图标显示
        if ($(document).scrollTop() > 30) {
            $(".top").css("visibility", "visible");
        } else {
            $(".top").css("visibility", "hidden");
        }
    });
    $(".top").click(function() {
        var factor = $(document).scrollTop() / 20;
        var id = setInterval(function() {
            if ($(document).scrollTop() == 0) {
                clearInterval(id);
            } else {
                $(document).scrollTop($(document).scrollTop() - factor);
            }
        }, 18);
    });


});
