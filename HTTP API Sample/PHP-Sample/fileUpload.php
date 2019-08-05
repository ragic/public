<?php
$picField = ""; //domain id of the field you want to upload file/image 

$ckfile = tempnam("/tmp", "CURLCOOKIE");  //create cookie file
function Curl($Url, $ckfile, $PostData=""){
    $agent = "Mozilla/5.0 (Windows NT 6.1; WOW64) like Gecko";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_COOKIEJAR, $ckfile);
    curl_setopt($ch, CURLOPT_COOKIEFILE, $ckfile);
    curl_setopt($ch, CURLOPT_USERAGENT, $agent);
    curl_setopt($ch, CURLOPT_URL, $Url);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    if($PostData != ""){
        curl_setopt($ch, CURLOPT_POST, 1);               //submit data in POST method
        curl_setopt($ch, CURLOPT_POSTFIELDS, $PostData);
    }
    $Output = curl_exec($ch);
    if(curl_errno($ch) != 0){
        echo curl_errno($ch).":".str_replace("'","",curl_error($ch));
    }
    curl_close($ch);
    return($Output);
}

//Authentication
$account = "";  //fill your account info
$password = ""; //fill your password info
if(!isset($_SESSION["SessionId"]) || $_SESSION["SessionId"] == "-1"){
    $PostData = "api&v=3&u=".$account."&p=".$password."&login_type=sessionId";
    $Url = "https://www.ragic.com/AUTH";
    $_SESSION["SessionId"] = Curl($Url, $ckfile, $PostData);
}

/*
  Creating a New Entry with File/Image Uploading
  
  Notice that curl_file_create() used below was added in PHP 5.5.0. 
  If your PHP installation is older, it will not support this function,
  and you may have to use $PostData = array($picField => '@'.$file); instead.
  Please refer to PHP official website.
*/
$Url = "https://www.ragic.com/xxx/newt/1?api&v=3";  //your form url
$file = realpath("");                           //fill your file path
$mime = "";                                     //fill file mimetype, like "image/jpg"
$file_name_onserver = "";                       //fill file name you want to use on server side
$cfile = curl_file_create($file, $mime, $file_name_onserver);
$PostData = [$picField => $cfile];
$json = Curl($Url, $ckfile, $PostData);
$result = json_decode($json,true);
echo $json."<br/>";          //print JSON returned
echo $result["ragicId"];    //print ragic Id for this new entry

?>
