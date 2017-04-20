<?php
header('Content-type: application/json;charset=utf-8');

$db_host = 'localhost';
$db_name = 'news';
$db_user = 'root';
$db_pwd = 'Iwanttodie';

//面向对象方式
$mysqli = new mysqli($db_host, $db_user, $db_pwd, $db_name);

?>