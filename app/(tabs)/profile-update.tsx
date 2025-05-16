import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
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

  return (
    <SafeAreaView style={styles.container}>
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
              <Text style={styles.headerButtonText}>Cancel</Text>
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
            disabled={isSubmitting}
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
          <TouchableOpacity onPress={handleImagePicker} disabled={isSubmitting}>
            <Text style={styles.editAvatarText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Controller
            control={control}
            name="firstName"
            rules={{ required: "First name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="First Name"
                editable={!isSubmitting}
              />
            )}
          />
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName.message}</Text>
          )}
        </View>
        <View style={styles.formGroup}>
          <Controller
            control={control}
            name="lastName"
            rules={{ required: "Last name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Last Name"
                editable={!isSubmitting}
              />
            )}
          />
          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName.message}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="City, Country"
                editable={!isSubmitting}
              />
            )}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio</Text>
          <View style={styles.bioInputContainer}>
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(text.slice(0, 150))}
                  value={value}
                  placeholder="150 characters"
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
  headerActivityIndicator: {
    marginHorizontal: Platform.OS === "ios" ? 8 : 16,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 4,
    marginTop: 4,
  },
});
