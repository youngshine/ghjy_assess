<?php
// 读取尚未排课表teacherID=0的课程（知识点），某个咨询师（校区）
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$teacherID = $arr->teacherID; //teacherID=0表示尚未排课
	$consultID = $arr->consultID;
	// 知识点分3个表，必循zsdID+subjectID才唯一 unique
	$query = " SELECT a.*,
		b.zsdName,c.subjectName,d.gradeName,e.studentName,f.teacherName     
		From `ghjy_student-study` a 
		join `ghjy_zsd` b on a.zsdID=b.zsdID And a.subjectID=b.subjectID
		join `ghjy_subject` c on b.subjectID=c.subjectID 
		join `ghjy_grade` d on b.gradeID=d.gradeID   
		join `ghjy_student` e on a.studentID=e.studentID  
		LEFT JOIN `ghjy_teacher` f ON a.teacherID=f.teacherID
		Where a.teacherID=$teacherID And e.consultID=$consultID And a.pass=0 ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readstudylist by kcb" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取未排课teacher=0 student-study成功";
	$res->data = $query_array;


	echo $_GET['callback']."(".$res->to_json().")";
?>