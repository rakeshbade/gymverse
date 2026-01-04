export const COLORS = {
  // Dark mode palette
  background: '#000000',
  backgroundSecondary: '#0A0A0A',
  backgroundCard: '#1A1A1A',
  
  // Neon accent (primary brand color)
  neon: '#9EFD38',
  neonDark: '#7ACC2A',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#707070',
  
  // Functional colors
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
};

export const TYPOGRAPHY = {
  // Font sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  body: 16,
  bodySmall: 14,
  caption: 12,
  
  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.neon,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.neon,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.neon,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
