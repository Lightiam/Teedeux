import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, Package, Truck } from 'lucide-react-native';
import { Button } from '@/src/components/Button';
import { formatCents } from '@/src/lib/format';
import { useOrderStore } from '@/src/store/order-store';
import { colors, radii, spacing } from '@/src/theme';

export default function OrderConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const { ids } = useLocalSearchParams<{ ids?: string }>();
  const orders = useOrderStore((s) => s.orders);

  const created = useMemo(() => {
    const idList = (ids ?? '').split(',').filter(Boolean);
    return idList
      .map((id) => orders.find((o) => o.id === id))
      .filter(Boolean) as typeof orders;
  }, [ids, orders]);

  const total = created.reduce((sum, o) => sum + o.fees.totalCents, 0);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24 }]}>
      <CheckCircle2 color={colors.secondary} size={64} strokeWidth={1.75} />
      <Text style={styles.title}>Order placed</Text>
      <Text style={styles.copy}>
        {created.length > 1
          ? 'Your cart was split into local delivery and nationwide shipping.'
          : 'Your Teedeux order is confirmed.'}
      </Text>

      <View style={styles.list}>
        {created.map((order) => (
          <Pressable
            key={order.id}
            style={styles.card}
            onPress={() =>
              router.push({ pathname: '/order/[id]', params: { id: order.id } })
            }
          >
            <View style={styles.cardHead}>
              {order.fulfillmentType === 'LOCAL_DELIVERY' ? (
                <Truck color={colors.secondary} size={20} />
              ) : (
                <Package color={colors.primary} size={20} />
              )}
              <Text style={styles.orderNo}>{order.orderNumber}</Text>
            </View>
            <Text style={styles.meta}>
              {order.fulfillmentType === 'LOCAL_DELIVERY'
                ? 'Local same-day'
                : 'Nationwide shipping'}{' '}
              · {order.status.replaceAll('_', ' ')}
            </Text>
            <Text style={styles.amount}>{formatCents(order.fees.totalCents)}</Text>
          </Pressable>
        ))}
      </View>

      {created.length > 0 ? (
        <Text style={styles.total}>Total {formatCents(total)}</Text>
      ) : null}

      <View style={styles.actions}>
        {created[0] ? (
          <Button
            title="Track order"
            fullWidth
            size="lg"
            onPress={() =>
              router.replace({
                pathname: '/order/[id]',
                params: { id: created[0].id },
              })
            }
          />
        ) : null}
        <Button
          title="Back to home"
          fullWidth
          variant="outline"
          onPress={() => router.replace('/(tabs)')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    marginTop: spacing.lg,
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 28,
    color: colors.onSurface,
  },
  copy: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
  },
  list: { width: '100%', marginTop: spacing.xl, gap: spacing.md },
  card: {
    width: '100%',
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderNo: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 17,
    color: colors.onSurface,
  },
  meta: {
    marginTop: 6,
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textTransform: 'capitalize',
  },
  amount: {
    marginTop: 8,
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 18,
    color: colors.primary,
  },
  total: {
    marginTop: spacing.lg,
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  actions: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
});
