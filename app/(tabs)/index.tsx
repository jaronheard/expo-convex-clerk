import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const tasks = useQuery(api.tasks.get);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Tasks</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.tasksContainer}>
        {tasks?.map(({ _id, text, isCompleted }) => (
          <ThemedView key={_id} style={styles.taskItem}>
            <ThemedText style={isCompleted ? styles.completedTask : undefined}>
              {text}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tasksContainer: {
    gap: 8,
    marginBottom: 8,
  },
  taskItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  completedTask: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
