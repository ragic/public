<%@ page import="com.google.gson.Gson"%>
<%@ page import="com.google.gson.JsonElement"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.DataOutputStream" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.net.HttpURLConnection" %>
<%@ page import="java.net.URL" %>
<%@ page import="java.net.URLEncoder" %>
<%!
Gson gson = new Gson();
private final String USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64) Chrome/30.0.1599.66";

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
  Reading all entries
*/
String url = "http://api.ragic.com/xxx/petstore/1?v=3"; //your Pet Store Demo url
String jsonStr = sendGet(url, "");
JsonElement element = gson.fromJson (jsonStr, JsonElement.class);
out.print(element + "<br/>");

/*
  Reading specified entry
  you can limit search range, set condition at url like "...url/petstore/1?v=3&where="+itemId+"%2Ceq%2C12345";
  commas(",") in conditions are needed to transfer to "%2C",  [where="+itemId+",eq,12345"] => [where="+itemId+"%2Ceq%2C12345"]
*/
String postId = "0";    //specified entry id, take 0 as example
url = "http://api.ragic.com/xxx/petstore/1?v=3";  //your Pet Store Demo url
jsonStr = sendGet(url, "");
element = gson.fromJson (jsonStr, JsonElement.class);
JsonObject jsonObj = element.getAsJsonObject();
out.print(jsonObj.get(postId));
%>
