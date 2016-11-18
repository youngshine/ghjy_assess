<?php
// 读取测评试卷: assessType初一上数学
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

//$assessType = $arr->assessType;
$subjectID = $arr->subjectID;
$gradeID = $arr->gradeID;

if($subjectID==1){
	$table = 'sx_xiaochu_exam_question';
}elseif($subjectID==2){
	$table = 'wl_chu_exam_question';
}else{
	$table = 'hx_chu_exam_question';
} 

$query = " SELECT a.*,b.zsdName 
	FROM `$table` a 
	Join `ghjy_zsd` b On a.zsdID_list=b.zsdID 
	WHERE a.objective_flag=1 And  
		b.subjectID=$subjectID And b.gradeID=$gradeID 
	LIMIT 10 ";

$result = mysql_query($query) Or die("Invalid query: readAssessTopic" . mysql_error());

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