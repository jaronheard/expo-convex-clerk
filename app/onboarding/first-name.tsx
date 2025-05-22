import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { Stack, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, TextInput, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";

export default function OnboardingFirstName() {
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateProfile);
  const user = useQuery(api.users.getCurrentUser);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { firstName: user?.firstName || "" },
  });

  const onSubmit = async (data: { firstName: string }) => {
    await updateProfile({ firstName: data.firstName, onboarded: false });
    router.replace("./last-name");
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-6 text-2xl font-semibold">
          What&apos;s your first name?
        </Text>
        <Controller
          control={control}
          name="firstName"
          rules={{ required: "First name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-3 w-full rounded-lg border border-gray-300 p-4 text-lg"
              placeholder="First Name"
              value={value}
              onChangeText={onChange}
              autoFocus
            />
          )}
        />
        {errors.firstName && (
          <Text className="mb-2 text-red-500">{errors.firstName.message}</Text>
        )}
        <Button className="w-full" onPress={handleSubmit(onSubmit)}>
          <Text className="text-lg font-medium text-white">Next</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
