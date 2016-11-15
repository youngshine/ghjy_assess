<?php
// 读取3个知识点测评题目（与考试题目paired)
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;
	
	$assessID = $arr->assessID;
	$subjectID = $arr->subjectID; // 题目按学科分3个表
	//$level = $arr->level;
	
	if($subjectID==1){
		$table = 'sx_xiaochu_exam_question';
	}elseif($subjectID==2){
		$table = 'wl_chu_exam_question';
	}else{
		$table = 'hx_chu_exam_question';
	} 
	
	$query = " SELECT a.*,b.level,b.content,b.answer,b.objective_answer,c.zsdName 
		FROM `ghjy_student-assess-topic` a 
		JOIN `$table` b On a.gid=b.gid 
		Join `ghjy_zsd` c On a.zsdID=c.zsdID And a.subjectID=c.subjectID 
		WHERE a.assessID=$assessID ";

	//$query = "SELECT * from `ghjy_topic` where zsdID=$zsdID and level=$level LIMIT 3 ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readTopicList" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取测评题assess-topic成功";
	$res->data = $query_array;


	echo $_GET['callback']."(".$res->to_json().")";
?>