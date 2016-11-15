<?php
/*
 * 8-1 要退费的记录（大小班，一对一）
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$studentID = $arr->studentID;
	$accntType = $arr->accntType;
	// isClassed=0 尚未排课状态
	$sql = " SELECT a.*,b.accntType,b.accntDate,b.studentID,c.kcType,c.title As kcTitle  
		From `ghjy_accnt_detail` a 
		Join `ghjy_accnt` b On b.accntID=a.accntID 
		Join `ghjy_kclist` c On a.kclistID=c.kclistID  
		WHERE b.studentID = $studentID And b.accntType='$accntType' And a.isClassed=0 "; 
	$result = mysql_query($sql) 
		or die("Invalid query: readAccntDetailList by refund " . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取要退费的记录成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>