<?php
/* 
 * 删除学生报读知识点
 */
	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

	$studentstudyID = $_REQUEST['studentstudyID'];

	// 开始教学，则不能删除
	$sql = "SELECT 1 FROM `ghjy_topic-teach` 
		Where studentstudyID = $studentstudyID";
	$result = mysql_query($sql) or die("Invalid query: createOrders" . mysql_error());
	if(mysql_num_rows($result) > 0){
	    echo json_encode(array(
	        "success" => false,
	        "message" => "已经上课，不能删除"
	    ));
	}else{	
		$query = "DELETE from `ghjy_student-study` 
			Where studentstudyID = $studentstudyID ";
		$result = mysql_query($query) 
			or die("Invalid query: deleteStudentStudy" . mysql_error());
		
	    echo json_encode(array(
	        "success" => true,
	        "message" => "删除成功"
	    ));
	}

?>
