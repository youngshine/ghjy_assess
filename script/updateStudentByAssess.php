<?php

// 测评对错结果保存，每个学生只保存最新一份报告，并微信模版消息推送 16-11
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$studentID = $_REQUEST['studentID'];
//$subject = $_REQUEST['subject'];
$result = $_REQUEST['result'];

$query = "UPDATE `ghjy_student` 
	Set assessReport = '$result' 
	Where studentID = $studentID ";
$result = mysql_query($query) 
	or die("Invalid query: updateStudent Assess report " . mysql_error());

echo json_encode(array(
    "success" => true,
    "message" => "测评报告保存成功"
));

?>
