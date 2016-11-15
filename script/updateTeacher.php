

<?php
/*log
*16-03-09 修改教师资料
endlog */
	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');
	
	$teacherID = $_REQUEST['teacherID'];
	$teacherName = addslashes($_REQUEST['teacherName']);
	$gender = $_REQUEST['gender'];
	$subjectID = $_REQUEST['subjectID'];
	$phone = addslashes($_REQUEST['phone']);
	$note = addslashes($_REQUEST['note']);

	$query = "UPDATE `ghjy_teacher` SET 
		teacherName = '$teacherName',gender = '$gender',
		phone = '$phone',note = '$note',subjectID = $subjectID   
		WHERE teacherID = $teacherID ";
	$result = mysql_query($query) or die("Invalid query: updateTeach" . mysql_error());
	//$result = mysql_query($query);
	
	if($result){
		echo json_encode(array(
	        "success" => true,
	        "message" => "修改成功"
	    ));
	}else{
		echo json_encode(array(
	        "success" => false,
	        "message" => "修改失败"
	    ));
	}

?>
