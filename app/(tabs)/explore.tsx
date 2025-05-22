import { ScrollView, StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Text } from "@/components/ui/text";

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ThemedView style={styles.titleContainer}>
          <Text className="text-3xl font-bold">Explore</Text>
        </ThemedView>
        <ThemedView style={styles.contentBox}>
          <Text>This is the explore tab. Add your content here.</Text>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  contentBox: {
    marginBottom: 16,
  },
});
