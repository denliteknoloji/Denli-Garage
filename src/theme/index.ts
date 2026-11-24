// Denli Garage tasarım sistemi: sitedeki renk ve tipografiyle birebir.
export const colors = {
  night: '#0A2A20',
  green: '#0F3D2E',
  green2: '#16503D',
  green3: '#1E6249',
  brass: '#E8B931',
  brassDeep: '#9A7A12',
  cream: '#F4F1E8',
  paper: '#FBFAF6',
  white: '#FFFFFF',
  ink: '#10261E',
  muted: '#4E5E56',
  sage: '#A9C2B5',
  line: '#DDD8CA',
  danger: '#C2462F',
  warn: '#B7791F',
  ok: '#2F7D55',
  plateBlue: '#1F4FB5',
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 10, md: 16, lg: 22, pill: 999 } as const;

export const shadow = {
  card: {
    shadowColor: '#0A2A20',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
} as const;
