import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Button } from '@/src/components/Button';
import { TextField } from '@/src/components/TextField';
import { DEMO_ADDRESSES } from '@/src/data/catalog';
import { formatAddress } from '@/src/lib/format';
import { useAppStore } from '@/src/store/app-store';
import type { Address } from '@/src/types';
import { colors, radii, spacing } from '@/src/theme';

export default function AddressScreen() {
  const insets = useSafeAreaInsets();
  const current = useAppStore((s) => s.deliveryAddress);
  const setAddress = useAppStore((s) => s.setAddress);
  const [draft, setDraft] = useState<Address>(
    current ?? {
      id: `addr_${Date.now()}`,
      label: 'Home',
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    }
  );

  const valid =
    draft.line1.trim().length > 3 &&
    draft.city.trim().length > 1 &&
    /^[A-Z]{2}$/.test(draft.state.trim().toUpperCase()) &&
    /^\d{5}(-\d{4})?$/.test(draft.postalCode.trim());

  function save() {
    const next = {
      ...draft,
      state: draft.state.trim().toUpperCase(),
      postalCode: draft.postalCode.trim(),
    };
    setAddress(next);
    router.back();
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft color={colors.primary} size={22} />
        </Pressable>
        <Text style={styles.title}>Delivery address</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.section}>Saved</Text>
        {DEMO_ADDRESSES.map((addr) => {
          const selected = current?.id === addr.id;
          return (
            <Pressable
              key={addr.id}
              onPress={() => {
                setAddress(addr);
                setDraft(addr);
              }}
              style={[styles.saved, selected && styles.savedOn]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.savedLabel}>{addr.label ?? 'Address'}</Text>
                <Text style={styles.savedValue}>{formatAddress(addr)}</Text>
              </View>
              {selected ? <Check color={colors.secondary} size={20} /> : null}
            </Pressable>
          );
        })}

        <Text style={[styles.section, { marginTop: spacing.xl }]}>Custom</Text>
        <TextField
          label="Street"
          value={draft.line1}
          onChangeText={(line1) => setDraft((d) => ({ ...d, line1 }))}
        />
        <TextField
          label="Apt / Suite"
          value={draft.line2 ?? ''}
          onChangeText={(line2) => setDraft((d) => ({ ...d, line2 }))}
        />
        <TextField
          label="City"
          value={draft.city}
          onChangeText={(city) => setDraft((d) => ({ ...d, city }))}
        />
        <View style={styles.row}>
          <TextField
            label="State"
            containerStyle={{ flex: 1 }}
            autoCapitalize="characters"
            maxLength={2}
            value={draft.state}
            onChangeText={(state) => setDraft((d) => ({ ...d, state }))}
          />
          <TextField
            label="ZIP"
            containerStyle={{ flex: 1 }}
            keyboardType="number-pad"
            value={draft.postalCode}
            onChangeText={(postalCode) => setDraft((d) => ({ ...d, postalCode }))}
          />
        </View>

        <Button title="Save address" fullWidth disabled={!valid} onPress={save} />
      </View>
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
    fontSize: 20,
    color: colors.primary,
  },
  body: { flex: 1, paddingHorizontal: spacing.lg },
  section: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  saved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  savedOn: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(185,238,171,0.25)',
  },
  savedLabel: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 15,
    color: colors.onSurface,
  },
  savedValue: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  row: { flexDirection: 'row', gap: spacing.md },
});
