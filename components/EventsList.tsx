/**
 * EventsList Component
 *
 * A simplified events list component that displays events from the Convex database.
 *
 * Usage:
 * ```tsx
 * import EventsList from '@/components/EventsList';
 *
 * export default function EventsScreen() {
 *   const handleEventPress = (event) => {
 *     console.log('Event pressed:', event);
 *     // Navigate to event detail screen
 *   };
 *
 *   const handleRefresh = async () => {
 *     // Refresh logic if needed
 *   };
 *
 *   return (
 *     <EventsList
 *       onEventPress={handleEventPress}
 *       onRefresh={handleRefresh}
 *       isRefreshing={false}
 *     />
 *   );
 * }
 * ```
 */

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Define the event type based on the schema
type Event = {
  _id: string;
  _creationTime: number;
  created_at: string;
  description: string;
  endDate: string;
  endDateTime: string;
  endTime: string;
  id: string;
  image: string | null;
  location: string;
  name: string;
  startDate: string;
  startDateTime: string;
  startTime: string;
  timeZone: string;
  updatedAt: string | null;
  userId: string;
  userName: string;
  visibility: string;
};

interface EventItemProps {
  event: Event;
  onPress?: (event: Event) => void;
}

function EventItem({ event, onPress }: EventItemProps) {
  return (
    <TouchableOpacity
      className="mx-4 mb-4 rounded-2xl bg-white p-4 shadow-sm"
      onPress={() => onPress?.(event)}
    >
      <View className="mb-2">
        <Text className="text-lg font-bold text-neutral-900" numberOfLines={2}>
          {event.name}
        </Text>
      </View>

      {event.description && (
        <View className="mb-2">
          <Text className="text-sm text-neutral-600" numberOfLines={3}>
            {event.description}
          </Text>
        </View>
      )}

      <View className="mb-1 flex-row items-center">
        <Text className="text-sm font-medium text-neutral-700">
          {event.startDate} • {event.startTime}
        </Text>
      </View>

      {event.location && (
        <View className="flex-row items-center">
          <Text className="text-sm text-neutral-600" numberOfLines={1}>
            📍 {event.location}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

interface EventsListProps {
  onEventPress?: (event: Event) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function EventsList({
  onEventPress,
  onRefresh,
  isRefreshing = false,
}: EventsListProps) {
  const events = useQuery(api.events.getAllEvents);

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="mb-2 text-center text-2xl font-bold text-neutral-900">
        No events yet
      </Text>
      <Text className="text-center text-base text-neutral-600">
        Your events will appear here
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#5A32FB" />
    </View>
  );

  if (events === undefined) {
    return renderLoadingState();
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <EventItem event={item} onPress={onEventPress} />
      )}
      ListEmptyComponent={renderEmptyState}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#5A32FB"
          />
        ) : undefined
      }
      style={{ backgroundColor: "#F4F1FF" }}
      contentContainerStyle={{
        paddingTop: 16,
        paddingBottom: 120,
        flexGrow: events.length === 0 ? 1 : 0,
        backgroundColor: "#F4F1FF",
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
