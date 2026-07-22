import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../theme';

type Tone = 'primary' | 'secondary' | 'tertiary' | 'muted' | 'danger';

const toneMap: Record<Tone, { bg: string; fg: string }> = {
  primary: { bg: colors.primaryFixed, fg: '#7a3000' },
  secondary: { bg: 'rgba(185,238,171,0.65)', fg: '#23501e' },
  tertiary: { bg: colors.tertiaryFixed, fg: '#5b4300' },
  muted: { bg: colors.surfaceHigh, fg: colors.onSurfaceVariant },
  danger: { bg: colors.errorContainer, fg: '#93000a' },
};

export function Badge({
  label,
  tone = 'muted',
  style,
}: {
  label: string;
  tone?: Tone;
  style?: ViewStyle;
}) {
  const t = toneMap[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      <Text style={[styles.text, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  text: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
