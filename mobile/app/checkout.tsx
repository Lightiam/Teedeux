import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  Truck,
} from 'lucide-react-native';
import { Badge } from '@/src/components/Badge';
import { Button } from '@/src/components/Button';
import { DEMO_PAYMENT_METHODS } from '@/src/data/catalog';
import { formatAddress, formatCents } from '@/src/lib/format';
import { useAppStore } from '@/src/store/app-store';
import {
  getFees,
  getLocalItems,
  getShippedItems,
  useCartStore,
} from '@/src/store/cart-store';
import { useOrderStore } from '@/src/store/order-store';
import { colors, radii, shadowWarm, spacing } from '@/src/theme';

const TIP_PRESETS = [0, 300, 500, 800];

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const items = useCartStore((s) => s.items);
  const tipCents = useCartStore((s) => s.tipCents);
  const setTip = useCartStore((s) => s.setTip);
  const clearCart = useCartStore((s) => s.clear);
  const address = useAppStore((s) => s.deliveryAddress);
  const paymentId = useAppStore((s) => s.selectedPaymentMethodId);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const [placing, setPlacing] = useState(false);

  const localItems = useMemo(() => getLocalItems(items), [items]);
  const shippedItems = useMemo(() => getShippedItems(items), [items]);
  const fees = useMemo(
    () => getFees(address ?? undefined, items, tipCents),
    [address, items, tipCents]
  );

  const payment = DEMO_PAYMENT_METHODS.find((p) => p.id === paymentId);
  const canPlace =
    items.length > 0 && !!address && !!paymentId && !placing;

  async function onPlaceOrder() {
    if (!address || !paymentId) return;
    setPlacing(true);
    try {
      const created = placeOrder({
        address,
        paymentMethodId: paymentId,
        tipCents,
        localItems,
        shippedItems,
        fees,
      });
      clearCart();
      const first = created[0];
      router.replace({
        pathname: '/order-confirmation',
        params: { ids: created.map((o) => o.id).join(',') },
      });
      if (!first) router.replace('/(tabs)/orders');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <ArrowLeft color={colors.primary} size={22} />
        </Pressable>
        <Text style={styles.title}>Final Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Hybrid checkout — fresh items stay local; dry goods ship nationwide.
        </Text>

        <Section
          icon={<Truck color={colors.secondary} size={20} />}
          title="Local Same-Day Delivery"
          badge={<Badge label="Today" tone="secondary" />}
        >
          {localItems.length === 0 ? (
            <Text style={styles.emptyLane}>No local items</Text>
          ) : (
            localItems.map((item) => (
              <LineItem
                key={item.id}
                name={item.product.name}
                meta={`${item.quantity} ${item.product.unit.toLowerCase()} · ${item.product.temperatureClass}`}
                cents={item.product.priceCents * item.quantity}
              />
            ))
          )}
        </Section>

        <Section
          icon={<Package color={colors.primary} size={20} />}
          title="Nationwide Shipped"
          badge={<Badge label="2–4 days" tone="primary" />}
        >
          {shippedItems.length === 0 ? (
            <Text style={styles.emptyLane}>No shipped items</Text>
          ) : (
            shippedItems.map((item) => (
              <LineItem
                key={item.id}
                name={item.product.name}
                meta={`${item.quantity}× · ${item.product.storeName}`}
                cents={item.product.priceCents * item.quantity}
              />
            ))
          )}
        </Section>

        <Pressable style={styles.card} onPress={() => router.push('/address')}>
          <View style={styles.cardRow}>
            <MapPin color={colors.primary} size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>Delivery address</Text>
              <Text style={styles.cardValue}>
                {address ? formatAddress(address) : 'Add address'}
              </Text>
            </View>
            <Text style={styles.edit}>Edit</Text>
          </View>
        </Pressable>

        <Pressable style={styles.card} onPress={() => router.push('/payment')}>
          <View style={styles.cardRow}>
            <CreditCard color={colors.primary} size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>Payment</Text>
              <Text style={styles.cardValue}>
                {payment
                  ? payment.type === 'CARD'
                    ? `${payment.brand ?? 'Card'} ···· ${payment.last4}`
                    : payment.label
                  : 'Add payment'}
              </Text>
            </View>
            <Text style={styles.edit}>Edit</Text>
          </View>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Tip for shopper</Text>
          <View style={styles.tipRow}>
            {TIP_PRESETS.map((t) => (
              <Pressable
                key={t}
                onPress={() => setTip(t)}
                style={[styles.tipChip, tipCents === t && styles.tipChipOn]}
              >
                <Text style={[styles.tipText, tipCents === t && styles.tipTextOn]}>
                  {t === 0 ? 'None' : formatCents(t)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.card, shadowWarm.raised]}>
          <FeeRow label="Subtotal" value={fees.subtotalCents} />
          <FeeRow label="Local delivery" value={fees.localDeliveryFeeCents} />
          <FeeRow label="Shipping" value={fees.shippingFeeCents} />
          <FeeRow label="Service fee" value={fees.serviceFeeCents} />
          <FeeRow label="Tax" value={fees.taxCents} />
          <FeeRow label="Tip" value={fees.tipCents} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCents(fees.totalCents)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          title={placing ? 'Placing…' : `Place order · ${formatCents(fees.totalCents)}`}
          fullWidth
          size="lg"
          loading={placing}
          disabled={!canPlace}
          onPress={onPlaceOrder}
        />
      </View>
    </View>
  );
}

function Section({
  icon,
  title,
  badge,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  badge: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHead}>
        <View style={styles.sectionTitleRow}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {badge}
      </View>
      {children}
    </View>
  );
}

function LineItem({
  name,
  meta,
  cents,
}: {
  name: string;
  meta: string;
  cents: number;
}) {
  return (
    <View style={styles.line}>
      <View style={{ flex: 1 }}>
        <Text style={styles.lineName}>{name}</Text>
        <Text style={styles.lineMeta}>{meta}</Text>
      </View>
      <Text style={styles.linePrice}>{formatCents(cents)}</Text>
    </View>
  );
}

function FeeRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.feeRow}>
      <Text style={styles.feeLabel}>{label}</Text>
      <Text style={styles.feeValue}>{value ? formatCents(value) : '—'}</Text>
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
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 22,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 15,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.4)',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 17,
    color: colors.onSurface,
  },
  emptyLane: {
    fontFamily: 'HankenGrotesk_400Regular',
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
  },
  lineName: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 15,
    color: colors.onSurface,
  },
  lineMeta: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  linePrice: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 15,
    color: colors.onSurface,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 15,
    color: colors.onSurface,
    marginTop: 2,
  },
  edit: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    color: colors.primary,
    fontSize: 14,
  },
  tipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  tipChip: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tipChipOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tipText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 13,
    color: colors.onSurface,
  },
  tipTextOn: { color: colors.onPrimary },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeLabel: {
    fontFamily: 'HankenGrotesk_400Regular',
    color: colors.onSurfaceVariant,
  },
  feeValue: {
    fontFamily: 'JetBrainsMono_500Medium',
    color: colors.onSurface,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 18,
    color: colors.onSurface,
  },
  totalValue: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 22,
    color: colors.primary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
    backgroundColor: colors.surfaceLowest,
    borderTopWidth: 1,
    borderTopColor: 'rgba(224,192,178,0.45)',
    ...shadowWarm.floating,
  },
});
