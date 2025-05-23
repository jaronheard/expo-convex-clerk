import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useQuery } from "convex-helpers/react/cache";
import { useMutation } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, View } from "react-native";
import { api } from "../../convex/_generated/api";

export default function OnboardingLastName() {
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateProfile);
  const user = useQuery(api.users.getCurrentUser);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { lastName: user?.lastName || "" },
  });

  const onSubmit = async (data: { lastName: string }) => {
    await updateProfile({ lastName: data.lastName, onboarded: false });
    router.replace("./location");
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-6 text-2xl font-semibold">
          What&apos;s your last name?
        </Text>
        <Controller
          control={control}
          name="lastName"
          rules={{ required: "Last name is required" }}
          render={({ field: { onChange, value } }) => (
            <Input
              className="mb-3 w-full"
              placeholder="Last Name"
              value={value}
              onChangeText={onChange}
              autoFocus
            />
          )}
        />
        {errors.lastName && (
          <Text className="mb-2 text-red-500">{errors.lastName.message}</Text>
        )}
        <Button className="w-full" onPress={handleSubmit(onSubmit)}>
          <Text className="text-lg font-medium text-white">Next</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
