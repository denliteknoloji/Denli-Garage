import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icons';
import { Button, Card, Empty, Screen, T, tap } from '@/components/ui';
import { confirm } from '@/lib/confirm';
import { formatTR, monthKey, monthLabel, todayISO } from '@/lib/dates';
import { formatTL } from '@/lib/format';
import { useStore } from '@/lib/store';
import { colors, fonts, radius, space } from '@/theme';

export default function Expenses() {
  const { state, removeExpense } = useStore();
  const { vehicles, expenses } = state;

  const current = monthKey(todayISO());
  const byMonth = new Map<string, number>();
  for (const e of expenses) byMonth.set(monthKey(e.date), (byMonth.get(monthKey(e.date)) ?? 0) + e.amount);
  const monthTotal = byMonth.get(current) ?? 0;

  // Son 6 ay, eskiden yeniye
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const max = Math.max(1, ...months.map((m) => byMonth.get(m) ?? 0));

  const byCategory = new Map<string, number>();
  for (const e of expenses.filter((x) => monthKey(x.date) === current))
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
  const cats = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);

  const sorted = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));
  const vehicleName = (id: string) => {
    const v = vehicles.find((x) => x.id === id);
    return v ? v.plate || `${v.brand} ${v.model}` : '';
  };

  return (
    <Screen>
      <View style={styles.header}>
        <T variant="title" style={{ flex: 1 }}>
          Masraflar
        </T>
        {vehicles.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Masraf ekle"
            onPress={() => {
              tap();
              router.push('/masraf/yeni');
            }}
            style={styles.add}>
            <Icon name="plus" color={colors.night} />
          </Pressable>
        ) : null}
      </View>

      {vehicles.length === 0 ? (
        <Empty title="Önce bir araç ekle" text="Masraflar araca bağlı tutulur. Garaj sekmesinden ilk aracını ekle." />
      ) : (
        <>
          <Card style={{ gap: space.md }}>
            <T variant="label">{monthLabel(current)}</T>
            <T variant="title">{formatTL(monthTotal)}</T>
            <View style={styles.chart}>
              {months.map((m) => {
                const v = byMonth.get(m) ?? 0;
                return (
                  <View key={m} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.bar,
                          { height: `${Math.max(4, (v / max) * 100)}%`, backgroundColor: m === current ? colors.brass : colors.green3 },
                        ]}
                      />
                    </View>
                    <T variant="small" style={{ fontSize: 11 }}>
                      {monthLabel(m).slice(0, 3)}
                    </T>
                  </View>
                );
              })}
            </View>
            {cats.length > 0 ? (
              <View style={{ gap: 6 }}>
                {cats.map(([c, v]) => (
                  <View key={c} style={styles.catRow}>
                    <T>{c}</T>
                    <T variant="h3">{formatTL(v)}</T>
                  </View>
                ))}
              </View>
            ) : null}
          </Card>

          {sorted.length === 0 ? (
            <Empty
              title="Henüz masraf yok"
              text="Yakıt, bakım, sigorta, vergi… Ne harcadıysan ekle, ay sonunda toplamı gör."
              action={<Button title="Masraf ekle" variant="brass" onPress={() => router.push('/masraf/yeni')} />}
            />
          ) : (
            <Card style={{ paddingVertical: space.sm }}>
              {sorted.map((e, i) => (
                <View key={e.id} style={[styles.item, i > 0 && styles.itemBorder]}>
                  <View style={{ flex: 1 }}>
                    <T variant="h3">{e.category}</T>
                    <T variant="small" numberOfLines={1}>
                      {formatTR(e.date)}
                      {vehicles.length > 1 ? ` · ${vehicleName(e.vehicleId)}` : ''}
                      {e.note ? ` · ${e.note}` : ''}
                    </T>
                  </View>
                  <T variant="h3" style={{ fontFamily: fonts.bold }}>
                    {formatTL(e.amount)}
                  </T>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Masrafı sil"
                    hitSlop={10}
                    onPress={async () => {
                      if (await confirm('Masraf silinsin mi?', `${e.category} · ${formatTL(e.amount)}`)) removeExpense(e.id);
                    }}>
                    <Icon name="trash" color={colors.muted} size={19} />
                  </Pressable>
                </View>
              ))}
            </Card>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.sm },
  add: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.brass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, height: 120 },
  barCol: { flex: 1, alignItems: 'center', gap: 6, height: '100%' },
  barTrack: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: radius.sm },
  catRow: { flexDirection: 'row', justifyContent: 'space-between' },
  item: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 12 },
  itemBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
});
