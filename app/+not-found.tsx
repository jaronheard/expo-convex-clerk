import { Link, Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-background px-5">
        <Text className="text-3xl font-bold">This screen does not exist.</Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-blue-600">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

