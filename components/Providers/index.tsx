import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as SecureStore from "expo-secure-store";
import ErrorBoundary from "react-native-error-boundary";
import FallbackComponent from "react-native-error-boundary/lib/ErrorBoundary/FallbackComponent";
import { PostHogProvider, usePostHog } from 'posthog-react-native';
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { useExpoUpdates } from "@/hooks/useExpoUpdates";

// Custom token cache for Clerk
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Initialize the Convex client
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

interface Props {
  children?: JSX.Element;
}

const handleErrorConsole = (error: Error, stackTrace: string) => {
  console.error("Error occurred:", error, stackTrace);
};

export default function RootProvider({ children }: Props): JSX.Element {
  const clerkPublishableKey =
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

  const { userId } = useAuth();
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog && userId) {
      posthog.identify(userId);
    }
  }, [posthog, userId]);

  useExpoUpdates();

  if (!clerkPublishableKey) {
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  const posthogOptions: Record<string, unknown> = {
    host: 'https://us.i.posthog.com',
    enableSessionReplay: true,
  };

  if (Platform.OS === 'web' || Platform.OS === 'macos') {
    posthogOptions.persistence = 'asyncStorage';
    posthogOptions.storage = AsyncStorage;
  }

  return (
    <PostHogProvider
      apiKey="phc_xFdnzXhdRoS2sHiQziB8NZvDZ3u9VCeJ44eEft1taA3"
      options={posthogOptions}
      autocapture
    >
      <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <ErrorBoundary
              FallbackComponent={FallbackComponent}
              onError={handleErrorConsole}
            >
              <ActionSheetProvider>{children}</ActionSheetProvider>
            </ErrorBoundary>
          </ConvexProviderWithClerk>
        </ClerkLoaded>
      </ClerkProvider>
    </PostHogProvider>
  );
}