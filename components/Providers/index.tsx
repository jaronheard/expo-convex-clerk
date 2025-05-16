import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as SecureStore from "expo-secure-store";
import ErrorBoundary from "react-native-error-boundary";
import FallbackComponent from "react-native-error-boundary/lib/ErrorBoundary/FallbackComponent";

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
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

  if (!publishableKey) {
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
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
  );
}
