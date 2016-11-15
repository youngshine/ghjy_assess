<?php
/** 
* 学生跟踪记录，联系沟通
*
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;

	$studentID = $arr->studentID;	
	$content = addslashes($arr->content);
		
	$query = "INSERT INTO `ghjy_student-followup` (content,studentID) 
		VALUES ('$content',$studentID)";

	$result = mysql_query($query) 
		or die("Invalid query: createFollowup" . mysql_error());

	// 返回最新插入记录id
	$id = mysql_insert_id(); 
	
	$res->success = true;
	$res->message = "添加联系沟通记录成功";
	$res->data = array("studentfollowID" => $id);


	echo $_GET['callback']."(".$res->to_json().")";
?>