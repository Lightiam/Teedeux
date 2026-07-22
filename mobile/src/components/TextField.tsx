import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing } from '../theme';

interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function TextField({ label, error, containerStyle, style, ...rest }: FieldProps) {
  return (
    <View style={[styles.wrap, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.onSurfaceVariant}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: 'rgba(249,244,232,0.9)',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.onSurface,
    fontFamily: 'HankenGrotesk_400Regular',
  },
  inputError: { borderBottomColor: colors.error },
  error: { marginTop: 4, color: colors.error, fontSize: 13 },
});
