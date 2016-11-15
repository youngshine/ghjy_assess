<?php
/*
 * 添加教师
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

    $arr = $req->params;

	$teacherName = addslashes($arr->teacherName);
	$gender = ($arr->gender);
	//$born = ($arr->born);
	$phone = addslashes($arr->phone);
	$note = addslashes($arr->note);
	$subjectID = $arr->subjectID;
	$schoolID = $arr->schoolID; //所属校区

	$query = "INSERT INTO `ghjy_teacher`
		(teacherName,gender,phone,note,subjectID,schoolID) 
		VALUES('$teacherName','$gender','$phone','$note',$subjectID,$schoolID)";
	$result = mysql_query($query) or die("Invalid query: readTeacher by school" . mysql_error());
	
	if($result){
		$id = mysql_insert_id(); 	
		$res->success = true;
		$res->message = "创建教师成功";
		$res->data = array("teacherID" => $id);
	}else{
		$res->success = false;
		$res->message = "出错！重复";
	}

	echo $_GET['callback']."(".$res->to_json().")";

?>
