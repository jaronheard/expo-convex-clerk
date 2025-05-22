import { ScrollView, View } from "react-native";

import { Text } from "@/components/ui/text";

export default function ExploreScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row gap-2 mt-4 mb-4 bg-background">
          <Text className="text-3xl font-bold">Explore</Text>
        </View>
        <View className="mb-4 bg-background">
          <Text>This is the explore tab. Add your content here.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

