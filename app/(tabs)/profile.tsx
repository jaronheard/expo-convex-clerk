import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex-helpers/react/cache";
import { Stack, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
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
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.profileHeader}>
          <Avatar
            alt={`${fullName}'s avatar`}
            className="h-24 w-24 self-center mb-4"
          >
            <AvatarImage source={{ uri: avatarUrl ?? "" }} />
            <AvatarFallback className="bg-foreground">
              <ActivityIndicator color="white" />
            </AvatarFallback>
          </Avatar>
          <ThemedText style={styles.userName}>{fullName}</ThemedText>
          <ThemedText style={styles.userLocation}>
            {user?.location || ""}
          </ThemedText>
          <ThemedText style={styles.userBio}>{user?.bio || ""}</ThemedText>
          <Button
            variant="outline"
            className="w-full"
            onPress={() => router.push("/profile-update")}
          >
            <Text>Edit Profile</Text>
          </Button>
        </ThemedView>
        <ThemedView style={styles.content}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  profileHeader: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  userLocation: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  userBio: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  content: {
    marginTop: 10,
  },
});
