import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, CreditCard, Smartphone } from 'lucide-react-native';
import { DEMO_PAYMENT_METHODS } from '@/src/data/catalog';
import { useAppStore } from '@/src/store/app-store';
import { colors, radii, spacing } from '@/src/theme';

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const selected = useAppStore((s) => s.selectedPaymentMethodId);
  const setPayment = useAppStore((s) => s.setPayment);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft color={colors.primary} size={22} />
        </Pressable>
        <Text style={styles.title}>Payment methods</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.hint}>
          Stripe Connect will split payouts to vendors and shoppers in production.
        </Text>
        {DEMO_PAYMENT_METHODS.map((pm) => {
          const on = selected === pm.id;
          return (
            <Pressable
              key={pm.id}
              onPress={() => {
                setPayment(pm.id);
                router.back();
              }}
              style={[styles.card, on && styles.cardOn]}
            >
              <View style={styles.icon}>
                {pm.type === 'APPLE_PAY' || pm.type === 'GOOGLE_PAY' ? (
                  <Smartphone color={colors.primary} size={22} />
                ) : (
                  <CreditCard color={colors.primary} size={22} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>
                  {pm.type === 'CARD'
                    ? `${pm.brand ?? 'Card'} ···· ${pm.last4}`
                    : pm.label}
                </Text>
                {pm.expiryMonth && pm.expiryYear ? (
                  <Text style={styles.meta}>
                    Exp {pm.expiryMonth}/{String(pm.expiryYear).slice(-2)}
                  </Text>
                ) : (
                  <Text style={styles.meta}>Express checkout</Text>
                )}
              </View>
              {on ? <Check color={colors.secondary} size={20} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 20,
    color: colors.primary,
  },
  body: { paddingHorizontal: spacing.lg },
  hint: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardOn: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFixed,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.savannaSand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 16,
    color: colors.onSurface,
  },
  meta: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
});
