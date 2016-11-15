<?php
/* 
 * ajax删除购买课程，如果已经分配课程内容（知识点）student-study不能删除
 */
	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

	$prepaidID = $_REQUEST['prepaidID'];
	
	$sql = "SELECT 1 FROM `ghjy_student-study` where prepaidID = $prepaidID";
	$result = mysql_query($sql);
	if(mysql_num_rows($result) > 0){
	    echo json_encode(array(
	        "success" => false,
	        "message" => "已经排课，不能删除"
	    ));
	}else{	
		$sql = "DELETE from `ghjy_student-prepaid` where prepaidID = $prepaidID ";
		$result = mysql_query($sql) 
			or die("Invalid query: deleteStudentPrepaid" . mysql_error());
	    
		echo json_encode(array(
	        "success" => true,
	        "message" => "删除成功"
	    ));
	}	

?>
