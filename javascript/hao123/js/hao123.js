//跨浏览器事件代理
function $(id) {
    return document.getElementById(id);
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

//换肤功能
var change_color = function(e) {
    var target = getEventTag(e);
    if (target.tagName.toLowerCase() === "span" && target.id !== "white-bg") {
        //根据点击到的元素的data-color改变颜色
        document.body.style.backgroundColor = target.getAttribute("data-color");
        //根据name获取到dom节点的数组，然后改变它们的颜色
        var hotword = document.getElementsByName("js-hotword");
        for (var i = 0; i < hotword.length; i++) {
            hotword[i].style.color = "#fcfcfc";
        }
        hotword_color = hotword[0].style.color;
    }
    if (target.id === "white-bg") {
        //根据点击到的元素的data-color改变颜色
        document.body.style.backgroundColor = target.getAttribute("data-color");
        //根据name获取到dom节点的数组，然后改变它们的颜色
        var hotword = document.getElementsByName("js-hotword");
        for (var i = 0; i < hotword.length; i++) {
            hotword[i].style.color = "#666";
        }
        hotword_color = hotword[0].style.color;
    }
}

//给元素绑定事件
bind($("changeColor"), "click", change_color);

var hotword_color = "#666";
//窗口关闭事件
window.onunload = function() {
    var color = {
        bg_color: document.body.style.backgroundColor,
        js_hotword_color: hotword_color
    }
    if (typeof color !== "undefined") {
        localStorage.color = JSON.stringify(color);
    }
}

//窗口加载成功事件
window.onload = function() {
    console.log("sfsfadfsgfs");
    if (typeof localStorage.color !== "undefined") {
        var color = JSON.parse(localStorage.color);
        //根据点击到的元素的data-color改变颜色
        document.body.style.backgroundColor = color.bg_color;
        //根据name获取到dom节点的数组，然后改变它们的颜色
        var hotword = document.getElementsByName("js-hotword");
        for (var i = 0; i < hotword.length; i++) {
            hotword[i].style.color = color.js_hotword_color;
        }
    }
}
