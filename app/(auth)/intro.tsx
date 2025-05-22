import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function Intro() {
  const { isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState<{
    google?: boolean;
    apple?: boolean;
  }>({});

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });

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

  const handleAppleSignIn = async () => {
    try {
      setIsLoading({ apple: true });

      const { createdSessionId, setActive } = await appleAuth();

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error:", err);
    } finally {
      setIsLoading({ apple: false });
    }
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-5">
        <Text className="mb-2 text-4xl font-bold">Welcome</Text>
        <Text className="mb-8 text-lg text-gray-600">Sign in to get started</Text>

        <View className="w-full gap-4">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-lg border border-gray-300 bg-gray-100 p-4"
            onPress={handleGoogleSignIn}
            disabled={isLoading.google}
          >
            {isLoading.google ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Image
                  source={require("../../assets/images/google.png")}
                  className="mr-3 h-6 w-6"
                />
                <Text className="text-base font-medium">Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center rounded-lg border border-gray-300 bg-gray-100 p-4"
            onPress={handleAppleSignIn}
            disabled={isLoading.apple}
          >
            {isLoading.apple ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Ionicons
                  name="logo-apple"
                  size={24}
                  color="#000"
                  className="mr-3 h-6 w-6"
                />
                <Text className="text-base font-medium">Continue with Apple</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

