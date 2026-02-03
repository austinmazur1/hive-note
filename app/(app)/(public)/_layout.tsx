import { Stack } from 'expo-router';
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="sign-up"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{ headerShown: false, headerBackButtonMenuEnabled: true, headerBackButtonDisplayMode: 'minimal' }}
      />
      <Stack.Screen
        name="reset-password"
        options={{ headerShown: false, headerBackButtonMenuEnabled: true, headerBackButtonDisplayMode: 'minimal' }}
      />
    </Stack>
  );
};
export default Layout;
