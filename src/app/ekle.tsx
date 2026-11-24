// Hızlı ekle: alt menüdeki "+" ile açılır.
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icons';
import { T, tap } from '@/components/ui';
import { useStore } from '@/lib/store';
import { FREE_VEHICLE_LIMIT } from '@/lib/types';
import { colors, fonts, radius, space } from '@/theme';

export default function QuickAdd() {
  const { state } = useStore();
  const hasVehicle = state.vehicles.length > 0;
  const first = state.vehicles[0]?.id;

  const go = (fn: () => void) => () => {
    tap();
    router.back();
    setTimeout(fn, 60);
  };

  const options: { icon: IconName; title: string; text: string; onPress: () => void; disabled?: boolean }[] = [
    {
      icon: 'fuel',
      title: 'Yakıt',
      text: 'Tutarı yaz, kaydet',
      disabled: !hasVehicle,
      onPress: go(() => router.push({ pathname: '/masraf/yeni', params: { kategori: 'Yakıt' } })),
    },
    {
      icon: 'wallet',
      title: 'Masraf',
      text: 'Bakım, sigorta, vergi ve diğerleri',
      disabled: !hasVehicle,
      onPress: go(() => router.push('/masraf/yeni')),
    },
    {
      icon: 'gauge',
      title: 'Kilometre',
      text: 'Güncel km ya da motor saati',
      disabled: !hasVehicle,
      onPress: go(() => first && router.push({ pathname: '/km', params: { vehicleId: first } })),
    },
    {
      icon: 'doc',
      title: 'Belge',
      text: 'Ruhsat, poliçe, muayene',
      disabled: !hasVehicle,
      onPress: go(() => router.push('/belge/yeni')),
    },
    {
      icon: 'car',
      title: 'Araç',
      text: state.vehicles.length >= FREE_VEHICLE_LIMIT ? 'Ek araç için Plus' : 'Garaja yeni araç',
      onPress: go(() => router.push(state.vehicles.length >= FREE_VEHICLE_LIMIT ? '/plus' : '/arac/yeni')),
    },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.root}>
      <View style={styles.grid}>
        {options.map((o) => (
          <Pressable
            key={o.title}
            accessibilityRole="button"
            disabled={o.disabled}
            onPress={o.onPress}
            style={({ pressed }) => [styles.tile, o.disabled && { opacity: 0.4 }, pressed && { transform: [{ scale: 0.97 }] }]}>
            <View style={styles.icon}>
              <Icon name={o.icon} color={colors.brass} size={24} />
            </View>
            <Text style={styles.title}>{o.title}</Text>
            <Text style={styles.text} numberOfLines={2}>
              {o.text}
            </Text>
          </Pressable>
        ))}
      </View>
      {!hasVehicle ? (
        <T variant="small" style={{ textAlign: 'center' }}>
          Önce garaja bir araç ekle.
        </T>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper, padding: space.lg, gap: space.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  tile: {
    width: '47.5%',
    minHeight: 132,
    borderRadius: radius.lg,
    backgroundColor: colors.green,
    padding: space.lg,
    gap: 6,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: { fontFamily: fonts.bold, fontSize: 17, color: colors.cream },
  text: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.sage, lineHeight: 17 },
});
