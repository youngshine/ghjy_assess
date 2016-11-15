<?php
/*
 * 咨询师新增班级
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

    $arr = $req->params;

	$title = addslashes($arr->title);
	$hour = $arr->hour;
	$amount = $arr->amount;
	$beginDate = $arr->beginDate;
	$weekday = $arr->weekday;
	$timespan = $arr->timespan;
	$classType = $arr->classType;
	$consultID = $arr->consultID; //所属咨询师

	$query = "INSERT INTO `ghjy_class` 
		(title,hour,amount,beginDate,weekday,timespan,classType,consultID) 
		VALUES('$title',$hour,$amount,'$beginDate','$weekday','$timespan',
			'$classType',$consultID)";
	$result = mysql_query($query) 
		or die("Invalid query: create classes" . mysql_error());
	
	if($result){
		$id = mysql_insert_id(); 	
		$res->success = true;
		$res->message = "创建班级成功";
		$res->data = array("classID" => $id);
	}else{
		$res->success = false;
		$res->message = "出错！重复";
	}

	echo $_GET['callback']."(".$res->to_json().")";

?>
