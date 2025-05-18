import { api } from "@/convex/_generated/api";
import { LegendList } from "@legendapp/list";
import { useMutation, usePaginatedQuery } from "convex/react";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDebounce } from "@/hooks/useDebounce";

export default function HomeScreen() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const { results, status, loadMore } = usePaginatedQuery(
    api.tasks.search,
    { searchQuery: debouncedSearch },
    { initialNumItems: 20 }
  );
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const modalBackgroundColor = colorScheme === "dark" ? "#1c1c1e" : "#f2f2f7";
  const inputBackgroundColor =
    colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";

  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const createTask = useMutation(api.tasks.createTask);

  const handleAddTask = async () => {
    if (newTaskText.trim() === "") return;
    try {
      await createTask({ text: newTaskText });
      setNewTaskText("");
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

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
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </ThemedView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText style={styles.fabText}>+</ThemedText>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.centeredView}
        >
          <ThemedView
            style={[
              styles.modalView,
              { backgroundColor: modalBackgroundColor },
            ]}
          >
            <ThemedText style={styles.modalText}>Add New Task</ThemedText>
            <TextInput
              style={[
                styles.modalInput,
                { color: textColor, backgroundColor: inputBackgroundColor },
              ]}
              placeholder="e.g., Study Portuguese every weekday"
              placeholderTextColor={
                colorScheme === "dark"
                  ? "rgba(255, 255, 255, 0.5)"
                  : "rgba(0, 0, 0, 0.5)"
              }
              value={newTaskText}
              onChangeText={setNewTaskText}
              autoFocus
            />
            <ThemedView style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <ThemedText
                  style={[
                    styles.modalButtonText,
                    styles.inactiveModalButtonText,
                  ]}
                >
                  Cancel
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddTask}
                style={styles.modalButton}
              >
                <ThemedText style={styles.modalButtonText}>
                  Save Task
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </KeyboardAvoidingView>
      </Modal>
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
    flex: 1,
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
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 8,
  },
  completedTask: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 24,
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalInput: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "transparent",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  inactiveModalButtonText: {
    color: "#8e8e93",
  },
});
