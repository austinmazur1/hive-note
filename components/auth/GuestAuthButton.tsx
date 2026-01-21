import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const GuestAuthButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.guestButton} onPress={onPress}>
      <Text style={styles.guestButtonText}>Continue as guest</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  guestButton: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    borderRadius: 100,
  },
  guestButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
export default GuestAuthButton;
