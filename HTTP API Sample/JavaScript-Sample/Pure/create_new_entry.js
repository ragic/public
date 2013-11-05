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
function crossDomainGet(url, postata, callback) {
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

//for POST request
function crossDomainPost(url, postData) {
    // Add the iframe with a unique name
    var iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.style.display = "none";
    iframe.contentWindow.name = "postIframe";

    // construct a form with hidden inputs, targeting the iframe
    var form = document.createElement("form");
    form.target = "postIframe";
    form.action = url;
    form.method = "POST";

    // repeat for each parameter
    var data = postData.split('&');
    for (var i = 0; i < data.length; i++) {
        var input = document.createElement("input");
        var _d = data[i];
        input.type = "hidden";
        input.name = _d.slice(0, _d.indexOf('='));
        input.value = _d.slice(_d.indexOf('=') + 1);
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();

    //remove after post
    document.body.removeChild(form);
    iframe.onload = function () {
        document.body.removeChild(iframe);
    };
}



//Authentication
(function () {
    var account = "xxx"; //fill your account info
    var password = "xxx"; //fill your password info
    if (!localStorage.getItem("sessionId")) {
        var postData = "u=" + account + "&p=" + password + "&login_type=sessionId";
        var url = "https://api.ragic.com/AUTH";
        crossDomainGet(url, postData, '(function(jsessionId){if(jsessionId!=-1){localStorage.setItem("sessionId", jsessionId);}})');
    }
})();

/*
  Creating a New Entry
  To use restful API, change www.ragic.com to api.ragic.com,
  ex: https://www.ragic.com/demo/ragic-setup/3 to https://api.ragic.com/demo/ragic-setup/3
*/
var url = "https://api.ragic.com/xxx/petstore/1?v=3"; //your Pet Store Demo url
var entryData = itemId + "=12345&" +
                itemCategory + "=fish&" + 
                itemName + "=fish food&" + 
                quantityLeft + "=10&" + 
                itemPrice + "=100&" + 
                itemDescription + "=test fish food";
                
window.onload = function () {
    crossDomainPost(url, entryData);
};
