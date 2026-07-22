import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import {
  ChevronRight,
  CreditCard,
  LogOut,
  MapPin,
  ShoppingBag,
} from 'lucide-react-native';
import { Screen } from '@/src/components/Screen';
import { Button } from '@/src/components/Button';
import { Badge } from '@/src/components/Badge';
import { useAuthStore } from '@/src/store/auth-store';
import { useAppStore } from '@/src/store/app-store';
import { DEMO_PAYMENT_METHODS } from '@/src/data/catalog';
import { formatAddress } from '@/src/lib/format';
import { colors, radii, shadowWarm, spacing } from '@/src/theme';

function LinkRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.9 }]}
    >
      <View style={styles.linkIcon}>{icon}</View>
      <View style={styles.linkText}>
        <Text style={styles.linkTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.linkSub} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <ChevronRight color={colors.onSurfaceVariant} size={18} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const deliveryAddress = useAppStore((s) => s.deliveryAddress);
  const paymentId = useAppStore((s) => s.selectedPaymentMethodId);

  const payment = DEMO_PAYMENT_METHODS.find((p) => p.id === paymentId);
  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';

  const onLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.name ?? 'T')
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </Text>
        </View>
        <View style={styles.userMeta}>
          <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
          <Text style={styles.email}>{user?.email ?? 'Not signed in'}</Text>
          {user?.role ? (
            <Badge
              label={user.role === 'SHOPPER' ? 'Shopper' : 'Customer'}
              tone={user.role === 'SHOPPER' ? 'secondary' : 'primary'}
              style={{ marginTop: 6 }}
            />
          ) : null}
        </View>
      </View>

      <View style={styles.links}>
        <LinkRow
          icon={<MapPin color={colors.primary} size={20} />}
          title="Delivery address"
          subtitle={
            deliveryAddress
              ? formatAddress(deliveryAddress)
              : 'Add a delivery address'
          }
          onPress={() => router.push('/address')}
        />
        <LinkRow
          icon={<CreditCard color={colors.primary} size={20} />}
          title="Payment methods"
          subtitle={payment?.label ?? 'Add a payment method'}
          onPress={() => router.push('/payment')}
        />
      </View>

      <View style={styles.note}>
        <ShoppingBag color={colors.secondary} size={20} />
        <View style={{ flex: 1 }}>
          <Text style={styles.noteTitle}>Shopper mode</Text>
          <Text style={styles.noteBody}>
            Sign in with a shopper email (e.g. shopper@teedeux.com) to pick and
            fulfill local orders. Customer shopping stays on these tabs.
          </Text>
        </View>
      </View>

      <Button
        title="Log out"
        variant="outline"
        icon={<LogOut color={colors.onSurface} size={18} />}
        onPress={onLogout}
        fullWidth
      />

      <Text style={styles.version}>Teedeux Mart · v{version}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  title: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 28,
    color: colors.primary,
    letterSpacing: -0.4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.4)',
    ...shadowWarm.raised,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 22,
    color: colors.primary,
  },
  userMeta: { flex: 1 },
  name: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 20,
    color: colors.onSurface,
  },
  email: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  links: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(224,192,178,0.4)',
    overflow: 'hidden',
    ...shadowWarm.raised,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(224,192,178,0.45)',
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.savannaSand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: { flex: 1, gap: 2 },
  linkTitle: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 15,
    color: colors.onSurface,
  },
  linkSub: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  note: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: 'rgba(185,238,171,0.35)',
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  noteTitle: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 15,
    color: colors.lushLeaf,
    marginBottom: 4,
  },
  noteBody: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  version: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
