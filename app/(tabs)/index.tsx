import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDebounce } from "@/hooks/useDebounce";

export default function HomeScreen() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 200);
  const tasks = useQuery(api.tasks.search, { searchQuery: debouncedSearch });
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";

  return (
    <ThemedView style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Tasks</ThemedText>
        </ThemedView>

        <ThemedView style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search tasks..."
            placeholderTextColor={
              colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(0, 0, 0, 0.5)"
            }
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </ThemedView>

        <ThemedView style={styles.tasksContainer}>
          {tasks?.map(({ _id, text, isCompleted }) => (
            <ThemedView key={_id} style={styles.taskItem}>
              <ThemedText
                style={isCompleted ? styles.completedTask : undefined}
              >
                {text}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  searchContainer: {
    marginVertical: 16,
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  tasksContainer: {
    gap: 8,
    marginBottom: 16,
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
});
