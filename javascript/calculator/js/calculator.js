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


//计算器对象
var calcu = function() {
    //基础变量
    var number1 = 0; //私有变量
    var operator = null; //私有变量
    var number2 = 0; //私有变量
    var result = 0; //私有变量

    //calculating()方法需要的变量
    var prefix_operator_number1 = []; //私有变量,number1上的前置操作符数组
    var prefix_operator_number2 = []; //私有变量,number2上的前置操作符数组
    var operator_origin = null; //记录上一次传入的操作符，私有，作用于二元操作符号
    var operator_origin_equal = null; //记录上一次传入等号操作符，私有
    var operator_origin_dot = null; //记录上一次传入"."操作符，私有
    var number1_user_input = false; //私有变量，用户是否输入number1
    var number2_user_input = false; //私有变量,用户是否输入,判断是否被0整除

    //show()方法需要的变量
    var _process = []; //私有变量，显示过程的数组，动态改变
    //私有变量，记录上次输入是否为数字，1为数字，
    //-1为非数字，2为在过程中被用户按下了等号和“C”
    var input_type = 0;
    var prefix_origin = false; //上一次操作符是否为前置操作符
    var prefix_deny = false; //私有变量，不显示前置操作符
    var prefix_brackets = 0; //前置操作符设置的括号
    var dot_allow_origin = false; //"."操作符上一次被允许显示
    var dot_deny_origin = false; //"."操作上一次不被显示
    var dot_deny_copy = false;
    var dot_count = 0; //"."符号输入次数
    var equal_count = 0; //等号输入次数
    var process_html = $("process"); //私有变量，取到显示过程的div
    var result_html = $("result"); //私有变量，取到显示结果的div

    //函数，被calculating()调用，实际计算
    var compute = function(value) {
        if (operator_origin === "+" || operator_origin === "-" ||
            operator_origin === "x" || operator_origin === "/" ||
            operator_origin === "^") {
            for (var i = 0; i < prefix_operator_number1.length; i++) {
                switch (prefix_operator_number1[i]) {
                    case "sin":
                        number1 = Math.sin(Number(number1));
                        //console.log(number1);
                        break;
                    case "cos":
                        number1 = Math.cos(Number(number1));
                        break;
                    case "tan":
                        number1 = Math.tan(Number(number1));
                        break;
                    case "√":
                        number1 = Math.sqrt(Number(number1));
                        break;
                    case "log":
                        number1 = Math.log10(Number(number1));
                        break;
                    case "negative":
                        number1 = -number1;
                        number1 = Number(number1);
                        break;
                }
                if (i == prefix_operator_number1.length - 1) {
                    prefix_operator_number1 = [];
                }
            }
            for (var i = 0; i < prefix_operator_number2.length; i++) {
                switch (prefix_operator_number2[i]) {
                    case "sin":
                        number2 = Math.sin(Number(number2));
                        //console.log(number2);
                        break;
                    case "cos":
                        number2 = Math.cos(Number(number2));
                        break;
                    case "tan":
                        number2 = Math.tan(Number(number2));
                        break;
                    case "√":
                        number2 = Math.sqrt(Number(number2));
                        break;
                    case "log":
                        number2 = Math.log10(Number(number2));
                        break;
                    case "negative":
                        number2 = -number2;
                        number2 = Number(number2);
                        //console.log(number2);
                        break;
                }
                if (i == prefix_operator_number2.length - 1) {
                    if (value === "=") {
                        prefix_operator_number2 = [];
                    } else {
                        if (number2_user_input) {
                            prefix_operator_number2 = [];
                        }
                    }
                }
            }

            switch (operator_origin) {
                case "+":
                    number1 = Number(number1);
                    number2 = Number(number2);
                    result = Calc.Add(number1, number2,10);
                    break;
                case "-":
                    number1 = Number(number1);
                    number2 = Number(number2);
                    result = Calc.Sub(number1, number2,10);
                    break;
                case "x":
                    number1 = Number(number1);
                    number2 = Number(number2);
                    result = Calc.Mul(number1, number2,10);
                    break;
                case "/":
                    number1 = Number(number1);
                    number2 = Number(number2);
                    if (number2 === 0) {
                        result = NaN;
                    } else {
                        result = Calc.Div(number1, number2,10);
                    }
                    break;
                case "^":
                    number1 = Number(number1);
                    number2 = Number(number2);
                    result = Math.pow(number1, number2);
                    break;
            }
        }

    }

    var that = {}; //需要返回的对象
    //该对象的方法，根据传入的值计算结果
    //该方法应该被点击触发，所以每次只传入一个参数
    //在方法内部，检测传入的值，把它们存到合适的以上私有变量中
    that.calculating = function(value) {
        operator_origin = operator;
        //操作传入的非数值（操作符）
        if (isNaN(value)) {
            operator = value; //更新操作符
            //前置操作符
            if (operator === "sin" || operator === "cos" || operator === "tan" ||
                operator === "√" || operator === "log" || operator === "negative") {
                operator = operator_origin;
                //根据operator的值判断出当前程序正在操作哪一个数值
                if (operator !== null) {
                    if (!number2_user_input) {
                        prefix_origin = true;
                        prefix_operator_number2.push(value);
                    }
                } else {
                    if (!number1_user_input) {
                        prefix_origin = true;
                        prefix_operator_number1.push(value);
                    }
                }
                //console.log("prefix_operator_number1  ", prefix_operator_number1);
                //console.log("prefix_operator_number2  ", prefix_operator_number2);
            }
            //clear
            if (operator === "C") {
                number1 = 0;
                operator = null;
                number2 = 0;
                result = 0;
                prefix_operator_number1 = [];
                prefix_operator_number2 = [];
                number1_user_input = false;
                number2_user_input = false;
            }
            //等于
            if (operator === "=") {
                operator_origin_equal = operator;
                number1_user_input = false;
                //假如用户用0当被除数，则显示出错信息,并且自动初始化程序
                if (number2_user_input && number2 ==0 && operator_origin === "/") {
                    prefix_operator_number1 = [];
                    prefix_operator_number2 = [];
                    number2_user_input = false;
                    number1 = 0;
                    operator = null;
                    number2 = 0;
                    result = "出错";
                } else {
                    if (operator_origin === null) {
                        for (var i = 0; i < prefix_operator_number1.length; i++) {
                            switch (prefix_operator_number1[i]) {
                                case "sin":
                                    number1 = Math.sin(Number(number1));
                                    //console.log(number1);
                                    result = number1;
                                    break;
                                case "cos":
                                    number1 = Math.cos(Number(number1));
                                    //console.log(number1);
                                    result = number1;
                                    break;
                                case "tan":
                                    number1 = Math.tan(Number(number1));
                                    //console.log(number1);
                                    result = number1;
                                    break;
                                case "√":
                                    number1 = Math.sqrt(Number(number1));
                                    //console.log(number1);
                                    result = number1;
                                    break;
                                case "log":
                                    number1 = Math.log10(Number(number1));
                                    //console.log(number1);
                                    result = number1;
                                    break;
                                case "negative":
                                    number1 = -number1;
                                    number1 = Number(number1);
                                    //console.log(number1);
                                    result = number1;
                                    break;
                            }
                        }
                        prefix_operator_number1 = [];
                        result = number1;
                    } else {
                        //实际计算
                        compute(value);
                    }
                    number2_user_input = false;
                    number1 = result;
                    operator = null;
                    number2 = 0;
                }
            } else {
                operator_origin_equal = null;
            }
            //小数点，为了不影响其他运算，当检测出值是小数点时
            //立即把operator换成原来的
            if (operator === ".") {
                operator = operator_origin;
                //根据operator的值判断出当前程序正在操作哪一个数值
                if (operator !== null) {
                    if (operator_origin_dot !== ".") {
                        var tmp = 0;
                        var tmpnum = number2.toString();
                        for (var i = 0; i < tmpnum.length; i++) {
                            if (tmpnum[i] === ".") {
                                tmp = tmp + 1;
                            }
                        }
                        if (tmp === 0) {
                            number2 = number2 + ".";
                        }
                    }
                } else {
                    if (operator_origin_dot !== ".") {
                        var tmp = 0;
                        var tmpnum = number1.toString();
                        for (var i = 0; i < tmpnum.length; i++) {
                            if (tmpnum[i] === ".") {
                                tmp = tmp + 1;
                            }
                        }
                        if (tmp === 0) {
                            number1 = number1 + ".";
                        }
                    }
                }
                operator_origin_dot = operator_origin;
            } else {
                operator_origin_dot = null;
            }
            //假如number2被用户输入，并且运算符是+-*/，则准备好下一次运算，
            //把结果存到number1中，并把number2初始化为0
            if (number2_user_input || (!number1_user_input &&
                    !number2_user_input && prefix_operator_number2.length > 0)) {
                if (value === "+" || value === "-" || value === "x" ||
                    value === "/" || value === "^") {
                    //实际计算
                    compute(value);
                    //假如用户用0当被除数，则显示出错信息,并且自动初始化程序
                    if (number2 === 0 && operator_origin === "/") {
                        number1 = 0;
                        operator = null;
                        number2 = 0;
                        result = "出错";
                    } else {
                        number1 = result;
                        number2 = 0;
                    }
                }
            }
        }
        //操作传入的数值
        else {
            //当操作符没有设置时，把传入的数值存入number1里
            if (operator === null) {
                if (value !== null) {
                    number1_user_input = true;
                    if (number1 === 0) {
                        number1 = value;
                    } else {
                        number1 = number1 + value;
                        if (operator_origin_equal === "=") {
                            operator_origin_equal = null;
                            number1 = value;
                        }
                    }
                }
            }
            //当操作符设置了时，把传入的数值存入number2里
            else {
                if (value !== null) {
                    number2_user_input = true; //用户输入
                    if (number2 === 0) {
                        number2 = value;
                    } else {
                        number2 = number2 + value;
                    }
                }
            }
        }

        console.log("number1 " + number1);
        console.log("operator " + operator);
        console.log("number2 " + number2);
        console.log("result " + result);
    }

    //该方法显示结果到浏览器上,必须在calculating方法之后使用
    that.show = function(value) {
        //用户输入非零操作符时
        if (isNaN(value)) {
            //根据上一次输入的值的不同，处理显示过程数组（_process)
            // 1为数字，0为初始状态，
            //-1为非数字，2为在过程中被用户按下了等号和“C”
            if (input_type === 0) {
                //前置操作符
                if (value === "sin" || value === "cos" || value === "tan" ||
                    value === "√" || value === "log" || value === "negative") {
                    if (value === "negative") {
                        if (_process.length > 0) {
                            _process.push("(");
                            prefix_brackets = prefix_brackets + 1;
                        }
                        _process.push("-");
                    } else if (value === "√") {
                        _process.push(value);
                    } else {
                        _process.push(value);
                        _process.push("(");
                        prefix_brackets = prefix_brackets + 1;
                    }
                } else {
                    _process.push(0);
                    _process.push(value);
                    //console.log("process0 " + _process);
                }
            } else if (input_type === 1) {
                //不是前置操作符
                if (value !== "sin" && value !== "cos" && value !== "tan" &&
                    value !== "√" && value !== "log" && value !== "negative") {
                    if (value === ".") {
                        if (_process.length >= 2) {
                            for (var i = _process.length - 2; i >= 0; i--) {
                                if (isNaN(_process[i])) {
                                    if (_process[i] !== ".") {
                                        dot_allow_origin = true;
                                        _process.push(value);
                                        break;
                                    } else {
                                        dot_allow_origin = false;
                                        dot_deny_origin = true;
                                        break;
                                    }
                                }
                            }
                        } else {
                            dot_allow_origin = true;
                            _process.push(value);
                        }
                    } else {
                        dot_allow_origin = false;
                        dot_deny_origin = false;
                        for (var i = 0; i < prefix_brackets; i++) {
                            _process.push(")");
                        }
                        prefix_brackets = 0;
                        _process.push(value);
                    }
                    //console.log("process1 " + _process);
                } else {
                    dot_allow_origin = false;
                    dot_deny_origin = false;
                    prefix_deny = true;
                }
            } else if (input_type === 2) {
                //前置操作符
                if (value === "sin" || value === "cos" || value === "tan" ||
                    value === "√" || value === "log" || value === "negative") {
                    if (value === "negative") {
                        _process.pop();
                        if (_process.length > 0) {
                            _process.push("(");
                            prefix_brackets = prefix_brackets + 1;
                        }
                        _process.push("-");
                    } else if (value === "√") {
                        _process.pop();
                        _process.push(value);
                    } else {
                        _process.pop();
                        _process.push(value);
                        _process.push("(");
                        prefix_brackets = prefix_brackets + 1;
                    }
                } else {
                    if (value === ".") {
                        var tmp = 0;
                        var tmpnum = _process[0].toString();
                        for (var i = 0; i < tmpnum.length; i++) {
                            if (tmpnum[i] === ".") {
                                tmp = tmp + 1;
                            }
                        }
                        console.log(tmp);
                        if (tmp === 0) {
                            _process.push(value);
                            dot_allow_origin = true;
                        } else {
                            dot_deny_origin = true;
                        }
                    } else {
                        _process.push(value);
                        //console.log("process2 " + _process);
                    }
                }
            } else {
                //前置操作符
                if (value === "sin" || value === "cos" || value === "tan" ||
                    value === "√" || value === "log" || value === "negative") {
                    if (!dot_allow_origin && !dot_deny_origin) {
                        if (!prefix_deny) {
                            if (value === "negative") {
                                if (_process.length > 0) {
                                    _process.push("(");
                                    prefix_brackets = prefix_brackets + 1;
                                }
                                _process.push("-");
                            } else if (value === "√") {
                                _process.push(value);
                            } else {
                                _process.push(value);
                                _process.push("(");
                                prefix_brackets = prefix_brackets + 1;
                            }
                        }
                    }
                } else if (value === ".") {
                    if (dot_deny_origin) {
                        for (var i = 0; i < prefix_brackets; i++) {
                            _process.push(")");
                        }
                        prefix_brackets = 0;
                        //_process.push(value);
                        dot_deny_origin = false;
                        dot_deny_copy = true;
                    }
                    if (dot_count === 0 && !number2_user_input) {
                        if (operator_origin === "+" || operator_origin === "-" ||
                            operator_origin === "x" || operator_origin === "/" ||
                            operator_origin === "^") {
                            dot_count = dot_count + 1;
                            _process.push(0);
                            _process.push(value);
                        }
                    }
                    dot_allow_origin = false;
                } else {
                    if (prefix_deny) {
                        prefix_deny = false;
                        _process.push(value);
                    } else {
                        //用户在输入了前置操作符号之后没有输入数字直接输入了其他二元操作符号
                        if (prefix_origin) {
                            prefix_origin = false;
                            _process.push(0);
                            for (var i = 0; i < prefix_brackets; i++) {
                                _process.push(")");
                            }
                            prefix_brackets = 0;
                            _process.push(value);
                        } else {
                            //用户输入了二元操作符号，接着直接按了“=”号
                            //console.log(operator_origin);
                            if (value === "=") {
                                if (operator_origin === "+" || operator_origin === "-" ||
                                    operator_origin === "x" || operator_origin === "/" ||
                                    operator_origin === "^") {
                                    _process.push(0);
                                    _process.push(value);
                                }
                            } else {
                                if (!dot_deny_origin) {
                                    if (dot_deny_copy) {
                                        for (var i = 0; i < prefix_brackets; i++) {
                                            _process.push(")");
                                        }
                                        prefix_brackets = 0;
                                        _process.push(value);
                                        dot_deny_copy = false;
                                    } else {
                                        _process[_process.length - 1] = value;
                                    }
                                } else {
                                    for (var i = 0; i < prefix_brackets; i++) {
                                        _process.push(")");
                                    }
                                    prefix_brackets = 0;
                                    _process.push(value);
                                    dot_deny_origin = false;
                                }
                            }
                        }
                        dot_allow_origin = false;
                        dot_deny_origin = false;
                        dot_deny_copy = false;
                        //console.log("process-1 " + _process);
                    }
                }
            }
            input_type = -1; //记录本次输入为非数字（操作符）
            //初始化显示屏
            //并且把input_type设置为2，为下一次输入提供初始化显示变量的信号
            if (value === "C") {
                _process = [];
                input_type = 2;
                prefix_brackets = 0;
                prefix_origin = false;
                prefix_deny = false;
                dot_count = 0;
                dot_allow_origin = false;
                dot_deny_origin = false;
                dot_deny_copy = false;
                //console.log("processC " + _process);
            }
            //初始化显示屏
            //并且把input_type设置为2，为下一次输入提供初始化显示变量的信号
            if (value === "=") {
                if (equal_count > 0) {
                    //equal_count = 0;
                    _process = [];
                } else {
                    equal_count = equal_count + 1;
                    for (var i = 0; i < prefix_brackets; i++) {
                        _process.push(")");
                    }
                    prefix_brackets = 0;
                    //console.log("process= " + _process);
                }
                input_type = 2;
                prefix_origin = false;
            } else {
                equal_count = 0;
            }
            //当输入“+-*/”时，如果是连续计算，则把之前计算的过程转变为结果显示
            //到过程中
            if (number2_user_input || (!number1_user_input &&
                    !number2_user_input && prefix_operator_number2.length > 0)) {
                if (value === "+" || value === "-" || value === "x" ||
                    value === "/" || value === "^") {
                    for (var i = 0; i < prefix_brackets; i++) {
                        _process.push(")");
                    }
                    prefix_brackets = 0;
                    prefix_origin = false;
                    _process.unshift("(");
                    _process.pop();
                    _process.push(")");
                    _process.push(value);
                    // _process = [];
                    // _process.push(number1);
                    // _process.push(value);
                }
            }
        }
        //用户输入数字时
        else {
            if (input_type === 2) {
                _process.pop();
            }
            _process.push(value);
            input_type = 1; //记录本次输入为数字
            //当用户点击到外层div时
            if (value === null) {
                _process.pop();
            }
            //当用户输入出错时，初始化显示屏
            if (result === "出错") {
                result = 0;
                _process = [];
                _process.push(value);
            }
            prefix_origin = false;
        }

        //console.log("process-result " + _process);
        process_html.innerHTML = "";
        //显示计算过程
        for (var i = 0; i < _process.length; i++) {
            process_html.innerHTML = process_html.innerHTML + _process[i];
        }
        //显示计算结果
        $("result").innerHTML = "";
        if (value === "=") {
            result_html.innerHTML = result;
        }
        if (number2_user_input || (!number1_user_input &&
                !number2_user_input && prefix_operator_number2.length > 0)) {
            if (value === "+" || value === "-" || value === "x" ||
                value === "/" || value === "^") {
                if (!number1_user_input && !number2_user_input &&
                    prefix_operator_number2.length > 0) {
                    prefix_operator_number2 = [];
                }
                _process = [];
                _process.push(number1);
                _process.push(value);
                number1_user_input = false;
                number2_user_input = false;
                if (value === "x" || value === "/") {
                    result_html.innerHTML = number1;
                } else {
                    result_html.innerHTML = result;
                }
            }
        }

        //当输入“=“和”C“时过程数组中存入number1
        if (input_type === 2) {
            _process = [];
            _process.push(number1);
        }
    }

    return that; //返回
}

var calculator = calcu(); //新建计算器对象

//触发事件时，取到触发此事件的源元素的html值,并处理计算
var handler = function(e) {
    var target = getEventTag(e);
    var value;
    if (target.tagName.toLowerCase() === "p") {
        value = "negative";
        //console.log("取到的值 " + value);
    }
    if (target.id === "negative") {
        if (target.innerHTML === "<p>+</p><p>-</p>") {
            value = "negative";
        } else {
            value = target.innerHTML;
        }
        //console.log("取到的值 " + value);
    }
    if (target.tagName.toLowerCase() === "span" && target.id !== "negative") {
        value = target.innerHTML;
        //console.log("取到的值 " + value);
    }
    //当用户点击外层div时
    if (target.id === "input_board") {
        value = null;
    }
    calculator.calculating(value); //调用计算器对象的方法计算结果
    calculator.show(value); //调用计算器对象的方法显示结果
}

//高级功能转换
var advance = function(e) {
    if ($("clear").innerHTML === "C") {
        $("clear").innerHTML = "sin";
    } else {
        $("clear").innerHTML = "C";
    }
    if ($("negative").innerHTML === "<p>+</p><p>-</p>") {
        $("negative").innerHTML = "cos";
    } else {
        $("negative").innerHTML = "<p>+</p><p>-</p>";
    }
    if ($("div").innerHTML === "/") {
        $("div").innerHTML = "tan";
    } else {
        $("div").innerHTML = "/";
    }
    if ($("mul").innerHTML === "x") {
        $("mul").innerHTML = "√";
    } else {
        $("mul").innerHTML = "x";
    }
    if ($("sub").innerHTML === "-") {
        $("sub").innerHTML = "^";
    } else {
        $("sub").innerHTML = "-";
    }
    if ($("add").innerHTML === "+") {
        $("add").innerHTML = "log";
    } else {
        $("add").innerHTML = "+";
    }
}

//绑定父级元素，代理子元素以及后代元素的点击事件
bind($("input_board"), "click", handler);
//绑定advance,功能转换
bind($("advance"), "click", advance);

$("result").innerHTML = 0;
