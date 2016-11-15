<?php
/* 
 * 删除购买课程（一对一、大小班）缴费主记录 ajax instead of jsonp
 */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$accntID = $_REQUEST['accntID'];	

$sql = "SELECT 1 FROM `ghjy_accnt_detail` Where accntID = $accntID";
$result = mysql_query($sql);

if(mysql_num_rows($result) > 0){
    echo json_encode(array(
        "success" => false,
        "message" => "已经开班，不能删除"
    ));
}else{	
	/*
	$sql = "SELECT 1 FROM `ghjy_student-study` Where accntID = $accntID";
	$result = mysql_query($sql);
	
	if(mysql_num_rows($result) > 0){
	    echo json_encode(array(
	        "success" => false,
	        "message" => "已经排课，不能删除"
	    ));
	}else{ */
		$query = "DELETE from `ghjy_accnt` Where accntID = $accntID ";
		$result = mysql_query($query) 
			or die("Invalid query: deleteAccnt" . mysql_error());

		echo json_encode(array(
	        "success" => true,
	        "message" => "缴费删除成功"
	    ));
	//}
}	

?>
