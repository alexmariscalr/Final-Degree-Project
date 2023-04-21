# Create new class


import os
import re
from urllib import request


class ThirdParty:
    def __init__(self, sdk, provider, maven_id):
        self.sdk = sdk
        self.provider = provider
        self.maven_id = maven_id

    def getSdk(self):
        return self.sdk

    def getProvider(self):
        return self.provider

    def getMavenId(self):
        return self.maven_id


class Method:
    def __init__(self, tipo, clase, metodo):
        self.tipo = tipo
        self.clase = clase
        self.metodo = metodo
    # Obtener tipo a partir del metodo

    def getTipo(self):
        return self.tipo
    # Obtener clase a partir del metodo

    def getClase(self):
        return self.clase
    # Obtener metodo

    def getMetodo(self):
        return self.metodo

# Crear clase connection


class Connection:

    def __init__(self, app, metodo, ipCliente, puertoCliente, ipServidor, puertoServidor, thirdParties, appCallDetected, appCalledFirst):
        self.app = app,
        self.metodo = metodo
        self.ipCliente = ipCliente
        self.puertoCliente = puertoCliente
        self.ipServidor = ipServidor
        self.puertoServidor = puertoServidor
        self.thirdParties = thirdParties
        self.appCallDetected = appCallDetected
        self.appCalledFirst = appCalledFirst
    # Getters

    def getClase(self):
        return self.clase

    def getMetodo(self):
        return self.metodo

    def getTipo(self):
        return self.tipo

    def getIpCliente(self):
        return self.ipCliente

    def getPuertoCliente(self):
        return self.puertoCliente

    def getIpServidor(self):
        return self.ipServidor

    def getPuertoServidor(self):
        return self.puertoServidor

    def getThirdParties(self):
        return self.thirdParties

    def getAppCallDetected(self):
        return self.appCallDetected

    def getAppCalledFirst(self):
        return self.appCalledFirst


# Crear lista de metodos
methods = [
    Method("Conexión", "java.nio.channels.SocketChannel", "open"),
    Method("Conexión", "java.net.Socket", "connect"),
    Method("Conexión", "java.net.Socket", "getOutputStream"),
    Method("Conexión", "java.net.Socket", "bind"),
    Method("Conexión", "javax.net.ssl.SSLContext", "getInstance"),
    Method("Conexión", "javax.net.url", "openConnection"),
    Method("Location", "android.telephony.TelephonyManager", "getCellLocation"),
    Method("Location", "android.location.LocationManager", "getCurrentLocation"),
    Method("Location", "android.location.Location", "getLatitude"),
    Method("Location", "android.location.Location", "getLongitude"),
    Method("IMEI", "android.telephony.TelephonyManager", "getDeviceId"),
    Method("IMSI", "android.telephony.TelephonyManager", "getSimSerialNumber"),
    Method("MEID", "android.telephony.TelephonyManager", "getMeid"),
    Method("SMS", "android.telephony.SmsManager", "sendTextMessage"),
    Method("Account", "android.accounts.AccountManager", "getAccounts"),
    Method("MIC", "android.media.MediaRecorder", "getAudioSource"),
    Method("Camera", "android.hardware.Camera", "open"),
    Method("Sensors", "android.hardware.SensorManager", "getDefaultSensor"),

]

# Crear lista de thirdParties
thirdParties = [ThirdParty('Ogury SDK','Ogury SDK','co.ogury:ogury-sdk'),ThirdParty('AdColony SDK','AdColony SDK','com.adcolony:sdk'),ThirdParty('Adjust SDK','Adjust','com.adjust.sdk:adjust-android'),ThirdParty('Core - Experience Platform SDK','Adobe','com.adobe.marketing.mobile:sdk-core'),ThirdParty('Core - Experience Platform SDK','Adobe','com.adobe.marketing.mobile:sdk-core'),ThirdParty('Core - Experience Platform SDK','Adobe','com.adobe.marketing.mobile:sdk-core'),ThirdParty('Adyen Drop-in','Adyen','com.adyen.checkout:drop-in'),ThirdParty('aliyun-oss-sdk-android','aliyun.com','com.aliyun.dpa:oss-android-sdk'),ThirdParty('Amplify Framework for Android - API','amplifyframework.com','com.amplifyframework:aws-api'),ThirdParty('Amplitude Android SDK','Amplitude','com.amplitude:android-sdk'),ThirdParty('Amplitude Android SDK','Amplitude','com.amplitude:android-sdk'),ThirdParty('Google Play Billing','Google','com.android.billingclient:billing'),ThirdParty('Apollo GraphQL Runtime Version 2','ApolloGraphQL','com.apollographql.apollo:apollo-runtime +3 more'),ThirdParty('Braze Android SDK','Braze','com.appboy:android-sdk-ui'),ThirdParty('AppDynamics Instrumentation Android Runtime','AppDynamics Inc.','com.appdynamics:appdynamics-runtime'),ThirdParty('AppLovin SDK','AppLovin SDK','com.applovin:applovin-sdk'),ThirdParty('Appnext Full Screen SDK','Appnext Full Screen SDK','com.appnext.sdk:ads +2 more'),ThirdParty('Appodeal SDK for Android','Appodeal SDK for Android','com.appodeal.ads:sdk'),ThirdParty('Appodeal SDK for Android','Appodeal Stack','com.appodeal.ads:sdk'),ThirdParty('Appodeal SDK for Android','Appodeal Stack','com.appodeal.ads:sdk'),ThirdParty('AppsFlyer SDK','AppsFlyer','com.appsflyer:af-android-sdk'),ThirdParty('AppsFlyer SDK','AppsFlyer','com.appsflyer:af-android-sdk'),ThirdParty('Apptentive','Apptentive','com.apptentive:apptentive-android'),ThirdParty('Apptimize SDK','Airship Group, Inc.','com.apptimize:apptimize-android'),ThirdParty('Batch','Batch','com.batch.android:batch-sdk'),ThirdParty('Batch','Batch','com.batch.android:batch-sdk'),ThirdParty('Braintree Card','Braintree','com.braintreepayments.api:card'),ThirdParty('com.brightcove.player:android-sdk','com.brightcove.player:android-sdk','com.brightcove.player:android-sdk'),ThirdParty('bugsnag-android','Bugsnag','com.bugsnag:bugsnag-android'),ThirdParty('Chartboost SDK','Chartboost SDK','com.chartboost:chartboost-sdk'),ThirdParty('CleverTap Android SDK','CleverTap','com.clevertap.android:clevertap-android-sdk'),ThirdParty('CleverTap Android SDK','CleverTap','com.clevertap.android:clevertap-android-sdk'),ThirdParty('Comscore Audience Measurement','Comscore','com.comscore:android-analytics'),ThirdParty('Criteo Publisher SDK','Criteo Publisher SDK','com.criteo.publisher:criteo-publisher-sdk'),ThirdParty('Datadog SDK for Android','Datadog','com.datadoghq:dd-sdk-android'),ThirdParty('Dropbox SDK Java','Dropbox, Inc.','com.dropbox.core:dropbox-core-sdk'),ThirdParty('Audience-Network-SDK','Audience-Network-SDK','com.facebook.android:audience-network-sdk'),ThirdParty('Facebook Android SDK','Facebook Android SDK','com.facebook.android:facebook-android-sdk'),ThirdParty('Facebook Android SDK','Facebook','com.facebook.android:facebook-android-sdk'),ThirdParty('Facebook Android SDK','Facebook','com.facebook.android:facebook-android-sdk'),ThirdParty('Facebook Android SDK - Login','Facebook','com.facebook.android:facebook-login'),ThirdParty('com.facebook.android:facebook-places','Facebook','com.facebook.android:facebook-places'),ThirdParty('Facebook Android SDK - Share','Facebook','com.facebook.android:facebook-share'),ThirdParty('Flurry Analytics Android SDK','Yahoo','com.flurry.android:analytics'),ThirdParty('Fyber FairBid SDK','Fyber FairBid SDK','com.fyber:fairbid-sdk'),ThirdParty('Fyber Marketplace SDK','Fyber Marketplace SDK','com.fyber:marketplace-sdk'),ThirdParty('Fyber Offer Wall SDK','Fyber Offer Wall SDK','com.fyber:offerwall-sdk'),ThirdParty('freshworks/freshchat-android','Freshworks Inc','com.github.freshdesk:freshchat-android'),ThirdParty('Freshchat (Now Freshdesk Messaging)','Freshworks Inc','com.github.freshworks:freshchat-android'),ThirdParty('Interactive Media Ads (IMA) SDK','Interactive Media Ads (IMA) SDK','com.google.ads.interactivemedia.v3:interactivemedia'),ThirdParty('Google Mobile Ads (GMA) SDK','Google Mobile Ads (GMA) SDK','com.google.android.gms:play-services-ads +1 more'),ThirdParty('Google Identity Services (GIS)','Google LLC','com.google.android.gms:play-services-auth'),ThirdParty('play-services-location','Google LLC','com.google.android.gms:play-services-location'),ThirdParty('Maps SDK for Android','Google LLC','com.google.android.gms:play-services-maps'),ThirdParty('Google Pay API','Google LLC','com.google.android.gms:play-services-wallet'),ThirdParty('Google Analytics','Google LLC','com.google.firebase:firebase-analytics'),ThirdParty('Firebase Authentication','Google LLC','com.google.firebase:firebase-auth'),ThirdParty('Firebase Remote Config','Google LLC','com.google.firebase:firebase-config'),ThirdParty('Firebase Remote Config','Google LLC','com.google.firebase:firebase-config'),ThirdParty('Firebase Crashlytics','Google LLC','com.google.firebase:firebase-crashlytics +1 more'),ThirdParty('Firebase Realtime Database','Google LLC','com.google.firebase:firebase-database'),ThirdParty('Firebase Dynamic Links','Google LLC','com.google.firebase:firebase-dynamic-links'),ThirdParty('Cloud Firestore','Google LLC','com.google.firebase:firebase-firestore'),ThirdParty('Firebase In-App Messaging','Google LLC','com.google.firebase:firebase-inappmessaging +1 more'),ThirdParty('Firebase Cloud Messaging','Google LLC','com.google.firebase:firebase-messaging'),ThirdParty('Firebase Performance Monitoring','Google LLC','com.google.firebase:firebase-perf'),ThirdParty('Cloud Storage','Google LLC','com.google.firebase:firebase-storage'),ThirdParty('Helpshift Native Android SDK','Helpshift Technologies Private Limited','com.helpshift:android-helpshift-aar'),ThirdParty('HyprMX','HyprMX','com.hyprmx.android:HyprMX-SDK'),ThirdParty('InMobi Mobile Ads','InMobi Mobile Ads','com.inmobi.monetization:inmobi-ads'),ThirdParty('Instabug','Instabug','com.instabug.library:instabug'),ThirdParty('ironSource','ironSource','com.ironsource.sdk:mediationsdk'),ThirdParty('ironSource AdQuality','ironSource AdQuality','com.ironsource:adqualitysdk'),ThirdParty('ironSource AdQuality','ironSource Mobile','com.ironsource:adqualitysdk'),ThirdParty('ironSource AdQuality','ironSource Mobile','com.ironsource:adqualitysdk'),ThirdParty('ironSource AdQuality','ironSource Mobile','com.ironsource:adqualitysdk'),ThirdParty('AdFit Android SDK','AdFit Android SDK','com.kakao.adfit:ads-base'),ThirdParty('Kakao SDK v2 - Link','Kakao Corp.','com.kakao.sdk:v2-link'),ThirdParty('Kakao SDK v2 - Navi','Kakao Corp.','com.kakao.sdk:v2-navi'),ThirdParty('Kakao SDK v2 - Story','Kakao Corp.','com.kakao.sdk:v2-story'),ThirdParty('Kakao SDK v2 - Talk','Kakao Corp.','com.kakao.sdk:v2-talk'),ThirdParty('Kakao SDK v2 - User','Kakao Corp.','com.kakao.sdk:v2-user'),ThirdParty('Kidoz SDK (Legacy Version)','Kidoz SDK (Legacy Version)','com.kidoz.sdk:KidozSDK'),ThirdParty('Kochava V3','Kochava','com.kochava.base:tracker'),ThirdParty('Kochava V3','Kochava','com.kochava.base:tracker'),ThirdParty('Kochava V4','Kochava','com.kochava.tracker:tracker'),ThirdParty('Leanplum SDK FCM Module','Leanplum','com.leanplum:leanplum-fcm'),ThirdParty('Leanplum SDK FCM Module','Leanplum','com.leanplum:leanplum-fcm'),ThirdParty('linesdk','LINE Corporation','com.linecorp.linesdk:linesdk'),ThirdParty('com.maio:android-sdk','com.maio:android-sdk','com.maio:android-sdk'),ThirdParty('Mintegral','Mintegral','com.mbridge.msdk.oversea:mbbanner +2 more'),ThirdParty('com.mercadopago.android.px.checkout','mercadopago.com','com.mercadopago.android.px:checkout'),ThirdParty('Visual Studio App Center Analytics SDK','Microsoft','com.microsoft.appcenter:appcenter-analytics +1 more'),ThirdParty('Official Mixpanel Android SDK','Mixpanel','com.mixpanel.android:mixpanel-android'),ThirdParty('MoEngage Android SDK','MoEngage Inc','com.moengage:moe-android-sdk'),ThirdParty('MoEngage Android SDK','MoEngage Inc','com.moengage:moe-android-sdk'),ThirdParty('MoPub Android SDK','MoPub Android SDK','com.mopub:mopub-sdk +3 more'),ThirdParty('mParticle Android SDK','mParticle Inc','com.mparticle:android-core'),ThirdParty('mParticle Android SDK','mParticle Inc','com.mparticle:android-core'),ThirdParty('mParticle Android SDK','mParticle Inc','com.mparticle:android-core'),ThirdParty('myTarget SDK','myTarget SDK','com.my.target:mytarget-sdk'),ThirdParty('myTracker SDK','myTracker','com.my.tracker:mytracker-sdk'),ThirdParty('NAVER Map SDK','주식회사 네이버','com.naver.maps:map-sdk'),ThirdParty('네아로 SDK','주식회사 네이버','com.naver.nid:naveridlogin-android-sdk'),ThirdParty('New Relic Mobile for Android','New Relic','com.newrelic.agent.android:android-agent'),ThirdParty('OneSignal','OneSignal','com.onesignal:OneSignal'),ThirdParty('OneSignal','OneSignal','com.onesignal:OneSignal'),ThirdParty('OneSignal','OneSignal','com.onesignal:OneSignal'),ThirdParty('Onfido Smart Capture SDK','Onfido','com.onfido.sdk.capture:onfido-capture-sdk +1 more'),ThirdParty('Optimizely Android SDK','Optimizely','com.optimizely.ab:android-sdk'),ThirdParty('Pangle Ad SDK','Pangle Ad SDK','com.pangle.global:ads-sdk'),ThirdParty('PayPal One Touch','Braintree','com.paypal.android.sdk:paypal-one-touch'),ThirdParty('Paytm All-in-One Payments SDK','Paytm','com.paytm.appinvokesdk:appinvokesdk'),ThirdParty('com.paytm.easypay:easypay','paytm.com','com.paytm.easypay:easypay'),ThirdParty('com.payumoney.sdkui:plug-n-play','payumoney.com','com.payumoney.sdkui:plug-n-play'),ThirdParty('Pollfish','Pollfish','com.pollfish:pollfish-googleplay'),ThirdParty('PubMatic OpenWrap SDK','PubMatic OpenWrap SDK','com.pubmatic.sdk:openwrap'),ThirdParty('七牛云 SDK','上海七牛信息技术有限公司','com.qiniu:qiniu-android-sdk'),ThirdParty('Qualtrics Website/App Feedback Android SDK','Qualtrics','com.qualtrics:digital'),ThirdParty('Razorpay Standard Checkout','Razorpay Software Pvt Ltd','com.razorpay:checkout'),ThirdParty('RevenueCat','RevenueCat','com.revenuecat.purchases:purchases'),ThirdParty('com.salesforce.marketingcloud:marketingcloudsdk','salesforce.com','com.salesforce.marketingcloud:marketingcloudsdk'),ThirdParty('com.salesforce.service:case-ui','salesforce.com','com.salesforce.service:case-ui +1 more'),ThirdParty('com.salesforce.service:chat-ui','salesforce.com','com.salesforce.service:chat-ui +1 more'),ThirdParty('Segment Analytics Android','Twilio-Segment','com.segment.analytics.android:analytics'),ThirdParty('Segment Analytics Android','Twilio-Segment','com.segment.analytics.android:analytics'),ThirdParty('Sendbird Chat SDK','Sendbird','com.sendbird.sdk:sendbird-android-sdk'),ThirdParty('Sendbird Chat SDK','Sendbird','com.sendbird.sdk:sendbird-android-sdk'),ThirdParty('Sendbird UIKit','Sendbird','com.sendbird.sdk:uikit'),ThirdParty('Sendbird UIKit','Sendbird','com.sendbird.sdk:uikit'),ThirdParty('Singular SDK','Singular','com.singular.sdk:singular_sdk'),ThirdParty('Singular SDK','Singular','com.singular.sdk:singular_sdk'),ThirdParty('Smaato NextGen SDK','Smaato NextGen SDK','com.smaato.android.sdk:smaato-sdk +3 more'),ThirdParty('Smart Display SDK','Smart Display SDK','com.smartadserver.android:smart-display-sdk'),ThirdParty('Ad Kit','Ad Kit','com.snap.adkit:adkit'),ThirdParty('Creative Kit','Snap Inc','com.snapchat.kit.sdk:creative'),ThirdParty('Creative Kit','Snap Inc','com.snapchat.kit.sdk:creative'),ThirdParty('Snowplow Android Tracker','Snowplow','com.snowplowanalytics:snowplow-android-tracker'),ThirdParty('Snowplow Android Tracker','Snowplow','com.snowplowanalytics:snowplow-android-tracker'),ThirdParty('Start.io (Formerly StartApp)','Start.io (Formerly StartApp)','com.startapp:inapp-sdk'),ThirdParty('Stripe Android SDK','Stripe','com.stripe:stripe-android'),ThirdParty('Taboola SDK','Taboola SDK','com.taboola:android-sdk'),ThirdParty('Tapjoy Android SDK','Tapjoy Android SDK','com.tapjoy:tapjoy-android-sdk'),ThirdParty('Tapjoy Android SDK','Tapjoy','com.tapjoy:tapjoy-android-sdk'),ThirdParty('Tapjoy Android SDK','Tapjoy','com.tapjoy:tapjoy-android-sdk'),ThirdParty('Tapjoy Android SDK','Tapjoy','com.tapjoy:tapjoy-android-sdk'),ThirdParty(': Tappx Android SDK',': Tappx Android SDK','com.tappx.sdk.android:tappx-sdk'),ThirdParty('TapResearch','Philip Canniff','com.tapr:tapresearch'),ThirdParty('Tealium Android Java SDK','Tealium Inc.','com.tealium:library'),ThirdParty('Tealium Android Java SDK','Tealium Inc.','com.tealium:library'),ThirdParty('Tealium Android Java SDK','Tealium Inc.','com.tealium:library'),ThirdParty('Tealium Android Java SDK','Tealium Inc.','com.tealium:library'),ThirdParty('Crash report Library for Android','Tencent Bugly','com.tencent.bugly:crashreport'),ThirdParty('Wechat SDK for Android','Tencent Wechat, Inc.','com.tencent.mm.opensdk:wechat-sdk-android-without-mta'),ThirdParty('Truecaller SDK','Truecaller for Developers','com.truecaller.android.sdk:truecaller-sdk'),ThirdParty('asms','umsdk','com.umeng.umsdk:asms'),ThirdParty('Unity Ads','Unity Ads','com.unity3d.ads:unity-ads'),ThirdParty('Airship SDK','Airship Group, Inc.','com.urbanairship.android:urbanairship-fcm +5 more'),ThirdParty('Usabilla SDK','Usabilla','com.usabilla.sdk:ubform'),ThirdParty('Insider','Insider','com.useinsider:insider'),ThirdParty('Insider','Insider','com.useinsider:insider'),ThirdParty('UXCam','UXCam','com.uxcam:uxcam'),ThirdParty('UXCam','UXCam','com.uxcam:uxcam'),ThirdParty('Verizon Media Ads SDK','Verizon Media Ads SDK','com.verizon.ads:android-vas-standard-edition'),ThirdParty('VK API library','vk.com','com.vk:android-sdk-core +1 more'),ThirdParty('Vungle Android Monetization SDK','Vungle Android Monetization SDK','com.vungle:publisher-sdk-android'),ThirdParty('WebEngage Android SDK','WebEngage','com.webengage:android-sdk'),ThirdParty('WebEngage Android SDK','WebEngage','com.webengage:android-sdk'),ThirdParty('Yandex MapsMobile','Yandex','com.yandex.android:maps.mobile'),ThirdParty('Yandex Mobile Ads','Yandex Mobile Ads','com.yandex.android:mobileads'),ThirdParty('AppMetrica SDK','Yandex','com.yandex.android:mobmetricalib'),ThirdParty('Zendesk Classic Chat SDK V2','Zendesk','com.zendesk:chat'),ThirdParty('Zendesk Classic Unified SDK','Zendesk','com.zendesk:messaging'),ThirdParty('Zendesk Classic Support SDK','Zendesk','com.zendesk:support'),ThirdParty('HyperSDK','Juspay Technologies PVT LTD','in.juspay:hypersdk'),ThirdParty('full-sdk','agorabuilder','io.agora.rtc:full-sdk'),ThirdParty('BidMachine SDK for Android','BidMachine SDK for Android','io.bidmachine:ads'),ThirdParty('Branch','Branch Metrics','io.branch.sdk.android:library'),ThirdParty('Branch','Branch Metrics','io.branch.sdk.android:library'),ThirdParty('Intercom','Intercom','io.intercom.android:intercom-sdk'),ThirdParty('Intercom','Intercom','io.intercom.android:intercom-sdk'),ThirdParty('Android Database','ObjectBox','io.objectbox:objectbox-android'),ThirdParty('Realm Java','MongoDB Realm','io.realm:realm-android-library'),ThirdParty('Sentry Android','Sentry','io.sentry:sentry-android'),ThirdParty('Kidoz SDK COPPA Compliant Monetization','Kidoz SDK COPPA Compliant Monetization','net.kidoz.sdk:kidoz-android-native'),ThirdParty('net.nend.android:nend-sdk','net.nend.android:nend-sdk','net.nend.android:nend-sdk'),ThirdParty('Verve Group HyBid SDK (formerly PubNative)','Verve Group HyBid SDK (formerly PubNative)','net.pubnative:hybid.sdk'),ThirdParty('SQLCipher for Android','Zetetic, LLC','net.zetetic:android-database-sqlcipher'),ThirdParty('PhonePe IntentSDK','PhonePe','phonepe.intentsdk.android.release:IntentSDK'),ThirdParty('Odnoklassniki Android SDK','Ozhiganov Valery','ru.ok:odnoklassniki-android-sdk'),ThirdParty('AwesomeAds SDK','AwesomeAds SDK','tv.superawesome.sdk.publisher:superawesome')
]

# Abrir cada archivo .txt de la carpeta "Experimento 2/frida_files"
for filename in os.listdir("frida_files"):
    connections = []
    if filename.endswith('.txt'):
        app_path = 'firda_files/' + filename
        app = filename.replace("_", ".")
        app = app.replace(".txt", "")
    with open(app_path, 'r', encoding='utf-8') as frida_file:
        content = frida_file.read()
        lines = content.split('\n')
        filtered_rows = []
        for method in methods:
            filtered_rows.append([line for line in lines if (
                (method.getClase) in line and method.getMetodo() in line)])

        for row in filtered_rows:
            connection = Connection(app, "", "", "", "", "", "", "", "")
            metodo = Method("", "", "")
            # Buscamos si alguno de los métodos está en la línea
            for method in methods:
                if method.getClase() in row and method.getMetodo() in row:
                    metodo = Method(method.getTipo(),
                                    method.getClase(), method.getMetodo())
                    connection.metodo = metodo
                    break
            
            #Buscamos si hay algún third party en la línea
            for third_party in thirdParties:
                if third_party.getMavenId().split(":")[0] in row:
                    connection.thirdParties.append(third_party)
            
            # IP y puerto del cliente
            match = re.search(r'client": "(.*?)"', row)
            connection.ipCliente=match.group(1).replace("/", "").split(":")[0] if match else 'No local IP'
            connection.puertoCliente = match.group(1).replace("/", "").split(":")[1] if match else 'No port'

            
