import { api } from "@/convex/_generated/api";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMutation, usePaginatedQuery } from "convex/react";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { TaskItem } from "@/components/TaskItem";
import { Text } from "@/components/ui/text";
import { useDebounce } from "@/hooks/useDebounce";
import { NAV_THEME } from "@/lib/constants";

export default function HomeScreen() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const { results, loadMore } = usePaginatedQuery(
    api.tasks.search,
    { searchQuery: debouncedSearch },
    { initialNumItems: 20 },
  );
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const modalBackgroundColor = colorScheme === "dark" ? "#1c1c1e" : "#f2f2f7";
  const inputBackgroundColor =
    colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);
  const [newTaskText, setNewTaskText] = useState("");
  const createTask = useMutation(api.tasks.createTask);

  const handleAddTask = async () => {
    if (newTaskText.trim() === "") return;
    try {
      await createTask({ text: newTaskText });
      setNewTaskText("");
      bottomSheetRef.current?.dismiss();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 bg-background p-4">
        <View className="flex-row items-center gap-2 mt-4 mb-4 bg-background">
          <Text className="text-3xl font-bold">Tasks</Text>
        </View>

        <View className="my-4 bg-background">
          <TextInput
            className="rounded-lg p-3 text-base"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: textColor }}
            placeholder="Search tasks..."
            placeholderTextColor={
              colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(0, 0, 0, 0.5)"
            }
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TaskItem
              id={item._id}
              text={item.text}
              isCompleted={item.isCompleted}
            />
          )}
          onEndReached={() => loadMore(20)}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      <TouchableOpacity
        className="absolute right-4 bottom-4 w-14 h-14 rounded-full justify-center items-center"
        style={{ backgroundColor: themeColors.primary, elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
        onPress={() => bottomSheetRef.current?.present()}
      >
        <Text className="text-2xl">+</Text>
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: modalBackgroundColor }}
      >
        <BottomSheetView style={styles.modalView}>
          <Text className="mb-5 text-center text-xl font-bold">Add New Task</Text>
          <BottomSheetTextInput
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
          />
          <View className="flex-row justify-between w-full bg-background">
            <TouchableOpacity
              onPress={() => bottomSheetRef.current?.dismiss()}
              style={styles.modalButton}
            >
              <Text
                style={[styles.modalButtonText, styles.inactiveModalButtonText]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddTask}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Save Task</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const styles = {
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
} as const;
