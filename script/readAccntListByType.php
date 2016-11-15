<?php
/*
 * 8-1 一对一排课的主记录
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$consultID = $arr->consultID;
	$accntType = $arr->accntType;
	/* 不都是一对一，所以left join pricelist
	$sql = " SELECT a.*,b.studentName,c.title,c.hour  
		From `ghjy_accnt` a 
		Join `ghjy_student` b On a.studentId=b.studentID 
		Left Join `ghjy_pricelist` c On a.pricelistID=c.pricelistID 
		WHERE a.consultID = $consultID And a.accntType='$accntType' ";  */ 
	$sql = " SELECT a.*,b.studentName  
		From `ghjy_accnt` a 
		Join `ghjy_student` b On a.studentId=b.studentID 
		WHERE a.consultID = $consultID And a.accntType='$accntType' "; 
	$result = mysql_query($sql) 
		or die("Invalid query: readAccntList " . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取缴费成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>