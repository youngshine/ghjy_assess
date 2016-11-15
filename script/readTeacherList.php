<?php
/*
  * 读取某个咨询师的报名学生
*/
	require_once 'db/response.php';
	require_once 'db/request.php';
	require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();
	
	$arr = $req->params;

	$schoolID = $arr->schoolID;
	//group by student+zsd?，一个学生可以报读同样知识点？？
	$query = " SELECT a.*,b.subjectName 
		From `ghjy_teacher` a 
		Join `ghjy_subject` b On a.subjectID=b.subjectID   
		Where a.schoolID=$schoolID Order by a.created Desc ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readTeacher by school" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取本校教师teacher成功";
	$res->data = $query_array;


	echo $_GET['callback']."(".$res->to_json().")";
	
?>