import { DeleteAccountDialog } from '@/components/dialog';
import { Button } from '@/components/ui/button';
import SignOutButton from '@/features/auth/components/sign-out-button';
import { useAuth, useSession, useUser } from '@clerk/clerk-expo';
import { StyleSheet, Text, View } from 'react-native';

// TODO: Add a confirmation dialog before deleting the user
export function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { session } = useSession();

  const deleteUser = async () => {
    const token = await session?.getToken();
    if (!token) return;
    const response = await fetch('/api/user', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      await signOut();
    }
  };

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Text className="text-sm text-gray-500">{user?.emailAddresses[0]?.emailAddress}</Text>
      <SignOutButton />
      <DeleteAccountDialog
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        onCancel={() => {}}
        onContinue={deleteUser}>
        <Button>
          <Text>Delete User</Text>
        </Button>
      </DeleteAccountDialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
