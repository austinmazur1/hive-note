import { Stack } from "expo-router";
import React from "react";

import { useAuthContext } from "@/features/auth/hooks/use-auth-context";
// TODO: Here we will need to add the protected routes
const RootNav = () => {
  const { isLoggedIn } = useAuthContext();
  console.log("isLoggedIn", isLoggedIn);
  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default RootNav;
