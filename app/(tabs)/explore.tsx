import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useState } from "react";
import { FlatList, View } from "react-native";

import { TaskItem } from "@/components/TaskItem";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useDebounce } from "@/hooks/useDebounce";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const { results, loadMore } = usePaginatedQuery(
    api.tasks.searchOthers,
    { searchQuery: debouncedSearch },
    { initialNumItems: 20 },
  );

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="bg-background flex-1 p-4">
        <View className="bg-background flex-row gap-2 mt-4 mb-4">
          <Text className="text-3xl font-bold">Explore</Text>
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
          onEndReached={() => loadMore(20)}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
    </SafeAreaView>
  );
}
