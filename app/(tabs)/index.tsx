import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LegendList } from "@/components/LegendList";
import { useDebounce } from "@/hooks/useDebounce";

export default function HomeScreen() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 200);
  const { results, status, loadMore } = usePaginatedQuery(
    api.tasks.search,
    { searchQuery: debouncedSearch },
    { initialNumItems: 20 }
  );
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";

  return (
    <ThemedView style={styles.wrapper}>
      <ThemedView style={styles.contentContainer}>
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
      </ThemedView>

      <LegendList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ThemedView style={styles.taskItem}>
            <ThemedText
              style={item.isCompleted ? styles.completedTask : undefined}
            >
              {item.text}
            </ThemedText>
          </ThemedView>
        )}
        onEndReached={() => loadMore(20)}
        isDone={status === "Exhausted"}
      />
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
