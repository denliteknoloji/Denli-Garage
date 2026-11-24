import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icons';
import { urgencyColor } from '@/components/reminder-row';
import { Button, Card, Empty, Screen, T, tap } from '@/components/ui';
import { confirm } from '@/lib/confirm';
import { daysUntil, formatTR, relativeDays } from '@/lib/dates';
import { useStore } from '@/lib/store';
import { colors, space } from '@/theme';

export default function Torpido() {
  const { state, removeDoc } = useStore();
  const { vehicles, docs } = state;

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <T variant="title">Torpido</T>
          <T color={colors.muted}>Aracının belgeleri, tek yerde.</T>
        </View>
        {vehicles.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Belge ekle"
            onPress={() => {
              tap();
              router.push('/belge/yeni');
            }}
            style={styles.add}>
            <Icon name="plus" color={colors.night} />
          </Pressable>
        ) : null}
      </View>

      {vehicles.length === 0 ? (
        <Empty title="Önce bir araç ekle" text="Belgeler araca bağlı tutulur. Garaj sekmesinden ilk aracını ekle." />
      ) : docs.length === 0 ? (
        <Empty
          title="Torpido boş"
          text="Ruhsat, trafik sigortası, kasko ve muayene bilgilerini ekle. Bitiş tarihi olan belgeler için hatırlatma gösterilir."
          action={<Button title="Belge ekle" variant="brass" onPress={() => router.push('/belge/yeni')} />}
        />
      ) : (
        vehicles.map((v) => {
          const list = docs.filter((d) => d.vehicleId === v.id);
          if (list.length === 0) return null;
          return (
            <View key={v.id} style={{ gap: space.sm }}>
              <T variant="label">{v.nickname || `${v.brand} ${v.model}`}</T>
              {list.map((d) => {
                const days = d.endDate ? daysUntil(d.endDate) : null;
                return (
                  <Card key={d.id} style={styles.doc}>
                    <View style={styles.docIcon}>
                      <Icon name="doc" color={colors.brass} />
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <T variant="h3">{d.type}</T>
                      {d.number ? <T variant="small">No: {d.number}</T> : null}
                      {d.endDate ? (
                        <T variant="small">
                          Bitiş {formatTR(d.endDate)} ·{' '}
                          <T variant="small" color={urgencyColor(days ?? 0)}>
                            {relativeDays(days ?? 0)}
                          </T>
                        </T>
                      ) : null}
                      {d.note ? <T variant="small">{d.note}</T> : null}
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${d.type} belgesini sil`}
                      hitSlop={10}
                      onPress={async () => {
                        if (await confirm('Belge silinsin mi?', `${d.type} kaydı silinecek.`)) removeDoc(d.id);
                      }}>
                      <Icon name="trash" color={colors.muted} size={20} />
                    </Pressable>
                  </Card>
                );
              })}
            </View>
          );
        })
      )}

      <T variant="small" style={{ textAlign: 'center' }}>
        Belge fotoğrafı çekme ve internetsiz açma bir sonraki sürümde geliyor.
      </T>
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
  doc: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
