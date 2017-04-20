$(document).ready(function() {
    var num = 5;
    window.onload = (function() {
        responsive_img(num);
    });
    window.onresize = (function() {
        responsive_img(num);
    });
    var data_img = {
        "data": [
            [
                { "src": "1.jpg" },
                { "src": "2.jpg" },
                { "src": "3.jpg" },
                { "src": "4.jpg" },
                { "src": "5.jpg" },
            ],

            [
                { "src": "6.jpg" },
                { "src": "7.jpg" },
                { "src": "8.jpg" },
                { "src": "9.jpg" },
                { "src": "10.jpg" },
            ],

            [
                { "src": "11.jpg" },
                { "src": "12.jpg" },
                { "src": "13.jpg" },
                { "src": "14.jpg" },
                { "src": "15.jpg" },
            ],

            [
                { "src": "16.jpg" },
                { "src": "17.jpg" },
                { "src": "18.jpg" },
                { "src": "19.jpg" },
                { "src": "20.jpg" },
            ]
        ]
    }
    var scroll_time = 0;
    window.onscroll = (function() {
        if (scroll_loading()) {
            $.each(data_img.data[scroll_time],
                function(i, val) {
                    var box_new = $("<div>").addClass("box").appendTo($(".container"));
                    var content_new = $("<div>").addClass("content").appendTo(box_new);
                    var img_new = $("<img>").attr("src", "./img/" + $(val).attr(
                        "src")).appendTo(content_new);
                });
            responsive_img(num);
            scroll_time = (scroll_time + 1) % 4;
        }
    });

    //滚动加载
    var scroll_loading = function() {
        if ($(document).height() - $(window).scrollTop() - $(window).height() < 10) {
            return true;
        } else {
            return false;
        }
    }

    //图片列数响应窗口变化
    var responsive_img = function(num) {
        if ($(window).width() >= 768) {
            $(".container").css("width", $(window).width() - 60);
            num = 5;
        } else if ($(window).width() < 768 && $(window).width() >= 480) {
            $(".container").css("width", $(window).width());
            num = 3;
        } else if ($(window).width() < 480) {
            $(".container").css("width", $(window).width());
            num = 2;
        }
        imglocation(num);
    }

    //摆放图片
    var imglocation = function(num) {
        var box = $(".box");
        $(".content img").css("width", $(".container").width() / num - 22);
        //每一列图片的高度数组
        var box_heights = [];
        $.each(box, function(i, val) {
            //将第一列图片的高度存入数组中，然后计算出哪一列高度最小，
            //将图片放置到那一列，然后重新计算这一列的高度
            if (i < num) {
                box_heights[i] = box.eq(i).height();
                $(val).css({
                    "position": "",
                    "top": "",
                    "left": ""
                });
            } else {
                var min_height = Math.min.apply(null, box_heights);
                var min_index = box_heights.indexOf(min_height);
                $(val).css({
                    "position": "absolute",
                    "top": min_height,
                    "left": box.eq(min_index).position().left
                });
                box_heights[min_index] += box.eq(i).height();
            }
        });

    }

});
