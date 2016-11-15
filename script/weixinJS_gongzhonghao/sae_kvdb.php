<?php
/** 
* 新浪云kvdb保存access_token及其过期时间
*/
class KVDB {
    private $appId;
    private $appSecret;

    public function __construct($appId, $appSecret) {
      $this->appId = $appId;
      $this->appSecret = $appSecret;
    }
	
	public function getAccessToken(){
		$kv = new SaeKV();

		// 初始化SaeKV对象，已经初始化则返回false
		$ret = $kv->init("lwoykyn5j3"); //访问授权应用的数据
		var_dump($ret);

		// 不存在则返回false
		$ret = $kv->get('access_token');
		//var_dump($ret);
	
		// access_token 7200秒后过期，重新获取并保存 expire_time + 7200
		if ($ret['expire_time'] < time() ){
		    $access_token = newAccessToken();
		    // 更新key-value
		    $arr = array(
		        "access_token" => $access_token,
		        "expire_time" => time() + 7200
		    );
    		// 更新kvdb
		    $ret = $kv->set('access_token', $arr);
    		// 获得更新后的
		    $ret = $kv->get('access_token');
		};
		
		return $ret['access_token'];
	}	

	private function newAccessToken(){
		$url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$this->appId&secret=$this->appSecret";
	    $res = json_decode(httpGet($url));
	    $access_token = $res->access_token;
	    return $access_token;
	}

	private function httpGet($url) {
	    $curl = curl_init();
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	    curl_setopt($curl, CURLOPT_TIMEOUT, 500);
	    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	    curl_setopt($curl, CURLOPT_URL, $url);
    
	    $res = curl_exec($curl);
	    curl_close($curl);
    
	    return $res;
	}
}

?>