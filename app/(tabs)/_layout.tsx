import { Redirect, Stack, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NAV_THEME } from "@/lib/constants";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <AuthLoading>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      </AuthLoading>

      <Unauthenticated>
        <Redirect href="/intro" />
      </Unauthenticated>

      <Authenticated>
        <Stack.Screen
          name="profile-update"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: NAV_THEME[colorScheme ?? "light"].primary,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: "absolute",
              },
              default: {},
            }),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="house.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: "Explore",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="paperplane.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="person.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen name="profile-update" options={{ href: null }} />
        </Tabs>
      </Authenticated>
    </>
  );
}
