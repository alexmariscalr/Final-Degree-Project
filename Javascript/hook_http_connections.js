
// Function to be called when a connection is made
setImmediate(function () {
  console.log("[*] Starting script");
  Java.perform(function () {
    var HttpURLConnection = Java.use("java.net.HttpURLConnection");
    //var URL = Java.use("java.net.URL");
    var HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection");
    // var OkHttpClient = Java.use("okhttp3.OkHttpClient");
    var Thread = Java.use("java.lang.Thread")
    
    //API Android

    //Class URLConnection
    var URLConnection = Java.use("java.net.URLConnection")
    URLConnection.connect.implementation = function() {
      var requestMethod = this.getClass().getDeclaredField("requestMethod");
      requestMethod.setAccesible(true);
      requestMethod = requestMethod.get(this)
      var connection = ''

      send('{"type":"URLConnection.connect()' + 
      '","url":"' + this.url.toString() +
      '","port":"' + this.url.getPort() +
      '","requestMethod":"' + requestMethod +
      '","connection":"' + connection +
      '","stackTrace:"'+ Thread.currentThread().getStackTrace() +
      '","domain:"N/A'+ 
      '","thirdParties":"'+ findThirdParties() +
      '","event":"intercept","status":true}')  
      return this.connect();
    }   

    //Class HttpURLConnection (llama internamente a URLConnection.connect())
     var HttpURLConnection = Java.use('java.net.HttpURLConnection');
    HttpURLConnection.connect.implementation = function () {   
      console.log(" \n")
        send('{"type":" HttpURLConnection.connect()' + 
        '","url":"' + this.getURL().toString() +
        '","port":"' + this.getURL().getPort() +
        '","requestMethod":"' + this.getRequestMethod() +
        '","stackTrace:"'+ Thread.currentThread().getStackTrace() +
        '","domain:"N/A'+ 
        '","event":"intercept","status":true}')  
        return this.connect();
    };
 
    //Class HttpsURLConnection (llama internamente a URLConnection.connect())
     HttpsURLConnection.connect.implementation = function () {
      console.log(" \n")
      send('{"type":" HttpURLConnection.connect()' + 
      '","url":"' + this.url.toString() +
      '","port":"' + this.url.getPort() +
      '","requestMethod":"' + this.getRequestMethod() +
      '","stackTrace:"'+ Thread.currentThread().getStackTrace() +
      '","domain:"N/A'+ 
      '","event":"intercept","status":true}')  
      return this.connect();
  };
 
  //Class Socket (API Android)
    var Socket = Java.use('java.net.Socket');
    Socket.connect.overload('java.net.SocketAddress').implementation = function (endpoint) {
      console.log(" \n")
      send('{"type":" Socket.connect(endpoint)' +
      '","stackTrace:"'+ Thread.currentThread().getStackTrace() +
      '","domain:"N/A'+ 
      '","event":"intercept","status":true}')  
        return this.connect(endpoint);
    };

    Socket.connect.overload('java.net.SocketAddress', 'int').implementation = function (endpoint, timeout) {
      console.log("\n")
      send('{"type":" Socket.connect(endpoint, timeout)' + 
      '","stackTrace:"'+ Thread.currentThread().getStackTrace() +
      '","domain:"N/A'+ 
      '","event":"intercept","status":true}')  
        return this.connect(endpoint, timeout);
    };

    Socket.getOutputStream.implementation = function () {
      var lPort = this.getLocalPort();
      var lAddr = this.getLocalSocketAddress();
      var rPort = this.getPort();
      var rAddr = this.getRemoteSocketAddress();
      console.log("\n")
      send('{"type":" Socket.getOutputStream()' + 
      '","local address":"' + lAddr +
      '","local port":"' + lPort +
      '","remote address":"' + rAddr +
      '","remote port":"' + rPort +
      '","stackTrace:"'+ Thread.currentThread().getStackTrace() +
      '","domain:"N/A'+ 
      '","event":"intercept","status":true}')  
        return this.getOutputStream();
    };


    //Square API 
/*     OkHttpClient.newCall.overload("okhttp3.Request").implementation = function ( request ) {
      console.log( "\n[OkHttpClient.newCall] Opening HTTP/HTTPS connection to: " + request.url().toString() );
      console.log("[OkHttpClient.newCall] Using method: " + request.method());
      return this.newCall(request);
    }; */
  });
});
