import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuthStore } from '@/src/store/auth-store';
import { colors, spacing } from '@/src/theme';

/**
 * Entry splash — routes users after auth hydration.
 */
export default function IndexGate() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const user = useAuthStore((s) => s.user);
  const hasOnboarded = useAuthStore((s) => s.hasOnboarded);

  useEffect(() => {
    if (!isHydrated) return;
    const t = setTimeout(() => {
      if (!hasOnboarded) {
        router.replace('/(auth)/onboarding');
        return;
      }
      if (!user) {
        router.replace('/(auth)/login');
        return;
      }
      if (user.role === 'SHOPPER') {
        router.replace('/shopper');
        return;
      }
      router.replace('/(tabs)');
    }, 900);
    return () => clearTimeout(t);
  }, [isHydrated, user, hasOnboarded]);

  return (
    <LinearGradient
      colors={['#9c3f00', '#c45100', '#3b6934']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}
    >
      <Text style={styles.brand}>Teedeux</Text>
      <Text style={styles.tag}>African groceries · Local + Nationwide</Text>
      <ActivityIndicator color={colors.white} style={{ marginTop: spacing.xl }} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  brand: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 48,
    color: colors.white,
    letterSpacing: -1,
  },
  tag: {
    marginTop: spacing.sm,
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
  },
});
