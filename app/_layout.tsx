import { SplashScreenController } from "@/components/splash-screen-controller";
import { ConcertOne_400Regular } from "@expo-google-fonts/concert-one";
import { Modak_400Regular } from "@expo-google-fonts/modak";
import {
  Poppins_200ExtraLight,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import { ShareIntentProvider } from "expo-share-intent";

import AuthProvider from "@/providers/auth-provider";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before fonts are loaded
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        <AuthProvider>
          <SplashScreenController />
          <Slot />
        </AuthProvider>
      </ShareIntentProvider>
    </GestureHandlerRootView>
  );
}
