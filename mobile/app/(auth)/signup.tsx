import { Link, router } from 'expo-router';
import { ShoppingBasket } from 'lucide-react-native';
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

export default function SignupScreen() {
  const signup = useAuthStore((s) => s.signup);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setError(undefined);
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (email.trim().length < 4 || password.length < 4) {
      setError('Email and password must be at least 4 characters.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = signup(name, email, password, phone);
      setLoading(false);
      if (!ok) {
        setError('Could not create account. Check your details and try again.');
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
      <View style={styles.sandWash} pointerEvents="none" />

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
          <View style={styles.brandRow}>
            <ShoppingBasket size={28} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.wordmark}>Teedeux</Text>
          </View>

          <View style={styles.intro}>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.sub}>Start your fresh food journey today.</Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Full Name"
              value={name}
              onChangeText={(t) => {
                setName(t);
                setError(undefined);
              }}
              placeholder="Kofi Mensah"
              autoCapitalize="words"
              textContentType="name"
              returnKeyType="next"
            />
            <TextField
              label="Email Address"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError(undefined);
              }}
              placeholder="kofi.m@example.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <TextField
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 555 000 0000"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              returnKeyType="next"
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setError(undefined);
              }}
              placeholder="••••••••"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="go"
              onSubmitEditing={onSubmit}
              error={error}
            />

            <Button
              title="Create account"
              size="lg"
              fullWidth
              loading={loading}
              onPress={onSubmit}
              style={styles.cta}
            />
          </View>

          <Text style={styles.footer}>
            Already have an account?{' '}
            <Link href="/(auth)/login" style={styles.footerLink}>
              Login
            </Link>
          </Text>

          <View style={styles.trust}>
            <Text style={styles.trustItem}>Secure checkout</Text>
            <View style={styles.trustDot} />
            <Text style={styles.trustItem}>Data encrypted</Text>
          </View>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sandWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: colors.savannaSand,
    opacity: 0.55,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  wordmark: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 26,
    color: colors.primary,
    letterSpacing: -0.4,
  },
  intro: {
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  title: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 24,
    lineHeight: 32,
    color: colors.onSurface,
  },
  sub: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
  },
  form: {
    gap: spacing.xs,
  },
  cta: {
    marginTop: spacing.md,
    borderRadius: radii.xl,
    ...shadowWarm.raised,
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
  trust: {
    marginTop: spacing.xxl,
    paddingTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(224,192,178,0.5)',
  },
  trustItem: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: 'rgba(88,66,56,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  trustDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
  },
});
