import { api } from "@/convex/_generated/api";
import { View } from "react-native";
import { TaskList } from "@/components/TaskList";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="bg-background flex-1 p-4">
        <View className="bg-background flex-row gap-2 mt-4 mb-4">
          <Text className="text-3xl font-bold">Explore</Text>
        </View>

        <TaskList query={api.tasks.searchOthers} bottomPadding={80} />
      </View>
    </SafeAreaView>
  );
}
