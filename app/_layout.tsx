import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import { Stack, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { isRunningInExpoGo } from "expo";

import Providers from "@/components/Providers";
import { useColorScheme } from "@/hooks/useColorScheme";

// Construct a new integration instance to track navigation with Sentry
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

// Initialize Sentry
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN, // Set this in .env.local
  // Add more context data to events (IP address, cookies, user, etc.)
  sendDefaultPii: true,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
  // Adjust this value in production
  tracesSampleRate: 0.2, // Lower in production
  // Capture profiles for 100% of transactions
  profilesSampleRate: 0.1, // Lower in production
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

function RootLayout() {
  const colorScheme = useColorScheme();
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Providers>
      <RootLayoutNav colorScheme={colorScheme || "light"} />
    </Providers>
  );
}

export default Sentry.wrap(RootLayout);

function RootLayoutNav({ colorScheme }: { colorScheme: "light" | "dark" }) {
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
