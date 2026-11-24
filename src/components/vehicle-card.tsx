// Garajdaki araç kartı: üstte araç silüeti, altta ad, plaka ve bilgiler.
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { odometerUnit, TYPE_LABEL } from '@/lib/catalog';
import { formatNumber } from '@/lib/format';
import type { Vehicle } from '@/lib/types';
import { colors, fonts, radius, space } from '@/theme';

import { Icon } from './icons';
import { Plate } from './plate';
import { tap } from './ui';

export function VehicleCard({ v }: { v: Vehicle }) {
  const name = v.nickname || `${v.brand} ${v.model}`.trim();
  const chips = [
    v.year ? String(v.year) : null,
    v.fuel,
    v.odometer != null ? `${formatNumber(v.odometer)} ${odometerUnit(v.type)}` : null,
  ].filter(Boolean) as string[];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name} aracını aç`}
      onPress={() => {
        tap();
        router.push({ pathname: '/arac/[id]', params: { id: v.id } });
      }}
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.985 }] }]}>
      <View style={styles.visual}>
        <Text style={styles.type}>{TYPE_LABEL[v.type]}</Text>
        <View style={styles.silhouette}>
          <Icon name={v.type === 'traktor' ? 'tractor' : v.type === 'motosiklet' ? 'moto' : 'car'} size={84} color="rgba(244,241,232,.88)" />
        </View>
      </View>
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        {v.nickname ? (
          <Text numberOfLines={1} style={styles.sub}>
            {v.brand} {v.model}
          </Text>
        ) : null}
        <View style={styles.meta}>
          {v.plate ? <Plate value={v.plate} size={12} /> : null}
          {chips.map((c) => (
            <View key={c} style={styles.chip}>
              <Text style={styles.chipText}>{c}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.green },
  visual: { height: 112, backgroundColor: colors.green2, justifyContent: 'center', paddingHorizontal: space.lg },
  type: {
    position: 'absolute',
    top: space.md,
    left: space.lg,
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.sage,
  },
  silhouette: { position: 'absolute', right: space.lg, bottom: 4 },
  body: { padding: space.lg, gap: 6 },
  name: { fontFamily: fonts.bold, fontSize: 19, color: colors.cream, letterSpacing: -0.2 },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.sage },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 4 },
  chip: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: 'rgba(244,241,232,.12)' },
  chipText: { fontFamily: fonts.medium, fontSize: 12, color: colors.cream },
});
