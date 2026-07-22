import { TextStyle, ViewStyle } from 'react-native';

/**
 * Teedeux Vitality design tokens for the mobile app.
 * Sourced from stitch_teedeux_mart_delivery_app/teedeux_vitality/DESIGN.md
 */

export const colors = {
  background: '#fcf9f8',
  surface: '#fcf9f8',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f6f3f2',
  surfaceContainer: '#f0eded',
  surfaceHigh: '#eae7e7',
  onSurface: '#1c1b1b',
  onSurfaceVariant: '#584238',
  primary: '#9c3f00',
  primaryContainer: '#c45100',
  onPrimary: '#ffffff',
  primaryFixed: '#ffdbcc',
  secondary: '#3b6934',
  secondaryContainer: '#b9eeab',
  onSecondary: '#ffffff',
  tertiary: '#765700',
  tertiaryFixed: '#ffdf9f',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  outline: '#8c7166',
  outlineVariant: '#e0c0b2',
  savannaSand: '#F9F4E8',
  earthClay: '#8B4513',
  lushLeaf: '#1E3F1B',
  chiliRed: '#9E2A2B',
  brandOrange: '#e36414',
  white: '#ffffff',
  black: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 40,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const fonts = {
  sans: 'HankenGrotesk',
  mono: 'JetBrainsMono',
} as const;

type TypographyStyle = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing'
>;

export const typography = {
  headlineXl: {
    fontFamily: fonts.sans,
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 48,
    letterSpacing: -0.02 * 40,
  } satisfies TypographyStyle,
  headlineLg: {
    fontFamily: fonts.sans,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.01 * 28,
  } satisfies TypographyStyle,
  headlineMd: {
    fontFamily: fonts.sans,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  } satisfies TypographyStyle,
  bodyLg: {
    fontFamily: fonts.sans,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
  } satisfies TypographyStyle,
  bodyMd: {
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } satisfies TypographyStyle,
  bodySm: {
    fontFamily: fonts.sans,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } satisfies TypographyStyle,
  labelMd: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  } satisfies TypographyStyle,
  labelSm: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  } satisfies TypographyStyle,
  price: {
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  } satisfies TypographyStyle,
} as const;

/** Soft warm ambient shadow — brand orange at ~6–8% opacity */
export const shadowWarm = {
  card: {
    shadowColor: colors.brandOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  } satisfies ViewStyle,
  raised: {
    shadowColor: colors.brandOrange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  } satisfies ViewStyle,
  floating: {
    shadowColor: colors.brandOrange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  } satisfies ViewStyle,
} as const;

export const theme = {
  colors,
  spacing,
  radii,
  fonts,
  typography,
  shadowWarm,
} as const;

export type Theme = typeof theme;
export type ThemeColors = typeof colors;
export type SpacingKey = keyof typeof spacing;
export type RadiiKey = keyof typeof radii;

export default theme;
