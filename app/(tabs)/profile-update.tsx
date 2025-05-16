import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../convex/_generated/api";

export default function ProfileUpdateScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [imagePickerAsset, setImagePickerAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  // Convex functions
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const sendImage = useMutation(api.upload.sendImage);

  // Load user data when available
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setLocation(user.location || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagePickerAsset(result.assets[0]);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      let avatarUrlId = user?.avatarUrlId;

      // Upload image if selected
      if (imagePickerAsset) {
        const uploadUrl = await generateUploadUrl();

        // Prepare the image as a blob
        const response = await fetch(imagePickerAsset.uri);
        const blob = await response.blob();

        // Upload to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": imagePickerAsset.type || "image/jpeg" },
          body: blob,
        });

        const { storageId } = await result.json();
        await sendImage({ storageId });
        avatarUrlId = storageId;
      }

      // Update user profile
      await updateProfile({
        firstName,
        lastName,
        location,
        bio,
        avatarUrlId,
      });

      router.back();
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const avatarUri =
    imagePickerAsset?.uri ||
    user?.avatarUrl ||
    "https://placehold.co/100x100/e0e0e0/a0a0a0?text=%20";

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
          <TouchableOpacity
            style={styles.avatarPlaceholder}
            onPress={handleImagePicker}
          >
            <Image
              source={{
                uri: avatarUri,
              }}
              style={styles.avatarImage}
            />
            <View style={styles.cameraIconPlaceholder}>
              <Text style={{ fontSize: 24 }}>📷</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePicker}>
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
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="City, Country"
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
