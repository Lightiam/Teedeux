import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Bell,
  ChevronDown,
  Cookie,
  Droplets,
  Fish,
  Flame,
  Leaf,
  MapPin,
  Package,
  Search,
  Snowflake,
  Star,
  Wheat,
  type LucideIcon,
} from 'lucide-react-native';
import { Screen } from '@/src/components/Screen';
import { ProductCard } from '@/src/components/ProductCard';
import { Badge } from '@/src/components/Badge';
import {
  CATEGORIES,
  PRODUCTS,
  RECIPE_BUNDLES,
  STORES,
  getBundleProducts,
  searchProducts,
} from '@/src/data/catalog';
import { useAppStore } from '@/src/store/app-store';
import { useCartStore } from '@/src/store/cart-store';
import { formatAddress } from '@/src/lib/format';
import { colors, radii, shadowWarm, spacing } from '@/src/theme';
import type { ProductCategory, StoreFulfillmentMode } from '@/src/types';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=700&fit=crop';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Flame,
  Wheat,
  Leaf,
  Fish,
  Droplets,
  Snowflake,
  Cookie,
  Package,
};

function fulfillmentLabel(mode: StoreFulfillmentMode): string {
  switch (mode) {
    case 'LOCAL_ONLY':
      return 'Local';
    case 'SHIPPING_ONLY':
      return 'Ships';
    default:
      return 'Local + Ship';
  }
}

export default function HomeScreen() {
  const deliveryAddress = useAppStore((s) => s.deliveryAddress);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearch = useAppStore((s) => s.setSearch);
  const addItem = useCartStore((s) => s.addItem);

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(
    null
  );
  const [searchFocused, setSearchFocused] = useState(false);

  const isSearching = localQuery.trim().length > 0 || searchFocused;

  const results = useMemo(() => {
    let list = localQuery.trim()
      ? searchProducts(localQuery)
      : [...PRODUCTS];
    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory);
    }
    return list;
  }, [localQuery, activeCategory]);

  const featured = useMemo(() => {
    if (activeCategory) {
      return PRODUCTS.filter((p) => p.category === activeCategory).slice(0, 8);
    }
    return PRODUCTS.filter((p) => p.shippable || p.localAvailable).slice(0, 8);
  }, [activeCategory]);

  const addressLine = deliveryAddress
    ? deliveryAddress.label ??
      `${deliveryAddress.line1}, ${deliveryAddress.city}`
    : 'Add address';

  const onSubmitSearch = () => {
    setSearch(localQuery);
    setSearchFocused(true);
  };

  const addBundle = (bundleId: string) => {
    const products = getBundleProducts(bundleId);
    products.forEach((p) => addItem(p, 1));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <Screen contentStyle={styles.screenContent}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.push('/address')}
          style={({ pressed }) => [styles.deliverTo, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Change delivery address"
        >
          <MapPin color={colors.primary} size={20} fill={colors.primaryFixed} />
          <View style={styles.deliverText}>
            <Text style={styles.deliverLabel}>Deliver to</Text>
            <View style={styles.deliverRow}>
              <Text style={styles.deliverAddress} numberOfLines={1}>
                {addressLine}
              </Text>
              <ChevronDown color={colors.primary} size={16} />
            </View>
          </View>
        </Pressable>

        <Text style={styles.brand}>Teedeux Mart</Text>

        <Pressable
          onPress={() => {}}
          style={styles.iconBtn}
          accessibilityLabel="Notifications"
        >
          <Bell color={colors.primary} size={22} />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Search color={colors.onSurfaceVariant} size={20} style={styles.searchIcon} />
        <TextInput
          value={localQuery}
          onChangeText={(t) => {
            setLocalQuery(t);
            setSearch(t);
          }}
          onFocus={() => setSearchFocused(true)}
          onSubmitEditing={onSubmitSearch}
          placeholder="Search spices, grains, produce…"
          placeholderTextColor={colors.onSurfaceVariant}
          returnKeyType="search"
          style={styles.searchInput}
        />
        {(localQuery.length > 0 || searchFocused) && (
          <Pressable
            onPress={() => {
              setLocalQuery('');
              setSearch('');
              setSearchFocused(false);
              setActiveCategory(null);
            }}
            hitSlop={8}
          >
            <Text style={styles.clearSearch}>Clear</Text>
          </Pressable>
        )}
      </View>

      {isSearching && localQuery.trim().length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Results · {results.length}
          </Text>
          <View style={styles.grid}>
            {results.map((product) => (
              <View key={product.id} style={styles.gridItem}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
          {results.length === 0 && (
            <Text style={styles.emptyHint}>
              No products match “{localQuery.trim()}”.
            </Text>
          )}
        </View>
      ) : (
        <>
          {/* Hero */}
          <View style={styles.hero}>
            <Image
              source={{ uri: HERO_IMAGE }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(28,27,27,0.05)', 'rgba(28,27,27,0.72)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroBody}>
              <Badge label="Limited offer" tone="primary" />
              <Text style={styles.heroTitle}>Weekly Specials</Text>
              <Text style={styles.heroSub}>
                Up to 30% off spices and pantry staples this week.
              </Text>
            </View>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Browse categories</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
            >
              {CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.icon] ?? Package;
                const selected = activeCategory === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() =>
                      setActiveCategory((prev) =>
                        prev === cat.id ? null : cat.id
                      )
                    }
                    style={({ pressed }) => [
                      styles.categoryChip,
                      selected && styles.categoryChipActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        selected && styles.categoryIconActive,
                      ]}
                    >
                      <Icon
                        color={selected ? colors.primary : colors.earthClay}
                        size={22}
                        strokeWidth={2}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryLabel,
                        selected && styles.categoryLabelActive,
                      ]}
                      numberOfLines={1}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Nearby stores */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby stores</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
            >
              {STORES.map((store) => (
                <Pressable
                  key={store.id}
                  onPress={() => {
                    useAppStore.getState().setStore(store.id);
                    router.push(`/store/${store.id}`);
                  }}
                  style={({ pressed }) => [
                    styles.storeCard,
                    pressed && styles.pressed,
                  ]}
                >
                  <Image
                    source={{ uri: store.coverImageUrl }}
                    style={styles.storeCover}
                    contentFit="cover"
                  />
                  <View style={styles.storeBody}>
                    <Text style={styles.storeName} numberOfLines={1}>
                      {store.name}
                    </Text>
                    <View style={styles.storeMeta}>
                      {store.rating != null && (
                        <View style={styles.ratingRow}>
                          <Star
                            color={colors.tertiary}
                            size={12}
                            fill={colors.tertiaryFixed}
                          />
                          <Text style={styles.metaText}>{store.rating}</Text>
                        </View>
                      )}
                      <Badge
                        label={fulfillmentLabel(store.fulfillmentType)}
                        tone="secondary"
                      />
                    </View>
                    {store.estimatedDeliveryMins != null && (
                      <Text style={styles.eta}>
                        ~{store.estimatedDeliveryMins} min
                      </Text>
                    )}
                    <Text style={styles.storeCity} numberOfLines={1}>
                      {store.address.city}, {store.address.state}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Recipe bundles */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recipe bundles</Text>
              <Text style={styles.sectionHint}>Tap to add all</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
            >
              {RECIPE_BUNDLES.map((bundle) => (
                <Pressable
                  key={bundle.id}
                  onPress={() => addBundle(bundle.id)}
                  style={({ pressed }) => [
                    styles.bundleCard,
                    pressed && styles.pressed,
                  ]}
                >
                  <Image
                    source={{ uri: bundle.imageUrl }}
                    style={styles.bundleImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(28,27,27,0.85)']}
                    style={styles.bundleGradient}
                  />
                  <View style={styles.bundleBody}>
                    <Text style={styles.bundleName}>{bundle.name}</Text>
                    <Text style={styles.bundleMeta}>
                      {bundle.servings} servings · {bundle.prepMinutes} min ·{' '}
                      {bundle.productIds.length} items
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Featured */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeCategory ? activeCategory : 'Featured products'}
              </Text>
              <Text style={styles.sectionHint}>
                {featured.length} items
              </Text>
            </View>
            <View style={styles.grid}>
              {featured.map((product) => (
                <View key={product.id} style={styles.gridItem}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          </View>

          {deliveryAddress && (
            <Text style={styles.footerNote}>
              Delivering to {formatAddress(deliveryAddress)}
            </Text>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  deliverTo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    maxWidth: 130,
  },
  deliverText: { flex: 1 },
  deliverLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 10,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  deliverRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  deliverAddress: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 13,
    color: colors.primary,
    flexShrink: 1,
  },
  brand: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 20,
    color: colors.primary,
    letterSpacing: -0.3,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    gap: spacing.sm,
  },
  searchIcon: { marginLeft: 2 },
  searchInput: {
    flex: 1,
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 15,
    color: colors.onSurface,
    paddingVertical: 12,
  },
  clearSearch: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.primary,
  },
  hero: {
    height: 200,
    borderRadius: radii.xl + 8,
    overflow: 'hidden',
    ...shadowWarm.card,
  },
  heroBody: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  heroTitle: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 28,
    color: colors.white,
    letterSpacing: -0.4,
  },
  heroSub: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    maxWidth: 280,
  },
  section: { gap: spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 20,
    color: colors.primary,
    letterSpacing: -0.2,
  },
  sectionHint: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  hScroll: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  categoryChip: {
    width: 88,
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryChipActive: {},
  categoryIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.savannaSand,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.35)',
  },
  categoryIconActive: {
    backgroundColor: colors.primaryFixed,
    borderColor: colors.primary,
  },
  categoryLabel: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 12,
    color: colors.onSurface,
    textAlign: 'center',
  },
  categoryLabelActive: { color: colors.primary },
  storeCard: {
    width: 220,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.4)',
    ...shadowWarm.raised,
  },
  storeCover: { width: '100%', height: 100, backgroundColor: colors.savannaSand },
  storeBody: { padding: spacing.md, gap: 6 },
  storeName: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 15,
    color: colors.onSurface,
  },
  storeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  eta: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.secondary,
  },
  storeCity: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  bundleCard: {
    width: 260,
    height: 150,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadowWarm.card,
  },
  bundleImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.savannaSand,
  },
  bundleGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  bundleBody: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.md,
    gap: 4,
  },
  bundleName: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 18,
    color: colors.white,
  },
  bundleMeta: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
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
  emptyHint: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  footerNote: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
});
