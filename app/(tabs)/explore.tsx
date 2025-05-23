import { ScrollView, View } from "react-native";

import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView className="flex-1">
        <View className="bg-background p-4">
          <View className="bg-background flex-row gap-2 mt-4 mb-4">
            <Text className="text-3xl font-bold">Explore</Text>
          </View>
          <View className="bg-background mb-4">
            <Text>This is the explore tab. Add your content here.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
