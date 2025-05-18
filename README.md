# Expo + Convex + Clerk Template

## Intentions

- [ ] This is intended to be an app template starting point
- [ ] It is intended to be used as a starting point for building a mobile app using Expo, Convex, and Clerk

## TODO:

- [x] Add apple auth
- [ ] Strip out specific components and make generic
- [ ] Add expo-updates
- [ ] Add error handling, log drain, posthog
- [ ] Update readme
- [ ] Scope out next steps

This is an [Expo](https://expo.dev) project integrated with [Convex](https://convex.dev) for the backend and [Clerk](https://clerk.com) for authentication.

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

4. Create a `.env.local` file with the following:

   ```
   # Convex
   EXPO_PUBLIC_CONVEX_URL=your_convex_url

   # Clerk
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   EXPO_PUBLIC_CLERK_FRONTEND_API_URL=your_clerk_frontend_api
   ```

5. Start development server

   ```bash
   # In one terminal
   npx convex dev

   # In another terminal
   pnpm start
   ```

## Profile Features

The app includes:

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

## Learn more

- [Convex documentation](https://docs.convex.dev/home)
- [Clerk documentation](https://clerk.com/docs)
- [Expo documentation](https://docs.expo.dev/)

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
