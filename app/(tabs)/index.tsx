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
} from "react-native";

import { TaskItem } from "@/components/TaskItem";
import { ThemedView } from "@/components/ThemedView";
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
    <ThemedView className="flex-1">
      <ThemedView className="flex-1 p-4">
        <ThemedView className="mt-4 mb-4 flex-row items-center gap-2">
          <Text className="text-3xl font-bold">Tasks</Text>
        </ThemedView>

        <ThemedView className="my-4">
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
        </ThemedView>

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
      </ThemedView>

      <TouchableOpacity
        className="absolute right-4 bottom-4 m-4 h-14 w-14 items-center justify-center rounded-full shadow"
        style={{ backgroundColor: themeColors.primary }}
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
        <BottomSheetView className="w-full items-center rounded-t-2xl p-6" style={{shadowColor: '#000', shadowOffset:{width:0,height:-2}, shadowOpacity:0.25, shadowRadius:4, elevation:5}}>
          <Text className="mb-5 text-center text-xl font-bold">Add New Task</Text>
          <BottomSheetTextInput
            className="mb-[25px] w-full rounded-xl p-4 text-base"
            style={{ color: textColor, backgroundColor: inputBackgroundColor }}
            placeholder="e.g., Study Portuguese every weekday"
            placeholderTextColor={
              colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(0, 0, 0, 0.5)"
            }
            value={newTaskText}
            onChangeText={setNewTaskText}
          />
          <ThemedView className="w-full flex-row justify-between">
            <TouchableOpacity
              onPress={() => bottomSheetRef.current?.dismiss()}
              className="rounded-lg px-5 py-2.5"
            >
              <Text className="text-base font-semibold text-[#8e8e93]">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddTask}
              className="rounded-lg px-5 py-2.5"
            >
              <Text className="text-base font-semibold text-[#007AFF]">Save Task</Text>
            </TouchableOpacity>
          </ThemedView>
        </BottomSheetView>
      </BottomSheetModal>
    </ThemedView>
  );
}

