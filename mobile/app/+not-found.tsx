import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/src/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops', headerShown: true }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn’t exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to Teedeux home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 22,
    color: colors.onSurface,
  },
  link: { marginTop: spacing.lg },
  linkText: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 16,
    color: colors.primary,
  },
});
