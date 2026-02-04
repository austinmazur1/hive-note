import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(modal)/(items)/new-item" options={{
        presentation: "formSheet",
        sheetAllowedDetents: [1],
        title: "New Item",
        headerShadowVisible: false,
        sheetCornerRadius: 16,
        sheetGrabberVisible: true,
        sheetExpandsWhenScrolledToEdge: true,
        headerShown: false,
        contentStyle: {
          backgroundColor: '#fff',
        }
      }} />
    </Stack>
  );
};

export default Layout;