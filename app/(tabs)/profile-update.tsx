import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useQuery } from "convex-helpers/react/cache";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Define Form Data Type
interface ProfileFormData {
  firstName: string;
  lastName: string;
  location: string;
  bio: string;
}

export default function ProfileUpdateScreen() {
  const router = useRouter();
  const [imagePickerAsset, setImagePickerAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const posthog = usePostHog();
  const colorScheme = useColorScheme();

  // Define dynamic colors based on colorScheme
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const inputBackgroundColor =
    colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
  const placeholderTextColor =
    colorScheme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)";

  // Convex functions
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const sendImage = useMutation(api.upload.sendImage);

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      location: "",
      bio: "",
    },
  });

  const bioValue = watch("bio");

  // Load user data into form when available
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        location: user.location || "",
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photos",
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

  const handleUpdate: SubmitHandler<ProfileFormData> = async (data) => {
    setLoading(true);

    try {
      let avatarUrlId: Id<"_storage"> | undefined;

      if (imagePickerAsset) {
        const url = await generateUploadUrl();
        const response = await fetch(imagePickerAsset.uri);
        const blob = await response.blob();

        const result = await fetch(url, {
          method: "POST",
          headers: imagePickerAsset.type
            ? { "Content-Type": `${imagePickerAsset.type}/*` }
            : {},
          body: blob,
        });

        const { storageId } = await result.json();
        await sendImage({ storageId });

        avatarUrlId = storageId;
      }

      await updateProfile({
        ...data,
        avatarUrlId,
      });
      posthog?.capture("profile_updated");

      router.navigate("/(tabs)/profile");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const avatarUri =
    imagePickerAsset?.uri ||
    user?.avatarUrl ||
    "https://placehold.co/100x100/e0e0e0/a0a0a0?text=%20";

  // Adjusted headerStyle to use dynamic background color or be transparent
  const headerStyle =
    colorScheme === "dark"
      ? { backgroundColor: "#1c1c1e" }
      : { backgroundColor: "#f2f2f7" };

  return (
    <View className="bg-background" style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.navigate("/(tabs)/profile")}
              style={styles.headerButton}
              disabled={loading}
            >
              <Text style={styles.cancelHeaderButtonText}>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () =>
            loading ? (
              <ActivityIndicator
                style={styles.headerActivityIndicator}
                color="#007AFF"
              />
            ) : (
              <TouchableOpacity
                onPress={handleSubmit(handleUpdate)}
                disabled={loading}
                style={styles.headerButton}
              >
                <Text
                  style={[
                    styles.headerButtonText,
                    styles.saveButtonTextHeader,
                    loading && styles.disabledButtonText,
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            ),
          headerStyle: headerStyle,
        }}
      />
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <View className="bg-background" style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarPlaceholder}
            onPress={handleImagePicker}
            disabled={isSubmitting}
          >
            <Image
              source={{
                uri: avatarUri,
              }}
              style={styles.avatarImage}
            />
            <View className="bg-background" style={styles.cameraIconPlaceholder}>
              <Text style={{ fontSize: 24 }}>📷</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePicker} disabled={isSubmitting}>
            <Text style={styles.editAvatarText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-background" style={styles.formGroup}>
          <Controller
            control={control}
            name="firstName"
            rules={{ required: "First name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, backgroundColor: inputBackgroundColor },
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="First Name"
                placeholderTextColor={placeholderTextColor}
                editable={!isSubmitting}
              />
            )}
          />
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName.message}</Text>
          )}
        </View>
        <View className="bg-background" style={styles.formGroup}>
          <Controller
            control={control}
            name="lastName"
            rules={{ required: "Last name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, backgroundColor: inputBackgroundColor },
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Last Name"
                placeholderTextColor={placeholderTextColor}
                editable={!isSubmitting}
              />
            )}
          />
          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName.message}</Text>
          )}
        </View>

        <View className="bg-background" style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { color: textColor, backgroundColor: inputBackgroundColor },
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="City, Country"
                placeholderTextColor={placeholderTextColor}
                editable={!isSubmitting}
              />
            )}
          />
        </View>

        <View className="bg-background" style={styles.formGroup}>
          <Text style={styles.label}>Bio</Text>
          <View className="bg-background" style={styles.bioInputContainer}>
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    { color: textColor, backgroundColor: inputBackgroundColor },
                  ]}
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(text.slice(0, 150))}
                  value={value}
                  placeholder="150 characters"
                  placeholderTextColor={placeholderTextColor}
                  multiline
                  maxLength={150}
                  editable={!isSubmitting}
                />
              )}
            />
            <Text style={styles.charCount}>{(bioValue || "").length}/150</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: Platform.OS === "ios" ? 8 : 16,
    paddingVertical: 10,
  },
  headerActivityIndicator: {
    marginHorizontal: Platform.OS === "ios" ? 8 : 16,
    paddingVertical: 10,
  },
  headerButtonText: {
    fontSize: 17,
    color: "#007AFF",
  },
  cancelHeaderButtonText: {
    fontSize: 17,
    color: "#8e8e93",
  },
  saveButtonTextHeader: {
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#BDBDBD",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 50,
  },
  editAvatarText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  formGroup: {
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    width: "100%",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  bioInputContainer: {
    position: "relative",
    backgroundColor: "transparent",
  },
  charCount: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 12,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 4,
    marginTop: 4,
  },
});
