<?php
// 某个学生报读的大小班列表
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

	$studentID = $_REQUEST['studentID'];

	// left join 教师，因为可能还没有制定班级教师
	$query = " SELECT a.*,b.title,b.beginDate,b.hour,b.amount,b.weekday,b.timespan,c.teacherName 
		From `ghjy_class_student` a 
		Join `ghjy_class` b On a.classID=b.classID 
		Left Join `ghjy_teacher` c On b.teacherID=c.teacherID 
		Where a.studentID = $studentID ";
    $result = mysql_query($query) 
		or die("Invalid query: readClassList by student" . mysql_error());

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