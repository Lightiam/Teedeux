import React, { useMemo } from 'react';
import { Image } from 'expo-image';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
import { Screen } from '@/src/components/Screen';
import { Button } from '@/src/components/Button';
import { Badge } from '@/src/components/Badge';
import {
  getFees,
  getLocalItems,
  getShippedItems,
  useCartStore,
} from '@/src/store/cart-store';
import { useAppStore } from '@/src/store/app-store';
import { formatCents } from '@/src/lib/format';
import type { CartItem } from '@/src/types';
import { colors, radii, shadowWarm, spacing } from '@/src/theme';

function CartLine({
  item,
  onInc,
  onDec,
  onRemove,
}: {
  item: CartItem;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
}) {
  const lineTotal = item.product.priceCents * item.quantity;
  return (
    <View style={styles.line}>
      <Image
        source={{ uri: item.product.imageUrl }}
        style={styles.thumb}
        contentFit="cover"
      />
      <View style={styles.lineBody}>
        <View style={styles.lineTop}>
          <Text style={styles.lineName} numberOfLines={2}>
            {item.product.name}
          </Text>
          <Pressable
            onPress={onRemove}
            hitSlop={8}
            accessibilityLabel={`Remove ${item.product.name}`}
          >
            <Trash2 color={colors.chiliRed} size={18} />
          </Pressable>
        </View>
        <Text style={styles.lineMeta}>
          {item.product.storeName} · {item.product.unit.toLowerCase()}
        </Text>
        <View style={styles.lineFooter}>
          <Text style={styles.linePrice}>{formatCents(lineTotal)}</Text>
          <View style={styles.stepper}>
            <Pressable onPress={onDec} style={styles.stepBtn} hitSlop={6}>
              <Minus color={colors.onSurfaceVariant} size={16} />
            </Pressable>
            <Text style={styles.qty}>{item.quantity}</Text>
            <Pressable
              onPress={onInc}
              style={[styles.stepBtn, styles.stepBtnPlus]}
              hitSlop={6}
            >
              <Plus color={colors.onPrimary} size={16} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function FeeRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.feeRow}>
      <Text style={styles.feeLabel}>{label}</Text>
      <Text style={[styles.feeValue, accent && styles.feeAccent]}>{value}</Text>
    </View>
  );
}

export default function CartScreen() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const tipCents = useCartStore((s) => s.tipCents);
  const deliveryAddress = useAppStore((s) => s.deliveryAddress);

  const localItems = useMemo(() => getLocalItems(items), [items]);
  const shippedItems = useMemo(() => getShippedItems(items), [items]);
  const fees = useMemo(
    () => getFees(deliveryAddress, items, tipCents),
    [deliveryAddress, items, tipCents]
  );

  const empty = items.length === 0;

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        {!empty && (
          <Pressable onPress={clear} hitSlop={8}>
            <Text style={styles.clear}>Clear all</Text>
          </Pressable>
        )}
      </View>

      {empty ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <ShoppingBag color={colors.primary} size={36} strokeWidth={1.8} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyBody}>
            Browse nearby markets for fresh produce and shippable pantry staples.
          </Text>
          <Button
            title="Shop Teedeux Mart"
            onPress={() => router.push('/(tabs)')}
            style={{ marginTop: spacing.md }}
          />
        </View>
      ) : (
        <>
          {localItems.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Local same-day</Text>
                <Badge label="Fresh / frozen" tone="secondary" />
              </View>
              {localItems.map((item) => (
                <CartLine
                  key={item.id}
                  item={item}
                  onInc={() => setQuantity(item.id, item.quantity + 1)}
                  onDec={() => setQuantity(item.id, item.quantity - 1)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </View>
          )}

          {shippedItems.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Nationwide shipped</Text>
                <Badge label="Dry goods" tone="primary" />
              </View>
              {shippedItems.map((item) => (
                <CartLine
                  key={item.id}
                  item={item}
                  onInc={() => setQuantity(item.id, item.quantity + 1)}
                  onDec={() => setQuantity(item.id, item.quantity - 1)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </View>
          )}

          <View style={styles.fees}>
            <FeeRow label="Subtotal" value={formatCents(fees.subtotalCents)} />
            {fees.localDeliveryFeeCents > 0 && (
              <FeeRow
                label="Local delivery"
                value={formatCents(fees.localDeliveryFeeCents)}
              />
            )}
            {fees.shippingFeeCents > 0 && (
              <FeeRow
                label="Shipping"
                value={formatCents(fees.shippingFeeCents)}
              />
            )}
            <FeeRow
              label="Service fee"
              value={formatCents(fees.serviceFeeCents)}
            />
            <FeeRow label="Tax" value={formatCents(fees.taxCents)} />
            {fees.tipCents > 0 && (
              <FeeRow label="Tip" value={formatCents(fees.tipCents)} />
            )}
            <View style={styles.divider} />
            <FeeRow
              label="Estimated total"
              value={formatCents(fees.totalCents)}
              accent
            />
          </View>

          <Button
            title={`Checkout · ${formatCents(fees.totalCents)}`}
            size="lg"
            fullWidth
            onPress={() => router.push('/checkout')}
            style={styles.checkout}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 28,
    color: colors.primary,
    letterSpacing: -0.4,
  },
  clear: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.chiliRed,
  },
  section: { gap: spacing.md },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 18,
    color: colors.onSurface,
  },
  line: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.4)',
    ...shadowWarm.raised,
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: radii.lg,
    backgroundColor: colors.savannaSand,
  },
  lineBody: { flex: 1, gap: 4, justifyContent: 'space-between' },
  lineTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  lineName: {
    flex: 1,
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 15,
    color: colors.onSurface,
    lineHeight: 20,
  },
  lineMeta: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  lineFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  linePrice: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 16,
    color: colors.primary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.full,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.3)',
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPlus: { backgroundColor: colors.primary },
  qty: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 13,
    color: colors.onSurface,
    minWidth: 20,
    textAlign: 'center',
  },
  fees: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.4)',
    ...shadowWarm.raised,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeLabel: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  feeValue: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 13,
    color: colors.onSurface,
  },
  feeAccent: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 18,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(224,192,178,0.45)',
    marginVertical: spacing.xs,
  },
  checkout: { marginTop: spacing.sm },
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
