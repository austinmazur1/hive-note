import AppleAuthButton from '@/components/auth/AppleAuthButton';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import GuestAuthButton from '@/components/auth/GuestAuthButton';
import { Fonts } from '@/constants/theme';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const insets = useSafeAreaInsets();

  const handleLogIn = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>

        <View style={styles.headerSection}>
          <Image
            source={require('@/assets/images/hive-note-logo-1.png')}
            style={styles.brandLogo}
          />
          <Animated.Text entering={FadeInDown} style={styles.tagline}>
            One space for everything that inspires you.
          </Animated.Text>
        </View>

        <View style={styles.buttonSection}>
          <Animated.View entering={FadeInDown.delay(100)}>
            <AppleAuthButton />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200)}>
            <GoogleAuthButton />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(300)}>
            <GuestAuthButton />
          </Animated.View>
        </View>

        <Animated.View
          style={[styles.footerSection, { paddingBottom: Math.max(insets.bottom, 24) }]}
          entering={FadeInDown.delay(400)}
        >
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.footerLink} onPress={handleLogIn}>
              Log in
            </Text>
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  brandLogo: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 20,
    fontFamily: Fonts.poppins,
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: 10,
  },
  buttonSection: {
    gap: 12,
    width: '100%',
    paddingBottom: 24,
  },
  footerSection: {
    alignItems: 'center',
    paddingTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  footerLink: {
    color: '#4285F4',
    fontWeight: '500',
  },
});
