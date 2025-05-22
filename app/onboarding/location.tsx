import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { Stack, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, TextInput, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";

export default function OnboardingLocation() {
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateProfile);
  const user = useQuery(api.users.getCurrentUser);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { location: user?.location || "" },
  });

  const onSubmit = async (data: { location: string }) => {
    await updateProfile({ location: data.location, onboarded: false });
    router.replace("./bio");
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-6 text-2xl font-semibold">
          Where are you located?
        </Text>
        <Controller
          control={control}
          name="location"
          rules={{ required: "Location is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-3 w-full rounded-lg border border-gray-300 p-4 text-lg"
              placeholder="City, Country"
              value={value}
              onChangeText={onChange}
              autoFocus
            />
          )}
        />
        {errors.location && (
          <Text className="mb-2 text-red-500">{errors.location.message}</Text>
        )}
        <Button className="w-full" onPress={handleSubmit(onSubmit)}>
          <Text className="text-lg font-medium text-white">Next</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
