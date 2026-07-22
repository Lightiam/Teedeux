import { Link, router } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../src/components/Button';
import { TextField } from '../../src/components/TextField';
import { useAuthStore } from '../../src/store/auth-store';
import { colors, radii, shadowWarm, spacing } from '../../src/theme';

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setError(undefined);
    setLoading(true);
    // Brief delay so the loading state is perceptible in the demo flow
    setTimeout(() => {
      const ok = login(email, password);
      setLoading(false);
      if (!ok) {
        setError('Invalid credentials. Use any email + password (4+ characters).');
        return;
      }
      const user = useAuthStore.getState().user;
      if (user?.role === 'SHOPPER') {
        router.replace('/shopper');
      } else {
        router.replace('/(tabs)');
      }
    }, 350);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.blobPrimary} pointerEvents="none" />
      <View style={styles.blobSecondary} pointerEvents="none" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <View style={styles.brandRow}>
              <ShoppingBag size={30} color={colors.primary} strokeWidth={2.2} />
              <Text style={styles.wordmark}>Teedeux</Text>
            </View>
            <Text style={styles.welcome}>Welcome back</Text>
            <Text style={styles.sub}>
              Access your pantry and track your fresh deliveries.
            </Text>
          </View>

          <View style={styles.card}>
            <TextField
              label="Email Address"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError(undefined);
              }}
              placeholder="hello@example.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <View style={styles.passwordWrap}>
              <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
                Forgot?
              </Link>
              <TextField
                label="Password"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setError(undefined);
                }}
                placeholder="••••••••"
                secureTextEntry
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={onSubmit}
                error={error}
                containerStyle={styles.passwordField}
              />
            </View>

            <Button
              title="Sign in"
              size="lg"
              fullWidth
              loading={loading}
              onPress={onSubmit}
              style={styles.cta}
            />

            <Text style={styles.hint}>
              Demo: any email + password (4+ chars). Use shopper@teedeux.com for
              shopper role.
            </Text>
          </View>

          <Text style={styles.footer}>
            New to Teedeux?{' '}
            <Link href="/(auth)/signup" style={styles.footerLink}>
              Create account
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  brand: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  wordmark: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 28,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  welcome: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 32,
    lineHeight: 40,
    color: colors.onSurface,
    letterSpacing: -0.3,
  },
  sub: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 17,
    lineHeight: 26,
    color: colors.onSurfaceVariant,
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.35)',
    ...shadowWarm.card,
  },
  passwordWrap: {
    position: 'relative',
  },
  forgotLink: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.primary,
  },
  passwordField: {
    marginBottom: spacing.lg,
  },
  cta: {
    borderRadius: radii.lg,
    marginTop: spacing.sm,
  },
  hint: {
    marginTop: spacing.lg,
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  footer: {
    marginTop: spacing.xl,
    textAlign: 'center',
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 15,
    color: colors.onSurfaceVariant,
  },
  footerLink: {
    fontFamily: 'HankenGrotesk_700Bold',
    color: colors.primary,
  },
  blobPrimary: {
    position: 'absolute',
    top: -80,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primary,
    opacity: 0.08,
  },
  blobSecondary: {
    position: 'absolute',
    bottom: -100,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.secondary,
    opacity: 0.1,
  },
});
