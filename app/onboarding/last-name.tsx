import { useMutation, useQuery } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.content}>
        <Text style={styles.title}>What&apos;s your last name?</Text>
        <Controller
          control={control}
          name="lastName"
          rules={{ required: "Last name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={value}
              onChangeText={onChange}
              autoFocus
            />
          )}
        />
        {errors.lastName && (
          <Text style={styles.error}>{errors.lastName.message}</Text>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    width: "100%",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    width: "100%",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "500" },
  error: { color: "red", marginBottom: 8 },
});
