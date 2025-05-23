import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import { cn } from "@/lib/utils";

WebBrowser.maybeCompleteAuthSession();

export function SignInButtons({ className }: { className?: string }) {
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
      <View className={cn("flex-1 justify-center items-center", className)}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className={cn("w-full gap-4", className)}>
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
              source={require("../assets/images/google.png")}
              className="w-6 h-6 mr-3"
            />
            <Text className="text-base font-medium">Continue with Google</Text>
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
            <Text className="text-base font-medium">Continue with Apple</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
