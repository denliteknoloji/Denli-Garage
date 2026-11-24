// Garaj sahnesi: araç, garaj kapısı çıtalarının önünde büyük çizilir; altında adı ve plakası.
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { odometerUnit, TYPE_LABEL } from '@/lib/catalog';
import { formatNumber } from '@/lib/format';
import type { Vehicle } from '@/lib/types';
import { colors, fonts, radius, space } from '@/theme';

import { Plate } from './plate';
import { tap } from './ui';
import { VehicleArt } from './vehicle-art';

export function vehicleName(v: Vehicle): string {
  return v.nickname || `${v.brand} ${v.model}`.trim();
}

export function VehicleHero({ v, width, pressable = true }: { v: Vehicle; width: number; pressable?: boolean }) {
  const meta = [v.year ? String(v.year) : null, v.fuel, TYPE_LABEL[v.type]].filter(Boolean).join(' · ');
  const content = (
    <>
      <View style={styles.stage}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.slat, { top: 18 + i * 26 }]} />
        ))}
        <View style={styles.odo}>
          <Text style={styles.odoValue}>{v.odometer != null ? formatNumber(v.odometer) : '—'}</Text>
          <Text style={styles.odoUnit}>{odometerUnit(v.type)}</Text>
        </View>
        <View style={styles.art}>
          <VehicleArt type={v.type} width={Math.min(260, width - 60)} />
        </View>
        <View style={styles.floor} />
      </View>
      <View style={styles.body}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text numberOfLines={1} style={styles.name}>
            {vehicleName(v)}
          </Text>
          <Text numberOfLines={1} style={styles.meta}>
            {v.nickname ? `${v.brand} ${v.model} · ` : ''}
            {meta}
          </Text>
        </View>
        {v.plate ? <Plate value={v.plate} size={14} /> : null}
      </View>
    </>
  );

  if (!pressable) return <View style={[styles.card, { width }]}>{content}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${vehicleName(v)} aracını aç`}
      onPress={() => {
        tap();
        router.push({ pathname: '/arac/[id]', params: { id: v.id } });
      }}
      style={({ pressed }) => [styles.card, { width }, pressed && { transform: [{ scale: 0.99 }] }]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.green },
  stage: { height: 168, backgroundColor: colors.night, overflow: 'hidden' },
  slat: { position: 'absolute', left: 0, right: 0, height: 14, backgroundColor: 'rgba(244,241,232,.035)' },
  odo: { position: 'absolute', top: space.md, right: space.lg, alignItems: 'flex-end' },
  odoValue: { fontFamily: fonts.bold, fontSize: 18, color: colors.cream, letterSpacing: -0.3 },
  odoUnit: { fontFamily: fonts.medium, fontSize: 11.5, color: colors.sage },
  art: { position: 'absolute', left: 0, right: 0, bottom: 10, alignItems: 'center' },
  floor: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, backgroundColor: colors.brass },
  body: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg },
  name: { fontFamily: fonts.bold, fontSize: 20, color: colors.cream, letterSpacing: -0.3 },
  meta: { fontFamily: fonts.regular, fontSize: 13, color: colors.sage },
});
