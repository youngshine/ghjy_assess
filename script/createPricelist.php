<?php
/*
 * 添加一对一课时套餐价格记录
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
	$schoolID = $arr->schoolID; //所属校区

	$query = "INSERT INTO `ghjy_pricelist`(title,hour,amount,schoolID) 
		VALUES('$title',$hour,$amount,$schoolID)";
	$result = mysql_query($query) 
		or die("Invalid query: create pricelist" . mysql_error());
	
	if($result){
		$id = mysql_insert_id(); 	
		$res->success = true;
		$res->message = "创建课时价格记录成功";
		$res->data = array("pricelistID" => $id);
	}else{
		$res->success = false;
		$res->message = "出错！重复";
	}

	echo $_GET['callback']."(".$res->to_json().")";

?>
