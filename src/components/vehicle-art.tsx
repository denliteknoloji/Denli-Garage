// Araç yan profil çizimleri: otomobil, motosiklet, traktör. Tek renk, sahnede büyük kullanılır.
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import type { VehicleType } from '@/lib/types';

export function VehicleArt({
  type,
  width = 220,
  body = '#F4F1E8',
  glass = '#16503D',
  tire = '#0A2A20',
}: {
  type: VehicleType;
  width?: number;
  body?: string;
  glass?: string;
  tire?: string;
}) {
  const h = Math.round(width * 0.45);
  if (type === 'motosiklet') {
    return (
      <Svg width={width} height={h} viewBox="0 0 200 90">
        <G>
          <Circle cx={42} cy={64} r={22} fill={tire} />
          <Circle cx={42} cy={64} r={9} fill={body} opacity={0.9} />
          <Circle cx={158} cy={64} r={22} fill={tire} />
          <Circle cx={158} cy={64} r={9} fill={body} opacity={0.9} />
          <Path d="M42 64 L78 40 L120 40 L158 64" stroke={body} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d="M70 40 C 76 26, 104 22, 122 30 L 128 40 Z" fill={body} />
          <Path d="M120 40 L136 18 L150 18" stroke={body} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Rect x={82} y={44} width={30} height={14} rx={5} fill={glass} />
          <Path d="M58 34 L92 34" stroke={body} strokeWidth={8} strokeLinecap="round" />
        </G>
      </Svg>
    );
  }
  if (type === 'traktor') {
    return (
      <Svg width={width} height={h} viewBox="0 0 200 90">
        <G>
          <Rect x={30} y={44} width={110} height={22} rx={6} fill={body} />
          <Path d="M96 44 V12 H140 L146 44 Z" fill={body} />
          <Rect x={104} y={18} width={34} height={22} rx={3} fill={glass} />
          <Rect x={44} y={26} width={6} height={18} rx={2} fill={body} />
          <Circle cx={128} cy={62} r={26} fill={tire} />
          <Circle cx={128} cy={62} r={11} fill={body} opacity={0.9} />
          <Circle cx={52} cy={72} r={15} fill={tire} />
          <Circle cx={52} cy={72} r={6} fill={body} opacity={0.9} />
          <Path d="M24 54 H34" stroke={body} strokeWidth={6} strokeLinecap="round" />
        </G>
      </Svg>
    );
  }
  return (
    <Svg width={width} height={h} viewBox="0 0 200 90">
      <G>
        <Path
          d="M14 62 C 14 50, 22 46, 34 44 L 58 40 L 82 22 C 86 19, 92 18, 98 18 H 132 C 140 18, 146 21, 151 26 L 166 40 L 182 44 C 189 46, 192 52, 192 58 V 64 C 192 67, 190 68, 187 68 H 18 C 15 68, 14 66, 14 62 Z"
          fill={body}
        />
        <Path d="M66 40 L86 25 C 88 24, 91 23, 94 23 H 112 V 40 Z" fill={glass} />
        <Path d="M118 23 H 132 C 137 23, 141 25, 144 28 L 156 40 H 118 Z" fill={glass} />
        <Circle cx={52} cy={68} r={16} fill={tire} />
        <Circle cx={52} cy={68} r={7} fill={body} opacity={0.9} />
        <Circle cx={156} cy={68} r={16} fill={tire} />
        <Circle cx={156} cy={68} r={7} fill={body} opacity={0.9} />
        <Rect x={184} y={50} width={7} height={5} rx={2} fill="#E8B931" />
      </G>
    </Svg>
  );
}
