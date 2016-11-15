<?php
/*
 * 咨询师新增班级（属于某个分校区）
*/
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$title = addslashes($_REQUEST['title']);
$kclistID = $_REQUEST['kclistID']; //隶属某个课程（由此能得到学校）
$beginDate = $_REQUEST['beginDate'];
$persons = $_REQUEST['persons'];
$teacherID = $_REQUEST['teacherID'];
$schoolsubID = $_REQUEST['schoolsubID'];  //具体到分校区

$consultID = $_REQUEST['consultID']; //所属咨询师，该咨询师才能修改、删除，其他咨询只能看

// 上课周期列表，数组字符串转为json对象，前面已经转换
$timely_list = $_REQUEST['timely_list'];
//$timely_list = json_decode($timely_list); //转换成数组 decode($a,true)

$query = "INSERT INTO `ghjy_class` 
	(title,kclistID,beginDate,persons,timely_list,teacherID,schoolsubID,consultID) 
	VALUES
	('$title',$kclistID,'$beginDate',$persons,'$timely_list',$teacherID,$schoolsubID,$consultID)";
$result = mysql_query($query) 
	or die("Invalid query: createClass" . mysql_error());

// 返回最新插入记录id
$id = mysql_insert_id(); 

echo json_encode(array(
    "success" => true,
    "message" => "创建班级成功",
	"data"    =>  array("classID" => $id)
));

?>
