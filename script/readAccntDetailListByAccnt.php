<?php
/*
 * 8-1 某个缴费单的子表）
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$accntID = $arr->accntID;

	$sql = " SELECT * From `ghjy_accnt_detail` 
		Where accntID=$accntID "; 
	$result = mysql_query($sql) 
		or die("Invalid query: readAccntDetailListByAccnt " . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取缴费子表成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>