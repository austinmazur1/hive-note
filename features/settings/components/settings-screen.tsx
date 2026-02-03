import SignOutButton from "@/features/auth/components/sign-out-button";
import { useUser } from "@clerk/clerk-expo";
import { StyleSheet, Text, View } from "react-native";

export function SettingsScreen() {
  const { user } = useUser();
  console.log('user', user);

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Text className="text-sm text-gray-500">{user?.emailAddresses[0]?.emailAddress}</Text>
      <SignOutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
