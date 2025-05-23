import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "convex-helpers/react/cache";
import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useConvexAuth,
  useMutation,
} from "convex/react";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { api } from "../../convex/_generated/api";

const GUEST_USER_KEY = "soonlist_guest_user_id";

export default function AuthLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const transferGuestTasks = useMutation(api.tasks.transferGuestTasks);

  // Fetch user data only when authenticated.
  // Pass "skip" to useQuery to prevent it from running if not authenticated.
  const user = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip",
  );

  // Handle guest task transfer when user becomes authenticated
  useEffect(() => {
    const handleGuestTaskTransfer = async () => {
      if (isAuthenticated && user?.onboarded) {
        try {
          const hasGuestTasks = await AsyncStorage.getItem("has_guest_tasks");
          const guestUserId = await AsyncStorage.getItem(GUEST_USER_KEY);

          if (hasGuestTasks === "true" && guestUserId) {
            console.log("Transferring guest tasks for user:", guestUserId);
            const transferredCount = await transferGuestTasks({ guestUserId });
            console.log(`Transferred ${transferredCount} guest tasks`);

            // Clean up guest data after successful transfer
            await AsyncStorage.multiRemove(["has_guest_tasks", GUEST_USER_KEY]);
          }
        } catch (error) {
          console.error("Failed to transfer guest tasks:", error);
        }
      }
    };

    handleGuestTaskTransfer();
  }, [isAuthenticated, user?.onboarded, transferGuestTasks]);

  return (
    <>
      <AuthLoading>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      </AuthLoading>
      <Unauthenticated>
        {/* Stack for unauthenticated users */}
        <Stack
          initialRouteName="guest-tasks"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="guest-tasks" />
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
          <View className="flex-1 justify-center items-center">
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

// Removed console.log statements and refined logic for user loading and onboarding redirection.
