import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Leaf, MapPin } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../src/components/Button';
import { useAuthStore } from '../../src/store/auth-store';
import { colors, radii, shadowWarm, spacing } from '../../src/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PAGES = [
  {
    key: 'discover',
    eyebrow: 'Discover African Flavors',
    headline: 'Freshness from the ',
    highlight: 'Source',
    body: 'Explore authentic ingredients delivered straight from our trusted local farms to your kitchen door.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDG1xZT0neT4GuEQdRW4KmOoVq4vcOzxdayO7NQdzdxVBHyItU0tZqiXOFr6_l4JdlKWTxx3tWP_vMgcfKXkAGOr57V1eB0RrtKhTPI2Z5B3tX8tQSZDo9ZDYLSFS7llSv-AWVLEvS_U5UiKActJN1psXNoM5eei_qJ4kskCyxss3TNbbQmWZFkY11WowU6u4_oN5DxjXYz6KpbrYGE1PZKf2oKtdsGm1XoklnVngmxfuNI7YRMlQnCiA',
    cta: 'Next',
  },
  {
    key: 'convenience',
    eyebrow: 'Local + Nationwide',
    headline: 'Convenience on Your Schedule',
    highlight: null as string | null,
    body: 'Same-day local delivery and nationwide shipping — choose windows that work for you, 7 days a week.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA7mktRaB2FMJErgQH0GwwHGXguXl-VTxWG20UxTPr_8e6RjRl6R0kmH-E7NwsolKcmSJxXlMIbF48CmG1zukC7sgs9xXviYF8byNRSZiDDca3ThcNGI3v53FHcIdzK7sTdbyrGDAmOLrL1vh3MdrDwf6wktU1Geng6eAPABu2T-Kwhnmti3tSS9hH1bHZg80y76Zw86vk6waE6U74hu6QjCIC0OfIEFp-YHyRA5YUFWXK2FXkDwM6SEQ',
    cta: 'Get started',
  },
] as const;

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatAnim]);

  const fadeTo = useCallback(
    (next: number) => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        setPage(next);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }).start();
      });
    },
    [opacity]
  );

  const finish = useCallback(() => {
    completeOnboarding();
    router.replace('/(auth)/login');
  }, [completeOnboarding]);

  const onPrimary = () => {
    if (page < PAGES.length - 1) {
      fadeTo(page + 1);
    } else {
      finish();
    }
  };

  const current = PAGES[page];
  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        {page === 1 ? (
          <View style={styles.brandRow}>
            <MapPin size={22} color={colors.primary} strokeWidth={2.2} />
            <Text style={styles.brandSmall}>Teedeux</Text>
          </View>
        ) : (
          <View />
        )}
        <Pressable
          onPress={finish}
          accessibilityRole="button"
          hitSlop={12}
          style={({ pressed }) => pressed && { opacity: 0.6 }}
        >
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <Animated.View style={[styles.body, { opacity }]}>
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: current.image }}
            style={styles.heroImage}
            contentFit="cover"
            transition={200}
          />
          <LinearGradient
            colors={['rgba(252,249,248,0)', 'rgba(252,249,248,0.55)', colors.background]}
            locations={[0, 0.45, 1]}
            style={styles.heroGradient}
          />
          <Animated.View
            style={[styles.floatBadge, { transform: [{ translateY: floatY }] }]}
          >
            {page === 0 ? (
              <Leaf size={28} color={colors.primary} strokeWidth={2} />
            ) : (
              <View style={styles.slotCard}>
                <View style={styles.slotIcon}>
                  <MapPin size={20} color={colors.secondary} />
                </View>
                <View>
                  <Text style={styles.slotLabel}>Earliest Slot</Text>
                  <Text style={styles.slotValue}>Today, 2:00 PM</Text>
                </View>
              </View>
            )}
          </Animated.View>
        </View>

        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{current.eyebrow}</Text>
          <Text style={styles.headline}>
            {current.headline}
            {current.highlight ? (
              <Text style={styles.highlight}>{current.highlight}</Text>
            ) : null}
          </Text>
          <Text style={styles.bodyText}>{current.body}</Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {PAGES.map((p, i) => (
            <Pressable
              key={p.key}
              onPress={() => (i !== page ? fadeTo(i) : undefined)}
              accessibilityRole="button"
              accessibilityLabel={`Go to page ${i + 1}`}
            >
              <View style={[styles.dot, i === page && styles.dotActive]} />
            </Pressable>
          ))}
        </View>
        <Button
          title={current.cta}
          size="lg"
          fullWidth
          onPress={onPrimary}
          style={styles.cta}
        />
        {page === 1 ? (
          <Text style={styles.micro}>
            Reliable delivery to{' '}
            <Text style={styles.microBold}>120+ Metro Zones</Text>
          </Text>
        ) : (
          <View style={styles.microSpacer} />
        )}
      </View>

      <View style={styles.blobPrimary} pointerEvents="none" />
      <View style={styles.blobSecondary} pointerEvents="none" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandSmall: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 20,
    color: colors.primary,
  },
  skip: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  body: {
    flex: 1,
  },
  heroWrap: {
    height: SCREEN_HEIGHT * 0.42,
    width: SCREEN_WIDTH,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
  },
  floatBadge: {
    zIndex: 2,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.full,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.4)',
    ...shadowWarm.raised,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    minWidth: SCREEN_WIDTH - spacing.xl * 2,
  },
  slotIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.onSurfaceVariant,
  },
  slotValue: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 18,
    color: colors.lushLeaf,
    marginTop: 2,
  },
  copy: {
    paddingHorizontal: spacing.xl,
    marginTop: -spacing.xl,
    alignItems: 'center',
  },
  eyebrow: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  headline: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 28,
    lineHeight: 36,
    color: colors.onSurface,
    textAlign: 'center',
  },
  highlight: {
    color: colors.primary,
    fontFamily: 'HankenGrotesk_700Bold',
  },
  bodyText: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 17,
    lineHeight: 26,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: 340,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceHigh,
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.primary,
  },
  cta: {
    borderRadius: radii.xl,
  },
  micro: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  microBold: {
    color: colors.primary,
    fontFamily: 'JetBrainsMono_500Medium',
  },
  microSpacer: {
    height: 16,
  },
  blobPrimary: {
    position: 'absolute',
    bottom: -40,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primaryFixed,
    opacity: 0.25,
  },
  blobSecondary: {
    position: 'absolute',
    top: '30%',
    left: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondaryContainer,
    opacity: 0.2,
  },
});
