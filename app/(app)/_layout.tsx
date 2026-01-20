import { Stack } from 'expo-router'
import React from 'react'

// TODO: Here we will need to add the protected routes
const RootNav = () => {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(public)" options={{ headerShown: false }} />
    </Stack>
  )
}

export default RootNav