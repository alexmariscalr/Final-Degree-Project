import os

""" #identificar el dispositivo
platformTools = "cd C:/platform-tools/platform-tools/platform-tools"
os.system(platformTools)
os.system("adb shell")
os.system("taskkill /im cmd.exe /f") """

#inicia el script de hook_http_connection.js
app = "com.aws.android"
script = "check_permissions.js"
command = "frida -U -l Javascript\hook_http_connections.js -f" + app
os.system(command)

