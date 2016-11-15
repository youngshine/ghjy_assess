<?php
// 全校的课程，校长设置
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;
	//$consultID = $arr->consultID;//班级所属的咨询师
	$kcType = $arr->kcType;//大小班，一对一
	$schoolID = $arr->schoolID;//班级所属的学校
	$schoolsubID = $arr->schoolsubID;//班级所属的分校区

	// left join 教师，因为可能还没有制定班级教师
	$query = "SELECT * FROM `ghjy_kclist` 
		Where kcType='$kcType' And schoolID=$schoolID And current=1 ";
    
    $result = mysql_query($query) or die("Invalid query: readKclist" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取大小班课程kclist成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>