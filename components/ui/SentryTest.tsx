import * as Sentry from "@sentry/react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export function SentryTest() {
  return (
    <View className="p-[10px]">
      <Button
        onPress={() => {
          Sentry.captureException(new Error("Test error from SoonList"));
        }}
      >
        <Text>Test Sentry Error</Text>
      </Button>
    </View>
  );
}
