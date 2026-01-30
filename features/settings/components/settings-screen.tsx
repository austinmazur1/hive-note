import SignOutButton from "@/features/auth/components/social-buttons/sign-out-button";
import { useAuthContext } from "@/features/auth/hooks/use-auth-context";
import { StyleSheet, Text, View } from "react-native";

export function SettingsScreen() {
  const { session, profile } = useAuthContext();

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Text>{session?.user.email}</Text>
      <Text>{profile?.full_name}</Text>
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
