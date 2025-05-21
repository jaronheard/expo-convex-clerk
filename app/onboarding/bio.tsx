import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
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
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.content}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Controller
          control={control}
          name="bio"
          rules={{ required: "Bio is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="150 characters"
              value={value}
              onChangeText={(text) => onChange(text.slice(0, 150))}
              multiline
              maxLength={150}
              autoFocus
            />
          )}
        />
        <Text style={styles.charCount}>{(bioValue || "").length}/150</Text>
        {errors.bio && <Text style={styles.error}>{errors.bio.message}</Text>}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Finish</Text>
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
  textArea: { height: 120, textAlignVertical: "top" },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#aaa",
    marginBottom: 8,
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
