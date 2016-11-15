<?php
/* 
 * 删除教师 ajax instead of jsonp
 * 教师已经分配课程studentstudy，不能删除
*/

	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

    $teacherID = $_REQUEST['teacherID'];
	
	$query = "SELECT 1 FROM `ghjy_student-study` WHERE teacherID=$teacherID LIMIT 1";
    $result = mysql_query($query);
	
	if(mysql_num_rows($result) > 0){
	    echo json_encode(array(
	        "success" => false,
	        "message" => "已经排课，不能删除"
	    ));
	}else{	
		$query = "DELETE FROM `ghjy_teacher` Where teacherID=$teacherID ";
	    $result = mysql_query($query) 
	        or die("Invalid query: deleteTeacher" . mysql_error());
    
	    echo json_encode(array(
	        "success" => true,
	        "message" => "删除成功"
	    ));
	}
  
?>
