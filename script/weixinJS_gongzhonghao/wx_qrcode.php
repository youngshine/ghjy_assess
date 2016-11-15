<?php
/**
* 16-08-16 生成带参数的临时二维码，scanid=studentID，学生扫码关注并注册绑定（手机号唯一）
* 先传递进来studentID，作为scene_id
* 然后1: token->ticket 2: ticket->qrcode img ->download 3: scan_id
*/
header("Content-type: text/html; charset=utf-8");

header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

//require_once('../db/database_connection.php');

//第一步：获得传递来参数studentID，作为scan_id
$studentID = $_REQUEST["studentID"]; 

// 第二步：memberId作为scene_id，通过ticket取得二维码图片
//require_once "jssdk-token.php";
//$corpid = "wx4f3ffca94662ce40";
//$corpsecret = "9998a307f7f99e9445d84439d6182355";
//$jssdk = new JSSDK($corpid, $corpsecret);
//$access_token = $jssdk->getAccessToken();

// 新浪云kvdb保存token
$ret = file_get_contents("http://xyzs.sinaapp.com/wx/kvdb.php");
$ret = json_decode($ret); 
$access_token = $ret->access_token;
/*
echo json_encode(array(
	"access_token" => $access_token
));
exit();  */

$url = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=$access_token";
// scene_id采用推荐者的openId???? 临时最长30天2592000
$data = '{
	"expire_seconds": 2592000, 
	"action_name": "QR_SCENE", 
	"action_info": {
		"scene": {
			"scene_id": ' . $studentID . '
		}
	}
}';

$result = httpPost($url,$data);
$jsonInfo = json_decode($result,true);
$ticket = $jsonInfo['ticket'];

// 获得二维码图片
//$ticket = urlencode($ticket);
$url = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=".urlencode($ticket);

// 返回,参数：图片文件地址url
echo json_encode(array(
    "img"     => $url
));

//取得ticket, post instead of get 参数wxid..
function httpPost($url,$data = null){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	
	$res = curl_exec($ch);
	if (curl_errno($ch)) {
		return curl_error($ch);
	}
	curl_close($ch);
	return $res;
}
// 获得二维码图片
function httpGet($url) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_TIMEOUT, 500);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_URL, $url);

    $res = curl_exec($curl);
    curl_close($curl);

    return $res;
}
//从微信下载图片
function downImgFromWx($url)
{
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_NOBODY, 0);	//只取body头
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$package = curl_exec($ch);
	$httpinfo = curl_getinfo($ch);
	curl_close($ch);
	$imageAll = array_merge(array('header'=>$httpinfo),array('body'=>$package));
	return $imageAll;
}

?>

