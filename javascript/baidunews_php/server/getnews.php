<?php

header('Content-type: application/json;charset=utf-8');

require_once("db.php");

//面向对象的昂贵屏蔽了连接产生的错误，需要通过函数来判断
if(mysqli_connect_error()){
    echo json_encode(array("success"=>"none"));
}else{
	//设置编码
    $mysqli->set_charset("utf8");//或者 $mysqli->query("set names 'utf8'")


    if(is_array($_GET)&&count($_GET)>0){//判断是否有Get参数  
        if(isset($_GET["newstype"])){//判断所需要的参数是否存在，isset用来检测变量是否设置，返回true or false 
             $sql="SELECT * FROM `news` WHERE `newstype`='{$_GET['newstype']}'";
             $result=$mysqli->query($sql);

             $senddata= array();
             while($row = $result->fetch_assoc()){
                   array_push($senddata,array('id' => $row['id'],
                                              'newstype'=>$row['newstype'],
                                              'newsimg'=>$row['newsimg'],
                                              'newstitle'=>$row['newstitle'],
                                              'newstime'=>$row['newstime'],
                                              'newssrc'=>$row['newssrc'] 
                             ));        
             }
    
             echo json_encode($senddata);
            
        } 

    }else{
        $sql="SELECT * FROM `news`";
        $result=$mysqli->query($sql);

        $senddata= array();
        while($row = $result->fetch_assoc()){
              array_push($senddata,array('id' => $row['id'],
                                        'newstype'=>$row['newstype'],
                                        'newsimg'=>$row['newsimg'],
                                        'newstitle'=>$row['newstitle'],
                                        'newstime'=>$row['newstime'],
                                        'newssrc'=>$row['newssrc'] 
                        ));        
        }
    
        echo json_encode($senddata);
    }
    
}

//关闭连接
$mysqli->close();

?>