export const LightTheme = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceVariant: '#F0F1F3',
  primary: '#1A73E8',
  primaryLight: '#E8F0FE',
  text: '#1A1A2E',
  textSecondary: '#5F6368',
  textTertiary: '#9AA0A6',
  border: '#E0E0E0',
  skeleton: '#E8E8E8',
  skeletonHighlight: '#F5F5F5',
  chipBackground: '#F0F1F3',
  chipActiveBackground: '#1A73E8',
  chipText: '#5F6368',
  chipActiveText: '#FFFFFF',
  error: '#D93025',
  statusBar: 'dark-content' as const,
  card: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.08)',
  accent: '#34A853',
  headerBackground: '#FFFFFF',
  searchBackground: '#F0F1F3',
  refreshControl: '#1A73E8',
};

export const DarkTheme = {
  background: '#121212',
  surface: '#1E1E2E',
  surfaceVariant: '#2A2A3C',
  primary: '#8AB4F8',
  primaryLight: '#1E3A5F',
  text: '#E8EAED',
  textSecondary: '#9AA0A6',
  textTertiary: '#6B7280',
  border: '#3C3C4E',
  skeleton: '#2A2A3C',
  skeletonHighlight: '#3C3C4E',
  chipBackground: '#2A2A3C',
  chipActiveBackground: '#8AB4F8',
  chipText: '#9AA0A6',
  chipActiveText: '#1A1A2E',
  error: '#F28B82',
  statusBar: 'light-content' as const,
  card: '#1E1E2E',
  shadow: 'rgba(0,0,0,0.3)',
  accent: '#81C995',
  headerBackground: '#1E1E2E',
  searchBackground: '#2A2A3C',
  refreshControl: '#8AB4F8',
};

export type ThemeColors = {
  [K in keyof typeof LightTheme]: K extends 'statusBar'
    ? 'dark-content' | 'light-content'
    : string;
};
