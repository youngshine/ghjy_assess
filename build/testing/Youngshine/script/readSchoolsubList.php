<?php

// 加盟学校的分校区
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();
	
	$arr = $req->params;
	$schoolID = $arr->schoolID;

	$query = "SELECT *  From `ghjy_school_sub` Where schoolID=$schoolID";
    
    $result = mysql_query($query) 
		or die("Invalid query: readSchoolsubList" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取分校区成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>