import { ThemedView } from "@/components/ThemedView";
import { Text } from "@/components/ui/text";
import { useQuery } from "convex-helpers/react/cache";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";
import {
  ActivityIndicator,
  Alert,
  Platform,
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
    <ThemedView className="flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.navigate("/(tabs)/profile")}
              className="py-2.5"
              style={{ paddingHorizontal: Platform.OS === "ios" ? 8 : 16 }}
              disabled={loading}
            >
              <Text className="text-[17px] text-[#8e8e93]">Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () =>
            loading ? (
              <ActivityIndicator
                style={{
                  marginHorizontal: Platform.OS === "ios" ? 8 : 16,
                  paddingVertical: 10,
                }}
                color="#007AFF"
              />
            ) : (
              <TouchableOpacity
                onPress={handleSubmit(handleUpdate)}
                disabled={loading}
                className="py-2.5"
                style={{ paddingHorizontal: Platform.OS === "ios" ? 8 : 16 }}
              >
                <Text
                  className={clsx(
                    "text-[17px] font-semibold text-[#007AFF]",
                    loading && "text-[#BDBDBD]",
                  )}
                >
                  Save
                </Text>
              </TouchableOpacity>
            ),
          headerStyle: headerStyle,
        }}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 40,
          gap: 16,
        }}
        bounces={false}
      >
        <ThemedView className="items-center mb-6">
          <TouchableOpacity
            className="relative mb-2 items-center justify-center rounded-full"
            style={{ width: 100, height: 100 }}
            onPress={handleImagePicker}
            disabled={isSubmitting}
          >
            <Image
              source={{
                uri: avatarUri,
              }}
              className="rounded-full"
              style={{ width: 100, height: 100 }}
            />
            <ThemedView className="absolute inset-0 items-center justify-center rounded-full bg-black/20">
              <Text style={{ fontSize: 24 }}>📷</Text>
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePicker} disabled={isSubmitting}>
            <Text className="text-base font-medium text-[#007AFF]">Edit</Text>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView>
          <Controller
            control={control}
            name="firstName"
            rules={{ required: "First name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full rounded-xl p-4 text-base"
                style={{ color: textColor, backgroundColor: inputBackgroundColor }}
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
            <Text className="ml-1 mt-1 text-xs text-red-500">
              {errors.firstName.message}
            </Text>
          )}
        </ThemedView>
        <ThemedView>
          <Controller
            control={control}
            name="lastName"
            rules={{ required: "Last name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full rounded-xl p-4 text-base"
                style={{ color: textColor, backgroundColor: inputBackgroundColor }}
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
            <Text className="ml-1 mt-1 text-xs text-red-500">
              {errors.lastName.message}
            </Text>
          )}
        </ThemedView>

        <ThemedView>
          <Text className="mb-1.5 ml-1 text-sm font-normal">Location</Text>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full rounded-xl p-4 text-base"
                style={{ color: textColor, backgroundColor: inputBackgroundColor }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="City, Country"
                placeholderTextColor={placeholderTextColor}
                editable={!isSubmitting}
              />
            )}
          />
        </ThemedView>

        <ThemedView>
          <Text className="mb-1.5 ml-1 text-sm font-normal">Bio</Text>
          <ThemedView className="relative">
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="h-30 w-full rounded-xl p-4 text-base"
                  style={{
                    color: textColor,
                    backgroundColor: inputBackgroundColor,
                    textAlignVertical: "top",
                  }}
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
            <Text className="absolute bottom-2.5 right-2.5 text-xs">
              {(bioValue || "").length}/150
            </Text>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

