<?php
// 学生购买课时套餐
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	//$studentID = $arr->studentID;
	//$checked = $arr->checked;
	//$prepaid = $arr->prepaid;
	$consultID = $arr->consultID;

	$query = " SELECT a.*,b.studentName,b.grade,b.gender     
		from `ghjy_student-prepaid` a 
		join `ghjy_student` b on a.studentID=b.studentID  
		where b.consultID=$consultID ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readOrdersList by prepaid" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取购买课时orders成功";
	$res->data = $query_array;


	echo $_GET['callback']."(".$res->to_json().")";
?>