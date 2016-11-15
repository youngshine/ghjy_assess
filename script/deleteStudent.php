<?php
/* 
 * 删除学生 ajax instead of jsonp
 * 有缴费accnt，不能删除
*/

	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

    $studentID = $_REQUEST['studentID'];
	
	$query = "SELECT 1 FROM `ghjy_accnt` WHERE studentID=$studentID LIMIT 1";
    $result = mysql_query($query);
	
	if(mysql_num_rows($result) > 0){
	    echo json_encode(array(
	        "success" => false,
	        "message" => "已经购买，不能删除"
	    ));
	}else{	
		$query = "DELETE FROM `ghjy_student` Where studentID=$studentID ";
	    $result = mysql_query($query) 
	        or die("Invalid query: deleteStudent" . mysql_error());
    
	    echo json_encode(array(
	        "success" => true,
	        "message" => "删除成功"
	    ));
	}
  
?>
