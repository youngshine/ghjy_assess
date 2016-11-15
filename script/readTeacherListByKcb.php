<?php
/**
  * 读取某个时间段，学科教师可以上课，排除studentstudy改时间段上课的教师
  * 学科教师某个时间段（周六08-10),只上课一个知识点 group by weekday+timespan
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$weekday = addslashes($arr->weekday);
	$timespan = addslashes($arr->timespan);
	// 方便取得某个校区的学科的所有教师
	$subjectID = $arr->subjectID;
	$schoolID = $arr->schoolID; 
	
	/*
	//1. 该时间段有课的校区学科教师，完成的课程不算pass=1
	$hasClass = "SELECT teacherID From `ghjy_student-study` 
		Where teach_weekday='$weekday' And teach_timespan='$timespan' And 		
		subjectID=$subjectID And schoolID=$schoolID And pass=0 ";
	//2. 该时间段没有课的学科教师列表
	$query = "SELECT teacherID,teacherName From `ghjy_teacher` 
		Where subjectID=$subjectID And schoolID=$schoolID And 
		NOT EXISTS($hasClass)";	  */
	
	$query = "SELECT teacherID,teacherName From `ghjy_teacher` 
		Where subjectID=$subjectID And schoolID=$schoolID ";
	$result = mysql_query($query) 
		or die("Invalid query: readTeacherByKcb " . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "获得某个时间段校区学科教师teacherkcb成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
	
?>