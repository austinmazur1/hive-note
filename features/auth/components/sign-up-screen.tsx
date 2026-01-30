import { Text } from "@/components/ui/text";
import { Fonts } from "@/constants/theme";
import GoogleAuthButton from "@/features/auth/components/GoogleAuthButton";
import GuestAuthButton from "@/features/auth/components/GuestAuthButton";
import AppleSignInButton from "@/features/auth/components/social-buttons/apple/apple-sign-in-button.ios";
import { router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export function SignUpScreen() {
  const handleLogIn = () => {
    router.replace("/login");
  };

  const handleGuestAuth = () => {
    router.replace("/home");
  };

  return (
    <View className="flex-1">
      <View className="flex-1 px-6">
        <View className="flex-1 justify-center items-center pt-10">
          <Image
            source={require("@/assets/images/hive-note-logo-1.png")}
            style={styles.brandLogo}
          />
          <Animated.Text entering={FadeInDown} className="text-2xl font-poppins text-center leading-8 px-10">
            One space for everything that inspires you.
          </Animated.Text>
        </View>

        <View className="gap-3 w-full pb-6">
          <Animated.View entering={FadeInDown.delay(100)}>
            <AppleSignInButton />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200)}>
            <GoogleAuthButton />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(300)}>
            <GuestAuthButton onPress={handleGuestAuth} />
          </Animated.View>
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
      </View>
    </View>
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
