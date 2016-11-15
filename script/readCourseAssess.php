<?php
/**
 * 课时评价内容，单一记录 
*/

header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$courseID = $_REQUEST['courseID'];
$sql = "SELECT * FROM `ghjy_teacher_course_assess` 
	WHERE courseID = $courseID limit 1";
$result = mysql_query($sql) or 
    die("Invalid query: readCourseAssess" . mysql_error());
$row = mysql_fetch_array($result) or 
    die("Invalid query: readCourseAssess 2" . mysql_error());
//print_r($row);
	
echo json_encode($row);

?>