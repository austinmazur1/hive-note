import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function ForgotPasswordScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <ForgotPasswordForm />
    </View>
  );
}