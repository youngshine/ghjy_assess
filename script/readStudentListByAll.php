<?php
/*
  * 全校范围学生：
  * 用于大小班，以及缴费报读可以从全校学生选择，不限于咨询师
*/
	require_once 'db/response.php';
	require_once 'db/request.php';
	require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();
	
	$arr = $req->params;

	$schoolID = $arr->schoolID;
	
	$query = "SELECT a.*,b.fullname  
		From `ghjy_student` a 
		Join `ghjy_school_sub` b On b.schoolsubID=a.schoolsubID 
		Where a.schoolID=$schoolID 
		Order By a.created Desc ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readStudentListByAll" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取全校学生成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
	
?>