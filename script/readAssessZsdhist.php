<?php
// 读取历年学科考点（知识点分数权重radar graph)
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;
// 学科数理化，都属于科学, subjectID+zsdID才是知识点unique
$subjectID = $arr->subjectID;
$gradeID = $arr->gradeID; //年级
$semester = addslashes($arr->semester); //学期：上下	
$schoolID = $arr->schoolID; //加盟校区
	
$sql = " SELECT a.*,ceil((a.Y1+a.Y2+a.Y3)/3) as Yavg,b.subjectName,c.zsdName   
	From `ghjy_assess_hist` a 
	Join `ghjy_subject` b On a.subjectID=b.subjectID 
	Join `ghjy_zsd` c On (a.zsdID=c.zsdID And a.subjectID=c.subjectID) 
	where a.subjectID=$subjectID And a.gradeID = $gradeID And a.semester='$semester' "; 
	// And schoolID=$schoolID "; // 先不管学校，全部用泉州

$result = mysql_query($sql) 
	or die("Invalid query: readAssessZsdhist" . mysql_error());

$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($query_array,$row);
	$i++;
}
	
$res->success = true;
$res->message = "读取学生年级学期科目的历史考点hist成功";
$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";

?>