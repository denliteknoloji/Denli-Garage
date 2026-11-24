// Hatırlatma satırı: başlık, tarih, kalan gün ve aciliyete göre renkli çubuk.
import { StyleSheet, Text, View } from 'react-native';

import { formatTR, relativeDays } from '@/lib/dates';
import { colors, fonts, radius } from '@/theme';

export function urgencyColor(days: number): string {
  if (days < 0) return colors.danger;
  if (days <= 15) return colors.danger;
  if (days <= 45) return colors.warn;
  return colors.ok;
}

export function ReminderRow({ title, date, days, subtitle }: { title: string; date: string; days: number; subtitle?: string }) {
  const c = urgencyColor(days);
  // 365 günlük pencerede dolum oranı: yaklaştıkça çubuk dolar
  const fill = Math.max(0.06, Math.min(1, 1 - days / 365));
  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {subtitle ? `${subtitle} · ` : ''}
            {formatTR(date)}
          </Text>
        </View>
        <Text style={[styles.days, { color: c }]}>{relativeDays(days)}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.bar, { width: `${fill * 100}%`, backgroundColor: c }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, paddingVertical: 10 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  sub: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginTop: 1 },
  days: { fontFamily: fonts.bold, fontSize: 13 },
  track: { height: 6, borderRadius: radius.pill, backgroundColor: '#EEF0EB', overflow: 'hidden' },
  bar: { height: '100%', borderRadius: radius.pill },
});
