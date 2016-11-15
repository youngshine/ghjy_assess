<?php
/* 
 * 修改班级个别学生的交费（非全款）
 */

	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

    $classstudentID = $_REQUEST['classstudentID'];
	$amount = $_REQUEST['amount'];

	$sql = "UPDATE `ghjy_class_student` 
		SET amount = $amount Where classstudentID=$classstudentID ";
    $result = mysql_query($sql) 
        or die("Invalid query: updateAttendee amount" . mysql_error());
    
    echo json_encode(array(
        "success" => true,
        "message" => "修改学生交费成功"
    ));
  
?>
