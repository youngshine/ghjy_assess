<?php
/** 一对一，添加报读知识点 study
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;
	// 知识点3个表，所以subjectID+zsdID才是唯一
	$zsdID = $arr->zsdID;
	$subjectID = $arr->subjectID;
	//$fee = $arr->fee;
	$times = $arr->times;
	$studentID = $arr->studentID;
	$accntdetailID = $arr->accntdetailID; //缴费的子记录，追踪用
	//$accntID = $arr->accntID;
	//$prepaidID = $arr->prepaidID; //属于哪个课时套餐taocan
	//$consultID = $arr->consultID; //属于哪个咨询师？？还是按学生
		
	$query = "INSERT INTO `ghjy_student-study` 
		(zsdID,subjectID,times,studentID,accntdetailID) 
		VALUES 
		($zsdID,$subjectID,$times,$studentID,$accntdetailID)";

	$result = mysql_query($query) 
		or die("Invalid query: createStudentStudy" . mysql_error());

	// 返回最新插入记录id
	$id = mysql_insert_id(); 
	
	$res->success = true;
	$res->message = "添加一对一报读学科＋知识点studentstudy成功";
	$res->data = array("studentstudyID" => $id);

	echo $_GET['callback']."(".$res->to_json().")";
?>