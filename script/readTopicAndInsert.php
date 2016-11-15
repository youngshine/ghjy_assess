<?php
// 根据选中知识点，读取并添加一个测评题目
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');
	
// 内部系统数据
require_once('db/database_connection.php');

	//$zsdID_list = $_REQUEST['zsdID_list'];
	//$arrZsd = explode(',',$zsdID_list);
	$zsdID = $_REQUEST['zsdID'];
	$subjectID = $_REQUEST['subjectID'];
	$gradeID = $_REQUEST['gradeID'];
	//$semester = '';
	$level = $_REQUEST['level'];
	$assessID = $_REQUEST['assessID'];
	
	if($subjectID==1){
		$table = 'sx_xiaochu_exam_question';
	}elseif($subjectID==2){
		$table = 'wl_chu_exam_question';
	}else{
		$table = 'hx_chu_exam_question';
	} 

	// 随机读取选择题目，该学生的该知识点的已经练习题目不能再出现 not in
	// 题库3个表，代表3个学科
	$query = "SELECT a.*,b.zsdName 
		From `$table` a 
		Join `ghjy_zsd` b On b.zsdID=$zsdID And b.subjectID=$subjectID  
		Where a.zsdID_list='$zsdID' And a.level=3 And a.objective_flag=1   
		Order By rand() LIMIT 1";  
    $result = mysql_query($query) 
		or die("Invalid query: readTopicAssess" . mysql_error());

	// 删除旧的delete, 插入insert 数据表topic-assess?? 
	// 还是前端，保存？
	
	// 插入题目记录
	$row = mysql_fetch_array($result);
	
	$gid = $row["gid"];
	$query2 = "INSERT INTO `ghjy_student-assess-topic`
		(subjectID,zsdID,gid,assessID) 
		VALUES( $subjectID,'$zsdID','$gid',$assessID )";
    $result2 = mysql_query($query2) 
		or die("Invalid query: createTopicAssess" . mysql_error());	
	
	echo json_encode($row);
?>