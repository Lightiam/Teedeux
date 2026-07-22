import React, { useMemo, useState } from 'react';
import {
  Image,
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
  PackageCheck,
  RefreshCw,
  Wallet,
} from 'lucide-react-native';
import { Badge } from '@/src/components/Badge';
import { Button } from '@/src/components/Button';
import { PRODUCTS } from '@/src/data/catalog';
import { formatAddress, formatCents } from '@/src/lib/format';
import { estimateShopperPayoutCents } from '@/src/lib/shopper';
import { useOrderStore } from '@/src/store/order-store';
import type { OrderItem, OrderItemStatus, Product } from '@/src/types';
import { colors, radii, shadowWarm, spacing } from '@/src/theme';

function isResolved(status: OrderItemStatus): boolean {
  return (
    status === 'FOUND' ||
    status === 'SUBSTITUTED' ||
    status === 'REFUNDED' ||
    status === 'UNAVAILABLE'
  );
}

function isFoundLike(status: OrderItemStatus): boolean {
  return status === 'FOUND' || status === 'SUBSTITUTED';
}

function suggestAlternatives(
  item: OrderItem,
  storeId: string
): Product[] {
  const original = PRODUCTS.find((p) => p.id === item.productId);
  const pool = PRODUCTS.filter(
    (p) =>
      p.storeId === storeId &&
      p.id !== item.productId &&
      p.localAvailable &&
      p.stockQty > 0
  );

  if (!original) return pool.slice(0, 3);

  const sameCategory = pool.filter((p) => p.category === original.category);
  const sameTemp = pool.filter(
    (p) => p.temperatureClass === original.temperatureClass
  );
  const merged = [...sameCategory, ...sameTemp, ...pool];
  const seen = new Set<string>();
  const unique: Product[] = [];
  for (const p of merged) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    unique.push(p);
    if (unique.length >= 3) break;
  }
  return unique;
}

export default function ShopperOrderScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === id));
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const updateOrderItemStatus = useOrderStore((s) => s.updateOrderItemStatus);

  const [subItemId, setSubItemId] = useState<string | null>(null);

  const progress = useMemo(() => {
    if (!order) return { found: 0, total: 0, resolved: 0 };
    const total = order.items.length;
    const found = order.items.filter((it) => isFoundLike(it.status)).length;
    const resolved = order.items.filter((it) => isResolved(it.status)).length;
    return { found, total, resolved };
  }, [order]);

  const payout = order ? estimateShopperPayoutCents(order) : 0;
  const allResolved =
    order != null &&
    order.items.length > 0 &&
    progress.resolved === progress.total;
  const isOutForDelivery = order?.status === 'OUT_FOR_DELIVERY';
  const isDelivered = order?.status === 'DELIVERED';
  const isShopping =
    order?.status === 'SHOPPING' || order?.status === 'CONFIRMED';

  const subItem = order?.items.find((it) => it.id === subItemId) ?? null;
  const alternatives =
    order && subItem ? suggestAlternatives(subItem, order.storeId) : [];

  if (!order) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.missing}>Order not found</Text>
        <Button
          title="Back to batches"
          onPress={() => router.replace('/shopper')}
        />
      </View>
    );
  }

  const handleFound = (itemId: string) => {
    updateOrderItemStatus(order.id, itemId, 'FOUND');
    if (subItemId === itemId) setSubItemId(null);
  };

  const handleOutOfStock = (itemId: string) => {
    updateOrderItemStatus(order.id, itemId, 'SUBSTITUTION_PENDING');
    setSubItemId(itemId);
  };

  const handleSubstitute = (itemId: string, alt: Product) => {
    updateOrderItemStatus(
      order.id,
      itemId,
      'SUBSTITUTED',
      `Substituted with ${alt.name}`
    );
    setSubItemId(null);
  };

  const handleRefund = (itemId: string) => {
    updateOrderItemStatus(order.id, itemId, 'REFUNDED', 'Item refunded');
    setSubItemId(null);
  };

  const handleCompleteShopping = () => {
    if (order.status === 'CONFIRMED') {
      updateOrderStatus(order.id, 'SHOPPING');
    }
    updateOrderStatus(order.id, 'OUT_FOR_DELIVERY');
  };

  const handleDelivered = () => {
    updateOrderStatus(order.id, 'DELIVERED');
  };

  const progressPct =
    progress.total === 0 ? 0 : progress.resolved / progress.total;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft color={colors.primary} size={22} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{order.orderNumber}</Text>
          <Text style={styles.storeHint} numberOfLines={1}>
            {order.storeName}
          </Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.payoutBar}>
          <View style={styles.payoutIcon}>
            <Wallet color={colors.secondary} size={18} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.payoutLabel}>Estimated payout</Text>
            <Text style={styles.payoutValue}>{formatCents(payout)}</Text>
          </View>
          <Badge
            label={order.status.replaceAll('_', ' ')}
            tone={isDelivered ? 'secondary' : 'primary'}
          />
        </View>

        {isShopping ? (
          <>
            <View style={styles.progressCard}>
              <View style={styles.progressTop}>
                <Text style={styles.progressTitle}>Pick progress</Text>
                <Text style={styles.progressCount}>
                  {progress.resolved}/{progress.total}
                </Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${Math.round(progressPct * 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressHint}>
                {progress.found} found · mark each item before completing
              </Text>
            </View>

            <Text style={styles.sectionLabel}>Checklist</Text>
            <View style={styles.list}>
              {order.items.map((item) => {
                const resolved = isResolved(item.status);
                const pendingSub = item.status === 'SUBSTITUTION_PENDING';
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.itemCard,
                      resolved && styles.itemCardDone,
                      pendingSub && styles.itemCardWarn,
                    ]}
                  >
                    {item.productImageUrl ? (
                      <Image
                        source={{ uri: item.productImageUrl }}
                        style={styles.thumb}
                      />
                    ) : (
                      <View style={[styles.thumb, styles.thumbFallback]}>
                        <PackageCheck
                          color={colors.onSurfaceVariant}
                          size={20}
                        />
                      </View>
                    )}
                    <View style={styles.itemBody}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {item.productName}
                      </Text>
                      <Text style={styles.itemMeta}>
                        Qty {item.quantity} · {formatCents(item.unitPriceCents)}
                      </Text>
                      {item.substitutionNote ? (
                        <Text style={styles.subNote}>
                          {item.substitutionNote}
                        </Text>
                      ) : null}
                      {resolved ? (
                        <Badge
                          label={item.status.replaceAll('_', ' ')}
                          tone={
                            item.status === 'REFUNDED' ||
                            item.status === 'UNAVAILABLE'
                              ? 'danger'
                              : 'secondary'
                          }
                          style={{ marginTop: 6 }}
                        />
                      ) : (
                        <View style={styles.itemActions}>
                          <Button
                            title="Found"
                            size="sm"
                            onPress={() => handleFound(item.id)}
                            style={{ flex: 1 }}
                          />
                          <Button
                            title="Out of stock"
                            size="sm"
                            variant="outline"
                            onPress={() => handleOutOfStock(item.id)}
                            style={{ flex: 1 }}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {subItem ? (
              <View style={styles.subPanel}>
                <View style={styles.subHeader}>
                  <RefreshCw color={colors.tertiary} size={18} />
                  <Text style={styles.subTitle}>Substitution</Text>
                </View>
                <Text style={styles.subBody}>
                  {subItem.productName} is unavailable. Pick an alternative or
                  refund the line.
                </Text>
                <View style={styles.altList}>
                  {alternatives.map((alt) => (
                    <Pressable
                      key={alt.id}
                      onPress={() => handleSubstitute(subItem.id, alt)}
                      style={({ pressed }) => [
                        styles.altRow,
                        pressed && { opacity: 0.9 },
                      ]}
                    >
                      <Image
                        source={{ uri: alt.imageUrl }}
                        style={styles.altThumb}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.altName} numberOfLines={1}>
                          {alt.name}
                        </Text>
                        <Text style={styles.altPrice}>
                          {formatCents(alt.priceCents)}
                        </Text>
                      </View>
                      <Text style={styles.altCta}>Use</Text>
                    </Pressable>
                  ))}
                  {alternatives.length === 0 ? (
                    <Text style={styles.subBody}>
                      No close matches in this store.
                    </Text>
                  ) : null}
                </View>
                <Button
                  title="Refund item"
                  variant="danger"
                  size="md"
                  fullWidth
                  onPress={() => handleRefund(subItem.id)}
                />
                <Button
                  title="Cancel"
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onPress={() => setSubItemId(null)}
                />
              </View>
            ) : null}
          </>
        ) : null}

        {(isOutForDelivery || isDelivered) && (
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryIcon}>
              {isDelivered ? (
                <Check color={colors.onPrimary} size={28} />
              ) : (
                <Navigation color={colors.onPrimary} size={28} />
              )}
            </View>
            <Text style={styles.deliveryTitle}>
              {isDelivered ? 'Delivered' : 'Ready to navigate'}
            </Text>
            <Text style={styles.deliveryAddr}>
              {formatAddress(order.deliveryAddress)}
            </Text>
            {!isDelivered ? (
              <View style={styles.navHint}>
                <MapPin color={colors.primary} size={16} />
                <Text style={styles.navHintText}>
                  Open maps with the address above, then mark delivered when
                  handed off.
                </Text>
              </View>
            ) : (
              <Text style={styles.earned}>
                You earned {formatCents(payout)}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        {isShopping ? (
          <Button
            title="Complete shopping"
            fullWidth
            size="lg"
            disabled={!allResolved}
            onPress={handleCompleteShopping}
          />
        ) : null}
        {isOutForDelivery ? (
          <Button
            title="Mark delivered"
            fullWidth
            size="lg"
            variant="secondary"
            onPress={handleDelivered}
          />
        ) : null}
        {isDelivered ? (
          <Button
            title="Back to batches"
            fullWidth
            size="lg"
            onPress={() => router.replace('/shopper')}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 14,
    color: colors.primary,
  },
  storeHint: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  missing: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 18,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  payoutBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.secondaryContainer,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  payoutIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: 'rgba(59,105,52,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.lushLeaf,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  payoutValue: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 20,
    color: colors.lushLeaf,
  },
  progressCard: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadowWarm.raised,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 16,
    color: colors.onSurface,
  },
  progressCount: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 14,
    color: colors.primary,
  },
  track: {
    height: 10,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceHigh,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.full,
    backgroundColor: colors.primaryContainer,
  },
  progressHint: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  sectionLabel: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 18,
    color: colors.onSurface,
    marginTop: spacing.xs,
  },
  list: {
    gap: spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadowWarm.card,
  },
  itemCardDone: {
    borderColor: colors.secondaryContainer,
    backgroundColor: 'rgba(185,238,171,0.18)',
  },
  itemCardWarn: {
    borderColor: colors.tertiaryFixed,
    backgroundColor: 'rgba(255,223,159,0.25)',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceHigh,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBody: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 15,
    color: colors.onSurface,
  },
  itemMeta: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  subNote: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 12,
    color: colors.tertiary,
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  subPanel: {
    backgroundColor: colors.savannaSand,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.tertiaryFixed,
    ...shadowWarm.raised,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  subTitle: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 17,
    color: colors.onSurface,
  },
  subBody: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  altList: {
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  altRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  altThumb: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceHigh,
  },
  altName: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 14,
    color: colors.onSurface,
  },
  altPrice: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  altCta: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 13,
    color: colors.primary,
  },
  deliveryCard: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadowWarm.card,
    marginTop: spacing.sm,
  },
  deliveryIcon: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  deliveryTitle: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 22,
    color: colors.onSurface,
  },
  deliveryAddr: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 15,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  navHint: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: colors.primaryFixed,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  navHintText: {
    flex: 1,
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 13,
    color: '#7a3000',
    lineHeight: 18,
  },
  earned: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 16,
    color: colors.secondary,
    marginTop: spacing.sm,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
});
