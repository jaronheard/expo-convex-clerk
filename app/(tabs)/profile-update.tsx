import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { cn } from "@/lib/utils";
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
  TouchableOpacity,
  View,
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
  const { colorScheme } = useColorScheme();

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
  const theme = colorScheme ?? "light";
  const headerStyle = { backgroundColor: Colors[theme].background };

  return (
    <View className="bg-background flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.navigate("/(tabs)/profile")}
              className={cn(
                "py-[10px]",
                Platform.OS === "ios" ? "px-2" : "px-4",
              )}
              disabled={loading}
            >
              <Text className="text-[17px] text-[#8e8e93]">Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () =>
            loading ? (
              <ActivityIndicator
                className={cn(
                  Platform.OS === "ios" ? "mx-2" : "mx-4",
                  "py-[10px]",
                )}
                color="#007AFF"
              />
            ) : (
              <TouchableOpacity
                onPress={handleSubmit(handleUpdate)}
                disabled={loading}
                className={cn(
                  "py-[10px]",
                  Platform.OS === "ios" ? "px-2" : "px-4",
                )}
              >
                <Text
                  className={cn(
                    "text-[17px] text-[#007AFF] font-semibold",
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
        }}
        bounces={false}
      >
        <View className="bg-background items-center mb-6">
          <TouchableOpacity
            className="relative w-[100px] h-[100px] rounded-full justify-center items-center mb-2"
            onPress={handleImagePicker}
            disabled={isSubmitting}
          >
            <Image
              source={{
                uri: avatarUri,
              }}
              className="w-[100px] h-[100px] rounded-full"
            />
            <View className="absolute w-full h-full justify-center items-center bg-[rgba(0,0,0,0.2)] rounded-full">
              <Text className="text-[24px]">📷</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePicker} disabled={isSubmitting}>
            <Text className="text-base font-medium text-[#007AFF]">Edit</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-background">
          <Controller
            control={control}
            name="firstName"
            rules={{ required: "First name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="w-full mb-3"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="First Name"
                editable={!isSubmitting}
              />
            )}
          />
          {errors.firstName && (
            <Text className="text-red-600 text-xs ml-1 mt-1">
              {errors.firstName.message}
            </Text>
          )}
        </View>
        <View className="bg-background">
          <Controller
            control={control}
            name="lastName"
            rules={{ required: "Last name is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="w-full mb-3"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Last Name"
                editable={!isSubmitting}
              />
            )}
          />
          {errors.lastName && (
            <Text className="text-red-600 text-xs ml-1 mt-1">
              {errors.lastName.message}
            </Text>
          )}
        </View>
        <View className="bg-background">
          <Text className="text-sm font-normal mb-1.5 ml-1">Location</Text>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="w-full mb-3"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="City, Country"
                editable={!isSubmitting}
              />
            )}
          />
        </View>
        <View className="bg-background">
          <Text className="text-sm font-normal mb-1.5 ml-1">Bio</Text>
          <View className="bg-background relative">
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className="w-full h-[120px]"
                  onBlur={onBlur}
                  onChangeText={(text: string) => onChange(text.slice(0, 150))}
                  value={value}
                  placeholder="150 characters"
                  multiline
                  maxLength={150}
                  editable={!isSubmitting}
                />
              )}
            />
            <Text className="absolute bottom-[10px] right-[10px] text-xs">
              {(bioValue || "").length}/150
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
