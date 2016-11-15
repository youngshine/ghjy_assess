<?php
// 某个分校区的班级列表，包括已经报读人数
// 全校的班级？？？咨询自己的班级
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;
	//$consultID = $arr->consultID;//班级所属的咨询师
	$schoolID = $arr->schoolID;//班级所属的学校
	//$schoolsubID = $arr->schoolsubID;//班级所属的分校区

	// left join 教师，因为可能还没有制定班级教师, class没有schoolId，有分校schoolsubId
	$query = "SELECT a.*,c.fullname, d.teacherName, e.kmType,   
		(SELECT count(b.studentID) From `ghjy_class_student` b 
		WHERE b.classID=a.classID And b.current=1 ) AS enroll  
		From `ghjy_class` a 
		Join `ghjy_school_sub` c On a.schoolsubID=c.schoolsubID  
		Left Join `ghjy_teacher` d On a.teacherID=d.teacherID 
		Join `ghjy_kclist` e On a.kclistID=e.kclistID 
		WHERE c.schoolID = $schoolID";
    
    $result = mysql_query($query) 
		or die("Invalid query: readClassList by school" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取班级classes成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>