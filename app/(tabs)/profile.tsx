import { ThemedView } from "@/components/ThemedView";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex-helpers/react/cache";
import { Stack, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { api } from "../../convex/_generated/api";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  const posthog = usePostHog();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      posthog?.capture("sign_out");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "Loading...";
  const avatarUrl = user?.avatarUrl;

  return (
    <ThemedView className="flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView bounces={false} className="flex-grow p-4">
        <ThemedView className="pb-5 pt-10">
          <Avatar
            alt={`${fullName}'s avatar`}
            className="h-24 w-24 self-center mb-4"
          >
            <AvatarImage source={{ uri: avatarUrl ?? "" }} />
            <AvatarFallback className="bg-foreground">
              <ActivityIndicator color="white" />
            </AvatarFallback>
          </Avatar>
          <Text className="mb-1 text-center text-2xl font-semibold">
            {fullName}
          </Text>
          <Text className="mb-3 text-center text-base">
            {user?.location || ""}
          </Text>
          <Text className="mb-6 text-center text-base px-5">
            {user?.bio || ""}
          </Text>
          <Button
            variant="outline"
            className="w-full"
            onPress={() => router.push("/profile-update")}
          >
            <Text>Edit Profile</Text>
          </Button>
        </ThemedView>
        <ThemedView className="mt-2">
          <Button
            variant="destructive"
            className="w-full"
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>Sign Out</Text>
            )}
          </Button>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
