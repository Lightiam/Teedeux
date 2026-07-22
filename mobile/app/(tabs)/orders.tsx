import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PackageOpen } from 'lucide-react-native';
import { Screen } from '@/src/components/Screen';
import { Badge } from '@/src/components/Badge';
import { Button } from '@/src/components/Button';
import { useAuthStore } from '@/src/store/auth-store';
import { useOrderStore } from '@/src/store/order-store';
import { formatCents, formatRelativeTime } from '@/src/lib/format';
import {
  FULFILLMENT_LABELS,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from '@/src/types';
import { colors, radii, shadowWarm, spacing } from '@/src/theme';

function statusTone(
  status: OrderStatus
): 'primary' | 'secondary' | 'tertiary' | 'muted' | 'danger' {
  switch (status) {
    case 'DELIVERED':
      return 'secondary';
    case 'CANCELLED':
    case 'REFUNDED':
      return 'danger';
    case 'OUT_FOR_DELIVERY':
    case 'SHOPPING':
    case 'READY_FOR_DELIVERY':
      return 'primary';
    case 'SHIPPED':
    case 'LABEL_CREATED':
      return 'tertiary';
    default:
      return 'muted';
  }
}

export default function OrdersScreen() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);
  const getOrdersForUser = useOrderStore((s) => s.getOrdersForUser);

  const userOrders = useMemo(() => {
    if (!user?.id) return [];
    const list = getOrdersForUser(user.id);
    return list.length > 0
      ? list
      : orders.filter((o) => o.userId === user.id);
  }, [user?.id, orders, getOrdersForUser]);

  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.title}>Orders</Text>
      <Text style={styles.subtitle}>Track local deliveries and shipments</Text>

      {userOrders.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <PackageOpen color={colors.primary} size={36} strokeWidth={1.8} />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyBody}>
            When you check out, your local and shipped orders will show up here.
          </Text>
          <Button
            title="Start shopping"
            onPress={() => router.push('/(tabs)')}
            style={{ marginTop: spacing.md }}
          />
        </View>
      ) : (
        <View style={styles.list}>
          {userOrders.map((order) => (
            <Pressable
              key={order.id}
              onPress={() => router.push(`/order/${order.id}`)}
              style={({ pressed }) => [
                styles.row,
                pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
              ]}
            >
              <View style={styles.rowTop}>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Badge
                  label={ORDER_STATUS_LABELS[order.status]}
                  tone={statusTone(order.status)}
                />
              </View>
              <Text style={styles.storeName} numberOfLines={1}>
                {order.storeName}
              </Text>
              <View style={styles.rowBottom}>
                <Text style={styles.meta}>
                  {FULFILLMENT_LABELS[order.fulfillmentType]}
                </Text>
                <Text style={styles.meta}>
                  {formatRelativeTime(order.createdAt)}
                </Text>
              </View>
              <Text style={styles.total}>
                {formatCents(order.fees.totalCents)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  title: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 28,
    color: colors.primary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: -4,
  },
  list: { gap: spacing.md, marginTop: spacing.sm },
  row: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.4)',
    gap: 6,
    ...shadowWarm.raised,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  orderNumber: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 13,
    color: colors.onSurface,
  },
  storeName: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 16,
    color: colors.onSurface,
  },
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  meta: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  total: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 18,
    color: colors.primary,
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 20,
    color: colors.onSurface,
  },
  emptyBody: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
});
