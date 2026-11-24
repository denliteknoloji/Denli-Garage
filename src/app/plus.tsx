import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { GarageMark, Icon } from '@/components/icons';
import { Button, Card, Screen, T } from '@/components/ui';
import { useStore } from '@/lib/store';
import { FREE_VEHICLE_LIMIT } from '@/lib/types';
import { colors, space } from '@/theme';

const FEATURES = [
  'Sınırsız araç',
  'Fiş, fatura ve poliçe okutma',
  'Araç Karnesi PDF ve ilana dönüştürme',
  'Gelişmiş raporlar, Excel ve PDF dışa aktarma',
  'Aile ve ortak garaj paylaşımı',
  'Traktör ekipman takibi',
];

export default function Plus() {
  const { state } = useStore();
  const atLimit = state.vehicles.length >= FREE_VEHICLE_LIMIT;

  return (
    <Screen edges={['bottom']}>
      <Card style={styles.hero}>
        <View style={styles.mark}>
          <GarageMark size={52} />
        </View>
        <T variant="h2" color={colors.cream} style={{ textAlign: 'center' }}>
          {atLimit ? 'Ücretsiz planda 1 araç eklenebilir' : 'Denli Garage Plus'}
        </T>
        <T color={colors.sage} style={{ textAlign: 'center' }}>
          Birden fazla araç ve fiş okutma gibi ekstra özellikler Plus ile geliyor.
        </T>
      </Card>

      <Card style={{ gap: space.md }}>
        {FEATURES.map((f) => (
          <View key={f} style={styles.feature}>
            <Icon name="star" color={colors.brass} size={20} />
            <T style={{ flex: 1 }}>{f}</T>
          </View>
        ))}
      </Card>

      <View style={styles.prices}>
        <Card style={styles.price}>
          <T variant="label">Aylık</T>
          <T variant="h2">₺150</T>
          <T variant="small">her ay yenilenir</T>
        </Card>
        <Card style={[styles.price, { borderColor: colors.brass, borderWidth: 2 }]}>
          <T variant="label" color={colors.brassDeep}>
            Yıllık · 2 ay bedava
          </T>
          <T variant="h2">₺1.500</T>
          <T variant="small">her yıl yenilenir</T>
        </Card>
      </View>

      <Button title="Satın alma yakında açılacak" variant="brass" disabled onPress={() => {}} />
      <Button title="Şimdilik geç" variant="ghost" onPress={() => router.back()} />
      <T variant="small" style={{ textAlign: 'center' }}>
        Abonelik, uygulama mağazası hesabın üzerinden alınacak ve mağaza ayarlarından istediğin zaman iptal edilebilecek.
      </T>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.green, borderColor: colors.green, alignItems: 'center', gap: space.md, paddingVertical: space.xl },
  mark: { width: 76, height: 76, borderRadius: 24, backgroundColor: colors.night, alignItems: 'center', justifyContent: 'center' },
  feature: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  prices: { flexDirection: 'row', gap: space.md },
  price: { flex: 1, gap: 2, alignItems: 'flex-start' },
});
