import { Stack } from "expo-router";
import React from "react";

export default function OnboardingLayout() {
  return (
    <Stack initialRouteName="first-name">
      <Stack.Screen name="first-name" options={{ headerShown: false }} />
      <Stack.Screen name="last-name" options={{ headerShown: false }} />
      <Stack.Screen name="location" options={{ headerShown: false }} />
      <Stack.Screen name="bio" options={{ headerShown: false }} />
    </Stack>
  );
}
