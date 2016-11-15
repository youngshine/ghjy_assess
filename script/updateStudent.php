

<?php
/*log
*16-03-09 修改学生资料，update电话号码重复？？
endlog */
	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');
	
	$studentID = $_REQUEST['studentID'];
	$studentName = addslashes($_REQUEST['studentName']);
	$gender = addslashes($_REQUEST['gender']);
	$grade = addslashes($_REQUEST['grade']);
	$phone = addslashes($_REQUEST['phone']);
	$addr = addslashes($_REQUEST['addr']);
	$schoolsubID = $_REQUEST['schoolsubID'];

	$query = "UPDATE `ghjy_student` SET 
		studentName = '$studentName',gender = '$gender',
		phone = '$phone',addr = '$addr',grade = '$grade',schoolsubID=$schoolsubID    
		WHERE studentID = $studentID ";
	$result = mysql_query($query) or die("Invalid query: updateStudent " . mysql_error());
	//$result = mysql_query($query);
	
	if($result){
		echo json_encode(array(
	        "success" => true,
	        "message" => "修改成功"
	    ));
	}else{
		echo json_encode(array(
	        "success" => false,
	        "message" => "修改失败，可能电话号码出现重复"
	    ));
	}

?>
