import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileUpdateScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hometown, setHometown] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              style={styles.headerButton}
            >
              <Text
                style={[
                  styles.headerButtonText,
                  styles.saveButtonTextHeader,
                  isSaving && styles.disabledButtonText,
                ]}
              >
                {isSaving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder}>
            <Image
              source={{
                uri: "https://placehold.co/100x100/e0e0e0/a0a0a0?text=%20",
              }}
              style={styles.avatarImage}
            />
            <View style={styles.cameraIconPlaceholder}>
              <Text style={{ fontSize: 24 }}>📷</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              /* Handle image picking */
            }}
          >
            <Text style={styles.editAvatarText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Hometown</Text>
          <TextInput
            style={styles.input}
            value={hometown}
            onChangeText={setHometown}
            placeholder="City, State"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio</Text>
          <View style={styles.bioInputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={(text) => setBio(text.slice(0, 150))}
              placeholder="150 characters"
              multiline
              maxLength={150}
            />
            <Text style={styles.charCount}>{bio.length}/150</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerButton: {
    paddingHorizontal: Platform.OS === "ios" ? 8 : 16,
    paddingVertical: 10,
  },
  headerButtonText: {
    fontSize: 17,
    color: "#007AFF",
  },
  saveButtonTextHeader: {
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#BDBDBD",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconPlaceholder: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 50,
  },
  editAvatarText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  formGroup: {},
  label: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  bioInputContainer: {
    position: "relative",
  },
  charCount: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 12,
    color: "#aaa",
  },
});
