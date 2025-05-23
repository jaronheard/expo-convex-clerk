import * as WebBrowser from "expo-web-browser";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

import { SignInButtons } from "@/components/SignInButtons";

WebBrowser.maybeCompleteAuthSession();

export default function Intro() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-5">
        <Text className="text-[32px] font-bold mb-2">Welcome</Text>
        <Text className="text-lg text-[#666] mb-8">Sign in to get started</Text>
        <SignInButtons />
      </View>
    </SafeAreaView>
  );
}
