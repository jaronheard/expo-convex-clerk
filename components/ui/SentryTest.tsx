import * as Sentry from "@sentry/react-native";
import React from "react";
import { Button, View } from "react-native";

export function SentryTest() {
  return (
    <View style={{ padding: 10 }}>
      <Button
        title="Test Sentry Error"
        onPress={() => {
          Sentry.captureException(new Error("Test error from SoonList"));
        }}
      />
    </View>
  );
}
