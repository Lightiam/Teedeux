import { Link, router } from 'expo-router';
import { ArrowLeft, CheckCircle2, KeyRound, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../src/components/Button';
import { TextField } from '../../src/components/TextField';
import { colors, radii, shadowWarm, spacing } from '../../src/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    setError(undefined);
    if (email.trim().length < 4 || !email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setEmail('');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.blobPrimary} pointerEvents="none" />
      <View style={styles.blobSecondary} pointerEvents="none" />

      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        >
          <ArrowLeft size={22} color={colors.primary} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.topBrand}>Teedeux</Text>
        <View style={styles.topSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconWrap}>
            {sent ? (
              <CheckCircle2 size={40} color={colors.secondary} strokeWidth={1.8} />
            ) : (
              <KeyRound size={40} color={colors.primaryContainer} strokeWidth={1.8} />
            )}
          </View>

          <View style={styles.copy}>
            <Text style={styles.title}>
              {sent ? 'Check your inbox' : 'Reset Password'}
            </Text>
            <Text style={styles.sub}>
              {sent
                ? 'If an account exists for that email, we sent a reset link. (Demo — no email is actually sent.)'
                : "Enter your email address and we'll send you a link to reset your password."}
            </Text>
          </View>

          {!sent ? (
            <View style={styles.card}>
              <View style={styles.mailHint}>
                <Mail size={18} color={colors.onSurfaceVariant} />
                <Text style={styles.mailHintText}>Account email</Text>
              </View>
              <TextField
                label="Email Address"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setError(undefined);
                }}
                placeholder="name@example.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                error={error}
              />
              <Button
                title="Send reset link"
                size="lg"
                fullWidth
                loading={loading}
                onPress={onSubmit}
                style={styles.cta}
              />
              <Text style={styles.remember}>
                Remember your password?{' '}
                <Link href="/(auth)/login" style={styles.link}>
                  Sign In
                </Link>
              </Text>
            </View>
          ) : (
            <View style={styles.card}>
              <Button
                title="Back to sign in"
                size="lg"
                fullWidth
                onPress={() => router.replace('/(auth)/login')}
                style={styles.cta}
              />
              <Button
                title="Send another link"
                variant="ghost"
                fullWidth
                onPress={() => setSent(false)}
              />
            </View>
          )}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBrand: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 20,
    color: colors.primary,
  },
  topSpacer: { width: 40 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginBottom: spacing.xl,
    ...shadowWarm.raised,
  },
  copy: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 28,
    lineHeight: 36,
    color: colors.onSurface,
    textAlign: 'center',
  },
  sub: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.35)',
    ...shadowWarm.card,
  },
  mailHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  mailHintText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cta: {
    borderRadius: radii.lg,
    marginTop: spacing.sm,
  },
  remember: {
    marginTop: spacing.lg,
    textAlign: 'center',
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 15,
    color: colors.onSurfaceVariant,
  },
  link: {
    fontFamily: 'HankenGrotesk_700Bold',
    color: colors.primary,
  },
  blobPrimary: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primaryFixed,
    opacity: 0.35,
  },
  blobSecondary: {
    position: 'absolute',
    bottom: -80,
    left: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.secondaryContainer,
    opacity: 0.3,
  },
});
