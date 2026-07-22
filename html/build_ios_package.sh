#!/bin/bash
# Script to build the Teedeux iOS package

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Sync the web assets to the iOS project
echo "Syncing web assets to iOS project..."
npx cap sync ios

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
