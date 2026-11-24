// Uygulama ikonları (sitedeki ikon setiyle aynı çizgi dili: 24px, 1.8 çizgi).
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

export type IconName =
  | 'home'
  | 'vault'
  | 'wallet'
  | 'user'
  | 'plus'
  | 'car'
  | 'moto'
  | 'tractor'
  | 'bell'
  | 'chevron'
  | 'close'
  | 'trash'
  | 'doc'
  | 'shield'
  | 'star'
  | 'search'
  | 'fuel'
  | 'gauge'
  | 'edit'
  | 'check'
  | 'wrench';

export function Icon({ name, size = 22, color = colors.ink }: { name: IconName; size?: number; color?: string }) {
  const p = { stroke: color, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' && <Path {...p} d="M3 11 12 4l9 7M5.5 9.5V20h13V9.5" />}
      {name === 'vault' && (
        <>
          <Rect {...p} x={3.5} y={5} width={17} height={14} rx={2.5} />
          <Path {...p} d="M3.5 9.5h17M10 13h4" />
        </>
      )}
      {name === 'wallet' && (
        <>
          <Path {...p} d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" />
          <Rect {...p} x={4} y={8} width={16.5} height={11} rx={2.5} />
          <Circle cx={16} cy={13.5} r={1.2} fill={color} />
        </>
      )}
      {name === 'user' && (
        <>
          <Circle {...p} cx={12} cy={8.5} r={3.5} />
          <Path {...p} d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5" />
        </>
      )}
      {name === 'plus' && <Path {...p} d="M12 5v14M5 12h14" />}
      {name === 'car' && (
        <>
          <Path {...p} d="M5 16.5h14M4 16.5v-3.2l1.7-4.4A2 2 0 0 1 7.6 7.5h8.8a2 2 0 0 1 1.9 1.4l1.7 4.4v3.2" />
          <Circle {...p} cx={7.5} cy={16.5} r={1.8} />
          <Circle {...p} cx={16.5} cy={16.5} r={1.8} />
        </>
      )}
      {name === 'moto' && (
        <>
          <Circle {...p} cx={6} cy={16} r={3} />
          <Circle {...p} cx={18} cy={16} r={3} />
          <Path {...p} d="M6 16 10 9h4l4 7M14 9l-1-3h2.5M9 12h6" />
        </>
      )}
      {name === 'tractor' && (
        <>
          <Circle {...p} cx={7} cy={15.5} r={3.5} />
          <Circle {...p} cx={18} cy={17} r={2} />
          <Path {...p} d="M5 11V6h5l1.5 5H19v4M11.5 11v4.5M10.5 15.5h5.5" />
        </>
      )}
      {name === 'bell' && <Path {...p} d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16ZM10 20.5a2 2 0 0 0 4 0" />}
      {name === 'chevron' && <Path {...p} d="m9 6 6 6-6 6" />}
      {name === 'close' && <Path {...p} d="M6 6l12 12M18 6 6 18" />}
      {name === 'trash' && <Path {...p} d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 12.5h9l1-12.5" />}
      {name === 'doc' && (
        <>
          <Path {...p} d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20V3.5Z" />
          <Path {...p} d="M14 3.5V8h4M9.5 12.5h5M9.5 16h5" />
        </>
      )}
      {name === 'shield' && <Path {...p} d="M12 3.5 19 6v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6l7-2.5Z" />}
      {name === 'star' && <Path {...p} d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6L12 4Z" />}
      {name === 'search' && (
        <>
          <Circle {...p} cx={11} cy={11} r={6} />
          <Path {...p} d="m20 20-4.5-4.5" />
        </>
      )}
      {name === 'fuel' && <Path {...p} d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4h6A1.5 1.5 0 0 1 14 5.5V20M4 20h11M7 8h5M14 11h2a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V8.5L18 6" />}
      {name === 'gauge' && <Path {...p} d="M4.5 16a7.5 7.5 0 1 1 15 0M12 16l3.5-4.5M4.5 16h2M17.5 16h2" />}
      {name === 'edit' && <Path {...p} d="M5 19h3.5L18 9.5 14.5 6 5 15.5V19ZM13 7.5l3.5 3.5" />}
      {name === 'check' && <Path {...p} d="m5 12.5 4.5 4.5L19 7.5" />}
      {name === 'wrench' && <Path {...p} d="M14.5 4.5a4.5 4.5 0 0 0-4.3 5.8L4.5 16a2 2 0 0 0 2.8 2.8l5.7-5.7a4.5 4.5 0 0 0 5.8-4.3l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6c-.4-.2-.9-.3-1.3-.3Z" />}
    </Svg>
  );
}

/** Denli Garage işareti: çatı + kapı, alt çıta pirinç */
export function GarageMark({ size = 64, light = true }: { size?: number; light?: boolean }) {
  const c = light ? colors.cream : colors.green;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M17 45 L50 21 L83 45" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <Rect x={27} y={50} width={46} height={30} rx={5} fill="none" stroke={c} strokeWidth={6} />
      <Rect x={35} y={57.5} width={30} height={5} rx={1.5} fill={c} />
      <Rect x={35} y={67} width={30} height={5} rx={1.5} fill={colors.brass} />
    </Svg>
  );
}
