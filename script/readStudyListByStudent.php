<?php
/*
  * 某个学生的报读内容（知识点
  * 4-17 知识点分3个表，要临时合并，zsdID+subjectID才是唯一
*/
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

	$studentID = $_REQUEST['studentID'];

	$sql = " SELECT a.*,
		b.zsdName,c.subjectName,c.subjectID,d.gradeName,e.teacherName    
		FROM `ghjy_student-study` a 
		JOIN `ghjy_zsd` b on (a.zsdID=b.zsdID and a.subjectID=b.subjectID) 
		JOIN `ghjy_subject` c on b.subjectID=c.subjectID 
		JOIN `ghjy_grade` d on b.gradeID=d.gradeID 
		LEFT JOIN `ghjy_teacher` e ON a.teacherID=e.teacherID 
		WHERE a.studentID = $studentID ";   
    $result = mysql_query($sql) 
		or die("Invalid query: readStudyList by student" . mysql_error());

	$arr = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($arr,$row);
		$i++;
	}
	
	echo json_encode($arr);
?>