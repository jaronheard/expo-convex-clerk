import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { api } from "../../convex/_generated/api";

export default function AuthLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  // Fetch user data only when authenticated.
  // Pass "skip" to useQuery to prevent it from running if not authenticated.
  const user = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip",
  );

  if (isLoading) {
    // This isLoading is from useConvexAuth, indicating Clerk auth state is loading.
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Unauthenticated>
        {/* Stack for unauthenticated users, primarily showing the intro screen */}
        <Stack initialRouteName="intro" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="intro" />
          {/* onboarding/ routes are not part of this stack, 
              they are handled after authentication based on user.onboarded status */}
        </Stack>
      </Unauthenticated>

      <Authenticated>
        {/* This content is rendered only when isAuthenticated (from useConvexAuth) is true */}
        {/* Now we handle the state of the 'user' query */}
        {user === undefined ? (
          // user query is loading (or was skipped and now isAuthenticated is true, so it's re-fetching)
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : user === null || !user.onboarded ? (
          // User record doesn't exist in DB OR user exists but is not onboarded
          <Redirect href="/onboarding/first-name" />
        ) : (
          <Redirect href="/(tabs)" />
        )}
      </Authenticated>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

// Removed console.log statements and refined logic for user loading and onboarding redirection.
