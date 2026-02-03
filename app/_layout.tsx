import '@/global.css';

import { SplashScreenController } from "@/components/splash-screen-controller";
import { NAV_THEME } from '@/lib/theme';

import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { PortalHost } from '@rn-primitives/portal';

import { ConcertOne_400Regular } from "@expo-google-fonts/concert-one";
import { Modak_400Regular } from "@expo-google-fonts/modak";
import {
  Poppins_200ExtraLight,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import { ShareIntentProvider } from "expo-share-intent";
import { useColorScheme } from 'nativewind';

// import AuthProvider from "@/providers/auth-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

// Prevent the splash screen from auto-hiding before fonts are loaded
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  console.log("colorScheme", colorScheme);
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Modak_400Regular,
    ConcertOne_400Regular,
    Poppins_400Regular,
    Poppins_200ExtraLight,
  });

  // useEffect(() => {
  //   if (fontsLoaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'dark']}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
      <ShareIntentProvider
        options={{
          debug: true,
          resetOnBackground: true,
          onResetShareIntent: () =>
            // used when app going in background and when the reset button is pressed
            router.replace({
              pathname: "/home",
            }),
        }}
      >
          <SplashScreenController />
          <Slot />
          <PortalHost />
      </ShareIntentProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
    </ThemeProvider>
    </ClerkProvider>
  );
}
