<?php
/* 
 * 删除学生测评学科的主记录 ajax instead of jsonp
 */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$assessID = $_REQUEST['assessID'];	

$sql = "SELECT 1 FROM `ghjy_student-assess-topic` Where assessID = $assessID";
$result = mysql_query($sql);
if(mysql_num_rows($result) > 0){
    echo json_encode(array(
        "success" => false,
        "message" => "已经测试内容，不能删除"
    ));
}else{	
	$query = "DELETE from `ghjy_student-assess` Where assessID = $assessID ";
	$result = mysql_query($query) 
		or die("Invalid query: deleteStudentAssess" . mysql_error());

	echo json_encode(array(
        "success" => true,
        "message" => "删除成功"
    ));
}	

?>
