# Expo + Convex + Clerk Template

## Intentions

- [x] This is an app template starting point
- [x] Use it as the foundation for building a mobile app with Expo, Convex, and Clerk

This template integrates [Expo](https://expo.dev) for the client, [Convex](https://convex.dev) for the backend, and [Clerk](https://clerk.com) for authentication.

## Get started

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Set up Convex

   Create a new Convex project at [dashboard.convex.dev](https://dashboard.convex.dev)

   ```bash
   npx convex login
   npx convex init
   ```

3. Set up Clerk

   Create a new Clerk project at [dashboard.clerk.com](https://dashboard.clerk.com)

   - Create a new Clerk application
   - Go to API Keys page to get your Publishable Key
   - Set the JWT template to include `sub` and `useId` in User Claims section

4. Copy `env.example` to `.env.local` and fill in the values:

   ```
   # Convex
   EXPO_PUBLIC_CONVEX_URL=your_convex_url

   # Clerk
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

   EXPO_PUBLIC_CLERK_FRONTEND_API_URL=your_clerk_frontend_api

   # Sentry
   EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn
   SENTRY_AUTH_TOKEN=your_sentry_auth_token
   SENTRY_ORG=your_sentry_org
   SENTRY_PROJECT=your_sentry_project

   # AppsFlyer
   EXPO_PUBLIC_APPSFLYER_DEV_KEY=your_appsflyer_dev_key
   EXPO_PUBLIC_APPSFLYER_APP_ID=your_appsflyer_app_id

   # Set the app variant (development, preview, production)
   APP_VARIANT=development

   # Optional API keys
   OPENAI_API_KEY=your_openai_api_key

   # Optional: override Expo platform detection
   EXPO_OS=ios
   ```

5. Start development server

   ```bash
   # In one terminal
   npx convex dev

   # In another terminal
   pnpm run dev
   # This script sets APP_VARIANT=development so the correct app id is used
   ```

## Deploying Convex to Vercel

1. Set the `CONVEX_DEPLOY_KEY` secret in your Vercel project.
2. Commit `vercel.json` and a `build` script that runs `pnpm run deploy:convex`.
3. Push your repository to Vercel and it will deploy Convex using the build command.

The template uses **expo-updates** to deliver over-the-air updates. The app
automatically checks for updates every 10 minutes while running and will
immediately download and launch a new update if it contains a higher
`criticalIndex` than the currently running version.

## Push Notifications

This template includes optional OneSignal integration for push notifications. Follow the steps in [ONESIGNAL_SETUP.md](./ONESIGNAL_SETUP.md) to configure your app.

## AppsFlyer Integration

This template includes AppsFlyer SDK integration for attribution tracking and deep linking. To set up AppsFlyer:

1. **Create an AppsFlyer account** at [appsflyer.com](https://www.appsflyer.com)

2. **Get your credentials**:

   - **Dev Key**: Found in your AppsFlyer dashboard under App Settings
   - **App ID**: Your app's identifier (e.g., iOS Bundle ID or Android Package Name)

3. **Add environment variables** to your `.env.local` file:

   ```
   EXPO_PUBLIC_APPSFLYER_DEV_KEY=your_dev_key_from_appsflyer_dashboard
   EXPO_PUBLIC_APPSFLYER_APP_ID=your_app_bundle_id_or_package_name
   ```

4. **Configuration details**:

   - The SDK is automatically initialized in `app/_layout.tsx`
   - Debug mode is enabled in development (`__DEV__`)
   - Install conversion data and deep link listeners are enabled
   - iOS ATT (App Tracking Transparency) timeout is set to 10 seconds

5. **Testing**:
   - AppsFlyer requires native builds (use EAS Build)
   - Test attribution and deep links on physical devices
   - Check AppsFlyer dashboard for attribution data

For advanced features like custom events, user identification, and deep link handling, refer to the [AppsFlyer React Native documentation](https://dev.appsflyer.com/hc/docs/react-native-plugin).

## Example Profile Features

The template includes example code for:

- User profile display with Clerk authentication
- Profile editing functionality (first name, last name, location, bio)
- Image upload using expo-image-picker and Convex storage
- Real-time data synchronization across clients

## Project Structure

- `app/(tabs)/profile.tsx`: Profile display page
- `app/(tabs)/profile-update.tsx`: Profile editing page
- `convex/users.ts`: User data management
- `convex/upload.ts`: File upload handling
- `convex/schema.ts`: Database schema definition

### UI components

The `components/ui` directory wraps primitives from
[React Native Reusables](https://github.com/rn-primitives/rn-primitives). These
provide cross-platform building blocks such as `Avatar`, `Checkbox` and
slot-based button primitives that you can style with NativeWind classes.

### Themes

Light and dark colors are defined in `lib/constants.ts`. The theme logic in
`hooks/useColorScheme.ts` syncs with the device, and `app/_layout.tsx` applies
the appropriate `ThemeProvider` so the UI automatically switches between light
and dark mode.

## Learn more

- [Convex documentation](https://docs.convex.dev/home)
- [Clerk documentation](https://clerk.com/docs)
- [Expo documentation](https://docs.expo.dev/)

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```

```
