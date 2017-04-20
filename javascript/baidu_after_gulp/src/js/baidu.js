 /*运用迭代器模式，来给多个类似dom节点绑定点击事件，把dom元素写进数组，如果
  *之后要增加类似的dom节点并且也要绑定类似的事件，我们可以把新的dom节点简单的
  *加进数组里*/
 //外部迭代器
 var iterator = function(array) {
     var current = 0;
     return {
         next: function() {
             current += 1;
         },
         is_done: function() {
             return current >= array.length;
         },
         get_current_item: function() {
             return array[current];
         }
     }
 }

 //判断是否为函数类型
 function is_function(fn) {
     return (!!fn && !fn.nodename && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn + ""));
 }

 //运用单例模式,jsonp_processer是唯一实例，所有jsonp请求都通过
 //这个唯一实例来完成，通过封装这一对象，使得代码可读性大大提高
 var jsonp_processer = (function(obj_name) {
     var that = {};
     var script = [];
     var _fn = [];
     that.req = function(url, fn) {
         var url2 = url + "&callback=" + obj_name + ".callback";
         that.callback(fn);
         var scr = document.createElement("script");
         script.push(scr);
         document.head.appendChild(scr);
         scr.setAttribute('src', url2);
     }
     that.callback = function(unknow_type) {
         if (!is_function(unknow_type)) {
             _fn[0].apply(this, arguments);
             _fn.shift();
             if (_fn.length === 0) {
                 for (var i = 0; i < script.length; i++) {
                     document.head.removeChild(script[i]);
                 }
                 script = [];
             }
         } else {
             _fn.push(unknow_type);
         }
     }
     return that;
 }("jsonp_processer"));


 $(document).ready(function(e) { 

     var getEventTag = (function(e) {
         if (e.target) { //W3C
             return function(e) {
                 return e.target;
             }
         } else if (window.event.srcElement) { //IE
             return function(e) {
                 return window.event.srcElement;
             }
         }
     }(e));

     var bind = (function(elem, type, fn) {
         if (window.addEventListener) {
             return function(elem, type, fn) { elem.addEventListener(type, fn, false) };
         } else if (window.attachEvent) {
             return function(elem, type, fn) { elem.attachEvent("on" + type, fn) };
         }
     }());

     //通过has_bg获取之前是否设置过背景  
     var has_bg = "false";
     if (localStorage.has_bg !== "undefined") {
         has_bg = localStorage.has_bg;
     }
     var preview_origin = localStorage.preview_origin;
     //网页加载完成后搜索框获得焦点
     $(".text_fields .input_text")[0].focus(); //jquery对象转换为DOM对象
     //根据是否设置过背景初始化网页
     if (has_bg === "false") {
         //console.log("nonono");
         $(".text_fields").css("border-top", "1px solid #3385ff")
             .css("border-bottom", "1px solid #3385ff")
             .css("border-left", "1px solid #3385ff");
     } else {
         //设置保存的背景
         $("#s_skin_preview_skin").attr("src", localStorage.preview_origin)
             .removeClass("preview-nobg")
             .addClass("preview-whitelogo");
         $(".s-skin-container").css("background-image", "url(" + localStorage.bg_url + ")");
         $("header").css("background-color", "rgba(0,0,0,0.3)")
             .css("border", "0");
         $(".info .weather").css("color", "#fff");
         $(".s_icons>a").css("color", "#fff");
         $(".item>a").css("color", "#fff");
         $(".item_user_name>a").css("color", "#fff");
         $(".item_setting>a").css("color", "#fff");
         $("article .logo img").attr("src", "./img/logo_white.png");
         $(".text_fields").css("border-top", "1px solid #ccc")
             .css("border-left", "1px solid #ccc")
             .css("border-bottom", "1px solid #ccc")
             .css("box-shadow", "1px 1px 3px #ededed");
         $(".search input").css("border", "#ccc")
             .css("background-color", "#ccc")
             .css("color", "#000");
         $(".bg-hideOrShowAjax").css("visibility", "visible");
         $(".s-skin-set").css("display", "block")
             .addClass("skin-has-bg")
             .removeClass("skin-no-bg");
     }

     //设置当搜索框获得焦点后，改变搜索框的颜色
     $(".text_fields .input_text").focus(function() {
         if (has_bg === "false") {
             $(".text_fields").css("border-top", "1px solid #3385ff")
                 .css("border-bottom", "1px solid #3385ff")
                 .css("border-left", "1px solid #3385ff");
         }
     });
     $(".text_fields .input_text").blur(function() {
         if (has_bg === "false") {
             $(".text_fields").css("border-top", "")
                 .css("border-bottom", "")
                 .css("border-left", "");
         }
     });

     //通过百度api的ip定位获得用户所在城市,用城市名查询天气
     //测试jsonp的工作原理,可用于本地调试代码
     var myDate = new Date();
     var city_text;
     var iplocation_url = "http://api.map.baidu.com/location/ip?ak=EA795838e6eae9bc224c716faea9ea11&coor=bd09ll"
     var ip_location_handler = function(data) {
         console.log(data);
         if (data.status === 0) {
             city_text = data.content.address_detail.city.slice(0, 2);
             $(".info .weather .city").text(city_text + "：");
             weather(); //天气
             aqi(); //空气质量
         }
     }
     jsonp_processer.req(iplocation_url, ip_location_handler);



     var weather = function() {
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

         var weather_word_slice = function(data) {
             var data1;
             if (data.length >= 4) {
                 var true_include = false;
                 var index_include;
                 for (var i = 0; i < data.length; i++) {
                     if (data[i] === "转") {
                         index_include = i;
                         true_include = true;
                         break;
                     }
                 }
                 if (true_include) {
                     data1 = data.slice(-(data.length - index_include - 1));
                 } else {
                     data1 = data;
                 }
             } else {
                 data1 = data;
             }
             return data1;
         }

         //天气数据
         var weather_url = "http://api.map.baidu.com/telematics/v3/weather?location=" + city_text + "&output=json&ak=EA795838e6eae9bc224c716faea9ea11";
         var weather_handler = function(data) {
             console.log(data);
             if (data.error === 0 && data.status === "success") {
                 if (((myDate.getHours() >= 0 && myDate.getHours() < 7) ||
                         (myDate.getHours() >= 18 && myDate.getHours() <= 23)) &&
                     (data.results[0].weather_data[0].weather === "多云" || data.results[0].weather_data[0].weather === "晴")) {
                     $(".icon_state").css("background-image", 'url(./img/weather_icon_small/' + get_weather_icon(data.results[0].weather_data[0].weather) + '_night.png)');
                 } else {
                     $(".icon_state").css("background-image", 'url(./img/weather_icon_small/' + get_weather_icon(data.results[0].weather_data[0].weather) + '.png)');
                 }
                 $(".temp_degree").text(data.results[0].weather_data[0].temperature);
                 //今天
                 $(".today .everyday-link").attr("href", "https://www.baidu.com/s?tn=baidutop10&rsv_idx=2&wd=" + city_text + "天气预报");
                 $(".today .everyday-title").attr("title", "今天(" + get_day(myDate.getDay()) + ")")
                     .text("今天(" + get_day(myDate.getDay()) + ")");
                 var icon = get_weather_icon(weather_word_slice(data.results[0].weather_data[0].weather));
                 if (((myDate.getHours() >= 0 && myDate.getHours() < 7) ||
                         (myDate.getHours() >= 18 && myDate.getHours() <= 23)) &&
                     (data.results[0].weather_data[0].weather === "多云" || data.results[0].weather_data[0].weather === "晴")) {
                     $(".today .everyday-icon").attr("src", "./img/weather_icon/" + icon + "_night.jpg");
                 } else {
                     $(".today .everyday-icon").attr("src", "./img/weather_icon/" + icon + ".jpg");
                 }
                 $(".today .everyday-temp").attr("title", data.results[0].weather_data[0].temperature)
                     .text(data.results[0].weather_data[0].temperature);
                 $(".today .everyday-condition").attr("title", data.results[0].weather_data[0].weather)
                     .text(data.results[0].weather_data[0].weather);
                 var fengli = data.results[0].weather_data[0].wind;
                 $(".today .everyday-wind").attr("title", fengli)
                     .text(fengli);

                 //明天，后天，第三天，第四天，第五天
                 var _day = ['.tomorrow', '.thirdday', '.fourthday', '.fifthday'];
                 var _day_2 = ['明天', '后天'];
                 data.results[0].weather_data.shift();
                 data.results[0].weather_data.push(data.results[0].weather_data[2]);

                 //迭代器模式
                 var set_wea = function(iterator1, iterator2, iterator3) {
                     var i = 0;

                     while (!iterator1.is_done()) {
                         var cur1 = iterator1.get_current_item();
                         var cur2 = iterator2.get_current_item();
                         var cur3 = iterator3.get_current_item();
                         i += 1;

                         $(cur1 + " .everyday-link").attr("href", "https://www.baidu.com/s?tn=baidutop10&rsv_idx=2&wd=" + city_text + "天气预报");
                         if (i < 3) {
                             $(cur1 + " .everyday-title").attr("title", cur2 + "(" + get_day(myDate.getDay() + i) + ")")
                                 .text(cur2 + "(" + get_day(myDate.getDay() + i) + ")");
                         } else {
                             $(cur1 + " .everyday-title").attr("title", get_day(myDate.getDay() + i))
                                 .text(get_day(myDate.getDay() + i));
                         }
                         icon = get_weather_icon(weather_word_slice(cur3.weather));
                         $(cur1 + " .everyday-icon").attr("src", "./img/weather_icon/" + icon + ".jpg");
                         $(cur1 + " .everyday-temp").attr("title", cur3.temperature)
                             .text(cur3.temperature);
                         $(cur1 + " .everyday-condition").attr("title", cur3.weather)
                             .text(cur3.weather);
                         fengli = cur3.wind;
                         $(cur1 + " .everyday-wind").attr("title", fengli)
                             .text(fengli);


                         iterator1.next();
                         iterator2.next();
                         iterator3.next();
                     }
                 }

                 var iterator1 = iterator(_day);
                 var iterator2 = iterator(_day_2);
                 var iterator3 = iterator(data.results[0].weather_data);
                 set_wea(iterator1, iterator2, iterator3);
             }
         }
         jsonp_processer.req(weather_url, weather_handler);
     }

     var aqi = function() {
         //空气质量
         //yql中，&要写成%26
         var aqi_url = 'http://route.showapi.com/104-29?showapi_appid=26998%26showapi_sign=3c3ca60553d14c7996e51b23c38c27bc%26city=' + city_text;
         var q = 'select * from json where url="' + aqi_url + '"';
         var y_url = 'https://query.yahooapis.com/v1/public/yql?q=' + q + '&format=json';
         var aqi_handler = function(_data) {
             console.log(_data);
             var data = _data.query.results.json;
             if (data) {
                 if (data.showapi_res_code === '0' && data.showapi_res_error === "") {
                     $(".pollution_name").text(data.showapi_res_body.pm.quality);
                     $(".pollution_num").text(data.showapi_res_body.pm.aqi);
                 }
             }
         }
         jsonp_processer.req(y_url, aqi_handler);
     }

     //农历
     var lunar_handler = function() {
         var lunar = calendar.solar2lunar();
         $(".lunar-calendar").text(lunar.cMonth + "月" + lunar.cDay + "日")
             .attr("title", lunar.cMonth + "月" + lunar.cDay + "日");
         $(".lunar-festival").text("农历 " + lunar.IMonthCn + lunar.IDayCn)
             .attr("title", "农历 " + lunar.IMonthCn + lunar.IDayCn);
     }
     lunar_handler();


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
             $("article .form_wrapper").css("position", "fixed")
                 .css("top", 0)
                 .css("left", 0)
                 .css("height", "70px")
                 .css("background-color", "rgba(255, 255, 255, 0.8)");
             $("article  form").css("margin", "15px auto 15px");
             $("article .form_wrapper").css("border-bottom", "1px solid #ebebeb")
                 .css("box-shadow", "0px 1px 5px #888");
             $(".form_wrapper .fixed_logo").css("display", "block")
                 .css("right", ($(window).width() / 2) + (636 / 2) + 27)
                 .css("opacity", "1");
             if (has_bg === "true") {
                 $(".text_fields").css("border-top", "")
                     .css("border-left", "")
                     .css("border-bottom", "")
                     .css("box-shadow", "");
                 $(".search input").css("border", "")
                     .css("background-color", "")
                     .css("color", "");
             }
         } else {
             $("article .form_wrapper").css("position", "")
                 .css("top", "")
                 .css("left", "")
                 .css("height", "")
                 .css("background-color", "");
             $("article form").css("margin", "");
             $("article .form_wrapper").css("border-bottom", "")
                 .css("box-shadow", "");
             $(".form_wrapper .fixed_logo").css("display", "")
                 .css("right", "")
                 .css("opacity", "");
             if (has_bg === "true") {
                 $(".text_fields").css("border-top", "1px solid #ccc")
                     .css("border-left", "1px solid #ccc")
                     .css("border-bottom", "1px solid #ccc")
                     .css("box-shadow", "1px 1px 3px #ededed");
                 $(".search input").css("border", "#ccc")
                     .css("background-color", "#ccc")
                     .css("color", "#000");
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
             if ($(document).scrollTop() === 0) {
                 clearInterval(id);
             } else {
                 $(document).scrollTop($(document).scrollTop() - factor);
             }
         }, 18);
     });

     //换肤功能
     (function() {
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
         var skin_changer = function(e) {
             var target = getEventTag(e);
             if (target.tagName.toLowerCase() === "p") {
                 has_bg = "true";
                 localStorage.has_bg = "true";
                 $("header").css("background-color", "rgba(0,0,0,0.3)")
                     .css("border", "0");
                 $(".info .weather").css("color", "#fff");
                 $(".s_icons>a").css("color", "#fff");
                 $(".item>a").css("color", "#fff");
                 $(".item_user_name>a").css("color", "#fff");
                 $(".item_setting>a").css("color", "#fff");
                 $("article .logo img").attr("src", "./img/logo_white.png");
                 $(".text_fields").css("border-top", "1px solid #ccc")
                     .css("border-left", "1px solid #ccc")
                     .css("border-bottom", "1px solid #ccc")
                     .css("box-shadow", "1px 1px 3px #ededed");
                 $(".search input").css("border", "#ccc")
                     .css("background-color", "#ccc")
                     .css("color", "#000");
                 $(".bg-hideOrShowAjax").css("visibility", "visible");
                 $(".s-skin-set").css("display", "block")
                     .addClass("skin-has-bg")
                     .removeClass("skin-no-bg");
                 preview_origin = $("#s_skin_preview_skin").attr("src");
                 localStorage.preview_origin = preview_origin;
                 var tmp = target.parentNode.getElementsByTagName("img")[0];
                 var num = $(tmp).attr("src");
                 var image_num = num.slice(-9, -6);
                 $(".s-skin-container").css("background-color", "rgb(64, 64, 64)")
                     .css("background-image", "url('https://ss1.bdstatic.com/kvoZeXSm1A5BphGlnYG/skin/" + image_num + ".jpg?2')");
                 localStorage.bg_url = 'https://ss1.bdstatic.com/kvoZeXSm1A5BphGlnYG/skin/' + image_num + '.jpg?2';
             }
         }


         //切换
         var elem_array = ['1000', '1012', '1011', '1010', '1009', '1001', '1002', '1004', '8888', '9999'];
         var last_clicked_skin = $(".s-skin-nav .nav-1000");
         var last_index = [0, 0, 0, 0];
         //迭代器模式
         var add_click_skin = function(iterator) {
             while (!iterator.is_done()) {
                 var elem = iterator.get_current_item();
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
                                     $("#s_skin_preview_view").removeClass("preview-nobg")
                                         .addClass("preview-whitelogo");
                                 }
                             });
                             bind(root_elem.childNodes[i], "mouseout", function(e) {
                                 $("#s_skin_preview_skin").attr("src", preview_origin);
                                 if ($("#s_skin_preview_skin").attr("src") === "") {
                                     $("#s_skin_preview_view").addClass("preview-nobg")
                                         .removeClass("preview-whitelogo");
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
                                 $("#s_skin_preview_view").removeClass("preview-nobg")
                                     .addClass("preview-whitelogo");
                             }
                         });
                         bind(root_elem, "mouseout", function(e) {
                             $("#s_skin_preview_skin").attr("src", preview_origin);
                             if ($("#s_skin_preview_skin").attr("src") === "") {
                                 $("#s_skin_preview_view").addClass("preview-nobg")
                                     .removeClass("preview-whitelogo");
                             }
                         });
                         //换肤
                         bind(root_elem, "click", function(e) {
                             skin_changer(e);
                         });
                     }

                 }(elem));

                 iterator.next();
             }
         }

         var _iterator = iterator(elem_array);
         add_click_skin(_iterator);


         //不使用换肤
         $(".s-skin-set").click(function() {
             has_bg = "false";
             preview_origin = "";
             localStorage.has_bg = has_bg;
             localStorage.preview_origin = preview_origin;
             localStorage.bg_url = "";
             $(".s-skin-set").css("display", "none")
                 .addClass("skin-no-bg")
                 .removeClass("skin-has-bg");
             $("header").css("background-color", "")
                 .css("border", "");
             $(".info .weather").css("color", "");
             $(".s_icons>a").css("color", "");
             $(".item>a").css("color", "");
             $(".item_user_name>a").css("color", "");
             $(".item_setting>a").css("color", "");
             $("article .logo img").attr("src", "./img/bd_logo.png");
             $(".text_fields").css("border-top", "")
                 .css("border-left", "")
                 .css("border-bottom", "")
                 .css("box-shadow", "");
             $(".search input").css("border", "")
                 .css("background-color", "")
                 .css("color", "");
             $(".bg-hideOrShowAjax").css("visibility", "hidden");
             $(".s-skin-container").css("background-color", "")
                 .css("background-image", "");
             $("#s_skin_preview_view").addClass("preview-nobg")
                 .removeClass("preview-whitelogo");
             $("#s_skin_preview_skin").attr("src", "");
         });

     }());




     //主要内容中顶部导航条点击更换相应内容
     (function() {

         var click_elem = [
             "#s_menus_wrapper span:first-child",
             "#s_menus_wrapper span:nth-child(2)",
             "#s_menus_wrapper span:nth-child(3)",
             "#s_menus_wrapper span:nth-child(4)",
             "#s_menu_mine"
         ];
         var show_elem = [
             "#s_xmancard_news",
             "#s_xmancard_nav",
             "#s_xmancard_video",
             "#s_xmancard_shopping",
             "#s_xmancard_mine"
         ];

         //初始化的时候显示推荐
         $(".main_content>div").hide();
         $(show_elem[0]).show();
         $(".main").css("height", $(document).height() - 293);
         //迭代器模式
         var add_click = function(iterator1, iterator2) {
             var last_clicked = $(click_elem[0]);
             var last_showed = $(show_elem[0]);
             while (!iterator1.is_done() && !iterator2.is_done()) {
                 var _elem = iterator2.get_current_item();
                 (function(_elem) {
                     $(iterator1.get_current_item()).bind("click", function() {
                         last_clicked.removeClass("current");
                         last_clicked = $(this);
                         $(this).addClass("current");
                         last_showed.hide();
                         last_showed = $(_elem);
                         $(_elem).show();
                         $(".main").css("height", "");
                         $(".main").css("height", $(document).height() - 293);
                     })
                 }(_elem));

                 iterator1.next();
                 iterator2.next();
             }
         }

         var iterator1 = iterator(click_elem);
         var iterator2 = iterator(show_elem);

         add_click(iterator1, iterator2);

     }());


 });
