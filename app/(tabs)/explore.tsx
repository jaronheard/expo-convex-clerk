import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Explore</ThemedText>
        </ThemedView>
        <ThemedView style={styles.contentBox}>
          <ThemedText>
            This is the explore tab. Add your content here.
          </ThemedText>
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
