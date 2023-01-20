// Function to be called when a connection is made
setImmediate(function () {
  console.log("[*] Starting script");
  Java.perform(function () {
    var HttpURLConnection = Java.use("java.net.HttpURLConnection");
    var URL = Java.use("java.net.URL");
    var HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection");
    var OkHttpClient = Java.use("okhttp3.OkHttpClient");
    var Thread = Java.use("java.lang.Thread")
    
    //API Android
    
    URL.openConnection.overload().implementation = function () {
      var connection = this.openConnection(); //URLConnection
      var headers = connection.getRequestProperties(); //Map<String, List<String>>
      var stackTrace = Thread.currentThread().getStackTrace()
      console.log("1" + stackTrace)
      console.log( "\n[URL.openConnection()] Opening HTTP/HTTPS connection to: " + connection.getURL().toString() );
      return connection;
    };

    URL.openConnection.overload("java.net.Proxy").implementation = function ( proxy ) {
      var URLConnection = this.openConnection(proxy);
      console.log( "\n[URL.openConnection with proxy] Opening HTTP/HTTPS connection to: " + connection.getURL().toString() );
      return URLConnection;
    };

    var HttpURLConnection = Java.use('java.net.HttpURLConnection');
    HttpURLConnection.connect.implementation = function () {   
        console.log("\n[HttpURLConnection.connect] Opening HTTP/HTTPS connection to: " + this.getURL());
        console.log("[OkHttpClient.newCall] Using method: " + this.getRequestMethod());
        return this.connect();
    };

    HttpsURLConnection.connect.implementation = function () {
      console.log( "\n[HttpsURLConnection.connect] Opening HTTP/HTTPS connection to: " + this.getURL().toString() );
      console.log( "[HttpsURLConnection.connect] Using method: " + this.getRequestMethod() );
      this.connect();
    };

    var Socket = Java.use('java.net.Socket');
    Socket.connect.overload('java.net.SocketAddress', 'int').implementation = function (address, timeout) {
      var stackTrace = Thread.currentThread().getStackTrace()
      console.log("2" + stackTrace)
        console.log("\n[Socket.connect] Opening HTTP/HTTPS connection to: " + address); 
        return this.connect(address, timeout);
    };


    //Square API 
    OkHttpClient.newCall.overload("okhttp3.Request").implementation = function ( request ) {
      console.log( "\n[OkHttpClient.newCall] Opening HTTP/HTTPS connection to: " + request.url().toString() );
      console.log("[OkHttpClient.newCall] Using method: " + request.method());
      return this.newCall(request);
    };
  });
});
