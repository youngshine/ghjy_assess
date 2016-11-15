<?php
/*
 * 8-1 某个学生的报读缴费主记录（大小班 或 一对一）
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$studentID = $arr->studentID;
	// 不都是一对一，所以left join pricelist
	$sql = " SELECT * From `ghjy_accnt` WHERE studentID = $studentID ";   
    $result = mysql_query($sql) 
		or die("Invalid query: readAccntList by student" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取学生缴费成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>