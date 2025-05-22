import { api } from "@/convex/_generated/api";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMutation, usePaginatedQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { FlatList, TouchableOpacity, View, useColorScheme } from "react-native";

import { TaskItem } from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useDebounce } from "@/hooks/useDebounce";

export default function GuestTasks() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const modalBackgroundColor = colorScheme === "dark" ? "#1c1c1e" : "#f2f2f7";
  const inputBackgroundColor =
    colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const { results, loadMore } = usePaginatedQuery(
    api.tasks.search,
    { searchQuery: debouncedSearch },
    { initialNumItems: 20 },
  );
  const [newTaskText, setNewTaskText] = useState("");
  const [hasAddedTask, setHasAddedTask] = useState(false);
  const createTask = useMutation(api.tasks.createTask);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const handleAddTask = async () => {
    if (newTaskText.trim() === "") return;
    try {
      await createTask({ text: newTaskText });
      setHasAddedTask(true);
      setNewTaskText("");
      bottomSheetRef.current?.dismiss();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <View className="bg-background flex-1">
      <View className="bg-background flex-1 p-4">
        <View className="bg-background flex-row items-center gap-2 mt-4 mb-4">
          <Text className="text-3xl font-bold">Tasks</Text>
        </View>

        <View className="bg-background my-4">
          <Input
            className="w-full"
            placeholder="Search tasks..."
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
          ItemSeparatorComponent={() => <View className="h-2" />}
          onEndReached={() => loadMore(20)}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>

      <TouchableOpacity
        className="absolute m-4 right-4 bottom-4 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        style={{ backgroundColor: "#007AFF" }}
        onPress={() => bottomSheetRef.current?.present()}
      >
        <Text className="text-2xl text-foreground">+</Text>
      </TouchableOpacity>

      {hasAddedTask && (
        <Button
          onPress={() => router.push("/intro")}
          className="absolute left-4 right-4 bottom-20"
        >
          <Text>Sign Up to Save Tasks</Text>
        </Button>
      )}

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: modalBackgroundColor }}
      >
        <BottomSheetView className="w-full rounded-t-2xl p-6 items-center shadow-md">
          <Text className="mb-5 text-center text-xl font-bold">
            Add New Task
          </Text>
          <BottomSheetTextInput
            className="w-full p-[15px] rounded-[10px] text-base mb-[25px]"
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
          <View className="bg-background flex-row justify-between w-full">
            <TouchableOpacity
              onPress={() => bottomSheetRef.current?.dismiss()}
              className="py-2.5 px-5 rounded-lg"
            >
              <Text className="text-base font-semibold text-[#8e8e93]">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddTask}
              className="py-2.5 px-5 rounded-lg"
            >
              <Text className="text-base font-semibold text-[#007AFF]">
                Save Task
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
