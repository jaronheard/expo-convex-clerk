import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { Stack, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, TextInput, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";

export default function OnboardingBio() {
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateProfile);
  const user = useQuery(api.users.getCurrentUser);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: { bio: user?.bio || "" },
  });
  const bioValue = watch("bio");

  const onSubmit = async (data: { bio: string }) => {
    await updateProfile({ bio: data.bio, onboarded: true });
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-6 text-2xl font-semibold">
          Tell us about yourself
        </Text>
        <Controller
          control={control}
          name="bio"
          rules={{ required: "Bio is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-3 h-30 w-full rounded-lg border border-gray-300 p-4 text-lg"
              placeholder="150 characters"
              value={value}
              onChangeText={(text) => onChange(text.slice(0, 150))}
              multiline
              maxLength={150}
              autoFocus
            />
          )}
        />
        <Text className="self-end text-xs text-gray-400 mb-2">
          {(bioValue || "").length}/150
        </Text>
        {errors.bio && (
          <Text className="mb-2 text-red-500">{errors.bio.message}</Text>
        )}
        <Button className="w-full" onPress={handleSubmit(onSubmit)}>
          <Text className="text-lg font-medium text-white">Finish</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
