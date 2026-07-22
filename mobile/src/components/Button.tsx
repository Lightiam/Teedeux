import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing } from '../theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  fullWidth,
  disabled,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.onPrimary}
        />
      ) : (
        <View style={styles.row}>
          {icon}
          <Text style={[styles.text, textVariants[variant], sizeText[size], textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  fullWidth: { alignSelf: 'stretch', width: '100%' },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  text: { fontWeight: '700' },
});

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 36 },
  md: { paddingVertical: 12, paddingHorizontal: 16, minHeight: 44 },
  lg: { paddingVertical: 14, paddingHorizontal: 20, minHeight: 52 },
};

const sizeText: Record<Size, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
};

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  secondary: { backgroundColor: colors.secondary },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.error },
};

const textVariants: Record<Variant, TextStyle> = {
  primary: { color: colors.onPrimary },
  secondary: { color: colors.onSecondary },
  outline: { color: colors.onSurface },
  ghost: { color: colors.primary },
  danger: { color: colors.onPrimary },
};
