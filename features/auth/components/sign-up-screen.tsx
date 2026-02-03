import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from "@/components/ui/text";
import { Fonts } from "@/constants/theme";
import { useSignUp } from '@clerk/clerk-expo';
import { router } from "expo-router";
import { useRef, useState } from "react";
import { type TextInput, Image, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeInDown } from "react-native-reanimated";
import { SocialConnections } from "./social-connections";

export function SignUpScreen() {
  const { signUp, isLoaded } = useSignUp();
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordInputRef = useRef<TextInput>(null);

  const onEmailSubmitEditing = () => {
    passwordInputRef.current?.focus();
  }

  const handleLogIn = () => {
    router.replace("/");
  };

  const onSubmit = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      router.push(`/(app)/(public)/sign-up/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err instanceof Error) {
        const isEmailMessage =
          err.message.toLowerCase().includes('identifier') ||
          err.message.toLowerCase().includes('email');
        setError(isEmailMessage ? { email: err.message } : { password: err.message });
        return;
      }
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16 }}>
        <View className="flex-1 justify-center items-center pt-10">
          <Image
            source={require("@/assets/images/hive-note-logo-1.png")}
            style={styles.brandLogo}
          />
          <Animated.Text entering={FadeInDown} className="text-2xl font-poppins text-center leading-8 px-10">
            One space for everything that inspires you.
          </Animated.Text>
        </View>

        <View className="gap-6 w-full pb-6">
          <View className="gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onSubmitEditing={onEmailSubmitEditing}
              returnKeyType="next"
              submitBehavior="submit"
            />
            {error.email ? (
              <Text className="text-sm font-medium text-destructive">{error.email}</Text>
            ) : null}
          </View>
          <View className="gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              ref={passwordInputRef}
              id="password"
              placeholder="Choose a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="send"
              onSubmitEditing={onSubmit}
            />
            {error.password ? (
              <Text className="text-sm font-medium text-destructive">{error.password}</Text>
            ) : null}
          </View>
          <Button className="w-full" onPress={onSubmit}>
            <Text>Continue</Text>
          </Button>

          <View className="flex-row items-center gap-3 w-full py-2">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-sm text-muted-foreground">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>
          <SocialConnections />
        </View>

        <Animated.View
          className="items-center pt-4 pb-safe"
          entering={FadeInDown.delay(400)}
        >
          <Text className="text-sm text-gray-500">
            Already have an account?{" "}
            <Text className="text-blue-500 font-medium" onPress={handleLogIn}>
              Log in
            </Text>
          </Text>
        </Animated.View>
      </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  brandLogo: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
    marginBottom: 16,
  },
  tagline: {
    fontFamily: Fonts.poppins,
  },
});
