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
$semester = $arr->semester;

// 学科测试题目 8个
$sx71 = "'ebj10000035','ebj10000241','ebj10000125','ebj10000541','ebj10000281','ebj10002675','ebj10000568','ebj10002155'";
$sx72 = "'ebj10002469','ebj10002496','ebjb10002267','ebs10000156','zke10000209','zke10000495','ebj10001297','ebjb10003242'";
$sx81 = "'ebj10000840','ebj10000841','ebj10002997','ebj10003004','ebj10001049','ebj10001052','ebj10000919','ebs10000929'";

$hx91 = "'zkh10001808','hrj10004937','zkh10000438','zkh10001761','zkh10001110','zkh10000939','hlj10000960','hlj10000874'";
$hx92 = "'hrj10005566','zkh10004516','zkh10001806','zkh10000515','zkh10002747','zkh10004019','zkh10002098','zkh10000056'";

if($subjectID==1){
	$table = 'sx_xiaochu_exam_question';
	
	if($gradeID=7){
		$topic_list = $semester=='上' ? $sx71 : $sx72;
	}elseif($gradeID=8){
		$topic_list = $semester=='上' ? $sx81 : $sx82;
	}elseif($gradeID=9){
		$topic_list = $semester=='上' ? $sx91 : $sx92;
	}
}elseif($subjectID==2){
	$table = 'wl_chu_exam_question';
}else{
	$table = 'hx_chu_exam_question';
	$topic_list = $semester=='上' ? $hx91 : $hx92;
} 
//var_dump($topic_list);

/* 顺序号 JOIN (SELECT @row :=0) r ，@row := @row +1 AS ROW 
$query = " SELECT a.*,b.zsdName,b.description,b.semester, @row := @row +1 AS ROW  
	FROM `$table` a 
	Join `ghjy_zsd` b On a.zsdID_list=b.zsdID 
	JOIN (SELECT @row :=0) r  
	WHERE a.objective_flag=1 And  
		b.subjectID=$subjectID and b.gradeID=$gradeID and b.semester='$semester' 
	LIMIT 10 ";
*/
$query = " SELECT a.*,b.zsdName,b.description,b.semester, @row := @row +1 AS ROW  
	FROM `$table` a 
	Join `ghjy_zsd` b On (a.zsdID_list=b.zsdID) 
	JOIN (SELECT @row :=0) r  
	WHERE a.gid in($topic_list) And b.subjectID=$subjectID 
	Order By b.zsdName ";
	
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