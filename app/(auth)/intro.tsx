import { useSSO, useSignIn } from "@clerk/clerk-expo";
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

  const { startSSOFlow } = useSSO();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading({ google: true });

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error("SSO error:", err);
    } finally {
      setIsLoading({ google: false });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading({ apple: true });

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_apple",
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error("SSO error:", err);
    } finally {
      setIsLoading({ apple: false });
    }
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-[32px] font-bold mb-2">Welcome</Text>
        <Text className="text-lg text-[#666] mb-8">Sign in to get started</Text>

        <View className="w-full gap-4">
          <TouchableOpacity
            className="flex-row items-center justify-center bg-[#f5f5f5] rounded-lg p-4 border border-[#e0e0e0]"
            onPress={handleGoogleSignIn}
            disabled={isLoading.google}
          >
            {isLoading.google ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Image
                  source={require("../../assets/images/google.png")}
                  className="w-6 h-6 mr-3"
                />
                <Text className="text-base font-medium">
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center bg-[#f5f5f5] rounded-lg p-4 border border-[#e0e0e0]"
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
                  className="w-6 h-6 mr-3"
                />
                <Text className="text-base font-medium">
                  Continue with Apple
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
