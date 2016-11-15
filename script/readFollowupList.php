<?php
// 某个学生的联系沟通记录
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$studentID = $arr->studentID;
	//$consultID = $arr->consultID;

	$query = "SELECT * From `ghjy_student-followup` 
		Where studentID=$studentID ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readFollowupList by student" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取某个学生的跟踪记录followup成功";
	$res->data = $query_array;


	echo $_GET['callback']."(".$res->to_json().")";
?>