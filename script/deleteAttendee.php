<?php
/* 
 * 删除班级学生，如果已经开课点名，不能删除
 */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$classstudentID = $_REQUEST['classstudentID'];	

$sql = "SELECT 1 FROM `ghjy_class_course` Where classstudentID = $classstudentID";
$result = mysql_query($sql);
if(mysql_num_rows($result) > 0){
    echo json_encode(array(
        "success" => false,
        "message" => "已经开课，不能删除"
    ));
}else{	
	$query = "DELETE from `ghjy_class_student` Where classstudentID = $classstudentID ";
	$result = mysql_query($query) 
		or die("Invalid query: deleteClassAttendee" . mysql_error());

	echo json_encode(array(
        "success" => true,
        "message" => "删除班级学生成功"
    ));
}	

?>
