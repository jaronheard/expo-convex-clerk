import { api } from "@/convex/_generated/api";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMutation } from "convex/react";
import { SafeAreaView, View } from "react-native";

import { AddTaskButton } from "@/components/AddTaskButton";
import { TaskList } from "@/components/TaskList";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const createTask = useMutation(api.tasks.createTask);

  const handleAddTask = async (text: string) => {
    try {
      await createTask({ text });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="bg-background flex-1 p-4">
        <View className="bg-background flex-row items-center gap-2 mt-4 mb-4">
          <Text className="text-3xl font-bold">Tasks</Text>
        </View>

        <TaskList
          query={api.tasks.searchMine}
          bottomPadding={tabBarHeight + 64}
        />
      </View>

      <AddTaskButton onAddTask={handleAddTask} bottom={tabBarHeight + 8} />
    </SafeAreaView>
  );
}
