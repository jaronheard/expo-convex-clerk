import { api } from "@/convex/_generated/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { AddTaskButton } from "@/components/AddTaskButton";
import { TaskList } from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const GUEST_USER_KEY = "soonlist_guest_user_id";

export default function GuestTasks() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [guestUserId, setGuestUserId] = useState<string | null>(null);
  const [hasAddedTask, setHasAddedTask] = useState(false);
  const createGuestTask = useMutation(api.tasks.createGuestTask);

  useEffect(() => {
    const initializeGuestUser = async () => {
      try {
        let guestId = await AsyncStorage.getItem(GUEST_USER_KEY);
        if (!guestId) {
          guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await AsyncStorage.setItem(GUEST_USER_KEY, guestId);
        }
        setGuestUserId(guestId);
      } catch (error) {
        console.error("Failed to initialize guest user:", error);
        const fallbackId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setGuestUserId(fallbackId);
      }
    };

    initializeGuestUser();
  }, []);

  const handleAddTask = async (text: string) => {
    if (!guestUserId) return;
    try {
      await createGuestTask({ text, guestUserId });
      setHasAddedTask(true);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleSignUp = () => {
    if (hasAddedTask) {
      AsyncStorage.setItem("has_guest_tasks", "true");
    }
    router.push("/intro");
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="bg-background flex-1 p-4">
        <View className="bg-background flex-row items-center gap-2 mt-4 mb-4">
          <Text className="text-3xl font-bold">Tasks</Text>
          <Text className="text-sm text-muted-foreground">(Guest Mode)</Text>
        </View>

        <TaskList
          query={api.tasks.searchGuest}
          queryArgs={{ guestUserId: guestUserId || "" }}
          bottomPadding={insets.bottom + 104}
        />
      </View>

      <AddTaskButton onAddTask={handleAddTask} bottom={insets.bottom + 16} />

      {hasAddedTask && (
        <Button
          onPress={handleSignUp}
          className="absolute left-4 right-4"
          style={{ bottom: insets.bottom + 80 }}
        >
          <Text>Sign Up to Save Tasks</Text>
        </Button>
      )}
    </SafeAreaView>
  );
}
