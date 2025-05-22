import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Text } from "@/components/ui/text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <Text className="text-3xl font-bold">This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text className="text-blue-600">Go to home screen!</Text>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
