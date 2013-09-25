<?php
//This sample take "Pet Store Demo" for example

//list all the domain ids from "Merchandise"
$itemId = "1000001";
$itemCategory = "1000002";
$itemName = "1000003";
$quantityLeft = "1000004";
$itemPrice = "1000005";
$itemDescription = "1000006";

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
if(!isset($_SESSION["SessionId"]) || $_SESSION["SessionId"] == ""){
    $PostData = "u=".$account."&p=".$password."&login_type=sessionId";
    $Url = "https://api.ragic.com/AUTH";
    $_SESSION["SessionId"] = Curl($Url, $ckfile, $PostData);
}

/*
  Modifying specified entry
*/
$PostId = "0"; //specified entry id, take 0 as example
$Url = "http://api.ragic.com/xxx/petstore/1/".$PostId."?v=3";  //your Pet Store Demo url
$PostData = $itemPrice."=120";
Curl($Url, $ckfile, $PostData);

?>
