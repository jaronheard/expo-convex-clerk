import { useMemo, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { Text } from "@/components/ui/text";

interface AddTaskButtonProps {
  onAddTask: (text: string) => Promise<void>;
  bottom: number;
}

export function AddTaskButton({ onAddTask, bottom }: AddTaskButtonProps) {
  const { colorScheme } = useColorScheme();
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const modalBackgroundColor = colorScheme === "dark" ? "#1c1c1e" : "#f2f2f7";
  const inputBackgroundColor =
    colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = async () => {
    if (newTaskText.trim() === "") return;
    await onAddTask(newTaskText);
    setNewTaskText("");
    bottomSheetRef.current?.dismiss();
  };

  return (
    <>
      <TouchableOpacity
        className="absolute m-4 right-4 w-14 h-14 rounded-full justify-center items-center shadow-lg bg-[#007AFF]"
        style={{ bottom }}
        onPress={() => bottomSheetRef.current?.present()}
      >
        <Text className="text-2xl text-foreground">+</Text>
      </TouchableOpacity>

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
    </>
  );
}
