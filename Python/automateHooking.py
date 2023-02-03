import os

#inicia el script de hook_http_connection.js
apps = ["com.aws.android"]
script = "Javascript\traffic_dataAnalysis.js"
for app in apps:
    filename = "hooking_"+app.replace(".","_")+".csv"
    command = "frida -U -l "+ script + " -f" + app
    os.system(command)

