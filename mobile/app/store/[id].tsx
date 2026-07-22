import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react-native';
import { ProductCard } from '@/src/components/ProductCard';
import { Badge } from '@/src/components/Badge';
import {
  CATEGORIES,
  getProductsByStore,
  getStoreById,
} from '@/src/data/catalog';
import { useCartStore } from '@/src/store/cart-store';
import { formatCents } from '@/src/lib/format';
import type { ProductCategory, StoreFulfillmentMode } from '@/src/types';
import { colors, radii, shadowWarm, spacing } from '@/src/theme';

function fulfillmentBadge(mode: StoreFulfillmentMode): {
  label: string;
  tone: 'primary' | 'secondary' | 'tertiary' | 'muted';
} {
  switch (mode) {
    case 'LOCAL_ONLY':
      return { label: 'Local same-day', tone: 'secondary' };
    case 'SHIPPING_ONLY':
      return { label: 'Nationwide shipping', tone: 'primary' };
    default:
      return { label: 'Local + nationwide', tone: 'tertiary' };
  }
}

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const store = getStoreById(Array.isArray(id) ? id[0] : id ?? '');
  const [category, setCategory] = useState<ProductCategory | null>(null);

  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = items.reduce(
    (sum, i) => sum + i.product.priceCents * i.quantity,
    0
  );

  const products = useMemo(() => {
    if (!store) return [];
    const all = getProductsByStore(store.id);
    if (!category) return all;
    return all.filter((p) => p.category === category);
  }, [store, category]);

  const storeCategories = useMemo(() => {
    if (!store) return [];
    const ids = new Set(getProductsByStore(store.id).map((p) => p.category));
    return CATEGORIES.filter((c) => ids.has(c.id));
  }, [store]);

  if (!store) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.missingTitle}>Store not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const fulfill = fulfillmentBadge(store.fulfillmentType);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: cartCount > 0 ? 100 + insets.bottom : 40 + insets.bottom,
        }}
      >
        <View style={styles.coverWrap}>
          <Image
            source={{ uri: store.coverImageUrl }}
            style={styles.cover}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(28,27,27,0.45)', 'transparent', 'rgba(28,27,27,0.55)']}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { top: insets.top + 8 }]}
            accessibilityLabel="Go back"
          >
            <ArrowLeft color={colors.onSurface} size={22} />
          </Pressable>
          <View style={styles.coverMeta}>
            <Badge label={fulfill.label} tone={fulfill.tone} />
            <Text style={styles.storeName}>{store.name}</Text>
            <View style={styles.metaRow}>
              {store.rating != null && (
                <View style={styles.rating}>
                  <Star
                    color={colors.tertiaryFixed}
                    size={14}
                    fill={colors.tertiaryFixed}
                  />
                  <Text style={styles.metaText}>
                    {store.rating}
                    {store.reviewCount != null
                      ? ` · ${store.reviewCount} reviews`
                      : ''}
                  </Text>
                </View>
              )}
              {store.estimatedDeliveryMins != null && (
                <Text style={styles.metaText}>
                  ~{store.estimatedDeliveryMins} min
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {store.description ? (
            <Text style={styles.description}>{store.description}</Text>
          ) : null}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            <Pressable
              onPress={() => setCategory(null)}
              style={[styles.chip, category === null && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  category === null && styles.chipTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            {storeCategories.map((cat) => {
              const active = category === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setCategory(active ? null : cat.id)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.gridLabel}>
            {products.length} product{products.length === 1 ? '' : 's'}
          </Text>

          <View style={styles.grid}>
            {products.map((product) => (
              <View key={product.id} style={styles.gridItem}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>

          {products.length === 0 && (
            <Text style={styles.emptyCat}>
              No products in this category at {store.name}.
            </Text>
          )}
        </View>
      </ScrollView>

      {cartCount > 0 && (
        <Pressable
          onPress={() => router.push('/(tabs)/cart')}
          style={[
            styles.miniCart,
            { bottom: Math.max(insets.bottom, 12) + 8 },
          ]}
        >
          <View style={styles.miniLeft}>
            <View style={styles.miniBadge}>
              <ShoppingCart color={colors.onPrimary} size={18} />
              <Text style={styles.miniCount}>{cartCount}</Text>
            </View>
            <Text style={styles.miniLabel}>View cart</Text>
          </View>
          <Text style={styles.miniTotal}>{formatCents(cartSubtotal)}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  coverWrap: {
    height: 260,
    backgroundColor: colors.savannaSand,
  },
  cover: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  backBtn: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowWarm.raised,
  },
  coverMeta: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    gap: spacing.sm,
  },
  storeName: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 26,
    color: colors.white,
    letterSpacing: -0.4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  description: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  chips: { gap: spacing.sm, paddingVertical: 4 },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.4)',
  },
  chipActive: {
    backgroundColor: colors.primaryFixed,
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  chipTextActive: { color: colors.primary },
  gridLabel: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 16,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    width: '47.5%',
    flexGrow: 1,
    maxWidth: '48.5%',
  },
  emptyCat: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  miniCart: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    ...shadowWarm.floating,
  },
  miniLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  miniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  miniCount: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.onPrimary,
  },
  miniLabel: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 16,
    color: colors.onPrimary,
  },
  miniTotal: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 16,
    color: colors.onPrimary,
  },
  missing: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  missingTitle: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 20,
    color: colors.onSurface,
  },
  backLink: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 13,
    color: colors.primary,
  },
});
