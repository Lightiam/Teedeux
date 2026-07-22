#!/bin/bash
# Script to build the Teedeux Android APK package

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Update the local.properties file with the correct SDK path
# Replace this path with the actual path to your Android SDK
echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties

# Sync the web assets to the Android project
echo "Syncing web assets to Android project..."
npx cap sync android

# Build the release APK
echo "Building release APK..."
cd android
./gradlew assembleRelease

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  echo "APK file location: $(pwd)/app/build/outputs/apk/release/app-release.apk"
  
  # Instructions for signing the APK
  echo ""
  echo "To sign the APK for Google Play Store submission:"
  echo "1. Create a keystore file if you don't have one:"
  echo "   keytool -genkey -v -keystore teedeux.keystore -alias teedeux -keyalg RSA -keysize 2048 -validity 10000"
  echo ""
  echo "2. Sign the APK:"
  echo "   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore teedeux.keystore app/build/outputs/apk/release/app-release-unsigned.apk teedeux"
  echo ""
  echo "3. Optimize the APK:"
  echo "   zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/teedeux.apk"
else
  echo "Build failed. Please check the error messages above."
fi
