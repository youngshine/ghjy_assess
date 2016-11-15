<?php
/* 
 * 删除班级，有学生子记录不能删除 ajax instead of jsonp
 */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$classID = $_REQUEST['classID'];	

$sql = "SELECT 1 FROM `ghjy_class_student` Where classID = $classID";
$result = mysql_query($sql);
if(mysql_num_rows($result) > 0){
    echo json_encode(array(
        "success" => false,
        "message" => "班级有学生，不能删除"
    ));
}else{	
	$query = "DELETE from `ghjy_class` Where classID = $classID ";
	$result = mysql_query($query) 
		or die("Invalid query: deleteClasses" . mysql_error());

	echo json_encode(array(
        "success" => true,
        "message" => "删除成功"
    ));
}	

?>
