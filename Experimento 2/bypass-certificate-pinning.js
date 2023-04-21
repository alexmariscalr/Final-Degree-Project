// -----------------@Autor: Antonio Javier de Lucas LÃ³pez y Alejandro Mariscal Romero
// Script para la extracción de datos de tráfico de una aplicación Android
setTimeout(function () {
  Java.perform(function () {
    console.log("===");
    console.error(
      "* Injecting hooks into common certificate pinning methods *"
    );
    console.log("===");

    try {
      var X509TrustManager = Java.use("javax.net.ssl.X509TrustManager");
      var SSLContext = Java.use("javax.net.ssl.SSLContext");

      // build fake trust manager
      // TrustManager (Android < 7)
      var TrustManager = Java.registerClass({
        // Implement a custom TrustManager
        name: "com.sensepost.test.TrustManager",
        implements: [X509TrustManager],
        methods: {
          checkClientTrusted: function (chain, authType) {},
          checkServerTrusted: function (chain, authType) {},
          getAcceptedIssuers: function () {
            return [];
          },
        },
      });

      // pass our own custom trust manager through when requested
      var TrustManagers = [TrustManager.$new()];
      var SSLContext_init = SSLContext.init.overload(
        "[Ljavax.net.ssl.KeyManager;",
        "[Ljavax.net.ssl.TrustManager;",
        "java.security.SecureRandom"
      );
      SSLContext_init.implementation = function (
        keyManager,
        trustManager,
        secureRandom
      ) {
        send(
          '{"type":"Trustmanager","domain":"N/A","event":"intercept","status":true}'
        );
        SSLContext_init.call(this, keyManager, TrustManagers, secureRandom);
      };
      send(
        '{"type":"Trustmanager","domain":"N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type":"Trustmanager","domain":"N/A","event":"setup","status":false}'
      );
    }

    // okhttp3
    try {
      var CertificatePinner = Java.use("okhttp3.CertificatePinner");
      CertificatePinner.check.overload(
        "java.lang.String",
        "java.util.List"
      ).implementation = function (str) {
        send(
          '{"type":"okhttp3-lista","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return;
      };
      CertificatePinner.check.overload(
        "java.lang.String",
        "java.security.cert.Certificate"
      ).implementation = function (str) {
        send(
          '{"type":"okhttp3-certificate","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return;
      };
      send('{"type":"okhttp3","domain":"N/A","event":"setup","status":true}');
    } catch (err) {
      send('{"type":"okhttp3","domain":"N/A","event":"setup","status":false}');
    }

    // trustkit
    try {
      var Activity = Java.use(
        "com.datatheorem.android.trustkit.pinning.OkHostnameVerifier"
      );
      Activity.verify.overload(
        "java.lang.String",
        "javax.net.ssl.SSLSession"
      ).implementation = function (str) {
        send(
          '{"type":"trustkit{1}","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };

      Activity.verify.overload(
        "java.lang.String",
        "java.security.cert.X509Certificate"
      ).implementation = function (str) {
        send(
          '{"type":"trustkit{2}","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };

      var trustkit_PinningTrustManager = Java.use(
        "com.datatheorem.android.trustkit.pinning.PinningTrustManager"
      );
      trustkit_PinningTrustManager.checkServerTrusted.implementation =
        function () {
          send(
            '{"type":"trustkit{3}","domain":"' +
              "N/A" +
              '","event":"intercept","status":true}'
          );
        };
      send('{"type":"trustkit","domain":"N/A","event":"setup","status":true}');
    } catch (err) {
      send('{"type":"trustkit","domain":"N/A","event":"setup","status":false}');
    }

    // TrustManagerImpl (Android > 7)
    try {
      var TrustManagerImpl = Java.use(
        "com.android.org.conscrypt.TrustManagerImpl"
      );
      TrustManagerImpl.verifyChain.implementation = function (
        untrustedChain,
        trustAnchorChain,
        host,
        clientAuth,
        ocspData,
        tlsSctData
      ) {
        send(
          '{"type":"trustmanagerImpl","domain":"' +
            host +
            '","event":"intercept","status":true}'
        );
        return untrustedChain;
      };
      send(
        '{"type":"trustmanagerImpl","domain":"N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type":"trustmanagerImpl","domain":"N/A","event":"setup","status":false}'
      );
    }

    // Appcelerator Titanium
    try {
      var PinningTrustManager = Java.use(
        "appcelerator.https.PinningTrustManager"
      );
      PinningTrustManager.checkServerTrusted.implementation = function () {
        send(
          '{"type":"appcelerator","domain": "N/A","event":"intercept","status":true}'
        );
      };
      send(
        '{"type":"appcelerator","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type":"appcelerator","domain":"N/A","event":"setup","status":false}'
      );
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // OpenSSLSocketImpl Conscrypt
    try {
      var OpenSSLSocketImpl = Java.use(
        "com.android.org.conscrypt.OpenSSLSocketImpl"
      );
      OpenSSLSocketImpl.verifyCertificateChain.implementation = function (
        certRefs,
        JavaObject,
        authMethod
      ) {
        send(
          '{"type":"OpenSSLSocketImpl Conscrypt","domain": "N/A","event":"intercept","status":true}'
        );
      };
      send(
        '{"type":"OpenSSLSocketImpl Conscrypt","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type":"OpenSSLSocketImpl Conscrypt","domain": "N/A","event":"setup","status":false}'
      );
    }

    // OpenSSLEngineSocketImpl Conscrypt
    try {
      var OpenSSLEngineSocketImpl_Activity = Java.use(
        "com.android.org.conscrypt.OpenSSLEngineSocketImpl"
      );
      OpenSSLSocketImpl_Activity.verifyCertificateChain.overload(
        "[Ljava.lang.Long;",
        "java.lang.String"
      ).implementation = function (str1, str2) {
        send(
          '{"type":"OpenSSLEngineSocketImpl Conscrypt","domain":"' +
            str2 +
            '","event":"intercept","status":true}'
        );
      };
      send(
        '{"type":"OpenSSLEngineSocketImpl Conscrypt","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type":"OpenSSLEngineSocketImpl Conscrypt","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // OpenSSLSocketImpl Apache Harmony
    try {
      var OpenSSLSocketImpl_Harmony = Java.use(
        "org.apache.harmony.xnet.provider.jsse.OpenSSLSocketImpl"
      );
      OpenSSLSocketImpl_Harmony.verifyCertificateChain.implementation =
        function (asn1DerEncodedCertificateChain, authMethod) {
          //console.log('[+] Bypassing OpenSSLSocketImpl Apache Harmony');
          send(
            '{"type":"OpenSSLSocketImpl Apache Harmony","domain":"' +
              "N/A" +
              '","event":"intercept","status":true}'
          );
        };
      send(
        '{"type":"OpenSSLSocketImpl Apache Harmony","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type":"OpenSSLSocketImpl Apache Harmony","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // PhoneGap sslCertificateChecker (https://github.com/EddyVerbruggen/SSLCertificateChecker-PhoneGap-Plugin)
    try {
      var phonegap_Activity = Java.use(
        "nl.xservices.plugins.sslCertificateChecker"
      );
      phonegap_Activity.execute.overload(
        "java.lang.String",
        "org.json.JSONArray",
        "org.apache.cordova.CallbackContext"
      ).implementation = function (str) {
        send(
          '{"type":"PhoneGap sslCertificateChecker","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        //console.log('[+] Bypassing PhoneGap sslCertificateChecker: ' + str);
        return true;
      };
      send(
        '{"type":"PhoneGap sslCertificateChecker","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] PhoneGap sslCertificateChecker pinner not found');
      send(
        '{"type":"PhoneGap sslCertificateChecker","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // IBM MobileFirst pinTrustedCertificatePublicKey (double bypass)
    try {
      var WLClient_Activity = Java.use("com.worklight.wlclient.api.WLClient");
      WLClient_Activity.getInstance().pinTrustedCertificatePublicKey.overload(
        "java.lang.String"
      ).implementation = function (cert) {
        //console.log('[+] Bypassing IBM MobileFirst pinTrustedCertificatePublicKey {1}: ' + cert);
        send(
          '{"type":"IBM MobileFirst {1}","domain":"' +
            cert +
            '","event":"intercept","status":true}'
        );
        return;
      };
      WLClient_Activity.getInstance().pinTrustedCertificatePublicKey.overload(
        "[Ljava.lang.String;"
      ).implementation = function (cert) {
        send(
          '{"type":"IBM MobileFirst {2}","domain":"' +
            cert +
            '","event":"intercept","status":true}'
        );
        //console.log('[+] Bypassing IBM MobileFirst pinTrustedCertificatePublicKey {2}: ' + cert);
        return;
      };
      send(
        '{"type":"IBM MobileFirst","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] IBM MobileFirst pinTrustedCertificatePublicKey pinner not found');
      send(
        '{"type":"IBM MobileFirst","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // IBM WorkLight (ancestor of MobileFirst) HostNameVerifierWithCertificatePinning (quadruple bypass)
    try {
      var worklight_Activity = Java.use(
        "com.worklight.wlclient.certificatepinning.HostNameVerifierWithCertificatePinning"
      );
      worklight_Activity.verify.overload(
        "java.lang.String",
        "javax.net.ssl.SSLSocket"
      ).implementation = function (str) {
        //console.log('[+] Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning {1}: ' + str);
        send(
          '{"type": "IBM WorkLight {1}","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return;
      };
      worklight_Activity.verify.overload(
        "java.lang.String",
        "java.security.cert.X509Certificate"
      ).implementation = function (str) {
        //console.log('[+] Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning {2}: ' + str);
        send(
          '{"type": "IBM WorkLight {2}","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return;
      };
      worklight_Activity.verify.overload(
        "java.lang.String",
        "[Ljava.lang.String;",
        "[Ljava.lang.String;"
      ).implementation = function (str) {
        //console.log('[+] Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning {3}: ' + str);
        send(
          '{"type": "IBM WorkLight {3}","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return;
      };
      worklight_Activity.verify.overload(
        "java.lang.String",
        "javax.net.ssl.SSLSession"
      ).implementation = function (str) {
        //console.log('[+] Bypassing IBM WorkLight HostNameVerifierWithCertificatePinning {4}: ' + str);
        send(
          '{"type": "IBM WorkLight {4}","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type":"IBM WorkLight","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] IBM WorkLight HostNameVerifierWithCertificatePinning pinner not found');
      send(
        '{"type":"IBM WorkLight","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // Conscrypt CertPinManager
    try {
      var conscrypt_CertPinManager_Activity = Java.use(
        "com.android.org.conscrypt.CertPinManager"
      );
      conscrypt_CertPinManager_Activity.isChainValid.overload(
        "java.lang.String",
        "java.util.List"
      ).implementation = function (str) {
        //console.log('[+] Bypassing Conscrypt CertPinManager: ' + str);
        send(
          '{"type": "Conscrypt CertPinManager","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type":"Conscrypt CertPinManager","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] Conscrypt CertPinManager pinner not found');
      send(
        '{"type":"Conscrypt CertPinManager","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // CWAC-Netsecurity (unofficial back-port pinner for Android < 4.2) CertPinManager
    try {
      var cwac_CertPinManager_Activity = Java.use(
        "com.commonsware.cwac.netsecurity.conscrypt.CertPinManager"
      );
      cwac_CertPinManager_Activity.isChainValid.overload(
        "java.lang.String",
        "java.util.List"
      ).implementation = function (str) {
        //console.log('[+] Bypassing CWAC-Netsecurity CertPinManager: ' + str);
        send(
          '{"type": "CWAC-Netsecurity","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type":"CWAC-Netsecurity","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] CWAC-Netsecurity CertPinManager pinner not found');
      send(
        '{"type":"CWAC-Netsecurity","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // Worklight Androidgap WLCertificatePinningPlugin
    try {
      var androidgap_WLCertificatePinningPlugin_Activity = Java.use(
        "com.worklight.androidgap.plugin.WLCertificatePinningPlugin"
      );
      androidgap_WLCertificatePinningPlugin_Activity.execute.overload(
        "java.lang.String",
        "org.json.JSONArray",
        "org.apache.cordova.CallbackContext"
      ).implementation = function (str) {
        //console.log('[+] Bypassing Worklight Androidgap WLCertificatePinningPlugin: ' + str);
        send(
          '{"type": Worklight Androidgap","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type":"Worklight Androidgap","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] Worklight Androidgap WLCertificatePinningPlugin pinner not found');
      send(
        '{"type":"Worklight Androidgap","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // Netty FingerprintTrustManagerFactory
    try {
      var netty_FingerprintTrustManagerFactory = Java.use(
        "io.netty.handler.ssl.util.FingerprintTrustManagerFactory"
      );
      //NOTE: sometimes this below implementation could be useful
      //var netty_FingerprintTrustManagerFactory = Java.use('org.jboss.netty.handler.ssl.util.FingerprintTrustManagerFactory');
      netty_FingerprintTrustManagerFactory.checkTrusted.implementation =
        function (type, chain) {
          //console.log('[+] Bypassing Netty FingerprintTrustManagerFactory');
          send(
            '{"type": "Netty FingerprintTrustManagerFactory","domain":"' +
              "N/A" +
              '","event":"intercept","status":true}'
          );
        };
      send(
        '{"type":"Netty FingerprintTrustManagerFactory","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] Netty FingerprintTrustManagerFactory pinner not found');
      send(
        '{"type":"Netty FingerprintTrustManagerFactory","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // Squareup CertificatePinner [OkHTTP < v3] (double bypass)
    try {
      var Squareup_CertificatePinner_Activity = Java.use(
        "com.squareup.okhttp.CertificatePinner"
      );
      Squareup_CertificatePinner_Activity.check.overload(
        "java.lang.String",
        "java.security.cert.Certificate"
      ).implementation = function (str1, str2) {
        //console.log('[+] Bypassing Squareup CertificatePinner {1}: ' + str1);
        send(
          '{"type": "Squareup CertificatePinner {1}","domain":"' +
            str1 +
            '","event":"intercept","status":true}'
        );
        return;
      };

      Squareup_CertificatePinner_Activity.check.overload(
        "java.lang.String",
        "java.util.List"
      ).implementation = function (str1, str2) {
        //console.log('[+] Bypassing Squareup CertificatePinner {2}: ' + str1);
        send(
          '{"type": "Squareup CertificatePinner {2}","domain":"' +
            str1 +
            '","event":"intercept","status":true}'
        );
        return;
      };
      send(
        '{"type":"Squareup CertificatePinner","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] Squareup CertificatePinner pinner not found');
      send(
        '{"type":"Squareup CertificatePinner","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // Squareup OkHostnameVerifier [OkHTTP v3] (double bypass)
    try {
      var Squareup_OkHostnameVerifier_Activity = Java.use(
        "com.squareup.okhttp.internal.tls.OkHostnameVerifier"
      );
      Squareup_OkHostnameVerifier_Activity.verify.overload(
        "java.lang.String",
        "java.security.cert.X509Certificate"
      ).implementation = function (str1, str2) {
        //console.log('[+] Bypassing Squareup OkHostnameVerifier {1}: ' + str1);
        send(
          '{"type": "Squareup OkHostnameVerifier {1}","domain":"' +
            str1 +
            '","event":"intercept","status":true}'
        );
        return true;
      };

      Squareup_OkHostnameVerifier_Activity.verify.overload(
        "java.lang.String",
        "javax.net.ssl.SSLSession"
      ).implementation = function (str1, str2) {
        //console.log('[+] Bypassing Squareup OkHostnameVerifier {2}: ' + str1);
        send(
          '{"type": "Squareup OkHostnameVerifier {2}","domain":"' +
            str1 +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type":"Squareup OkHostnameVerifier","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] Squareup OkHostnameVerifier pinner not found');
      send(
        '{"type":"Squareup OkHostnameVerifier","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // Android WebViewClient
    try {
      var AndroidWebViewClient_Activity = Java.use(
        "android.webkit.WebViewClient"
      );
      print(AndroidWebViewClient_Activity);
      AndroidWebViewClient_Activity.onReceivedSslError.overload(
        "android.webkit.WebView",
        "android.webkit.SslErrorHandler",
        "android.net.http.SslError"
      ).implementation = function (obj1, obj2, obj3) {
        //console.log('[+] Bypassing Android WebViewClient');
        send(
          '{"type": "Android WebViewClient","domain":"' +
            "N/A" +
            '","event":"intercept","status":true}'
        );
      };
      send(
        '{"type":"Android WebViewClient","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] Android WebViewClient pinner not found');
      send(
        '{"type":"Android WebViewClient","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err);
    }

    // Apache Cordova WebViewClient
    try {
      var CordovaWebViewClient_Activity = Java.use(
        "org.apache.cordova.CordovaWebViewClient"
      );
      CordovaWebViewClient_Activity.onReceivedSslError.overload(
        "android.webkit.WebView",
        "android.webkit.SslErrorHandler",
        "android.net.http.SslError"
      ).implementation = function (obj1, obj2, obj3) {
        //console.log('[+] Bypassing Apache Cordova WebViewClient');
        send(
          '{"type": "Apache Cordova WebViewClient","domain":"' +
            "N/A" +
            '","event":"intercept","status":true}'
        );
        obj3.proceed();
      };
      send(
        '{"type":"Apache Cordova WebViewClient","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] Apache Cordova WebViewClient pinner not found');
      send(
        '{"type":"Apache Cordova WebViewClient","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err):
    }

    // Boye AbstractVerifier (https://github.com/mozilla/spiderweb/blob/master/mobile/android/thirdparty/ch/boye/httpclientandroidlib/conn/ssl/AbstractVerifier.java)
    try {
      var boye_AbstractVerifier = Java.use(
        "ch.boye.httpclientandroidlib.conn.ssl.AbstractVerifier"
      );
      boye_AbstractVerifier.verify.implementation = function (host, ssl) {
        send(
          '{"type": "Boye AbstractVerifier","domain":"' +
            host +
            '","event":"intercept","status":true}'
        );
        //console.log('[+] Bypassing Boye AbstractVerifier: ' + host);
      };
      send(
        '{"type":"Boye AbstractVerifier","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      //console.log('[-] Boye AbstractVerifier pinner not found');
      send(
        '{"type":"Boye AbstractVerifier","domain": "N/A","event":"setup","status":false}'
      );
      //console.log(err):
    }

    ///// TrustManagerImpl (Andrea)
    try {
      var array_list = Java.use("java.util.ArrayList");
      var ApiClient = Java.use("com.android.org.conscrypt.TrustManagerImpl");
      ApiClient.checkTrustedRecursive.implementation = function (
        obj1,
        obj2,
        obj3,
        obj4,
        obj5,
        objs6
      ) {
        send(
          '{"type": "TrustManagerImpl(ANDREA)","domain":"' +
            obj4 +
            '","event":"intercept","status":true}'
        );
        var k = array_list.$new();
        return k;
      };
      send(
        '{"type": "TrustManagerImpl(ANDREA)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type":"TrustManagerImpl(ANDREA)","domain": "N/A","event":"setup","status":false}'
      );
    }

    //// Android WebViewClient (Andrea)
    try {
      var WebView = Java.use("android.webkit.WebView");
      WebView.loadUrl.overload("java.lang.String").implementation = function (
        s
      ) {
        send(
          '{"type": "Android WebViewClient(ANDREA)","domain":"' +
            s +
            '","event":"intercept","status":true}'
        );
        this.setWebContentsDebuggingEnabled(true);
        this.loadUrl.overload("java.lang.String").call(this, s);
      };
      send(
        '{"type":"Android WebViewClient(ANDREA)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type":"Android WebViewClient(ANDREA)","domain": "N/A","event":"setup","status":false}'
      );
    }

    ////Okhttp3 (Andrea)
    try {
      var Pinner = Java.use("okhttp3.g$a");
      Pinner.a.overload(
        "java.lang.String",
        "[Ljava.lang.String;"
      ).implementation = function (a, b) {
        send(
          '{"type": "Okhttp1(ANDREA)","domain":"' +
            a +
            '","event":"intercept","status":true}'
        );
        return this;
      };
      send(
        '{"type": "Okhttp1(ANDREA)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "Okhttp1(ANDREA)","domain": "N/A", "event":"setup","status":false}'
      );
    }

    ////Okhttp3 (Andrea)
    //Nuevo mÃ©todo check(String a, Certificate... peerCert);
    try {
      var CertificatePinner = Java.use("okhttp3.CertificatePinner");
      CertificatePinner.check.overload(
        "java.lang.String",
        "java.util.List"
      ).implementation = function () {
        send(
          '{"type": "Okhttp2(ANDREA)","domain":"N/A","event":"intercept","status":true}'
        );
      };
      send(
        '{"type": "Okhttp2(ANDREA)","domain":"N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "Okhttp2(ANDREA)","domain": "N/A","event":"setup","status":false}'
      );
    }

    // Trustmanager (ANDREA & ANTONIO)

    try {
      var CertificateFactory = Java.use(
        "java.security.cert.CertificateFactory"
      );
      var FileInputStream = Java.use("java.io.FileInputStream");
      var BufferedInputStream = Java.use("java.io.BufferedInputStream");
      var X509Certificate = Java.use("java.security.cert.X509Certificate");
      var KeyStore = Java.use("java.security.KeyStore");
      var TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");
      var SSLContext = Java.use("javax.net.ssl.SSLContext");
      var cf = CertificateFactory.getInstance("X.509");

      try {
        var fileInputStream = FileInputStream.$new(
          "/data/local/tmp/cert-der.crt"
        );
      } catch (err) {
        send(
          '{"type":"ERROR_1","domain": "N/A","event":"setup","status":false}'
        );
      }

      var bufferedInputStream = BufferedInputStream.$new(fileInputStream);
      var ca = cf.generateCertificate(bufferedInputStream);
      bufferedInputStream.close();

      var certInfo = Java.cast(ca, X509Certificate);

      var keyStoreType = KeyStore.getDefaultType();
      var keyStore = KeyStore.getInstance(keyStoreType);
      keyStore.load(null, null);
      keyStore.setCertificateEntry("ca", ca);

      var tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
      var tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
      tmf.init(keyStore);

      SSLContext.init.overload(
        "[Ljavax.net.ssl.KeyManager;",
        "[Ljavax.net.ssl.TrustManager;",
        "java.security.SecureRandom"
      ).implementation = function (a, b, c) {
        SSLContext.init
          .overload(
            "[Ljavax.net.ssl.KeyManager;",
            "[Ljavax.net.ssl.TrustManager;",
            "java.security.SecureRandom"
          )
          .call(this, a, tmf.getTrustManagers(), c);
        send(
          '{"type":"Trustmanager(ANDREA&ANTONIO)","domain": "N/A","event":"intercept","status":true}'
        );
      };

      send(
        '{"type":"Trustmanager(ANDREA&ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type":"Trustmanager(ANDREA&ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    //// Okhttp3 (Antonio)

    //Certificate Pinner como un Arraylist
    try {
      var CertificatePinner2 = Java.use("okhttp3.CertificatePinner");
      CertificatePinner2["check$okhttp"].implementation = function (str) {
        send(
          '{"type": "Okhttp3(ANTONIO)","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
      };
      send(
        '{"type": "Okhttp3(ANTONIO)","domain":"N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "Okhttp3(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    ////Truskit (Antonio)
    try {
      var PinningTrustManager1 = Java.use(
        "com.datatheorem.android.trustkit.pinning.PinningTrustManager"
      );
      PinningTrustManager1.checkServerTrusted.overload(
        "java.util.Arrays",
        "java.lang.String"
      ).implementation = function (str) {
        send(
          '{"type":"trustkit1(ANTONIO)","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type": "trustkit1(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "trustkit1(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      var PinningTrustManager1 = Java.use(
        "com.datatheorem.android.trustkit.pinning.PinningTrustManager"
      );
      PinningTrustManager1.checkClientTrusted.overload(
        "java.util.Arrays",
        "java.lang.String"
      ).implementation = function (str) {
        send(
          '{"type":"trustkit2(ANTONIO)","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type": "trustkit2(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "trustkit2(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      var PinningTrustManager1 = Java.use(
        "com.datatheorem.android.trustkit.pinning.PinningTrustManager"
      );
      PinningTrustManager1.checkTrustedRecursive.implementation = function (
        str
      ) {
        send(
          '{"type":"trustkit3(ANTONIO)","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type": "trustkit3(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "trustkit3(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      var PinningTrustManager1 = Java.use(
        "com.datatheorem.android.trustkit.pinning.PinningTrustManager"
      );
      PinningTrustManager1.checkTrusted.implementation = function (str) {
        send(
          '{"type":"trustkit4(ANTONIO)","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type": "trustkit4(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "trustkit4(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      var PinningTrustManager1 = Java.use(
        "com.datatheorem.android.trustkit.pinning.PinningTrustManager"
      );
      PinningTrustManager1.check.implementation = function (str) {
        send(
          '{"type":"trustkit5(ANTONIO)","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type": "trustkit5(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "trustkit5(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      var PinningTrustManager1 = Java.use(
        "com.datatheorem.android.trustkit.pinning.PinningTrustManager"
      );
      PinningTrustManager1.check$okhttp.implementation = function (str) {
        send(
          '{"type":"trustkit6(ANTONIO)","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type": "trustkit6(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "trustkit6(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      var PinningTrustManager1 = Java.use(
        "com.datatheorem.android.trustkit.pinning.PinningTrustManager"
      );
      PinningTrustManager1.verifyCertificateChain.implementation = function (
        str
      ) {
        send(
          '{"type":"trustkit7(ANTONIO)","domain":"' +
            str +
            '","event":"intercept","status":true}'
        );
        return true;
      };
      send(
        '{"type": "trustkit7(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "trustkit7(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    //TrustManagerImpl (ANTONIO)

    try {
      var ApiClient = Java.use("com.android.org.conscrypt.TrustManagerImpl");
      ApiClient.verifyChain.implementation = function (
        obj1,
        obj2,
        obj3,
        obj4,
        obj5,
        objs6
      ) {
        send(
          '{"type": "TrustManagerImpl(ANTONIO)","domain":"' +
            obj1 +
            '","event":"intercept","status":true}'
        );
        return obj1;
      };
      send(
        '{"type": "TrustManagerImpl(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type":"TrustManagerImpl(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    //Android WebViewClient (ANTONIO) (https://www.codota.com/code/java/classes/android.webkit.WebResourceRequest)
    try {
      var WebView = Java.use("android.webkit.WebViewClient");
      WebView.onReceivedError.overload(
        "android.webkit.WebView",
        "android.webkit.WebResourceRequest",
        "android.webkit.WebResourceError"
      ).implementation = function (s) {
        send(
          '{"type": "Android WebViewClient_1(ANTONIO)","domain":"' +
            s +
            '","event":"intercept","status":true}'
        );
      };
      send(
        '{"type":"Android WebViewClient_1(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "Android WebViewClient_1(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    // (https://stackoverflow.com/questions/36553190/check-in-the-onreceivedsslerror-method-of-a-webviewclient-if-a-certificate-is) (https://www.codota.com/code/java/classes/android.webkit.WebViewClient)

    try {
      var WebView = Java.use("android.webkit.WebViewClient");
      WebView.onReceivedError.overload(
        "android.webkit.WebView",
        "java.lang.Integer",
        "java.lang.String",
        "java.lang.String"
      ).implementation = function (s) {
        send(
          '{"type": "Android WebViewClient_2(ANTONIO)","domain":"' +
            s +
            '","event":"intercept","status":true}'
        );
      };
      send(
        '{"type":"Android WebViewClient_2(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "Android WebViewClient_2(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    // (https://stackoverflow.com/questions/36553190/check-in-the-onreceivedsslerror-method-of-a-webviewclient-if-a-certificate-is)

    try {
      var WebView = Java.use("android.webkit.WebViewClient");
      WebView.onReceivedSslError.overload(
        "android.webkit.WebView",
        "android.webkit.SslErrorHandler",
        "android.net.http.SslError"
      ).implementation = function (s) {
        send(
          '{"type": "Android WebViewClient_3(ANTONIO)","domain":"' +
            s +
            '","event":"intercept","status":true}'
        );
      };
      send(
        '{"type":"Android WebViewClient_3(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "Android WebViewClient_3(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    // OkhttpClient (ANTONIO) (https://javadoc.io/doc/com.squareup.okhttp3/okhttp/3.14.9/okhttp3/package-summary.html
    try {
      var ByteString = Java.use("com.android.okhttp.okio.ByteString");
      var Buffer = Java.use("com.android.okhttp.okio.Buffer");
      var Interceptor = Java.use("okhttp3.Interceptor");
      var MyInterceptor = Java.registerClass({
        name: "okhttp3.MyInterceptor",
        implements: [Interceptor],
        methods: {
          intercept: function (chain) {
            var request = chain.request();
            try {
              //console.log("MyInterceptor.intercept onEnter:", request, "\nrequest headers:\n", request.headers());
              var requestBody = request.body();
              var contentLength = requestBody ? requestBody.contentLength() : 0;
              if (contentLength > 0) {
                var BufferObj = Buffer.$new();
                requestBody.writeTo(BufferObj);
                try {
                  console.log(
                    "\nrequest body String:\n",
                    BufferObj.readString(),
                    "\n"
                  );
                } catch (error) {
                  try {
                    console.log(
                      "\nrequest body ByteString:\n",
                      ByteString.of(BufferObj.readByteArray()).hex(),
                      "\n"
                    );
                  } catch (error) {
                    console.log("error 1:", error);
                  }
                }
              }
            } catch (error) {
              console.log("error 2:", error);
            }
            var response = chain.proceed(request);
            try {
              //console.log("MyInterceptor.intercept onLeave:", response, "\nresponse headers:\n", response.headers());
              var responseBody = response.body();
              var contentLength = responseBody
                ? responseBody.contentLength()
                : 0;
              if (contentLength > 0) {
                console.log(
                  "\nresponsecontentLength:",
                  contentLength,
                  "responseBody:",
                  responseBody,
                  "\n"
                );

                var ContentType = response.headers().get("Content-Type");
                console.log("ContentType:", ContentType);
                if (ContentType.indexOf("video") == -1) {
                  if (ContentType.indexOf("application") == 0) {
                    var source = responseBody.source();
                    if (ContentType.indexOf("application/zip") != 0) {
                      try {
                        console.log(
                          "\nresponse.body StringClass\n",
                          source.readUtf8(),
                          "\n"
                        );
                      } catch (error) {
                        try {
                          console.log(
                            "\nresponse.body ByteString\n",
                            source.readByteString().hex(),
                            "\n"
                          );
                        } catch (error) {
                          console.log("error 4:", error);
                        }
                      }
                    }
                  }
                }
              }
            } catch (error) {
              console.log("error 3:", error);
            }
            return response;
          },
        },
      });

      try {
        //var ArrayList = Java.use("java.util.ArrayList");
        var OkHttpClient = Java.use("okhttp3.OkHttpClient");
        OkHttpClient.$init.overload(
          "okhttp3.OkHttpClient$Builder"
        ).implementation = function (Builder) {
          send(
            '{"type": "OkHttpClient_1(ANTONIO)","domain":"' +
              Builder +
              '","event":"intercept","status":true}'
          );
          //send("OkHttpClient.$init:", this, Java.cast(Builder.interceptors(), ArrayList));//
          this.$init(Builder); //
        };
        send(
          '{"type":"OkHttpClient_1(ANTONIO)","domain": "N/A","event":"setup","status":true}'
        );
      } catch (err) {
        send(
          '{"type": "OkHttpClient_1(ANTONIO)","domain": "N/A","event":"setup","status":false}'
        );
      }

      try {
        var MyInterceptorObj = MyInterceptor.$new();
        var Builder = Java.use("okhttp3.OkHttpClient$Builder");
        Builder.build.implementation = function () {
          send(
            '{"type": "OkHttpClient_2.1(ANTONIO)","domain":"","event":"intercept","status":true}'
          );
          this.interceptors().clear(); //
          //var MyInterceptorObj = MyInterceptor.$new();
          this.interceptors().add(MyInterceptorObj); //
          var result = this.build(); //
          return result; //
        };
        Builder.addInterceptor.implementation = function (interceptor) {
          send(
            '{"type": "OkHttpClient_2.2(ANTONIO)","domain":"' +
              interceptor +
              '","event":"intercept","status":true}'
          );
          this.interceptors().clear(); //
          //var MyInterceptorObj = MyInterceptor.$new();
          this.interceptors().add(MyInterceptorObj); //
          return this; //
          //return this.addInterceptor(interceptor);
        };
        send(
          '{"type":"OkHttpClient_2(ANTONIO)","domain": "N/A","event":"setup","status":true}'
        );
      } catch (err) {
        send(
          '{"type": "OkHttpClient_2(ANTONIO)","domain": "N/A","event":"setup","status":false}'
        );
      }
    } catch (err) {
      send('{"type":"ERROR_2","domain": "N/A","event":"setup","status":false}');
    }

    // OkHttpClient Squareup (ANTONIO) (https://square.github.io/okhttp/2.x/okhttp/com/squareup/okhttp/OkHttpClient.html

    try {
      var OkHttpClient = Java.use("com.squareup.okhttp.OkHttpClient");
      OkHttpClient.setCertificatePinner.implementation = function (s) {
        send(
          '{"type": "OkHttpClient squareup_1(ANTONIO)","domain":"' +
            s +
            '","event":"intercept","status":true}'
        );
        return this;
      };
      send(
        '{"type":"OkHttpClient squareup_1(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "OkHttpClient squareup_1(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      var OkHttpClient = Java.use("com.squareup.okhttp.OkHttpClient");
      OkHttpClient.setSocketFactory.implementation = function (s) {
        send(
          '{"type": "OkHttpClient squareup_2(ANTONIO)","domain":"' +
            s +
            '","event":"intercept","status":true}'
        );
        return this;
      };
      send(
        '{"type":"OkHttpClient squareup_2(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "OkHttpClient squareup_2(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      var OkHttpClient = Java.use("com.squareup.okhttp.OkHttpClient");
      OkHttpClient.setSslSocketFactory.implementation = function (s) {
        send(
          '{"type": "OkHttpClient squareup_3(ANTONIO)","domain":"' +
            s +
            '","event":"intercept","status":true}'
        );
        return this;
      };
      send(
        '{"type":"OkHttpClient squareup_3(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "OkHttpClient squareup_3(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      var OkHttpClient = Java.use("com.squareup.okhttp.OkHttpClient");
      OkHttpClient.setCertificatePinner.overload(
        "com.squareup.okhttp.CertificatePinner"
      ).implementation = function (s) {
        send(
          '{"type": "OkHttpClient squareup_4(ANTONIO)","domain":"' +
            s +
            '","event":"intercept","status":true}'
        );
        return this;
      };
      send(
        '{"type":"OkHttpClient squareup_4(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "OkHttpClient squareup_4(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      var OkHttpClient = Java.use("com.squareup.okhttp.OkHttpClient");
      OkHttpClient.setSocketFactory.overload(
        "javax.net.SocketFactory"
      ).implementation = function (s) {
        send(
          '{"type": "OkHttpClient squareup_5(ANTONIO)","domain":"' +
            s +
            '","event":"intercept","status":true}'
        );
        return this;
      };
      send(
        '{"type":"OkHttpClient squareup_5(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "OkHttpClient squareup_5(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      var OkHttpClient = Java.use("com.squareup.okhttp.OkHttpClient");
      OkHttpClient.setSslSocketFactory.overload(
        "javax.net.ssl.SSLSocketFactory"
      ).implementation = function (s) {
        send(
          '{"type": "OkHttpClient squareup_6(ANTONIO)","domain":"' +
            s +
            '","event":"intercept","status":true}'
        );
        return this;
      };
      send(
        '{"type":"OkHttpClient squareup_6(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "OkHttpClient squareup_6(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    // Okhttp3 (CertificatePinner.Builder)
    try {
      var CertificatePinnerBuilder = Java.use(
        "okhttp3.CertificatePinner.Builder"
      );
      CertificatePinnerBuilder.add.overload(
        "java.lang.String",
        "java.lang.String"
      ).implementation = function (Builder) {
        send(
          '{"type": "OkHttp3_2(ANTONIO)","domain":"' +
            Builder +
            '","event":"intercept","status":true}'
        );
        return Builder;
      };
      send(
        '{"type":"OkHttp3_2(ANTONIO)","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "OkHttp3_2(ANTONIO)","domain": "N/A","event":"setup","status":false}'
      );
    }

    let Thread = Java.use("java.lang.Thread");

    //1---------Java NIO SocketChannel - Open: Open a socket channel
    let SocketChannel = Java.use("java.nio.channels.SocketChannel");

    try {
      SocketChannel.open.implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        let socket = this.socket();
        let client = socket.getLocalAddress();
        let port = socket.getLocalPort();
        send(
          '{"type": "java.nio.channels.SocketChannel","trace:"' +
            traceClasses +
            '","client": "' +
            client +
            ":" +
            port +
            '","domain": "N/A","event":"intercept","status":true}'
        );
        return this.open();
      };
      send(
        '{"type":"java.nio.channels.SocketChannel","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "java.nio.channels.SocketChannel","domain": "N/A","event":"setup","status":false}'
      );
    }
    try {
      SocketChannel.open.overload("java.net.SocketAddress").implementation =
        function (addr) {
          let traces = Thread.currentThread().getStackTrace();
          let traceClasses = [];
          for (let trace of traces) {
            traceClasses.push(trace.getClassName());
          }
          let socket = this.socket();
          let client = socket.getLocalAddress();
          let port = socket.getLocalPort();
          send(
            '{"type": "java.nio.channels.SocketChannel","trace:"' +
              traceClasses +
              '","client": "' +
              client +
              ":" +
              port +
              '","domain": "N/A","event":"intercept","status":true}'
          );
          return this.open(addr);
        };
    } catch {
      send(
        '{"type": "java.nio.channels.SocketChannel","domain": "N/A","event":"setup","status":false}'
      );
    }

    //2----------Socket- connect: Method to intercept socket connections
    let Socket = Java.use("java.net.Socket");
    try {
      Socket.connect.overload("java.net.SocketAddress").implementation =
        function (endpoint) {
          let traces = Thread.currentThread().getStackTrace();
          let traceClasses = [];
          for (let trace of traces) {
            traceClasses.push(trace.getClassName());
          }
          this.connect(endpoint);
          let client = this.getLocalAddress();
          let port = this.getLocalPort();
          send(
            '{"type": "java.net.Socket.connect","trace:"' +
              traceClasses +
              '","client": "' +
              client +
              ":" +
              port +
              '","domain": "N/A","event":"intercept","status":true}'
          );
          return this.connect(endpoint);
        };
    } catch {
      send(
        '{"type": "java.net.Socket.connect","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      Socket.connect.overload("java.net.SocketAddress", "int").implementation =
        function (endpoint, timeout) {
          let traces = Thread.currentThread().getStackTrace();
          let traceClasses = [];
          for (let trace of traces) {
            traceClasses.push(trace.getClassName());
          }

          let client = this.getLocalAddress();
          let port = this.getLocalPort();
          send(
            '{"type": "java.net.Socket.connect","trace:"' +
              traceClasses +
              '","client": "' +
              client +
              ":" +
              port +
              '","domain": "N/A","event":"intercept","status":true}'
          );
          return this.connect(endpoint, timeout);
        };
      send(
        '{"type": "java.net.Socket.connect","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "java.net.Socket.connect","domain": "N/A","event":"setup","status":false}'
      );
    }

    //3-------------- Socket - getOutputStream: Output stream of the socket
    try {
      Socket.getOutputStream.implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        let client = this.getLocalAddress();
        let port = this.getLocalPort();
        send(
          '{"type": "java.net.Socket.getOutputStream","trace:"' +
            traceClasses +
            '","processID": "' +
            Process.id +
            '","client": "' +
            client +
            ":" +
            port +
            '","domain": "N/A","event":"intercept","status":true}'
        );
        return this.getOutputStream();
      };
      send(
        '{"type":"java.net.Socket.getOutputStream","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "java.net.Socket.getOutputStream","domain": "N/A","event":"setup","status":false}'
      );
    }

    //17 -------------- Socket - sendUrgentData(int data): Send urgent data
    try {
      Socket.sendUrgentData.overload("int").implementation = function (data) {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        let client = this.getLocalAddress();
        let port = this.getLocalPort();
        send(
          '{"type": "java.net.Socket.sendUrgentData","trace:"' +
            traceClasses +
            '","processID": "' +
            Process.id +
            '","client": "' +
            client +
            ":" +
            port +
            '","domain": "N/A","event":"intercept","status":true}'
        );
        return this.sendUrgentData(data);
      };
      send(
        '{"type":"java.net.Socket.sendUrgentData","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "java.net.Socket.sendUrgentData","domain": "N/A","event":"setup","status":false}'
      );
    }

    //18 -------------- Socket - close(): Close the socket
    try {
      Socket.close.implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        let client = this.getLocalAddress();
        let port = this.getLocalPort();
        send(
          '{"type": "java.net.Socket.close","trace:"' +
            traceClasses +
            '","processID": "' +
            Process.id +
            '","client": "' +
            client +
            ":" +
            port +
            '","domain": "N/A","event":"intercept","status":true}'
        );
        return this.close();
      };
      send(
        '{"type":"java.net.Socket.close","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "java.net.Socket.close","domain": "N/A","event":"setup","status":false}'
      );
    }
    


    //4----------------SSLContext - getInstance: Creation of SSL Context
    try {
      let SSLContext = Java.use("javax.net.ssl.SSLContext");
      SSLContext.getInstance.overload("java.lang.String").implementation =
        function (protocol) {
          let traces = Thread.currentThread().getStackTrace();
          let traceClasses = [];
          for (let trace of traces) {
            traceClasses.push(trace.getClassName());
          }
          send(
            '{"type": "javax.net.ssl.SSLContext.getInstance","trace:"' +
              traceClasses +
              '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
          );
          return this.getInstance(protocol);
        };
      send(
        '{"type":"javax.net.ssl.SSLContext.getInstance","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "javax.net.ssl.SSLContext.getInstance","domain": "N/A","event":"setup","status":false}'
      );
    }

    //5 ----------------- Socket - bind: Bind the socket to a local address
    try {
      Socket.bind.overload("java.net.SocketAddress").implementation = function (
        bindpoint
      ) {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        let client = this.getLocalAddress().getHostAddress();
        let port = this.getLocalPort();
        send(
          '{"type": "java.net.Socket.bind","trace:"' +
            traceClasses +
            '","client": "' +
            client +
            ":" +
            port +
            '","domain": "N/A","event":"intercept","status":true}'
        );
        return this.bind(bindpoint);
      };
      send(
        '{"type":"java.net.Socket.bind","domain": "N/A","event":"setup","status":true}'
      );
    } catch (err) {
      send(
        '{"type": "java.net.Socket.bind","domain": "N/A","event":"setup","status":false}'
      );
    }

    //6-------Location methods
    let TelephonyManager = Java.use("android.telephony.TelephonyManager");
    try {
      TelephonyManager.getCellLocation.implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.telephony.TelephonyManager.getCellLocation","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.getCellLocation();
      };

      send(
        '{"type": "android.telephony.TelephonyManager.getCellLocation","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.telephony.TelephonyManager.getCellLocation","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }
    let LocationManager = Java.use("android.location.LocationManager");
    try {
      LocationManager.getCurrentLocation.overload(
        "java.lang.String",
        "android.location.LocationRequest",
        "android.os.CancellationSignal",
        "java.util.concurrent.Executor",
        "java.util.function.Consumer"
      ).implementation = function (
        provider,
        locationRequest,
        cancellationSignal,
        executor,
        consumer
      ) {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.location.LocationManager.getCurrentLocation","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.getCurrentLocation(
          provider,
          locationRequest,
          cancellationSignal,
          executor,
          consumer
        );
      };
      send(
        '{"type": "android.location.LocationManager.getCurrentLocation","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.location.LocationManager.getCurrentLocation","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      LocationManager.getCurrentLocation.overload(
        "java.lang.String",
        "android.os.CancellationSignal",
        "java.util.concurrent.Executor",
        "java.util.function.Consumer"
      ).implementation = function (
        provider,
        cancellationSignal,
        executor,
        consumer
      ) {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.location.LocationManager.getCurrentLocation","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.getCurrentLocation(
          provider,
          cancellationSignal,
          executor,
          consumer
        );
      };
      send(
        '{"type": "android.location.LocationManager.getCurrentLocation","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.location.LocationManager.getCurrentLocation","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }

    let Location = Java.use("android.location.Location");
    try {
      Location.getLatitude.implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName() + "." + trace.getMethodName());
        }
        send(
          '{"type": "android.location.Location.getLatitude","trace:"' +
            traceClasses +
            '","processID": "' +
            Process.id +
            '", "latitude": "' +
            this.getLatitude() +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.getLatitude();
      };
      send(
        '{"type": "android.location.Location.getLatitude","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.location.Location.getLatitude","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      Location.getLongitude.implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.location.Location.getLongitude","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.getLongitude();
      };
      send(
        '{"type": "android.location.Location.getLongitude","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.location.Location.getLongitude","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }

    //7 -------- IMEI methods
    try {
      TelephonyManager.getDeviceId.overload().implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.telephony.TelephonyManager.getDeviceId","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.getDeviceId();
      };
      send(
        '{"type": "android.telephony.TelephonyManager.getDeviceId","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.telephony.TelephonyManager.getDeviceId","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }

    // 8. IMSI methods
    try {
      TelephonyManager.getSimSerialNumber.overload().implementation =
        function () {
          let traces = Thread.currentThread().getStackTrace();
          let traceClasses = [];
          for (let trace of traces) {
            traceClasses.push(trace.getClassName());
          }
          send(
            '{"type": "android.telephony.TelephonyManager.getSimSerialNumber","trace:"' +
              traceClasses +
              '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
          );
          return this.getSimSerialNumber();
        };
      send(
        '{"type": "android.telephony.TelephonyManager.getSimSerialNumber","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.telephony.TelephonyManager.getSimSerialNumber","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }

    // 9. MEID methods
    try {
      TelephonyManager.getMeid.overload().implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.telephony.TelephonyManager.getMeid","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.getMeid();
      };
      send(
        '{"type": "android.telephony.TelephonyManager.getMeid","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.telephony.TelephonyManager.getMeid","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }
    // 10. SMS methods
    let SmsManager = Java.use("android.telephony.SmsManager");
    try {
      SmsManager.sendTextMessage.overload(
        "java.lang.String",
        "java.lang.String",
        "java.lang.String",
        "android.app.PendingIntent",
        "android.app.PendingIntent"
      ).implementation = function (
        destinationAddress,
        scAddress,
        text,
        sentIntent,
        deliveryIntent
      ) {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.telephony.SmsManager.sendTextMessage","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.sendTextMessage(
          destinationAddress,
          scAddress,
          text,
          sentIntent,
          deliveryIntent
        );
      };
      send(
        '{"type": "android.telephony.SmsManager.sendTextMessage","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.telephony.SmsManager.sendTextMessage","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      SmsManager.sendTextMessage.overload(
        "java.lang.String",
        "java.lang.String",
        "java.lang.String",
        "android.app.PendingIntent",
        "android.app.PendingIntent",
        "long"
      ).implementation = function (
        destinationAddress,
        scAddress,
        text,
        sentIntent,
        deliveryIntent,
        messageId
      ) {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.telephony.SmsManager.sendTextMessage","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.sendTextMessage(
          destinationAddress,
          scAddress,
          text,
          sentIntent,
          deliveryIntent,
          messageId
        );
      };
    } catch {}

    // 11. Account methods
    let AccountManager = Java.use("android.accounts.AccountManager");
    try {
      AccountManager.getAccounts.overload().implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.accounts.AccountManager.getAccounts","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.getAccounts();
      };
      send(
        '{"type": "android.accounts.AccountManager.getAccounts","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.accounts.AccountManager.getAccounts","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }
    // 12. MIC methods
    let MediaRecorder = Java.use("android.media.MediaRecorder");
    try {
      MediaRecorder.getAudioSource.overload().implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.media.MediaRecorder.getAudioSource","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.getAudioSources();
      };
      send(
        '{"type": "android.media.MediaRecorder.getAudioSource","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.media.MediaRecorder.getAudioSource","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }
    // 13. Contacts methods
    let ContactsContract = Java.use("android.provider.ContactsContract");

    //14. Camera methods
    let Camera = Java.use("android.hardware.Camera");
    try {
      Camera.open().implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.hardware.Camera.open","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.open();
      };
      send(
        '{"type": "android.hardware.Camera.open","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.hardware.Camera.open","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }

    //15. Sensors methods
    let SensorManager = Java.use("android.hardware.SensorManager");
    try {
      SensorManager.getDefaultSensor.overload("int").implementation = function (
        type
      ) {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "android.hardware.SensorManager.getDefaultSensor","trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.getDefaultSensor(type);
      };

      send(
        '{"type": "android.hardware.SensorManager.getDefaultSensor","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "android.hardware.SensorManager.getDefaultSensor","trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }
    //16.Internet methods
    let URL = Java.use("java.net.URL");

    try {
      URL.openConnection.overload("java.net.Proxy").implementation = function (
        proxy
      ) {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "javax.net.url.openConnection,"trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.openConnection(proxy);
      };
      send(
        '{"type": "javax.net.url.openConnection,"trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "javax.net.url.openConnection,"trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }

    try {
      URL.openConnection.overload().implementation = function () {
        let traces = Thread.currentThread().getStackTrace();
        let traceClasses = [];
        for (let trace of traces) {
          traceClasses.push(trace.getClassName());
        }
        send(
          '{"type": "javax.net.url.openConnection,"trace:"' +
            traceClasses +
            '","client": "N/A","domain": "N/A","event":"intercept","status":true}'
        );
        return this.openConnection();
      };
      send(
        '{"type": "javax.net.url.openConnection,"trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":true}'
      );
    } catch {
      send(
        '{"type": "javax.net.url.openConnection,"trace: N/A","client": "N/A","domain": "N/A","event":"setup","status":false}'
      );
    }

    //OutputStream write
  });
}, 0);

/**
 * Get the stack trace of the current thread
 * @returns {Array} Array of class names
 */
