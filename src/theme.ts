import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const colors = {
  primary: '#0052cc',
  primaryDark: '#003d99',
  splash: '#003366',
  white: '#ffffff',
  background: '#f5f5f5',
  backgroundDark: '#121212',
  surface: '#ffffff',
  surfaceDark: '#1e1e1e',
  cardDark: '#1e1e1e',
  text: '#1f2937',
  textDark: '#f3f4f6',
  textSecondary: '#6b7280',
  textSecondaryDark: '#9ca3af',
  error: '#dc2626',
  success: '#16a34a',
  border: '#e5e7eb',
  borderDark: '#374151',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.surface,
    onSurface: colors.text,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    background: colors.backgroundDark,
    surface: colors.surfaceDark,
    onSurface: colors.textDark,
  },
};

export function getScreenColors(isDark: boolean) {
  return {
    background: isDark ? colors.backgroundDark : colors.background,
    surface: isDark ? colors.surfaceDark : colors.surface,
    text: isDark ? colors.textDark : colors.text,
    textSecondary: isDark ? colors.textSecondaryDark : colors.textSecondary,
    appbar: isDark ? colors.surfaceDark : colors.primary,
    border: isDark ? colors.borderDark : colors.border,
  };
}
