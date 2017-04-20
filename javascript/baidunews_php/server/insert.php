<?php

header('Content-type: application/json;charset=utf-8');

require_once("db.php");

//面向对象的昂贵屏蔽了连接产生的错误，需要通过函数来判断
if(mysqli_connect_error()){
    echo json_encode(array("insert"=>"none"));
}else{
    //插入新闻
    $newstype=$_POST['newstype'];
    $newsimg=$_POST['newsimg'];
    $newstitle=$_POST['newstitle'];
    $newstime=$_POST['newstime'];
    $newssrc=$_POST['newssrc'];
    
    //设置编码
    $mysqli->set_charset("utf8");//或者 $mysqli->query("set names 'utf8'")

    $sql="INSERT INTO `news`.`news` (`id`, `newstype`, `newsimg`, `newstitle`, `newstime`, `newssrc`) VALUES (NULL, '{$newstype}', '{$newsimg}', '{$newstitle}', '{$newstime}', '{$newssrc}')";
    $result=$mysqli->query($sql);
    
    echo json_encode(array("insert"=>"ok"));
}

//关闭连接
$mysqli->close();

?>