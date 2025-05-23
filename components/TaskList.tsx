import { usePaginatedQuery } from "convex/react";
import { useState } from "react";
import { FlatList, View } from "react-native";

import { TaskItem } from "@/components/TaskItem";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

interface TaskListProps {
  query: any;
  queryArgs?: Record<string, unknown>;
  bottomPadding?: number;
}

export function TaskList({
  query,
  queryArgs = {},
  bottomPadding = 80,
}: TaskListProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const { results, loadMore } = usePaginatedQuery(
    query,
    { searchQuery: debouncedSearch, ...queryArgs },
    { initialNumItems: 20 },
  );

  return (
    <View className="flex-1">
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
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      />
    </View>
  );
}
