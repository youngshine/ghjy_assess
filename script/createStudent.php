<?php
/*
 * 简单的添加一个学生，演示介绍测评用
 */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$studentName = addslashes($arr->studentName);
$gender = ($arr->gender);
$grade = $arr->grade;
//$born = ($arr->born);
$phone = addslashes($arr->phone);
$addr = addslashes($arr->addr);

$schoolsubID = $arr->schoolsubID;

//当前咨询师，网上注册默认 0
$consultID = isset($arr->consultID) ? $arr->consultID : 0 ; 
$schoolID = isset($arr->consultID) ? $arr->schoolID : 0 ; 

//isset($array_r->Sex) ? $user->Sex = $array_r->Sex : $user->Sex = 0;
/*if($user->Sex)
	$user->HeadPhoto = '/carpool/image/male.jpg';
else
	$user->HeadPhoto = '/carpool/image/female.jpg';
$user->CarPhoto = '/carpool/image/default.jpg';*/
//$student->HeadPhoto = '';

//update
//$create_time = time(); //now()
//$birthday = date('Y-m-d H:i:s',strtotime($user->Birthday));
//echo $birthday;

$query = "INSERT INTO `ghjy_student`
	(studentName,gender,grade,phone,addr,schoolsubID,consultID,schoolID) 
 VALUES ('$studentName', '$gender','$grade','$phone','$addr',
	 $schoolsubID, $consultID,$schoolID)";

//$result = mysql_query($query) or die("Invalid query: createStudent" . mysql_error());
$result = mysql_query($query);

if($result){
	$id = mysql_insert_id(); 	
	$res->success = true;
	$res->message = "创建学生资料成功";
	$res->data = array("studentID" => $id);
}else{
	$res->success = false;
	$res->message = "出错！可能电话号码重复";
}

echo $_GET['callback']."(".$res->to_json().")";

?>
