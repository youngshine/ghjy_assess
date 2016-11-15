<?php
// 读取学科知识点
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;
	// 学科数理化，都属于科学
	$subjectID = $arr->subjectID;
	//$subject = addslashes($arr->subject);
	$sql = "SELECT a.*,b.subjectName,c.gradeName   
		FROM `ghjy_zsd` a 
		JOIN `ghjy_subject` b On a.subjectID=b.subjectID 
		JOIN `ghjy_grade` c On a.gradeID=c.gradeID 
		where a.subjectID = $subjectID ";
    
    $result = mysql_query($sql) 
		or die("Invalid query: readZsdList" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取某个学科知识点zsd成功";
	$res->data = $query_array;


	echo $_GET['callback']."(".$res->to_json().")";
?>