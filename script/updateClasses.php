<?php
/* 
 * 修改班级，包括指定班级的任课教师）
 */

	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

    $classID = $_REQUEST['classID'];
	$title = addslashes($_REQUEST['title']);
	$hour = $_REQUEST['hour'];
	$amount = $_REQUEST['amount'];
	$beginDate = $_REQUEST['beginDate'];
	$weekday = $_REQUEST['weekday'];
	$timespan = $_REQUEST['timespan'];
	$classType = $_REQUEST['classType'];
	$teacherID = $_REQUEST['teacherID'];

	$sql = "UPDATE `ghjy_class` 
		SET title = '$title',hour = $hour, amount = $amount, 
		beginDate = '$beginDate', weekday = '$weekday',timespan='$timespan',
		classType = '$classType', teacherID = $teacherID  
		Where classID = $classID ";
    $result = mysql_query($sql) 
        or die("Invalid query: updateClass inc teacher" . mysql_error());
    
    echo json_encode(array(
        "success" => true,
        "message" => "指定任课教师成功"
    ));
  
?>
