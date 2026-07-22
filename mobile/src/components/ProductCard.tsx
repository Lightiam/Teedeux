import React from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import type { Product } from '../types';
import { colors, radii, shadowWarm, spacing } from '../theme';
import { formatCents } from '../lib/format';
import { Badge } from './Badge';
import { useCartStore } from '../store/cart-store';

export function ProductCard({
  product,
  onPress,
}: {
  product: Product;
  onPress?: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
    >
      <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.body}>
        <Badge
          label={product.temperatureClass}
          tone={product.temperatureClass === 'DRY' ? 'primary' : 'secondary'}
        />
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {product.unit.toLowerCase()}
          {product.weightOz ? ` · ${product.weightOz} oz` : ''}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatCents(product.priceCents)}</Text>
          <Pressable
            accessibilityLabel={`Add ${product.name}`}
            onPress={() => addItem(product, 1)}
            style={styles.addBtn}
          >
            <Plus color={colors.onPrimary} size={18} strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.45)',
    overflow: 'hidden',
    ...shadowWarm.card,
  },
  image: { width: '100%', height: 110, backgroundColor: colors.savannaSand },
  body: { padding: spacing.md, gap: 6 },
  name: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 15,
    color: colors.onSurface,
    lineHeight: 20,
  },
  meta: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  footer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 16,
    color: colors.primary,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
