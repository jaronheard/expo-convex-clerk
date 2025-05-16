import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../convex/_generated/api";

export default function ProfileScreen() {
  const { signOut, userId } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
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
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: avatarUrl }} style={styles.userAvatar} />
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userLocation}>{user?.location || ""}</Text>
          <Text style={styles.userBio}>{user?.bio || ""}</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => router.push("/profile-update")}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Out</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  userBio: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  editProfileButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  editProfileButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    padding: 24,
    gap: 20,
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: "#f44336",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
