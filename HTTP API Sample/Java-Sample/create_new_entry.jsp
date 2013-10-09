<%@ page import="com.google.gson.Gson"%>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.DataOutputStream" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.net.HttpURLConnection" %>
<%@ page import="java.net.URL" %>
<%@ page import="java.net.URLEncoder" %>
/*
 ** This sample take "Pet Store Demo" for example,
 ** and use Google Gson project as JSON parser,
 ** Gson could be found at https://code.google.com/p/google-gson/
 */
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
  Creating a New Entry
  To use restful API, change www.ragic.com to api.ragic.com,
  ex: http://www.ragic.com/demo/ragic-setup/3 to http://api.ragic.com/demo/ragic-setup/3
*/
String url = "http://api.ragic.com/xxx/petstore/1?v=3"; //your Pet Store Demo url
String entryData = itemId + "=" + URLEncoder.encode("12345", "UTF-8") + "&" +
                   itemCategory + "=" + URLEncoder.encode("fish", "UTF-8") + "&" +
                   itemName + "=" + URLEncoder.encode("fish food", "UTF-8") + "&" +
                   quantityLeft + "=" + URLEncoder.encode("10", "UTF-8") + "&" +
                   itemPrice + "=" + URLEncoder.encode("100", "UTF-8") + "&" +
                   itemDescription + "=" + URLEncoder.encode("test fish food", "UTF-8");

String returnedJson = sendPost(url, entryData);
statusReport sr = gson.fromJson (returnedJson, statusReport.class);
out.print(sr.ragicId);
%>
