// Türkiye plakası: mavi şeritte TR, beyaz zemin, tek satır. size ile ölçeklenir.
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

export function Plate({ value, size = 13 }: { value: string; size?: number }) {
  if (!value) return null;
  return (
    <View style={[styles.plate, { height: size * 2.1, borderRadius: size * 0.36, borderWidth: Math.max(1, size * 0.1) }]}>
      <View style={[styles.band, { width: size * 1.3, paddingBottom: size * 0.2 }]}>
        <Text style={[styles.tr, { fontSize: size * 0.5 }]}>TR</Text>
      </View>
      <Text numberOfLines={1} style={[styles.no, { fontSize: size, paddingHorizontal: size * 0.55 }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderColor: '#161616',
    overflow: 'hidden',
  },
  band: { backgroundColor: colors.plateBlue, alignItems: 'center', justifyContent: 'flex-end' },
  tr: { color: colors.white, fontFamily: fonts.bold },
  no: { alignSelf: 'center', fontFamily: fonts.bold, color: '#111', letterSpacing: 0.8 },
});
