<?php
/* 
 * 修改班级，包括指定班级的任课教师）
 */

header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$classID = $_REQUEST['classID']; //unique
$title = addslashes($_REQUEST['title']);
$kclistID = $_REQUEST['kclistID']; //隶属某个课程
$beginDate = $_REQUEST['beginDate'];
$persons = $_REQUEST['persons'];
$teacherID = $_REQUEST['teacherID'];

// 上课周期列表，数组字符串转为json对象
$timely_list = $_REQUEST['timely_list'];
//$timely_list = json_decode($timely_list); //转换成数组

$sql = "UPDATE `ghjy_class` 
	SET title = '$title',kclistID = $kclistID, persons = $persons, 
	beginDate = '$beginDate', teacherID = $teacherID,
	timely_list = '$timely_list'   
	Where classID = $classID ";
$result = mysql_query($sql) 
    or die("Invalid query: updateClass inc teacher" . mysql_error());

echo json_encode(array(
    "success" => true,
    "message" => "修改班级指定任课教师成功"
));
  
?>
