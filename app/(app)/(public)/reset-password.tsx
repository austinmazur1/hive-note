import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { View } from "react-native";

export default function ResetPasswordScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <ResetPasswordForm />
    </View>
  );
}