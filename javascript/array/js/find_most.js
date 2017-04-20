//找到数组中出现最多的字母和出现次数以及它在数组中的位置，传入参数为数组
var find_most = function(array) {
    //检测传入参数是否合法
    if (!Array.isArray(array)) {
        alert("请传入数组！");
        return;
    }
    if (array.length <= 1) {
        alert("数组元素小于2，无法比较！");
        return;
    }

    //本函数需要返回的对象
    var that = {}

    //复制传入数组，并排序，以使复制的数组的相同字母互相邻接
    var copy = array.slice(0);
    copy.sort();
    //console.log(copy);

    //操作复制数组，创建一个二维数组，使相同字母装入同一个二级数组里
    var store = [];
    var j = 0;
    for (var i = 0; i < copy.length; i++) {
        if (i > 0) {
            if (copy[i] === copy[i - 1]) {
                store[j].push(copy[i]);
            } else {
                j++;
                store[j] = [];
                store[j].push(copy[i]);
            }
        } else {
            store[j] = [];
            store[j].push(copy[i]);
        }
    }
    /*console.log(store);
    console.log(store.length);
    for (var j = 0; j < store.length; j++) {
        console.log(store[j]);
    }*/

    /*操作上一步创建的二维数组，通过遍历比较每个数组的长度
    将较小长度的数组删除，保留最大长度的数组*/
    var hold = [];
    while (store.length > 0) {
        if (store.length > 1) {
            if (store[store.length - 1].length > store[store.length - 2].length) {
                store.splice(store.length - 2, 1);
            } else if (store[store.length - 1].length < store[store.length - 2].length) {
                store.splice(store.length - 1, 1);
            } else {
                hold.push(store[store.length - 1]);
                store.splice(store.length - 1, 1);
            }
        } else {
            for (var s = 0; s < hold.length; s++) {
                if (hold[s].length === store[0].length) {
                    store.push(hold[s]);
                }
            }
            //将最大长度的数组保存到要返回的对象属性里
            that.result_array = store;
            //将最大长度的数组的字母保存到要返回的对象属性里
            that.result_letter = [];
            for (var m = 0; m < store.length; m++) {
                that.result_letter.push(store[m][0]);
            }
            break;
        }
    }

    //遍历传入的原数组，找出出现次数最多的每个字母在数组中的索引值
    that.letter_index = [];
    for (var n = 0; n < that.result_letter.length; n++) {
        that.letter_index[n] = [];
        for (var k = 0; k < array.length; k++) {
            if (array[k] === that.result_letter[n]) {
                that.letter_index[n].push(k);
            }
        }
    }

    return that; //返回结果
}


//var array = ["a", "m", "b", "b", "m", "a", "k", "m", "b", "j", "a"];
var array = ["a", "x", "b", "d", "m", "a", "k", "m", "p", "j", "a"];
var find = find_most(array); //调用函数
//控制台打印出结果
for (var x = 0; x < find.result_letter.length; x++) {
    console.log("数组中出现次数最多的字母是 " + find.result_letter[x] + 
        "，共出现了 " + find.result_array[x].length + "次，它在数组中的位置分别是 "
         + find.letter_index[x]);
}
