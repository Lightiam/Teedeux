# Teedeux App Store Submission Guide

## Prerequisites
- Apple Developer Account ($99/year)
- Google Play Developer Account ($25 one-time fee)
- App icons and splash screens in various sizes
- Screenshots of the app on different devices
- App store metadata (descriptions, keywords, etc.)

## Android (Google Play Store) Submission

### Preparing the APK/AAB
1. Run the build script:
   ```
   ./build_android_package.sh
   ```
2. Sign the APK:
   ```
   keytool -genkey -v -keystore teedeux.keystore -alias teedeux -keyalg RSA -keysize 2048 -validity 10000
   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore teedeux.keystore android/app/build/outputs/apk/release/app-release-unsigned.apk teedeux
   zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk android/app/build/outputs/apk/release/teedeux.apk
   ```

### Google Play Console Steps
1. Log in to the Google Play Console
2. Create a new app
3. Fill out the store listing information using the metadata from `app_store_metadata/app_store_listing.md`
4. Upload the signed APK/AAB
5. Set up pricing and distribution
6. Complete the content rating questionnaire
7. Set up app access (if applicable)
8. Submit for review

## iOS (Apple App Store) Submission

### Preparing the IPA
1. Run the build script:
   ```
   ./build_ios_package.sh
   ```
2. Open the iOS project in Xcode:
   ```
   npx cap open ios
   ```
3. Select a development team in the Signing & Capabilities tab
4. Archive the app:
   Product > Archive

### App Store Connect Steps
1. Log in to App Store Connect
2. Create a new app
3. Fill out the store listing information using the metadata from `app_store_metadata/app_store_listing.md`
4. Upload the archived app using Xcode's Organizer
5. Set up pricing and distribution
6. Complete the content rating questionnaire
7. Submit for review

## Important Notes
- The review process can take anywhere from a few hours to several days
- Be prepared to address any issues raised by the review team
- Make sure your app complies with all app store guidelines
- Keep your certificates and signing keys in a safe place
- Consider setting up CI/CD for automated builds and submissions
