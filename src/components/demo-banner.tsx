// Web deneme sürümünde her ekranın üstünde görünen şerit.
import { StyleSheet, Text, View } from 'react-native';

import { IS_DEMO } from '@/lib/demo';
import { demoExpiry, useStore } from '@/lib/store';
import { colors, fonts } from '@/theme';

function leftText(expiresAt: number | null): string {
  if (!expiresAt) return 'Veriler 24 saat sonra silinir';
  const h = Math.max(0, Math.ceil((expiresAt - Date.now()) / 3_600_000));
  return h <= 1 ? 'Veriler 1 saat içinde silinecek' : `Veriler ${h} saat sonra silinecek`;
}

export function DemoBanner() {
  // Durum değiştikçe yeniden hesaplanması için store'a abone olur
  const { state } = useStore();
  if (!IS_DEMO || !state.onboarded) return null;
  return (
    <View style={styles.bar}>
      <Text style={styles.text} numberOfLines={1}>
        <Text style={styles.strong}>Deneme sürümü</Text> · {leftText(demoExpiry())}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.brass, paddingVertical: 7, paddingHorizontal: 16, alignItems: 'center' },
  text: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.night },
  strong: { fontFamily: fonts.bold },
});
