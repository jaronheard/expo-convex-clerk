import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function Intro() {
  const { isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState<{
    google?: boolean;
  }>({});

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading({ google: true });

      const { createdSessionId, setActive } = await googleAuth();

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error:", err);
    } finally {
      setIsLoading({ google: false });
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign in to get started</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading.google}
          >
            {isLoading.google ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Image
                  source={require("../../assets/images/google.png")}
                  style={styles.socialIcon}
                />
                <Text style={styles.buttonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
