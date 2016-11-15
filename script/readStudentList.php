<?php
/*
  * 读取某个校区咨询师的报名学生?? 全校所有学生？某个分校所有学生，方便16-09-09
  * 来自公众号的学生，没有归属咨询师怎么办？
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

//$consultID = $arr->consultID;
$schoolID = $arr->schoolID;
$schoolsubID = $arr->schoolsubID;
$val = addslashes( $arr->val );

$query = "SELECT * From `ghjy_student`  
	Where schoolID = $schoolID And 
	( studentName Like '%$val%' Or phone Like '%$val%' ) ";

$result = mysql_query($query) 
	or die("Invalid query: readStudentList search" . mysql_error());

$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($query_array,$row);
	$i++;
}
	
$res->success = true;
$res->message = "查找报名学生student成功";
$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
	
?>