<?php
/* 
 * 修改密码consult
 */

	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

    $consultID = $_REQUEST['consultID'];
	$psw1 = addslashes($_REQUEST['psw1']);

	$query = "UPDATE `ghjy_consult` SET psw='$psw1' where consultID=$consultID ";
    $result = mysql_query($query) 
        or die("Invalid query: updatePsw" . mysql_error());
    
    echo json_encode(array(
        "success" => true,
        "message" => "咨询密码设置成功"
    ));
  
?>
