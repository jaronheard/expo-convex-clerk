/**
 * Example usage of the EventsList component
 */

import { useState } from "react";
import { View } from "react-native";
import EventsList from "./EventsList";

export default function EventsExample() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleEventPress = (event: any) => {
    console.log("Event pressed:", event.name);
    // You can navigate to event detail screen here
    // Example: router.push(`/event/${event.id}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <View style={{ flex: 1 }}>
      <EventsList
        onEventPress={handleEventPress}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    </View>
  );
}
