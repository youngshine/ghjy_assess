<?php

// 测评对错结果保存
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$done = $_REQUEST['done'];
$assesstopicID = $_REQUEST['assesstopicID'];

$query = "UPDATE `ghjy_student-assess-topic` Set done = '$done' 
	Where assesstopicID = $assesstopicID ";
$result = mysql_query($query) 
	or die("Invalid query: updateTopicAssess " . mysql_error());

echo json_encode(array(
    "success" => true,
    "message" => "答案评分成功"
));

?>
