<?php
/** 添加测评知识点assess
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;
	
	//$zsdID = $arr->zsdID;
	$studentID = $arr->studentID;
	$subjectID = $arr->subjectID;
	$gradeID = $arr->gradeID;
	$semester = addslashes($arr->semester);
	//$consultID = $arr->consultID; //属于哪个咨询师？？还是按学生
		
	$query = "INSERT INTO `ghjy_student-assess` 
		(studentID,subjectID,gradeID,semester) 
		VALUES ($studentID,$subjectID,$gradeID,'$semester')";

	$result = mysql_query($query) 
		or die("Invalid query: createStudentAssess" . mysql_error());

	// 返回最新插入记录id
	$id = mysql_insert_id(); 
	
	$res->success = true;
	$res->message = "添加测评知识点studentassess成功";
	$res->data = array("assessID" => $id);


	echo $_GET['callback']."(".$res->to_json().")";
?>