<?php
/**
 * 教师的课程表：某天某个时间段上什么课zsdName? pass !=1 结束的不算
 * 大小班class和一对一student-study合并 16-8-31
*/

header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$teacherID = $_REQUEST['teacherID'];

$sql = "SELECT teach_weekday,teach_timespan FROM 
	`ghjy_student-study` 
	WHERE teacherID = $teacherID And pass = 0 
	Group By teach_weekday,teach_timespan ";
	
$sql = "SELECT teacherID,timely_list,'一对一' As kcType FROM `ghjy_student-study` 
	WHERE teacherID = $teacherID And pass = 0 
	Union All 
	SELECT teacherID,timely_list,'大小班' As kcType FROM `ghjy_class` 
		WHERE teacherID = $teacherID And current = 1 ";	
	
$result = mysql_query($sql) or 
    die("Invalid query: readKcbByTeacher" . mysql_error());

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