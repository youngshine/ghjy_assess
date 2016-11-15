<?php
/*
 * 7-27 班级子表：报读学生记录，移出禁用不显示current=0
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$classID = $arr->classID;

	$sql = " SELECT a.*,b.studentName,b.gender  
		From `ghjy_class_student` a 
		Join `ghjy_student` b On a.studentID=b.studentID 
		WHERE a.classID = $classID And a.current=1 ";   
    $result = mysql_query($sql) 
		or die("Invalid query: readClassAttendeeList " . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取班级学生成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>