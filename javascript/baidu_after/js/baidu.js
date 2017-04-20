var ip_location_handler;
var weather_handler;
var aqi_handler;
//var lunar_handler;
$(document).ready(function() {   
    var has_bg = "false";
    if (localStorage.has_bg !== "undefined") {
        has_bg = localStorage.has_bg;
    }
    console.log(localStorage.has_bg);
    var preview_origin = "";
    //网页加载完成后搜索框获得焦点
    $(".text_fields .input_text")[0].focus(); //jquery对象转换为DOM对象
    if (has_bg === "false") {
        console.log("nonono");
        $(".text_fields").css("border-top", "1px solid #3385ff");
        $(".text_fields").css("border-bottom", "1px solid #3385ff");
        $(".text_fields").css("border-left", "1px solid #3385ff");
    } else {
        //设置保存的背景
        preview_origin = localStorage.preview_origin;
        $("#s_skin_preview_skin").attr("src", preview_origin);
        $("#s_skin_preview_view").removeClass("preview-nobg");
        $("#s_skin_preview_view").addClass("preview-whitelogo");
        $(".s-skin-container").css("background-image", "url(" + localStorage.bg_url + ")");
        $("header").css("background-color", "rgba(0,0,0,0.3)");
        $("header").css("border", "0");
        $(".info .weather").css("color", "#fff");
        $(".s_icons>a").css("color", "#fff");
        $(".item>a").css("color", "#fff");
        $(".item_user_name>a").css("color", "#fff");
        $(".item_setting>a").css("color", "#fff");
        $("article .logo img").attr("src", "./images/logo_white.png");
        $(".text_fields").css("border-top", "1px solid #ccc");
        $(".text_fields").css("border-left", "1px solid #ccc");
        $(".text_fields").css("border-bottom", "1px solid #ccc");
        $(".text_fields").css("box-shadow", "1px 1px 3px #ededed");
        $(".search input").css("border", "#ccc");
        $(".search input").css("background-color", "#ccc");
        $(".search input").css("color", "#000");
        $(".bg-hideOrShowAjax").css("visibility", "visible");
        $(".s-skin-set").css("display", "block");
        $(".s-skin-set").addClass("skin-has-bg");
        $(".s-skin-set").removeClass("skin-no-bg");
    }

    //设置当搜索框获得焦点后，改变搜索框的颜色
    $(".text_fields .input_text").focus(function() {
        if (has_bg === "false") {
            $(".text_fields").css("border-top", "1px solid #3385ff");
            $(".text_fields").css("border-bottom", "1px solid #3385ff");
            $(".text_fields").css("border-left", "1px solid #3385ff");
        }
    });
    $(".text_fields .input_text").blur(function() {
        if (has_bg === "false") {
            $(".text_fields").css("border-top", "");
            $(".text_fields").css("border-bottom", "");
            $(".text_fields").css("border-left", "");
        }
    });

    //通过百度api的ip定位获得用户所在城市,用城市名查询天气
    /*
    $.ajax({
        type: "GET", //请求方式
        url: "http://api.map.baidu.com/location/ip?ak=EA795838e6eae9bc224c716faea9ea11&coor=bd09ll",
        dataType: "json", //返回的数据格式
        success: function(data) {
            // 响应成功 的回调函数
            console.log(data);
        }
    });
    */
    //测试jsonp的工作原理,可用于本地调试代码
    var myDate = new Date();
    var city_text;
    var iplocation_url = "http://api.map.baidu.com/location/ip?ak=EA795838e6eae9bc224c716faea9ea11&coor=bd09ll&callback=ip_location_handler"
    ip_location_handler = function(data) {
        console.log(data);
        if (data.status === 0) {
            city_text = data.content.address_detail.city.slice(0, 2);
            $(".info .weather .city").text(city_text + "：");
            weather();
            aqi();
        }
        $(script_get_city).remove();
    }
    var script_get_city = document.createElement('script');
    $(script_get_city).attr('src', iplocation_url);
    $("head").append($(script_get_city));

    //得到星期的字符串，传入new Date().getDay()
    var get_day = function(num) {
        var day;
        switch (num % 7) {
            case 0:
                day = "周日";
                break;
            case 1:
                day = "周一";
                break;
            case 2:
                day = "周二";
                break;
            case 3:
                day = "周三";
                break;
            case 4:
                day = "周四";
                break;
            case 5:
                day = "周五";
                break;
            case 6:
                day = "周六";
                break;
        }
        return day;
    }

    var get_weather_icon = function(type) {
        var icon_string;
        switch (type) {
            case '霾':
                icon_string = 'a53';
                break;
            case '阴':
                icon_string = 'a2';
                break;
            case '多云':
                icon_string = 'a1';
                break;
            case '晴':
                icon_string = 'a0';
                break;
            case '小雨':
                icon_string = 'a7';
                break;
            case '小到中雨':
                icon_string = 'a8';
                break;
            case '中雨':
                icon_string = 'a9';
                break;
            case '雷阵雨':
                icon_string = 'a4';
                break;
            case '阵雨':
                icon_string = 'a9';
                break;
            case '中到大雨':
                icon_string = 'a9';
                break;
            case '大雨':
                icon_string = 'a10';
                break;
            case '暴雨':
                icon_string = 'a11';
                break;
            case '大暴雨':
                icon_string = 'a12';
                break;
            case '特大暴雨':
                icon_string = 'a12';
                break;
            case '雨夹雪':
                icon_string = 'a6';
                break;
            case '小雪':
                icon_string = 'a13';
                break;
            case '小到中雪':
                icon_string = 'a15';
                break;
            case '中雪':
                icon_string = 'a16';
                break;
            case '阵雪':
                icon_string = 'a16';
                break;
            case '中到大雪':
                icon_string = 'a17';
                break;
            case '大雪':
                icon_string = 'a17';
                break;
            case '暴雪':
                icon_string = 'a17';
                break;
            case '大暴雪':
                icon_string = 'a17';
                break;
            case '特大暴雪':
                icon_string = 'a17';
                break;
        }
        return icon_string;
    }

    var weather = function() {
        //天气数据
        var weather_url = "http://wthrcdn.etouch.cn/weather_mini?city=" + city_text + "&callback=weather_handler";
        weather_handler = function(data) {
            console.log(data);
            if (data.status === 1000 && data.desc === "OK") {
                if (((myDate.getHours() >= 0 && myDate.getHours() < 7) ||
                        (myDate.getHours() >= 18 && myDate.getHours() <= 23)) &&
                    (data.data.forecast[0].type === "多云" || data.data.forecast[0].type === "晴")) {
                    $(".icon_state").css("background-image", 'url(./images/weather_icon_small/' + get_weather_icon(data.data.forecast[0].type) + '_night.png)');
                } else {
                    $(".icon_state").css("background-image", 'url(./images/weather_icon_small/' + get_weather_icon(data.data.forecast[0].type) + '.png)');
                }
                $(".temp_degree").text(data.data.wendu + "℃");
                //今天
                $(".today .everyday-link").attr("href", "https://www.baidu.com/s?tn=baidutop10&rsv_idx=2&wd=" + city_text + "天气预报");
                $(".today .everyday-title").attr("title", "今天(" + get_day(myDate.getDay()) + ")");
                $(".today .everyday-title").text("今天(" + get_day(myDate.getDay()) + ")");
                var icon = get_weather_icon(data.data.forecast[0].type);
                if (((myDate.getHours() >= 0 && myDate.getHours() < 7) ||
                        (myDate.getHours() >= 18 && myDate.getHours() <= 23)) &&
                    (data.data.forecast[0].type === "多云" || data.data.forecast[0].type === "晴")) {
                    $(".today .everyday-icon").attr("src", "./images/weather_icon/" + icon + "_night.jpg");
                } else {
                    $(".today .everyday-icon").attr("src", "./images/weather_icon/" + icon + ".jpg");
                }
                $(".today .everyday-temp").attr("title", data.data.wendu + "℃");
                $(".today .everyday-temp").text(data.data.wendu + "℃");
                $(".today .everyday-condition").attr("title", data.data.forecast[0].type);
                $(".today .everyday-condition").text(data.data.forecast[0].type);
                var fengli_tmp = data.data.forecast[0].fengli;
                var fengli = fengli_tmp.slice(0, fengli_tmp.length - 1);
                $(".today .everyday-wind").attr("title", fengli);
                $(".today .everyday-wind").text(fengli);
                //明天
                $(".tomorrow .everyday-link").attr("href", "https://www.baidu.com/s?tn=baidutop10&rsv_idx=2&wd=" + city_text + "天气预报");
                $(".tomorrow .everyday-title").attr("title", "明天(" + get_day(myDate.getDay() + 1) + ")");
                $(".tomorrow .everyday-title").text("明天(" + get_day(myDate.getDay() + 1) + ")");
                icon = get_weather_icon(data.data.forecast[1].type);
                $(".tomorrow .everyday-icon").attr("src", "./images/weather_icon/" + icon + ".jpg");
                var high_tmp = data.data.forecast[1].high;
                var high = high_tmp.slice(3, high_tmp.length - 1);
                var low_tmp = data.data.forecast[1].low;
                var low = low_tmp.slice(3, low_tmp.length - 1);
                $(".tomorrow .everyday-temp").attr("title", high + " ~ " + low + "℃");
                $(".tomorrow .everyday-temp").text(high + " ~ " + low + "℃");
                $(".tomorrow .everyday-condition").attr("title", data.data.forecast[1].type);
                $(".tomorrow .everyday-condition").text(data.data.forecast[1].type);
                fengli_tmp = data.data.forecast[1].fengli;
                fengli = fengli_tmp.slice(0, fengli_tmp.length - 1);
                $(".tomorrow .everyday-wind").attr("title", fengli);
                $(".tomorrow .everyday-wind").text(fengli);
                //后天
                $(".thirdday .everyday-link").attr("href", "https://www.baidu.com/s?tn=baidutop10&rsv_idx=2&wd=" + city_text + "天气预报");
                $(".thirdday .everyday-title").attr("title", "后天(" + get_day(myDate.getDay() + 2) + ")");
                $(".thirdday .everyday-title").text("后天(" + get_day(myDate.getDay() + 2) + ")");
                icon = get_weather_icon(data.data.forecast[2].type);
                $(".thirdday .everyday-icon").attr("src", "./images/weather_icon/" + icon + ".jpg");
                high_tmp = data.data.forecast[2].high;
                high = high_tmp.slice(3, high_tmp.length - 1);
                low_tmp = data.data.forecast[2].low;
                low = low_tmp.slice(3, low_tmp.length - 1);
                $(".thirdday .everyday-temp").attr("title", high + " ~ " + low + "℃");
                $(".thirdday .everyday-temp").text(high + " ~ " + low + "℃");
                $(".thirdday .everyday-condition").attr("title", data.data.forecast[2].type);
                $(".thirdday .everyday-condition").text(data.data.forecast[2].type);
                fengli_tmp = data.data.forecast[2].fengli;
                fengli = fengli_tmp.slice(0, fengli_tmp.length - 1);
                $(".thirdday .everyday-wind").attr("title", fengli);
                $(".thirdday .everyday-wind").text(fengli);
                //第四天
                $(".fourthday .everyday-link").attr("href", "https://www.baidu.com/s?tn=baidutop10&rsv_idx=2&wd=" + city_text + "天气预报");
                $(".fourthday .everyday-title").attr("title", "(" + get_day(myDate.getDay() + 3) + ")");
                $(".fourthday .everyday-title").text("(" + get_day(myDate.getDay() + 3) + ")");
                icon = get_weather_icon(data.data.forecast[3].type);
                $(".fourthday .everyday-icon").attr("src", "./images/weather_icon/" + icon + ".jpg");
                high_tmp = data.data.forecast[3].high;
                high = high_tmp.slice(3, high_tmp.length - 1);
                low_tmp = data.data.forecast[3].low;
                low = low_tmp.slice(3, low_tmp.length - 1);
                $(".fourthday .everyday-temp").attr("title", high + " ~ " + low + "℃");
                $(".fourthday .everyday-temp").text(high + " ~ " + low + "℃");
                $(".fourthday .everyday-condition").attr("title", data.data.forecast[3].type);
                $(".fourthday .everyday-condition").text(data.data.forecast[3].type);
                fengli_tmp = data.data.forecast[3].fengli;
                fengli = fengli_tmp.slice(0, fengli_tmp.length - 1);
                $(".fourthday .everyday-wind").attr("title", fengli);
                $(".fourthday .everyday-wind").text(fengli);
                //第五天
                $(".fifthday .everyday-link").attr("href", "https://www.baidu.com/s?tn=baidutop10&rsv_idx=2&wd=" + city_text + "天气预报");
                $(".fifthday .everyday-title").attr("title", "(" + get_day(myDate.getDay() + 4) + ")");
                $(".fifthday .everyday-title").text("(" + get_day(myDate.getDay() + 4) + ")");
                icon = get_weather_icon(data.data.forecast[4].type);
                $(".fifthday .everyday-icon").attr("src", "./images/weather_icon/" + icon + ".jpg");
                high_tmp = data.data.forecast[4].high;
                high = high_tmp.slice(3, high_tmp.length - 1);
                low_tmp = data.data.forecast[4].low;
                low = low_tmp.slice(3, low_tmp.length - 1);
                $(".fifthday .everyday-temp").attr("title", high + " ~ " + low + "℃");
                $(".fifthday .everyday-temp").text(high + " ~ " + low + "℃");
                $(".fifthday .everyday-condition").attr("title", data.data.forecast[4].type);
                $(".fifthday .everyday-condition").text(data.data.forecast[4].type);
                fengli_tmp = data.data.forecast[4].fengli;
                fengli = fengli_tmp.slice(0, fengli_tmp.length - 1);
                $(".fifthday .everyday-wind").attr("title", fengli);
                $(".fifthday .everyday-wind").text(fengli);
            }
            $(script_get_weather).remove();
        }
        var script_get_weather = document.createElement("script");
        $(script_get_weather).attr("src", weather_url);
        $("head").append($(script_get_weather));

    }

    var aqi = function() {
        //空气质量
        //yql中，&要写成%26
        var aqi_url = 'http://route.showapi.com/104-29?showapi_appid=26998%26showapi_sign=3c3ca60553d14c7996e51b23c38c27bc%26city=' + city_text;
        var q = 'select * from json where url="' + aqi_url + '"';
        var y_url = 'https://query.yahooapis.com/v1/public/yql?q=' + q + '&format=json&callback=aqi_handler';
        aqi_handler = function(data) {
            console.log(data);
            var data = data.query.results.json;
            if (data) {
                if (data.showapi_res_code === '0' && data.showapi_res_error === "") {
                    $(".pollution_name").text(data.showapi_res_body.pm.quality);
                    $(".pollution_num").text(data.showapi_res_body.pm.aqi);
                }
            }
            $(script_get_aqi).remove();
        }
        var script_get_aqi = document.createElement("script");
        $(script_get_aqi).attr("src", y_url);
        $("head").append($(script_get_aqi));
    }

    //农历
    var lunar_handler = function() {
        var lunar = calendar.solar2lunar();
        $(".lunar-calendar").text(lunar.cMonth + "月" + lunar.cDay + "日");
        $(".lunar-calendar").attr("title", lunar.cMonth + "月" + lunar.cDay + "日");
        $(".lunar-festival").text("农历 " + lunar.IMonthCn + lunar.IDayCn);
        $(".lunar-festival").attr("title", "农历 " + lunar.IMonthCn + lunar.IDayCn);
    }
    lunar_handler();
    /*
    var lunar = function() {
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var date = myDate.getDate();
        $(".lunar-calendar").text(month + "月" + date + "日");
        $(".lunar-calendar").attr("title", month + "月" + date + "日");
        var lunar_url = "http://api.tuijs.com/solarToLunar?year=" + year + "&month=" + month + "&day=" + date + "&callback=lunar_handler";
        lunar_handler = function(data) {
            console.log(data);
            if (data) {
                if (typeof data.term === "undefined") {
                    $(".lunar-festival").text("农历 " + data.lunarMonthName + data.lunarDayName);
                    $(".lunar-festival").attr("title", "农历 " + data.lunarMonthName + data.lunarDayName);
                } else {
                    $(".lunar-festival").text("农历 " + data.lunarMonthName + data.lunarDayName + "(" + data.term + ")");
                    $(".lunar-festival").attr("title", "农历 " + data.lunarMonthName + data.lunarDayName + "(" + data.term + ")");
                }
            }
            $(script_get_lunar).remove();
        }
        var script_get_lunar = document.createElement("script");
        $(script_get_lunar).attr("src", lunar_url);
        $("head").append($(script_get_lunar));
    }
    lunar();
    */

    //设置class为products_wrapper的div的高度为浏览器可见区域高度减去header的高度，
    //设置class为add_border的span的高度为浏览器可见区域高度，
    //从而当鼠标悬停在更多产品上，达到二级菜单占满整个浏览器的高度的效果；
    $(".add_border").css("height", $(window).height());   
    $(".products_wrapper").css("height", $(window).height() - 33);
    //窗口发生resize事件时重新设置
    $(window).resize(function() {
        $(".add_border").css("height", $(window).height());   
        $(".products_wrapper").css("height", $(window).height() - 33);
    });

    $(document).scroll(function() {
        //设置当用户滚动30px时，把回到顶部图标显示
        if ($(document).scrollTop() > 30) {
            $(".to_top").css("visibility", "visible");
        } else {
            $(".to_top").css("visibility", "hidden");
        }
        //设置当用户滚动170px时，把搜索框固定到顶部
        if ($(document).scrollTop() >= 161) {
            $("article .form_wrapper").css("position", "fixed");
            $("article .form_wrapper").css("top", 0);
            $("article .form_wrapper").css("left", 0);
            $("article .form_wrapper").css("height", "70px");
            $("article .form_wrapper").css("background-color", "rgba(255, 255, 255, 0.8)");
            $("article  form").css("margin", "15px auto 15px");
            $("article .form_wrapper").css("border-bottom", "1px solid #ebebeb");
            $("article .form_wrapper").css("box-shadow", "0px 1px 5px #888");
            $(".form_wrapper .fixed_logo").css("display", "block");
            $(".form_wrapper .fixed_logo").css("right", ($(window).width() / 2) + (636 / 2) + 27);
            $(".form_wrapper .fixed_logo").css("opacity", "1");
            if (has_bg === "true") {
                $(".text_fields").css("border-top", "");
                $(".text_fields").css("border-left", "");
                $(".text_fields").css("border-bottom", "");
                $(".text_fields").css("box-shadow", "");
                $(".search input").css("border", "");
                $(".search input").css("background-color", "");
                $(".search input").css("color", "");
            }
        } else {
            $("article .form_wrapper").css("position", "");
            $("article .form_wrapper").css("top", "");
            $("article .form_wrapper").css("left", "");
            $("article .form_wrapper").css("height", "");
            $("article .form_wrapper").css("background-color", "");
            $("article form").css("margin", "");
            $("article .form_wrapper").css("border-bottom", "");
            $("article .form_wrapper").css("box-shadow", "");
            $(".form_wrapper .fixed_logo").css("display", "");
            $(".form_wrapper .fixed_logo").css("right", "");
            $(".form_wrapper .fixed_logo").css("opacity", "");
            if (has_bg === "true") {
                $(".text_fields").css("border-top", "1px solid #ccc");
                $(".text_fields").css("border-left", "1px solid #ccc");
                $(".text_fields").css("border-bottom", "1px solid #ccc");
                $(".text_fields").css("box-shadow", "1px 1px 3px #ededed");
                $(".search input").css("border", "#ccc");
                $(".search input").css("background-color", "#ccc");
                $(".search input").css("color", "#000");
            }
        }
    });

    //回到顶部功能实现
    $(".to_top").mouseover(function() {
        //鼠标进入该区域，显示“回到顶部”汉字
        $(".top_icon").css("display", "none");
        $(".top_text").css("display", "block");
    });
    $(".to_top").mouseout(function() {
        //鼠标离开该区域，显示回到顶部的图标
        $(".top_text").css("display", "none");
        $(".top_icon").css("display", "block");
    });
    //点击返回顶部
    $(".to_top").click(function() {
        var factor = $(document).scrollTop() / 20;
        var id = setInterval(function() {
            if ($(document).scrollTop() == 0) {
                clearInterval(id);
            } else {
                $(document).scrollTop($(document).scrollTop() - factor);
            }
        }, 18);
    });

    //换肤功能
    $(".s-skin-layer").hide();
    $(".s-skin").click(function() {
        $(".s-skin-layer").slideDown();
    });
    $(".s-skin-up").click(function() {
        $(".s-skin-layer").slideUp();
    });
    //换肤层初始化
    $(".s-skin-content>li").hide();
    $(".s-skin-content .content-1000").show();
    var last_showed_skin = $(".s-skin-content .content-1000");
    var change_content_skin = function(show_this) {
        last_showed_skin.hide();
        last_showed_skin = show_this;
        //console.log(show_this);
        show_this.show();
    }

    //切换
    var elem_array = ['1000', '1012', '1011', '1010', '1009', '1001', '1002', '1004', '8888', '9999'];
    var last_clicked_skin = $(".s-skin-nav .nav-1000");
    var last_index = [0, 0, 0, 0];
    for (var i = 0; i < elem_array.length; i++) {
        var elem = elem_array[i];
        //closure
        (function(elem) {
            var tmp = $('.s-skin-content .content-' + elem);

            $(".s-skin-nav .nav-" + elem).bind("click", function() {
                last_clicked_skin.removeClass("choose-nav");
                last_clicked_skin = $(this);
                //console.log($(this));
                $(this).addClass("choose-nav");

                if (elem === "1000") {
                    $(".s-skin-page").show();
                } else {
                    $(".s-skin-page").hide();
                }

                if (elem === "1012") {
                    $(".s-skin-photo-body").css("padding", "0");
                    $(".s-skin-preview").css("padding-top", "46px");
                    $(".s-skin-photo-body>div:first-child").show();
                    tmp.children("ul").hide();
                    tmp.children(".cur").show();
                    $(".s-skin-photo-body>div:nth-child(2)").hide();
                    $(".s-skin-starNav").hide();
                    $(".s-skin-goddessNav").hide();
                } else if (elem === "1011") {
                    $(".s-skin-photo-body").css("padding", "0");
                    $(".s-skin-preview").css("padding-top", "46px");
                    $(".s-skin-photo-body>div:first-child").hide();
                    $(".s-skin-starNav").hide();
                    $(".s-skin-goddessNav").hide();
                    $(".s-skin-photo-body>div:nth-child(2)").show();
                    tmp.children("ul").hide();
                    tmp.children(".cur").show();
                } else if (elem === "1010") {
                    $(".s-skin-photo-body").css("padding", "0");
                    $(".s-skin-preview").css("padding-top", "46px");
                    $(".s-skin-goddessNav").show();
                    tmp.children("ul").hide();
                    tmp.children(".cur").show();
                    $(".s-skin-starNav").hide();
                    $(".s-skin-photo-body>div:first-child").hide();
                    $(".s-skin-photo-body>div:nth-child(2)").hide();
                } else if (elem === "1009") {
                    $(".s-skin-photo-body").css("padding", "0");
                    $(".s-skin-preview").css("padding-top", "46px");
                    $(".s-skin-starNav").show();
                    tmp.children("ul").hide();
                    tmp.children(".cur").show();
                    $(".s-skin-photo-body>div:first-child").hide();
                    $(".s-skin-photo-body>div:nth-child(2)").hide();
                    $(".s-skin-goddessNav").hide();
                } else {
                    $(".s-skin-photo-body").css("padding", "");
                    $(".s-skin-preview").css("padding-top", "");
                    $(".s-skin-starNav").hide();
                    $(".s-skin-photo-body>div:first-child").hide();
                    $(".s-skin-photo-body>div:nth-child(2)").hide();
                    $(".s-skin-goddessNav").hide();
                }

                if (elem === "8888") {
                    $("#s_skin_exhibition_mod").show();
                } else {
                    $("#s_skin_exhibition_mod").hide();
                }

                change_content_skin(tmp);
            });

            if (elem === "1012") {
                $(".s-skin-photo-body>div:first-child").delegate("li", "click", function() {
                    $($(".s-skin-photo-body>div:first-child li").get(last_index[0])).removeClass("cur");
                    $(tmp.children("ul").get(last_index[0])).removeClass("cur").hide();
                    last_index[0] = $(this).index();
                    $(this).addClass("cur");
                    $(tmp.children("ul").get($(this).index())).addClass("cur");
                    $(tmp.children("ul").get($(this).index())).show();
                });
            } else if (elem === "1011") {
                $(".s-skin-photo-body>div:nth-child(2)").delegate("li", "click", function() {
                    $($(".s-skin-photo-body>div:nth-child(2) li").get(last_index[1])).removeClass("cur");
                    $(tmp.children("ul").get(last_index[1])).removeClass("cur").hide();
                    last_index[1] = $(this).index();
                    $(this).addClass("cur");
                    $(tmp.children("ul").get($(this).index())).addClass("cur");
                    $(tmp.children("ul").get($(this).index())).show();
                });
            } else if (elem === "1010") {
                $(".s-skin-goddessNav").delegate("li", "click", function() {
                    $($(".s-skin-goddessNav li").get(last_index[2])).removeClass("cur");
                    $(tmp.children("ul").get(last_index[2])).removeClass("cur").hide();
                    last_index[2] = $(this).index();
                    $(this).addClass("cur");
                    $(tmp.children("ul").get($(this).index())).addClass("cur");
                    $(tmp.children("ul").get($(this).index())).show();
                });
            } else if (elem === "1009") {
                $(".s-skin-starNav").delegate("li", "click", function() {
                    $($(".s-skin-starNav li").get(last_index[3])).removeClass("cur");
                    $(tmp.children("ul").get(last_index[3])).removeClass("cur").hide();
                    last_index[3] = $(this).index();
                    $(this).addClass("cur");
                    $(tmp.children("ul").get($(this).index())).addClass("cur");
                    $(tmp.children("ul").get($(this).index())).show();
                });
            }

            //实际换肤
            var root_elem = document.querySelector(".s-skin-content .content-" + elem + " ul");
            if (elem === "1012" || elem === "1011" || elem === "1010" || elem === "1009") {
                root_elem = document.querySelector(".s-skin-content .content-" + elem);
                for (var i = 0; i < root_elem.childNodes.length; i++) {
                    //预览
                    bind(root_elem.childNodes[i], "mouseover", function(e) {
                        var target = getEventTag(e);
                        if (target.tagName.toLowerCase() === "p") {
                            var tmp = target.parentNode.getElementsByTagName("img")[0];
                            var num = $(tmp).attr("src");
                            $("#s_skin_preview_skin").attr("src", num);
                            $("#s_skin_preview_view").removeClass("preview-nobg");
                            $("#s_skin_preview_view").addClass("preview-whitelogo");
                        }
                    });
                    bind(root_elem.childNodes[i], "mouseout", function(e) {
                        $("#s_skin_preview_skin").attr("src", preview_origin);
                        if ($("#s_skin_preview_skin").attr("src") === "") {
                            $("#s_skin_preview_view").addClass("preview-nobg");
                            $("#s_skin_preview_view").removeClass("preview-whitelogo");
                        }
                    });
                    //换肤
                    bind(root_elem.childNodes[i], "click", function(e) {
                        skin_changer(e);
                    });
                }
            } else {
                //预览
                bind(root_elem, "mouseover", function(e) {
                    var target = getEventTag(e);
                    if (target.tagName.toLowerCase() === "p") {
                        var tmp = target.parentNode.getElementsByTagName("img")[0];
                        var num = $(tmp).attr("src");
                        $("#s_skin_preview_skin").attr("src", num);
                        $("#s_skin_preview_view").removeClass("preview-nobg");
                        $("#s_skin_preview_view").addClass("preview-whitelogo");
                    }
                });
                bind(root_elem, "mouseout", function(e) {
                    $("#s_skin_preview_skin").attr("src", preview_origin);
                    if ($("#s_skin_preview_skin").attr("src") === "") {
                        $("#s_skin_preview_view").addClass("preview-nobg");
                        $("#s_skin_preview_view").removeClass("preview-whitelogo");
                    }
                });
                //换肤
                bind(root_elem, "click", function(e) {
                    skin_changer(e);
                });
            }

        })(elem);
    }

    function getEventTag(e) {
        var e = e || window.event;
        return e.target || e.srcElement;
    }

    function bind(elem, type, fn) {
        if (elem.attachEvent) {
            elem.attachEvent("on" + type, fn);
        }
        if (elem.addEventListener) {
            elem.addEventListener(type, fn, false);
        }
    }
    var skin_changer = function(e) {
        var target = getEventTag(e);
        if (target.tagName.toLowerCase() === "p") {
            has_bg = "true";
            localStorage.has_bg = "true";
            $("header").css("background-color", "rgba(0,0,0,0.3)");
            $("header").css("border", "0");
            $(".info .weather").css("color", "#fff");
            $(".s_icons>a").css("color", "#fff");
            $(".item>a").css("color", "#fff");
            $(".item_user_name>a").css("color", "#fff");
            $(".item_setting>a").css("color", "#fff");
            $("article .logo img").attr("src", "./images/logo_white.png");
            $(".text_fields").css("border-top", "1px solid #ccc");
            $(".text_fields").css("border-left", "1px solid #ccc");
            $(".text_fields").css("border-bottom", "1px solid #ccc");
            $(".text_fields").css("box-shadow", "1px 1px 3px #ededed");
            $(".search input").css("border", "#ccc");
            $(".search input").css("background-color", "#ccc");
            $(".search input").css("color", "#000");
            $(".bg-hideOrShowAjax").css("visibility", "visible");
            $(".s-skin-set").css("display", "block");
            $(".s-skin-set").addClass("skin-has-bg");
            $(".s-skin-set").removeClass("skin-no-bg");
            preview_origin = $("#s_skin_preview_skin").attr("src");
            localStorage.preview_origin = preview_origin;
            var tmp = target.parentNode.getElementsByTagName("img")[0];
            var num = $(tmp).attr("src");
            var image_num = num.slice(-9, -6);
            $(".s-skin-container").css("background-color", "rgb(64, 64, 64)");
            $(".s-skin-container").css("background-image", "url('https://ss1.bdstatic.com/kvoZeXSm1A5BphGlnYG/skin/" + image_num + ".jpg?2')");
            localStorage.bg_url = 'https://ss1.bdstatic.com/kvoZeXSm1A5BphGlnYG/skin/' + image_num + '.jpg?2';
        }
    }

    //不使用换肤
    $(".s-skin-set").click(function() {
        has_bg = "false";
        localStorage.has_bg = "false";
        localStorage.preview_origin = "";
        localStorage.bg_url = "";
        $(".s-skin-set").css("display", "none");
        $(".s-skin-set").addClass("skin-no-bg");
        $(".s-skin-set").removeClass("skin-has-bg");
        $("header").css("background-color", "");
        $("header").css("border", "");
        $(".info .weather").css("color", "");
        $(".s_icons>a").css("color", "");
        $(".item>a").css("color", "");
        $(".item_user_name>a").css("color", "");
        $(".item_setting>a").css("color", "");
        $("article .logo img").attr("src", "./images/bd_logo.png");
        $(".text_fields").css("border-top", "");
        $(".text_fields").css("border-left", "");
        $(".text_fields").css("border-bottom", "");
        $(".text_fields").css("box-shadow", "");
        $(".search input").css("border", "");
        $(".search input").css("background-color", "");
        $(".search input").css("color", "");
        $(".bg-hideOrShowAjax").css("visibility", "hidden");
        $(".s-skin-container").css("background-color", "");
        $(".s-skin-container").css("background-image", "");
        $("#s_skin_preview_view").addClass("preview-nobg");
        $("#s_skin_preview_view").removeClass("preview-whitelogo");
        $("#s_skin_preview_skin").attr("src", "");
    });

    //主要内容中顶部导航条点击更换相应内容
    //初始化的时候显示推荐
    $(".main_content>div").hide();
    $("#s_xmancard_news").show();
    $(".main").css("height", $(document).height() - 293);
    var last_showed = $("#s_xmancard_news");
    var change_content = function(show_this) {
        last_showed.hide();
        last_showed = show_this;
        show_this.show();
        $(".main").css("height", "");
        $(".main").css("height", $(document).height() - 293);
    }

    var last_clicked = $("#s_menus_wrapper span:first-child");
    //  切换到推荐
    $("#s_menus_wrapper span:first-child").bind("click", function() {
        last_clicked.removeClass("current");
        last_clicked = $(this);
        $(this).addClass("current");
        change_content($("#s_xmancard_news"));
    });
    //切换到导航
    $("#s_menus_wrapper span:nth-child(2)").bind("click", function() {
        last_clicked.removeClass("current");
        last_clicked = $(this);
        $(this).addClass("current");
        change_content($("#s_xmancard_nav"));
    });
    //切换到视频
    $("#s_menus_wrapper span:nth-child(3)").bind("click", function() {
        last_clicked.removeClass("current");
        last_clicked = $(this);
        $(this).addClass("current");
        change_content($("#s_xmancard_video"));
    });
    //切换到购物
    $("#s_menus_wrapper span:nth-child(4)").bind("click", function() {
        last_clicked.removeClass("current");
        last_clicked = $(this);
        $(this).addClass("current");
        change_content($("#s_xmancard_shopping"));
    });
    //切换到我的关注
    $("#s_menu_mine").bind("click", function() {
        last_clicked.removeClass("current");
        last_clicked = $(this);;
        $(this).addClass("current");
        change_content($("#s_xmancard_mine"));
    });



});
