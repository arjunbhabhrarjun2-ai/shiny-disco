// Kandella Design Tokens — single source of truth for JS/TS usage

export const colors = {
  // Backgrounds
  bg:        '#070B14',
  surface1:  '#0D1421',
  surface2:  '#111827',
  border:    'rgba(255, 255, 255, 0.06)',

  // Accents
  blue:      '#3B82F6',
  blueLight: '#60A5FA',
  cyan:      '#06B6D4',
  emerald:   '#10B981',
  rose:      '#F43F5E',
  gold:      '#F59E0B',

  // Text
  textPrimary:   '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted:     '#6B7280',
} as const;

export const chart = {
  primary:   '#3B82F6',
  secondary: '#06B6D4',
  tertiary:  '#10B981',
  grid:      'rgba(255, 255, 255, 0.06)',
  tooltip: {
    bg:     '#0D1421',
    border: 'rgba(255, 255, 255, 0.08)',
  },
} as const;

export const radius = {
  card:   '12px',
  input:  '8px',
  button: '8px',
  pill:   '9999px',
} as const;

export const fonts = {
  sans:    'Inter, system-ui, -apple-system, sans-serif',
  display: 'Space Grotesk, system-ui, sans-serif',
  mono:    'JetBrains Mono, Courier New, monospace',
} as const;
