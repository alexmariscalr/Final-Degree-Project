import pandas as pd, csv

#lista con third parties
lista = ['co.ogury:ogury-sdk','com.adcolony:sdk','com.adjust.sdk:adjust-android','com.adobe.marketing.mobile:sdk-core','com.adyen.checkout:drop-in','com.aliyun.dpa:oss-android-sdk','com.amplifyframework:aws-api','com.amplitude:android-sdk','com.android.billingclient:billing','com.apollographql.apollo:apollo-runtime +3 more','com.appboy:android-sdk-ui','com.appdynamics:appdynamics-runtime','com.applovin:applovin-sdk','com.appnext.sdk:ads +2 more','com.appodeal.ads:sdk','com.appsflyer:af-android-sdk','com.apptentive:apptentive-android','com.apptimize:apptimize-android','com.batch.android:batch-sdk','com.braintreepayments.api:card','com.brightcove.player:android-sdk','com.bugsnag:bugsnag-android','com.chartboost:chartboost-sdk','com.clevertap.android:clevertap-android-sdk','com.comscore:android-analytics','com.criteo.publisher:criteo-publisher-sdk','com.datadoghq:dd-sdk-android','com.dropbox.core:dropbox-core-sdk','com.facebook.android:audience-network-sdk','com.facebook.android:facebook-android-sdk','com.facebook.android:facebook-login','com.facebook.android:facebook-places','com.facebook.android:facebook-share','com.flurry.android:analytics','com.fyber:fairbid-sdk','com.fyber:marketplace-sdk','com.fyber:offerwall-sdk','com.github.freshdesk:freshchat-android','com.github.freshworks:freshchat-android','com.google.ads.interactivemedia.v3:interactivemedia','com.google.android.gms:play-services-ads +1 more','com.google.android.gms:play-services-auth','com.google.android.gms:play-services-location','com.google.android.gms:play-services-maps','com.google.android.gms:play-services-wallet','com.google.firebase:firebase-analytics','com.google.firebase:firebase-auth','com.google.firebase:firebase-config','com.google.firebase:firebase-crashlytics +1 more','com.google.firebase:firebase-database','com.google.firebase:firebase-dynamic-links','com.google.firebase:firebase-firestore','com.google.firebase:firebase-inappmessaging +1 more','com.google.firebase:firebase-messaging','com.google.firebase:firebase-perf','com.google.firebase:firebase-storage','com.helpshift:android-helpshift-aar','com.hyprmx.android:HyprMX-SDK','com.inmobi.monetization:inmobi-ads','com.instabug.library:instabug','com.ironsource.sdk:mediationsdk','com.ironsource:adqualitysdk','com.kakao.adfit:ads-base','com.kakao.sdk:v2-link','com.kakao.sdk:v2-navi','com.kakao.sdk:v2-story','com.kakao.sdk:v2-talk','com.kakao.sdk:v2-user','com.kidoz.sdk:KidozSDK','com.kochava.base:tracker','com.kochava.tracker:tracker','com.leanplum:leanplum-fcm','com.linecorp.linesdk:linesdk','com.maio:android-sdk','com.mbridge.msdk.oversea:mbbanner +2 more','com.mercadopago.android.px:checkout','com.microsoft.appcenter:appcenter-analytics +1 more','com.mixpanel.android:mixpanel-android','com.moengage:moe-android-sdk','com.mopub:mopub-sdk +3 more','com.mparticle:android-core','com.my.target:mytarget-sdk','com.my.tracker:mytracker-sdk','com.naver.maps:map-sdk','com.naver.nid:naveridlogin-android-sdk','com.newrelic.agent.android:android-agent','com.onesignal:OneSignal','com.onfido.sdk.capture:onfido-capture-sdk +1 more','com.optimizely.ab:android-sdk','com.pangle.global:ads-sdk','com.paypal.android.sdk:paypal-one-touch','com.paytm.appinvokesdk:appinvokesdk','com.paytm.easypay:easypay','com.payumoney.sdkui:plug-n-play','com.pollfish:pollfish-googleplay','com.pubmatic.sdk:openwrap','com.qiniu:qiniu-android-sdk','com.qualtrics:digital','com.razorpay:checkout','com.revenuecat.purchases:purchases','com.salesforce.marketingcloud:marketingcloudsdk','com.salesforce.service:case-ui +1 more','com.salesforce.service:chat-ui +1 more','com.segment.analytics.android:analytics','com.sendbird.sdk:sendbird-android-sdk','com.sendbird.sdk:uikit','com.singular.sdk:singular_sdk','com.smaato.android.sdk:smaato-sdk +3 more','com.smartadserver.android:smart-display-sdk','com.snap.adkit:adkit','com.snapchat.kit.sdk:creative','com.snowplowanalytics:snowplow-android-tracker','com.startapp:inapp-sdk','com.stripe:stripe-android','com.taboola:android-sdk','com.tapjoy:tapjoy-android-sdk','com.tappx.sdk.android:tappx-sdk','com.tapr:tapresearch','com.tealium:library','com.tencent.bugly:crashreport','com.tencent.mm.opensdk:wechat-sdk-android-without-mta','com.truecaller.android.sdk:truecaller-sdk','com.umeng.umsdk:asms','com.unity3d.ads:unity-ads','com.urbanairship.android:urbanairship-fcm +5 more','com.usabilla.sdk:ubform','com.useinsider:insider','com.uxcam:uxcam','com.verizon.ads:android-vas-standard-edition','com.vk:android-sdk-core +1 more','com.vungle:publisher-sdk-android','com.webengage:android-sdk','com.yandex.android:maps.mobile','com.yandex.android:mobileads','com.yandex.android:mobmetricalib','com.zendesk:chat','com.zendesk:messaging','com.zendesk:support','in.juspay:hypersdk','io.agora.rtc:full-sdk','io.bidmachine:ads','io.branch.sdk.android:library','io.intercom.android:intercom-sdk','io.objectbox:objectbox-android','io.realm:realm-android-library','io.sentry:sentry-android','net.kidoz.sdk:kidoz-android-native','net.nend.android:nend-sdk','net.pubnative:hybid.sdk','net.zetetic:android-database-sqlcipher','phonepe.intentsdk.android.release:IntentSDK','ru.ok:odnoklassniki-android-sdk','tv.superawesome.sdk.publisher:superawesome']
lista = [x.split(':')[0] for x in lista]
lista2 = list(set(lista))

#leer el csv
result = {}

with open("results_frida_intercepted_idle.csv", 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=";")
        next(reader)
        for row in reader:
                apk = row[0]
                matches = (row[2]).replace("[",'').replace("]",'')
                if len(matches) != 0:
                    matches_list = matches.split(",")
                    matches_list = [x.strip("'").replace("'",'').replace(" ",'') for x in matches_list]
                    for element in matches_list:
                        if apk in result:
                            if element not in result[apk]:
                                result[apk].append(element)
                        else:
                            result[apk] = [element] 
                    


with open("different_third_parties.csv", "w", newline="", encoding='utf-8') as f:
    writer = csv.writer(f,delimiter=";")
    writer.writerow(["APK", "matches_list", "total"])
    for apk,thirdParties in result.items():
        writer.writerow([apk, str(thirdParties), len(thirdParties)])

                       


