<?php
/** 课时套餐下的子表：报读知识点（课程），未缴费的0，可以缴费／排课
* 4-17 知识点分3个表，要临时合并，zsdID+subjectID才是唯一
*
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$accntdetailID = $arr->accntdetailID;
	//$studentID = $arr->studentID;
	//$prepaid = $arr->prepaid; //0缴费前，1缴费后成历史记录，不能修改

	/* 创建临时表（自动清除？），合并知识点（表中zsdID+subjectID才唯一）
	$sql = "CREATE TEMPORARY TABLE temp_zsd   
		SELECT * FROM `ghjy_zsd-sx` Union 
		SELECT * FROM `ghjy_zsd-wl` Union
		SELECT * FROM `ghjy_zsd-hx`";   
	$result = mysql_query($sql); 
	*/
	// 可能还没有排课教师，left join teacher
	$sql = " SELECT a.*,
		b.zsdName,c.subjectName,c.subjectID,d.gradeName,e.teacherName    
		FROM `ghjy_student-study` a 
		JOIN `ghjy_zsd` b on (a.zsdID=b.zsdID and a.subjectID=b.subjectID) 
		JOIN `ghjy_subject` c on b.subjectID=c.subjectID 
		JOIN `ghjy_grade` d on b.gradeID=d.gradeID 
		LEFT JOIN `ghjy_teacher` e ON a.teacherID=e.teacherID 
		WHERE a.accntdetailID = $accntdetailID ";   
    $result = mysql_query($sql) 
		or die("Invalid query: readStudyList by accntdetail" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取学生报读知识点（未缴费）student-study成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>