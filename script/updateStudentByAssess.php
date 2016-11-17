<?php

// 测评对错结果保存，每个学生只保存最新一份报告，并微信模版消息推送 16-11
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;
// 学科数理化，都属于科学
$studentID = $arr->studentID;
$time = $arr->time;
$subject = $arr->subject;
$result = ($arr->result); //是数组

$jsonResult = '{"time":'.$time.',"subject":"'.$subject.'","result":[';
for($i = 0; $i < count($result); $i++){
	$rec = ($result[$i]);
	$jsonResult .= 
		'{"name":"'.$rec->name.'","value1":'.$rec->value1.',"value2":'.$rec->value2 .'}';
};
$jsonResult .= ']}';

//$result = urldecode ( json_encode ( $result ) ); 

//$result = json_encode($result);
//$result = urlencode($result);
//$result = urldecode($result);
//$result = addslashes($result);
//$assessResult = urldecode($assessResult);


/* 数组转json字符串, urlencode,urldecode处理转换中文乱码
$assessResult = json_encode(array(
    "time"    => $time,
	"subject" => urlencode($subject),
    "result"  => urlencode($result),
)); */

$query = "UPDATE `ghjy_student` 
	Set assessResult = '$jsonResult' 
	Where studentID = $studentID ";
$result = mysql_query($query) 
	or die("Invalid query: updateStudent Assess report " . mysql_error());

$res->success = true;
$res->message = "测评报告json数据保存成功";
$res->data = $jsonResult;

echo $_GET['callback']."(".$res->to_json().")";

?>
