<?php
/*
 * 缴费（大小班、一对一课程）
 * 如果是大小班，还必须把学生添加到报读的班级class_student
 * 传递进来的多个班级数组，必须是json.stringify
*/
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$accntType = addslashes($_REQUEST['accntType']);
$accntDate = $_REQUEST['accntDate'];
$studentID = $_REQUEST['studentID'];
$amount_ys = $_REQUEST['amount_ys'];
$amount = $_REQUEST['amount'];
$note = addslashes($_REQUEST['note']);
$payment = addslashes($_REQUEST['payment']);

$consultID = $_REQUEST['consultID']; //哪个咨询师操作缴费

$pricelistID = $_REQUEST['pricelistID']; //一对一课时套餐，大小班为 0
$title = addslashes($_REQUEST['title']); //一对一课名称
$unitprice = $_REQUEST['unitprice']; //一对一单价，咨询不能修改
$hour = $_REQUEST['hour']; //一对一课时

$arrList = $_REQUEST['arrList']; //报读的多个大小班
$arrList = json_decode($arrList); //转换成数组 decode($a,true)
//$arrClasses = explode(',',$arrClasses);
//echo is_array($arrClasses);

// 1. 收费主记录（大小班，一对一）	
$sql = "INSERT INTO `ghjy_accnt` 
	(studentID,accntType,accntDate,amount_ys,amount,hour,unitprice,
		title,note,payment,pricelistID,consultID) 
	VALUES 
	($studentID,'$accntType','$accntDate',$amount_ys,$amount,
		$hour,$unitprice,'$title','$note','$payment',$pricelistID,$consultID)";
$result = mysql_query($sql) 
	or die("Invalid query: createAccnt" . mysql_error());

// 返回最新插入收费主记录id
$id = mysql_insert_id(); 

//$arrList = json_decode($arrList); //转换成数组 decode($a,true)
// 2.批量循环添加, not is_array
//if(is_object($arrList)){  
foreach($arrList as $rec){
	$sql = "INSERT INTO `ghjy_accnt_detail`
		(accntID,studentID,classID) 
		VALUES($id, $studentID, $rec)";
	$result = mysql_query($sql) 
		or die("Invalid query: createAccntDetail" . mysql_error());
}
//}

/*
// 2.大小班的话，class_student表插入报读班级，数组循环
if($accntType == '大小班' ){
	//$arrClasses = json_decode($arrClasses); //转换成数组 decode($a,true)
	// 批量循环添加, not is_array
	if(is_object($arrClasses)){  
		foreach($arrClasses as $rec){
			$sql = "INSERT INTO `ghjy_class_student`
				(classID,studentID,accntID) 
				VALUES($rec, $studentID, $id)";
			$result = mysql_query($sql) 
				or die("Invalid query: createClassStudent" . mysql_error());
		}
	}
}
*/
echo json_encode(array(
    "success" => false,
    "message" => "缴费成功",
	"data"    =>  array("accntID" => $id)
));

?>