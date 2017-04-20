$(document).ready(function() {
    //刷新新闻列表
    var newstable = $("#newstable tbody");
    var refresh_news = function() {
        newstable.empty();

        $.ajax({
            type: 'get',
            url: './server/getnews.php',
            datatype: 'json',
            success: function(data) {
                console.log(data);
                data.forEach(function(val, i) {
                    var id = $("<td>").html(val.id);
                    var newstype = $("<td>").html(val.newstype);
                    var newstitle = $("<td>").html(val.newstitle);
                    var newstime = $("<td>").html(val.newstime);
                    var newssrc = $("<td>").html(val.newssrc);
                    var newsupdate = $("<button>").html("修改").addClass("btn btn-primary btn-xs");
                    var newsdelete = $("<button>").html("删除").addClass("btn btn-danger btn-xs");
                    var newsctrl = $("<td>");
                    newsctrl.append(newsupdate, newsdelete);
                    var newsrows = $("<tr>");
                    newsrows.append(id, newstype, newstitle, newstime, newssrc, newsctrl);
                    newstable.prepend(newsrows);
                });
            }
        });

    }

    refresh_news();

    //添加新闻
    $("#addnews").click(function(e) {
        e.preventDefault();

        //提交判断
        if ($("#newsimg").val() === "" || $("#newstitle").val() === "" ||
            $("#newstime").val() === "" || $("#newssrc").val() === "") {

            if ($("#newsimg").val() === "") {
                $("#newsimg").parent().addClass("has-error");
            } else {
                $("#newsimg").parent().removeClass("has-error");
            }
            if ($("#newstitle").val() === "") {
                $("#newstitle").parent().addClass("has-error");
            } else {
                $("#newstitle").parent().removeClass("has-error");
            }
            if ($("#newstime").val() === "") {
                $("#newstime").parent().addClass("has-error");
            } else {
                $("#newstime").parent().removeClass("has-error");
            }
            if ($("#newssrc").val() === "") {
                $("#newssrc").parent().addClass("has-error");
            } else {
                $("#newssrc").parent().removeClass("has-error");
            }
        } else {
            //提交添加
            $("#newsimg").parent().removeClass("has-error");
            $("#newstitle").parent().removeClass("has-error");
            $("#newstime").parent().removeClass("has-error");
            $("#newssrc").parent().removeClass("has-error");

            var json_news = {
                newstype: $("#newstype").val(),
                newsimg: $("#newsimg").val(),
                newstitle: $("#newstitle").val(),
                newstime: $("#newstime").val(),
                newssrc: $("#newssrc").val()
            }
            $.ajax({
                type: 'post',
                url: './server/insert.php',
                data: json_news,
                datatype: 'json',
                success: function(data) {
                    console.log(data);
                    $("#newstype").val('精选');
                    $("#newsimg").val('');
                    $("#newstitle").val('');
                    $("#newstime").val('');
                    $("#newssrc").val('');
                    refresh_news();
                }
            });
        }
    });

    //删除新闻
    var delete_id = null;
    newstable.on("click", ".btn-danger", function(e) {
        $("#delete_modal").modal("show");
        delete_id = $(this).parent().parent().children().eq(0).html();
    });
    $("#delete_modal #delete_confirm").click(function(e) {
        if (delete_id) {
            $.ajax({
                url: "./server/delete.php",
                type: "post",
                datatype: "json",
                data: { newsid: delete_id },
                success: function(data) {
                    console.log(data);
                    $("#delete_modal").modal("hide");
                    refresh_news();
                }
            })
        }
    });

    //编辑新闻
    var update_id = null;
    newstable.on("click", ".btn-primary", function(e) {
        $("#update_modal").modal("show");
        update_id = $(this).parent().parent().children().eq(0).html();
        $.ajax({
            url: "./server/curnews.php",
            type: "get",
            datatype: "json",
            data: { newsid: update_id },
            success: function(data) {
                console.log(data);
                $("#unewstype").val(data[0].newstype);
                $("#unewsimg").val(data[0].newsimg);
                $("#unewstitle").val(data[0].newstitle);
                var datetime = data[0].newstime.split(' ');
                var udate = datetime[0];
                var utime = datetime[1].split(":");
                var time_use = utime[0] + ":" + utime[1];
                $("#unewstime").val(udate + "T" + time_use);
                $("#unewssrc").val(data[0].newssrc);
            }
        })
    });
    $("#update_modal #update_confirm").click(function(e) {
        if (update_id) {
            var json_send = {
                newstype: $("#unewstype").val(),
                newsimg: $("#unewsimg").val(),
                newstitle: $("#unewstitle").val(),
                newstime: $("#unewstime").val(),
                newssrc: $("#unewssrc").val(),
                newsid: update_id
            }
            $.ajax({
                url: "./server/update.php",
                type: "post",
                datatype: "json",
                data: json_send,
                success: function(data) {
                    console.log(data);
                    $("#update_modal").modal("hide");
                    refresh_news();
                }
            })
        }
    });


});
