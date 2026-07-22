#!/bin/bash
# Script to build the Teedeux Android APK package

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Check if Android SDK is installed
if [ -z "$ANDROID_SDK_ROOT" ]; then
  echo "Android SDK not found. Please install Android Studio or set ANDROID_SDK_ROOT."
  echo "For this environment, we'll use a default path."
  export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
fi

# Update the local.properties file with the correct SDK path
echo "sdk.dir=$ANDROID_SDK_ROOT" > android/local.properties

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
  echo "APK file location: $(pwd)/app/build/outputs/apk/release/app-release-unsigned.apk"
  
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
  echo ""
  echo "4. Verify the APK:"
  echo "   apksigner verify app/build/outputs/apk/release/teedeux.apk"
  
  # Create a QR code for easy installation (if qrencode is available)
  if command -v qrencode &> /dev/null; then
    echo ""
    echo "Creating QR code for easy installation..."
    APK_PATH="$(pwd)/app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_PATH" ]; then
      qrencode -o teedeux_install_qr.png "https://example.com/download/teedeux.apk"
      echo "QR code created: teedeux_install_qr.png"
      echo "Note: Replace the URL with the actual download URL when available."
    else
      echo "APK not found at expected location. QR code not created."
    fi
  fi
else
  echo "Build failed. Please check the error messages above."
fi
