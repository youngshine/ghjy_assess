<?php
/*
 * 课程学生分班，班级隶属某个课程
 * 分班后，待分班标志去除 accntdetail.isClassed，才能实现转班
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$studentID = $arr->studentID;
	$classID = $arr->classID;
	$accntdetailID = $arr->accntdetailID;

	$query = "INSERT INTO `ghjy_class_student` (studentID,classID,accntdetailID) 
		VALUES ($studentID,$classID,$accntdetailID)";
	$result = mysql_query($query) 
		or die("Invalid query: createClassStudent" . mysql_error());

	// 返回最新插入记录id
	//$id = mysql_insert_id(); 
	
	$query = "UPDATE `ghjy_accnt_detail` SET isClassed=1 
		Where accntdetailID=$accntdetailID ";
	$result = mysql_query($query) 
		or die("Invalid query: updateAccntDetail" . mysql_error());
	
	
	$res->success = true;
	$res->message = "分班及消除带排班成功";
	//$res->data = array("classstudentID" => $id);

	echo $_GET['callback']."(".$res->to_json().")";
?>