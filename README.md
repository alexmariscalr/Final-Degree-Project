# Final-Degree-Project
Design of a tool for the instrumentation and characterisation of the execution of Android applications.

## Previous requirements
- Android rooted device
- Windows, Mac or Linux OS on PC
- USB wire

## Installing Magisk
1. Download the latest version of Magisk Manager from the [official website](https://github.com/topjohnwu/Magisk/releases)
2. Open Magisk Manager on the Android device and select "Install" on the main page. 
3. Select "install" again on the next screen and wait for the installation to complete.

## Installing adb
1. Download the platform-tools-latest-os.zip from the [official website](https://developer.android.com/studio/releases/platform-tools?hl=es-419)
2. Follow the instructions depending on your OS.

## Setting up the Android device. Installing frida-server
1. Download the latest frida server from the [official website](https://github.com/frida/frida/releases)
2. Uncompress it:
```bash
unxz frida-server.xz
```
3. Run the frida-server on your device:
```bash
$ adb root # might be required
$ adb push frida-server /data/local/tmp/
$ adb shell "chmod 755 /data/local/tmp/frida-server"
$ adb shell "/data/local/tmp/frida-server &"
```
For the last step, make sure you start frida-server as root, i.e. if you are doing this on a rooted device, you might need to su and run it from that shell.

4. To make sure adb can see your device:
```bash
$ adb devices -l
```
This will also ensure that the adb daemon is running on your desktop, which allows Frida to discover and communicate with your device regardless of whether you’ve got it hooked up through USB or WiFi.

## Installing Magisk-Frida module.
This module allows you to use Frida on rooted devices with Magisk. It will launch the frida-server when an app is running and will be listened by the host to hook method calls.

1. Download Magisk-Frida module on your device from the [official website](https://github.com/ViRb3/magisk-frida)
2. Open Magisk Manager on your device and choose "Modules" on the main page.
3. Select "+" and choose the downloaded file.
4. Reboot your device to apply changes.

## Executing Javascript files to hook methods
1. Connect your Android device to your PC using USB.
2. Open terminal and make sure ADB is installed and working properly.
3. Execute this to start a new Frida session on your Android device:
```bash
$ frida -U -l script.js -f com.example.app
```
Replace "com.example.app" with the target app package.
4. Write the JS script and locate it on the folder where you executed the command.
