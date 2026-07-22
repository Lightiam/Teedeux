#!/bin/bash
# Script to build the Teedeux iOS package

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
  echo "Xcode not found. Please install Xcode to build iOS packages."
  exit 1
fi

# Sync the web assets to the iOS project
echo "Syncing web assets to iOS project..."
npx cap sync ios

# Check if CocoaPods is installed
if ! command -v pod &> /dev/null; then
  echo "CocoaPods not found. Installing CocoaPods..."
  sudo gem install cocoapods
fi

# Install CocoaPods dependencies
echo "Installing CocoaPods dependencies..."
cd ios/App
pod install
cd ../..

echo "iOS project preparation complete."
echo ""
echo "To build the iOS app for App Store submission:"
echo "1. Open the iOS project in Xcode:"
echo "   npx cap open ios"
echo ""
echo "2. In Xcode, select a development team in the Signing & Capabilities tab."
echo ""
echo "3. Build the app for testing in the simulator:"
echo "   Product > Run"
echo ""
echo "4. Archive the app for App Store submission:"
echo "   Product > Archive"
echo ""
echo "5. In the Archives window, click 'Distribute App' and follow the prompts to submit to the App Store."
echo ""
echo "Note: You must have an Apple Developer account to submit apps to the App Store."
echo "The app must pass App Store review before it will be available for download."

# Additional information for TestFlight distribution
echo ""
echo "To distribute the app via TestFlight for beta testing:"
echo "1. After archiving the app, select 'Distribute App' in the Archives window."
echo "2. Choose 'TestFlight & App Store Connect'."
echo "3. Follow the prompts to upload the app to App Store Connect."
echo "4. In App Store Connect, go to the TestFlight tab and add testers."
echo "5. Once the build is processed, testers will receive an email invitation to test the app."
