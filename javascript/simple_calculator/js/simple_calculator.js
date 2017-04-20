//加减乘除的简单计算，第一个和第二个参数为数字，第三个参数是字符”+-*/“中的任何一个
var simple_calculator = function(x, y, z) {
    //检测传入参数合法性
    if (x == "" || y == "") {
        alert("输入为空，请输入数字！");
        return;
    }
    if (isNaN(x) || isNaN(y)) {
        alert("请输入数字！");
        return;
    }
    if (z !== "+" && z !== "-" && z !== "*" && z !== "/") {
        console.log(z);
        alert("请输入“+ - * /”中的任何一个！");
        return;
    }
    if (y === 0 && z === "/") {
        alert("出错,0不能当除数！");
        return;
    }

    //根据传入的第三个参数计算结果并返回
    switch (z) {
        case "+":
            return x + y;
            break;
        case "-":
            return x - y;
            break;
        case "*":
            return x * y;
            break;
        case "/":
            return x / y;
            break;
    }
}

var result = simple_calculator(2, 4, "/"); //调用函数

console.log("2/4的结果是 " + result);
