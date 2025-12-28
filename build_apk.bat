@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ANDROID_HOME=C:\Users\Zbook\AppData\Local\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd android
call gradlew.bat assembleDebug
