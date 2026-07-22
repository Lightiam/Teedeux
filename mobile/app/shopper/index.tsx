import React, { useEffect, useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  Wallet,
} from 'lucide-react-native';
import { Badge } from '@/src/components/Badge';
import { Button } from '@/src/components/Button';
import { Screen } from '@/src/components/Screen';
import { getStoreById } from '@/src/data/catalog';
import { formatCents } from '@/src/lib/format';
import { estimateShopperPayoutCents } from '@/src/lib/shopper';
import { useAuthStore } from '@/src/store/auth-store';
import { useOrderStore } from '@/src/store/order-store';
import type { Order } from '@/src/types';
import { colors, radii, shadowWarm, spacing } from '@/src/theme';

function mockDistanceMiles(orderId: string): number {
  let hash = 0;
  for (let i = 0; i < orderId.length; i++) {
    hash = (hash * 31 + orderId.charCodeAt(i)) % 1000;
  }
  return 0.8 + (hash % 45) / 10;
}

export default function ShopperHomeScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const orders = useOrderStore((s) => s.orders);
  const seedShopperDemoOrders = useOrderStore((s) => s.seedShopperDemoOrders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  useEffect(() => {
    seedShopperDemoOrders();
  }, [seedShopperDemoOrders]);

  const availableBatches = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.fulfillmentType === 'LOCAL_DELIVERY' &&
          (o.status === 'CONFIRMED' || o.status === 'SHOPPING')
      ),
    [orders]
  );

  const estimatedPayoutSum = useMemo(
    () =>
      availableBatches.reduce(
        (sum, o) => sum + estimateShopperPayoutCents(o),
        0
      ),
    [availableBatches]
  );

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const handleAccept = (order: Order) => {
    if (order.status === 'CONFIRMED') {
      updateOrderStatus(order.id, 'SHOPPING');
    }
    router.push(`/shopper/order/${order.id}`);
  };

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.brand}>Teedeux Shopper</Text>
          <Text style={styles.greeting}>
            {user?.name ?? 'Shopper'} · ready to pick
          </Text>
        </View>
        <Pressable
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && { opacity: 0.85 },
          ]}
        >
          <LogOut color={colors.primary} size={20} strokeWidth={2} />
        </Pressable>
      </View>

      <LinearGradient
        colors={['#c45100', '#9c3f00', '#3b6934']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsCard}
      >
        <View style={styles.statBlock}>
          <View style={styles.statIcon}>
            <ShoppingBag color={colors.white} size={18} />
          </View>
          <Text style={styles.statValue}>{availableBatches.length}</Text>
          <Text style={styles.statLabel}>Available batches</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <View style={styles.statIcon}>
            <Wallet color={colors.white} size={18} />
          </View>
          <Text style={styles.statValue}>
            {formatCents(estimatedPayoutSum)}
          </Text>
          <Text style={styles.statLabel}>Est. payout</Text>
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Open batches</Text>
      <Text style={styles.sectionSub}>
        Local delivery orders ready to shop
      </Text>

      {availableBatches.length === 0 ? (
        <View style={styles.empty}>
          <Package color={colors.primary} size={36} strokeWidth={1.6} />
          <Text style={styles.emptyTitle}>No batches right now</Text>
          <Text style={styles.emptyBody}>
            New local orders will appear here when customers check out nearby.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {availableBatches.map((order) => {
            const itemCount = order.items.reduce(
              (sum, it) => sum + it.quantity,
              0
            );
            const payout = estimateShopperPayoutCents(order);
            const distance = mockDistanceMiles(order.id);
            const store = getStoreById(order.storeId);

            return (
              <View key={order.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <Badge
                    label={order.status === 'SHOPPING' ? 'In progress' : 'Ready'}
                    tone={order.status === 'SHOPPING' ? 'primary' : 'secondary'}
                  />
                </View>
                <Text style={styles.storeName} numberOfLines={1}>
                  {order.storeName}
                </Text>
                {store ? (
                  <Text style={styles.storeAddr} numberOfLines={1}>
                    {store.address.line1}, {store.address.city}
                  </Text>
                ) : null}

                <View style={styles.metaRow}>
                  <View style={styles.metaChip}>
                    <Package color={colors.onSurfaceVariant} size={14} />
                    <Text style={styles.metaText}>
                      {itemCount} item{itemCount === 1 ? '' : 's'}
                    </Text>
                  </View>
                  <View style={styles.metaChip}>
                    <MapPin color={colors.onSurfaceVariant} size={14} />
                    <Text style={styles.metaText}>
                      {distance.toFixed(1)} mi
                    </Text>
                  </View>
                  <Text style={styles.payout}>{formatCents(payout)}</Text>
                </View>

                <Button
                  title={
                    order.status === 'SHOPPING' ? 'Continue shopping' : 'Accept'
                  }
                  onPress={() => handleAccept(order)}
                  fullWidth
                  size="md"
                />
              </View>
            );
          })}
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  brand: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 26,
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  greeting: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 15,
    color: colors.onSurfaceVariant,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  statsCard: {
    borderRadius: radii.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadowWarm.floating,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 24,
    color: colors.white,
  },
  statLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.82)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statDivider: {
    width: 1,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  sectionTitle: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 20,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  sectionSub: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: -spacing.sm,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadowWarm.card,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  orderNumber: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 13,
    color: colors.primary,
  },
  storeName: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 17,
    color: colors.onSurface,
  },
  storeAddr: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xs,
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceLow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  metaText: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  payout: {
    marginLeft: 'auto',
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 16,
    color: colors.secondary,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.surfaceLow,
    borderRadius: radii.lg,
  },
  emptyTitle: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 18,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  emptyBody: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
});
