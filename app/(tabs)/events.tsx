import { SafeAreaView, View } from "react-native";

import EventsList from "@/components/EventsList";
import { Text } from "@/components/ui/text";
import { useBottomTabBarHeight } from "@/hooks/useBottomTabBarHeight";

export default function EventsScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const handleEventPress = (event: any) => {
    console.log("Event pressed:", event.name);
    // You can navigate to event detail screen here
    // Example: router.push(`/event/${event.id}`);
  };

  const handleRefresh = async () => {
    // Refresh logic if needed
    console.log("Refreshing events...");
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="bg-background flex-1">
        <View className="bg-background flex-row items-center gap-2 mt-4 mb-4 px-4">
          <Text className="text-3xl font-bold">Events</Text>
        </View>

        <View className="flex-1" style={{ paddingBottom: tabBarHeight }}>
          <EventsList
            onEventPress={handleEventPress}
            onRefresh={handleRefresh}
            isRefreshing={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
