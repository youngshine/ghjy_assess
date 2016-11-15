<?php
/*log 选择知识点的教学教师
 * 课程（学习知识点）排课：修改任课教师、上课时间
endlog */

header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$studentstudyID = $_REQUEST['studentstudyID'];
$teacherID = $_REQUEST['teacherID'];
// 上课周期列表，数组字符串
$timely_list = $_REQUEST['timely_list'];

$query = "UPDATE `ghjy_student-study` SET  
	timely_list = '$timely_list',teacherID = $teacherID 
	Where studentstudyID = $studentstudyID ";

$result = mysql_query($query) 
	or die("Invalid query: updateOne2oneStudy by Kcb" . mysql_error());

echo json_encode(array(
    "success" => true,
    "message" => "一对一排课成功"
));

?>
