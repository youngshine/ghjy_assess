<?php
// 某个咨询的大小班，编辑用
/* SELECT a.title,a.kclistID, (select count(b.studentID) from `ghjy_class_student` b where b.classID=a.classID  ) as enroll  From  `ghjy_class`  a 
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$consultID = $arr->consultID;//班级所属的咨询师

$query = " SELECT a.*,b.fullname 
	From `ghjy_class` a 
	Join `ghjy_school_sub` b On a.schoolsubID=b.schoolsubID 
	Where a.consultID = $consultID ";
	
// 嵌套复合查询，比group by好用
// 可能还没有指定任课教师，所以left join
$query = "SELECT a.*,c.fullname, d.teacherName,   
	(SELECT count(b.studentID) From `ghjy_class_student` b 
	WHERE b.classID=a.classID And b.current=1 ) AS enroll  
	From `ghjy_class` a 
	Join `ghjy_school_sub` c On a.schoolsubID=c.schoolsubID  
	Left Join `ghjy_teacher` d On a.teacherID=d.teacherID 
	WHERE a.consultID = $consultID";

$result = mysql_query($query) 
	or die("Invalid query: readClassList by consult" . mysql_error());

$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($query_array,$row);
	$i++;
}
	
$res->success = true;
$res->message = "读取某个课程的班级classes成功";
$res->data = $query_array;

echo $_GET['callback']."(".$res->to_json().")";

?>