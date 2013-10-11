<%@ page import="com.google.gson.Gson"%>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.DataOutputStream" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.net.HttpURLConnection" %>
<%@ page import="java.net.URL" %>
<%@ page import="java.net.URLEncoder" %>
<%!
Gson gson = new Gson();
private final String USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64) Chrome/30.0.1599.66";
private class statusReport{
    String status;
    String msg;
    int ragicId;
    String rv;
}

// HTTP GET request
private String sendGet(String url, String data) throws Exception {
    if (url.indexOf("?") == -1) url += "?" + data;
    else url += "&" + data;
    
    URL obj = new URL(url);
    HttpURLConnection conn = (HttpURLConnection) obj.openConnection();
    conn.setRequestMethod("GET");

    //add request header
    conn.setRequestProperty("User-Agent", USER_AGENT);
    conn.setRequestProperty("charset", "UTF-8");
    
    try(BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()))){
        StringBuilder jsonStr = new StringBuilder();
        String inputLine;
        while ((inputLine = br.readLine()) != null) {
            jsonStr.append(inputLine);
        }
        return jsonStr.toString();
    }
}
// HTTP POST request
private String sendPost(String url, String data) throws Exception {
    URL obj = new URL(url);
    HttpURLConnection conn = (HttpURLConnection) obj.openConnection();
    
    //add reuqest header
    conn.setDoOutput(true);
    conn.setDoInput(true);
    conn.setRequestMethod("POST");
    conn.setRequestProperty("User-Agent", USER_AGENT);
    conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded"); 
    conn.setRequestProperty("charset", "utf-8");
    conn.setRequestProperty("Content-Length", "" + Integer.toString(data.getBytes().length));
    
    //send post data
    try(DataOutputStream wr = new DataOutputStream(conn.getOutputStream())){
        wr.writeBytes(data);
    }
    //read response
    try(BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()))){
        StringBuilder jsonStr = new StringBuilder();
        String inputLine;
        while ((inputLine = br.readLine()) != null) {
            jsonStr.append(inputLine);
        }
        return jsonStr.toString();
    }
}
%>
<%
/*
 **This sample take "Pet Store Demo" for example.
 */

//list all the domain ids from "Merchandise"
String itemId = "1000001";
String itemCategory = "1000002";
String itemName = "1000003";
String quantityLeft = "1000004";
String itemPrice = "1000005";
String itemDescription = "1000006";


//Authentication
String account = "xxx"; //fill your account info
String password = "xxx"; //fill your password info
Cookie[] cookies = request.getCookies();
boolean authOk = false;
if (cookies != null) {
    for(Cookie c : cookies){
        if("sessionId".equals(c.getName())){
            authOk = true;
            break;
        } 
    }
}
if(!authOk) {
    String sessionId = sendGet("http://api.ragic.com/AUTH?", "u=" + URLEncoder.encode(account, "UTF-8") + "&p=" + URLEncoder.encode(password, "UTF-8") + "&login_type=sessionId");
    if(sessionId.equals("-1")) return;
    Cookie cookie = new Cookie("sessionId", sessionId);
    response.addCookie(cookie);
}


/*
Modifying specified entry
*/
String postId = "0"; //specified entry id, take 0 as example
String url = "http://api.ragic.com/xxx/petstore/1/" + postId + "?v=3"; //your Pet Store Demo url
String postData = itemPrice + "=120";
String returnedJson = sendPost(url, postData);
statusReport sr = gson.fromJson (returnedJson, statusReport.class);
out.print(sr.status);
%>
