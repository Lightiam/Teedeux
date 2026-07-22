import React, { useEffect, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Check,
  MapPin,
  Navigation,
  Package,
  Truck,
} from 'lucide-react-native';
import { Badge } from '@/src/components/Badge';
import { Button } from '@/src/components/Button';
import { formatAddress, formatCents, formatRelativeTime } from '@/src/lib/format';
import { useOrderStore } from '@/src/store/order-store';
import type { OrderStatus } from '@/src/types';
import { colors, radii, spacing } from '@/src/theme';

const LOCAL_STEPS: OrderStatus[] = [
  'CONFIRMED',
  'SHOPPING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

const SHIP_STEPS: OrderStatus[] = [
  'CONFIRMED',
  'LABEL_CREATED',
  'SHIPPED',
  'DELIVERED',
];

export default function OrderTrackingScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === id));
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  const steps =
    order?.fulfillmentType === 'NATIONWIDE_SHIPPING' ? SHIP_STEPS : LOCAL_STEPS;

  const stepIndex = useMemo(() => {
    if (!order) return 0;
    const idx = steps.indexOf(order.status);
    return idx >= 0 ? idx : 0;
  }, [order, steps]);

  // Demo: auto-advance local orders slowly while viewing
  useEffect(() => {
    if (!order) return;
    if (order.status === 'DELIVERED') return;
    const timer = setTimeout(() => {
      const next = steps[stepIndex + 1];
      if (next) updateOrderStatus(order.id, next);
    }, 8000);
    return () => clearTimeout(timer);
  }, [order, stepIndex, steps, updateOrderStatus]);

  if (!order) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.missing}>Order not found</Text>
        <Button title="Go to orders" onPress={() => router.replace('/(tabs)/orders')} />
      </View>
    );
  }

  const isLocal = order.fulfillmentType === 'LOCAL_DELIVERY';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft color={colors.primary} size={22} />
        </Pressable>
        <Text style={styles.title}>{order.orderNumber}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 48 }}>
        <View style={styles.hero}>
          {isLocal ? (
            <Truck color={colors.secondary} size={36} />
          ) : (
            <Package color={colors.primary} size={36} />
          )}
          <Text style={styles.heroTitle}>
            {order.status === 'DELIVERED'
              ? 'Delivered'
              : isLocal
                ? 'Live local delivery'
                : 'Package on the way'}
          </Text>
          <Badge
            label={order.status.replaceAll('_', ' ')}
            tone={order.status === 'DELIVERED' ? 'secondary' : 'primary'}
          />
          <Text style={styles.heroMeta}>
            Updated {formatRelativeTime(order.updatedAt)}
          </Text>
        </View>

        <View style={styles.timeline}>
          {steps.map((step, i) => {
            const done = i <= stepIndex;
            const current = i === stepIndex;
            return (
              <View key={step} style={styles.stepRow}>
                <View style={styles.rail}>
                  <View
                    style={[
                      styles.dot,
                      done && styles.dotDone,
                      current && styles.dotCurrent,
                    ]}
                  >
                    {done ? <Check color={colors.onPrimary} size={12} /> : null}
                  </View>
                  {i < steps.length - 1 ? (
                    <View style={[styles.line, i < stepIndex && styles.lineDone]} />
                  ) : null}
                </View>
                <View style={styles.stepBody}>
                  <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>
                    {step.replaceAll('_', ' ')}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {!isLocal && order.trackingNumber ? (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Tracking</Text>
            <Text style={styles.tracking}>
              {order.shippingCarrier ?? 'Carrier'} · {order.trackingNumber}
            </Text>
          </View>
        ) : null}

        {isLocal ? (
          <View style={styles.mapPlaceholder}>
            <Navigation color={colors.secondary} size={28} />
            <Text style={styles.mapText}>GPS tracking active for shopper</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.addrRow}>
            <MapPin color={colors.primary} size={18} />
            <Text style={styles.cardLabel}>Delivering to</Text>
          </View>
          <Text style={styles.addr}>{formatAddress(order.deliveryAddress)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Items · {order.storeName}</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.quantity}× {item.productName}
              </Text>
              <Text style={styles.itemPrice}>
                {formatCents(item.unitPriceCents * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {formatCents(order.fees.totalCents)}
            </Text>
          </View>
        </View>

        {order.status !== 'DELIVERED' ? (
          <Button
            title="Advance status (demo)"
            variant="outline"
            fullWidth
            onPress={() => {
              const next = steps[stepIndex + 1];
              if (next) updateOrderStatus(order.id, next);
            }}
          />
        ) : null}
      </ScrollView>
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
    fontSize: 18,
    color: colors.primary,
  },
  missing: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: spacing.xl,
    backgroundColor: colors.savannaSand,
    borderRadius: radii.xl,
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 22,
    color: colors.onSurface,
  },
  heroMeta: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  timeline: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  stepRow: { flexDirection: 'row', minHeight: 52 },
  rail: { width: 28, alignItems: 'center' },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  dotCurrent: {
    borderColor: colors.primary,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: 2,
  },
  lineDone: { backgroundColor: colors.secondary },
  stepBody: { flex: 1, paddingLeft: 8, paddingTop: 2 },
  stepLabel: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 15,
    color: colors.onSurfaceVariant,
    textTransform: 'capitalize',
  },
  stepLabelDone: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    color: colors.onSurface,
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  tracking: {
    marginTop: 6,
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 13,
    color: colors.onSurface,
  },
  mapPlaceholder: {
    height: 140,
    borderRadius: radii.xl,
    backgroundColor: 'rgba(59,105,52,0.08)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  mapText: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    color: colors.secondary,
  },
  addrRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addr: {
    marginTop: 8,
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 15,
    color: colors.onSurface,
    lineHeight: 22,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  itemName: {
    flex: 1,
    fontFamily: 'HankenGrotesk_400Regular',
    color: colors.onSurface,
  },
  itemPrice: {
    fontFamily: 'JetBrainsMono_500Medium',
    color: colors.onSurface,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    marginTop: 12,
    paddingTop: 12,
  },
  totalLabel: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 16,
  },
  totalValue: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 18,
    color: colors.primary,
  },
});
