import { ScrollView, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";

export default function ExploreScreen() {
  return (
    <View className="bg-background" style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View className="bg-background" style={styles.titleContainer}>
          <Text className="text-3xl font-bold">Explore</Text>
        </View>
        <View className="bg-background" style={styles.contentBox}>
          <Text>This is the explore tab. Add your content here.</Text>
        </View>
      </ScrollView>
    </View>
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
