function score_level() {
    //得到用户输入到表单中的分数
    var x = document.querySelector("#user_score").value;
    x = x.trim();
    console.log(x);
    var result = null;

    //验证用户输入是否为空
    if (x == "") {
        result = "输入为空，请输入0-100的数字！";
        //把结果显示出来
        document.querySelector("#result").innerHTML = " 错误：  " + result;

        return false;
    }

    //验证用户输入是否数字
    if (isNaN(x)) {
        result = "请输入数字！";
        //把结果显示出来
        document.querySelector("#result").innerHTML = " 错误：  " + result;

        return false;
    }


    //验证用户输入数字合法性
    if (x < 0 || x > 100) {
        result = "请输入0到100之间的数字！"
            //把结果显示出来
        document.querySelector("#result").innerHTML = " 错误：  " + result;

        return false;
    }
    /*else if (x[0] == "0" && x.length > 1) {
        result = "请输入0到100之间的数字！"
            //把结果显示出来
        document.querySelector("#result").innerHTML = " 错误：  " + result;

        return false;
    }*/
    //计算用户输入分数在哪个等级
    /*else if (x >= 90 && x <= 100)
        result = 1;
    else if (x >= 80 && x < 90)
        result = 2;
    else if (x >= 70 && x < 80)
        result = 3;
    else if (x >= 60 && x < 70)
        result = 4;
    else if (x >= 50 && x < 60)
        result = 5;
    else if (x >= 40 && x < 50)
        result = 6;
    else if (x >= 30 && x < 40)
        result = 7;
    else if (x >= 20 && x < 30)
        result = 8;
    else if (x >= 10 && x < 20)
        result = 9;
    else if (x >= 0 && x < 10)
        result = 10;*/
    switch (true) {
        case x >= 90 && x <= 100:
            result = 1;
            break;
        case x >= 80 && x < 90:
            result = 2;
            break;
        case x >= 70 && x < 80:
            result = 3;
            break;
        case x >= 60 && x < 70:
            result = 4;
            break;
        case x >= 50 && x < 60:
            result = 5;
            break;
        case x >= 40 && x < 50:
            result = 6;
            break;
        case x >= 30 && x < 40:
            result = 7;
            break;
        case x >= 20 && x < 30:
            result = 8;
            break;
        case x >= 10 && x < 20:
            result = 9;
            break;
        case x >= 0 && x < 10:
            result = 10;
            break;
    }

    console.log(result);

    //把结果显示出来
    document.querySelector("#result").innerHTML = " 等级：  " + result;

    return false;
}
