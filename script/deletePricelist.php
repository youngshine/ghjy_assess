<?php
/* 
 * 删除课时价格记录 ajax instead of jsonp
*/

	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

    $pricelistID = $_REQUEST['pricelistID'];
	
	$query = "DELETE FROM `ghjy_pricelist` Where pricelistID=$pricelistID ";
    $result = mysql_query($query) 
        or die("Invalid query: deletePricelist" . mysql_error());

    echo json_encode(array(
        "success" => true,
        "message" => "删除成功"
    ));

?>
