import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex-helpers/react/cache";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
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
  const avatarUrl = user?.avatarUrl || "https://placehold.co/200x200?text=User";

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.profileHeader}>
          <Image source={{ uri: avatarUrl }} style={styles.userAvatar} />
          <ThemedText style={styles.userName}>{fullName}</ThemedText>
          <ThemedText style={styles.userLocation}>
            {user?.location || ""}
          </ThemedText>
          <ThemedText style={styles.userBio}>{user?.bio || ""}</ThemedText>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => router.push("/profile-update")}
          >
            <ThemedText style={styles.editProfileButtonText}>
              Edit Profile
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.content}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator color="#FF3B30" />
            ) : (
              <ThemedText style={styles.buttonText}>Sign Out</ThemedText>
            )}
          </TouchableOpacity>
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
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    alignSelf: "center",
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
  editProfileButton: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  editProfileButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    marginTop: 10,
  },
  signOutButton: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
  },
  buttonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "500",
  },
});
