<?php
/*
 * 8-1 缴费得子记录（大小班，一对一）
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$consultID = $arr->consultID;
	$accntType = $arr->accntType;
	// isClassed=0 为排课状态
	$sql = " SELECT a.*,b.accntType,b.accntDate,b.studentID,c.studentName  
		From `ghjy_accnt_detail` a 
		Join `ghjy_accnt` b On b.accntID=a.accntID 
		Join `ghjy_student` c On c.studentId=b.studentID 
		WHERE b.consultID = $consultID And b.accntType='$accntType' And a.isClassed=0 "; 
	$result = mysql_query($sql) 
		or die("Invalid query: readAccntDetailList " . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取缴费字表成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>