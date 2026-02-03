import { useAuth } from "@clerk/clerk-expo";
import { SplashScreen, Stack } from "expo-router";
import React from "react";

// TODO: Here we will need to add the protected routes
const RootNav = () => {
  const { isSignedIn, isLoaded } = useAuth();

  React.useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }
  return (
    <Stack>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default RootNav;
