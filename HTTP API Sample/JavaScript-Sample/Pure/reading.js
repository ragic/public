/*
 **This sample take "Pet Store Demo" for example.
 */


//list all the domain ids from "Merchandise"
var itemId = "1000001";
var itemCategory = "1000002";
var itemName = "1000003";
var quantityLeft = "1000004";
var itemPrice = "1000005";
var itemDescription = "1000006";


//for GET request
function doJSONP(url, postata, callback) {
    var head = document.getElementsByTagName('head')[0];
    var js = document.createElement('script');

    if (url.indexOf('?') === -1) url += '?' + postata;
    else url += '&' + postata;
    if (callback) url += '&callback=' + callback;
    js.setAttribute('src', url);
    if (head) {
        head.appendChild(js);
    } else {
        document.body.appendChild(js);
    }
}

function getData(data, index) {
    var JSONObj = JSON.parse(JSON.stringify(data));
    var displayContent;
    if (index) {
        displayContent = JSONObj[index];
    } else {
        displayContent = JSONObj;
    }
    var panel = document.querySelector('#panel');                //need to prepare <div id="panel"></div> in HTML first
    panel.innerHTML += JSON.stringify(displayContent) + "<br/>"; //print data
}


//Authentication
(function () {
    var account = "xxx"; //fill your account info
    var password = "xxx"; //fill your password info
    if (!localStorage.getItem("sessionId")) {
        var postData = "u=" + account + "&p=" + password + "&login_type=sessionId";
        var url = "http://api.ragic.com/AUTH";
        doJSONP(url, postData, '(function(jsessionId){if(jsessionId!=-1){localStorage.setItem("sessionId", jsessionId);}})');
    }
})();


/*
  Reading all entries
*/
var url = "http://api.ragic.com/xxx/petstore/1?v=3"; //your Pet Store Demo url
doJSONP(url, '', 'getData');


/*
  Reading specified entry
  you can limit search range, set condition at url like "...url/petstore/1?v=3&where="+itemId+"%2Ceq%2C12345";
  commas(",") in conditions are needed to transfer to "%2C",  [where="+itemId+",eq,12345"] => [where="+itemId+"%2Ceq%2C12345"]
*/
var postId = "0";    //specified entry id, take 0 as example
var url = "http://api.ragic.com/xxx/petstore/1?v=3";  //your Pet Store Demo url
doJSONP(url, postId, "(function(data){getData(data,'" + postId + "');})"); //print specified data info
