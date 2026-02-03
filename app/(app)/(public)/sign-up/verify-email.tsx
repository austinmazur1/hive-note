import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";
import { View } from "react-native";

export default function VerifyEmailScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <VerifyEmailForm />
    </View>
  );
}