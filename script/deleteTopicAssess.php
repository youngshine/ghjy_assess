<?php
/* 
 * 删除测评题目
 */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$assesstopicID = $_REQUEST['assesstopicID'];	
	
$query = "DELETE From `ghjy_student-assess-topic` Where assesstopicID = $assesstopicID ";
$result = mysql_query($query) 
	or die("Invalid query: deleteTopicAssess" . mysql_error());

echo json_encode(array(
    "success" => true,
    "message" => "删除成功"
));


?>
