import { ScrollView } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Text } from "@/components/ui/text";

export default function ExploreScreen() {
  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <ThemedView className="mt-4 mb-4 flex-row gap-2">
          <Text className="text-3xl font-bold">Explore</Text>
        </ThemedView>
        <ThemedView className="mb-4">
          <Text>This is the explore tab. Add your content here.</Text>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
