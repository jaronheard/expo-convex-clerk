# OneSignal Setup Guide

This document outlines the OneSignal setup for push notifications in this Expo app.

## What's Been Configured

### 1. Package Installation

- ✅ `onesignal-expo-plugin` - Expo plugin for OneSignal
- ✅ `react-native-onesignal` - OneSignal React Native SDK

### 2. App Configuration (`app.config.ts`)

- ✅ Added OneSignal plugin to plugins array with development mode
- ✅ Configured iOS settings:
  - `UIBackgroundModes: ["remote-notification"]` for background push notifications
  - `aps-environment: "development"` for push notification entitlements
  - App Groups entitlement for confirmed delivery

### 3. SDK Initialization (`app/_layout.tsx`)

- ✅ OneSignal SDK initialization in the root layout
- ✅ Environment variable support for OneSignal App ID
- ✅ Permission request setup
- ✅ Debug logging enabled for development

### 4. Environment Variables

- ✅ Added `EXPO_PUBLIC_ONESIGNAL_APP_ID` to `env.example`

## Next Steps

### 1. Create OneSignal Account & App

1. Sign up at [OneSignal](https://onesignal.com/) or login
2. Create a new app for your project
3. Copy your OneSignal App ID from Settings > Keys & IDs

### 2. Configure Environment Variables

1. Create `.env.local` file (copy from `env.example`)
2. Add your OneSignal App ID:
   ```
   EXPO_PUBLIC_ONESIGNAL_APP_ID=your-app-id-here
   ```

### 3. Platform Configuration

#### iOS Setup

1. Configure Apple Push Notification Service (APNS) in OneSignal:
   - Go to your OneSignal app Settings > Platforms
   - Add iOS platform
   - Upload your APNs Auth Key or Certificate

#### Android Setup

1. Configure Firebase Cloud Messaging (FCM) in OneSignal:
   - Go to your OneSignal app Settings > Platforms
   - Add Android platform
   - Upload your Firebase Server Key

### 4. Production Configuration

When ready for production builds:

1. Update `app.config.ts`:

   ```typescript
   "aps-environment": "production" // Change from "development"
   ```

2. Update OneSignal plugin mode:

   ```typescript
   [
     "onesignal-expo-plugin",
     {
       mode: "production", // Change from "development"
     },
   ];
   ```

3. Consider removing verbose logging:
   ```typescript
   // Remove or comment out in production
   // OneSignal.Debug.setLogLevel(LogLevel.Verbose);
   ```

### 5. Testing

1. Build your app using EAS Build (OneSignal requires native builds, won't work in Expo Go)
2. Install on a physical device
3. Test push notifications from OneSignal dashboard

## Additional Features

You can enhance the OneSignal integration by adding:

- User identification and tagging
- Custom notification handling
- In-app messaging
- Deep linking from notifications
- Analytics and conversion tracking

Refer to the [OneSignal React Native documentation](https://documentation.onesignal.com/docs/react-native-sdk-setup) for advanced features.

## Important Notes

- OneSignal requires EAS Build - it won't work in Expo Go development builds
- Push notifications only work on physical devices, not simulators (for iOS)
- Make sure to test on both iOS and Android platforms
- Consider implementing proper error handling and user permission flows
