<?php
// 学生测评主记录
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;
	$consultID = $arr->consultID;//学生所属的咨询师

	$query = " SELECT a.*,b.studentName,c.subjectName,d.gradeName       
		From `ghjy_student-assess` a 
		Join `ghjy_student` b On a.studentID=b.studentID  
		Join `ghjy_subject` c On a.subjectID=c.subjectID 
		Join `ghjy_grade` d On a.gradeID=d.gradeID 
		Where b.consultID = $consultID ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readAssessList by all" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取学生测评主记录assess-list成功";
	$res->data = $query_array;


	echo $_GET['callback']."(".$res->to_json().")";
?>