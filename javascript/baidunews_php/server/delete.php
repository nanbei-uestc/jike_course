<?php
header('Content-type: application/json;charset=utf-8');

require_once("db.php");

//面向对象的昂贵屏蔽了连接产生的错误，需要通过函数来判断
if(mysqli_connect_error()){
    echo json_encode(array("delete"=>"none"));
}else{
    $newsid=$_POST['newsid'];
    
    //设置编码
    $mysqli->set_charset("utf8");//或者 $mysqli->query("set names 'utf8'")
    
    $sql="DELETE FROM `news` WHERE `news`.`id`={$newsid}";
    $result=$mysqli->query($sql);

    echo json_encode(array("delete"=>"ok"));
}


?>