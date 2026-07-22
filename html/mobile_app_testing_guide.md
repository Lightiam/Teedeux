# Teedeux Mobile App Testing Guide

## Overview
This guide provides instructions for testing the Teedeux mobile app on Android and iOS devices. The app has been built using Capacitor, which wraps the web application in a native container for mobile platforms.

## Prerequisites
- Android Studio (for Android testing)
- Xcode (for iOS testing)
- Physical Android device or emulator
- Physical iOS device or simulator
- Node.js and npm installed

## Android Testing

### Building the App
1. Run the build script:
   ```
   ./build_android_package.sh
   ```
2. This will create an APK file at `android/app/build/outputs/apk/release/app-release.apk`

### Testing on an Emulator
1. Open Android Studio
2. Select "Open an existing Android Studio project"
3. Navigate to the `android` folder in the Teedeux project
4. Wait for the project to sync
5. Click on the "Run" button (green triangle)
6. Select an emulator from the list or create a new one
7. The app will be installed and launched on the emulator

### Testing on a Physical Device
1. Enable Developer Options and USB Debugging on your Android device
2. Connect your device to your computer via USB
3. Run the following command:
   ```
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```
4. The app will be installed on your device
5. Open the app from your device's app drawer

## iOS Testing

### Building the App
1. Run the build script:
   ```
   ./build_ios_package.sh
   ```
2. This will prepare the iOS project for opening in Xcode

### Testing on a Simulator
1. Open the iOS project in Xcode:
   ```
   npx cap open ios
   ```
2. Select a simulator from the device dropdown
3. Click the "Run" button (play icon)
4. The app will be installed and launched on the simulator

### Testing on a Physical Device
1. Connect your iOS device to your computer
2. Open the iOS project in Xcode:
   ```
   npx cap open ios
   ```
3. Select your device from the device dropdown
4. Click the "Run" button (play icon)
5. You may need to trust the developer certificate on your device
6. The app will be installed and launched on your device

## Testing Checklist

### Functionality Testing
- [ ] App launches successfully
- [ ] Navigation works correctly
- [ ] All buttons and links function as expected
- [ ] Product listings display correctly
- [ ] Search functionality works
- [ ] User registration and login work
- [ ] Shopping cart functionality works
- [ ] Checkout process works
- [ ] User profile and settings can be accessed and modified

### UI/UX Testing
- [ ] All text is properly displayed (no overlapping or cut-off text)
- [ ] Images load correctly
- [ ] Color scheme is consistent (green theme)
- [ ] All Teedeux branding is consistent
- [ ] Responsive design works on different screen sizes
- [ ] Touch interactions work smoothly
- [ ] Scrolling is smooth
- [ ] Forms are easy to fill out on mobile

### Performance Testing
- [ ] App loads quickly
- [ ] Transitions between screens are smooth
- [ ] No lag when scrolling through product listings
- [ ] Images load efficiently
- [ ] App responds quickly to user input

## Reporting Issues
When reporting issues, please include:
1. Device model and OS version
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots or videos if applicable

## App Store Submission Preparation
After successful testing, the app can be prepared for submission to the app stores:

### Google Play Store
1. Create a signed APK or App Bundle
2. Create a Google Play Developer account
3. Create a new app listing
4. Upload the signed APK or App Bundle
5. Fill out the store listing information
6. Set up pricing and distribution
7. Submit for review

### Apple App Store
1. Archive the app in Xcode
2. Create an App Store Connect account
3. Create a new app listing
4. Upload the archived app
5. Fill out the store listing information
6. Set up pricing and distribution
7. Submit for review

## App Store Submission Checklist

### Google Play Store
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (at least 2)
- [ ] Short description (80 characters max)
- [ ] Full description (4000 characters max)
- [ ] App category selected
- [ ] Content rating questionnaire completed
- [ ] Privacy policy URL provided
- [ ] Signed APK/AAB uploaded
- [ ] Pricing and distribution set up

### Apple App Store
- [ ] App icon (1024x1024 PNG)
- [ ] Screenshots (at least 1 per device type)
- [ ] App preview video (optional)
- [ ] App name (30 characters max)
- [ ] Subtitle (30 characters max)
- [ ] Description (4000 characters max)
- [ ] Keywords (100 characters max)
- [ ] Support URL provided
- [ ] Marketing URL (optional)
- [ ] Privacy policy URL provided
- [ ] App category selected
- [ ] Content rating questionnaire completed
- [ ] Pricing and distribution set up
- [ ] App Review Information provided
