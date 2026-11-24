import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { DateField } from '@/components/date-field';
import { Icon } from '@/components/icons';
import { ReminderRow } from '@/components/reminder-row';
import { Button, Row, Screen, T, tap } from '@/components/ui';
import { vehicleName, VehicleHero } from '@/components/vehicle-hero';
import { odometerUnit, TYPE_LABEL } from '@/lib/catalog';
import { confirm } from '@/lib/confirm';
import { formatTR } from '@/lib/dates';
import { formatNumber, formatTL } from '@/lib/format';
import { remindersFor, useStore } from '@/lib/store';
import { colors, fonts, radius, space } from '@/theme';

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <View style={{ gap: space.sm }}>
      <View style={styles.sectionHead}>
        <T variant="h2">{title}</T>
        {action}
      </View>
      {children}
    </View>
  );
}

export default function VehicleDetail() {
  const { id, yeni } = useLocalSearchParams<{ id: string; yeni?: string }>();
  const { state, updateVehicle, removeVehicle } = useStore();
  const { width } = useWindowDimensions();
  const v = state.vehicles.find((x) => x.id === id);

  if (!v) {
    return (
      <Screen edges={[]}>
        <T>Araç bulunamadı.</T>
        <Button title="Garaja dön" onPress={() => router.replace('/(tabs)')} />
      </Screen>
    );
  }

  const reminders = remindersFor(v);
  const expenses = state.expenses.filter((e) => e.vehicleId === v.id).sort((a, b) => (a.date < b.date ? 1 : -1));
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const unit = odometerUnit(v.type);
  const missingDates = [
    !v.inspectionDate && { key: 'inspectionDate' as const, label: 'Sonraki muayene tarihi' },
    !v.insuranceEnd && { key: 'insuranceEnd' as const, label: 'Trafik sigortası bitişi' },
    !v.cascoEnd && { key: 'cascoEnd' as const, label: 'Kasko bitişi (varsa)' },
  ].filter(Boolean) as { key: 'inspectionDate' | 'insuranceEnd' | 'cascoEnd'; label: string }[];

  return (
    <Screen edges={[]}>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Aracı düzenle"
              hitSlop={10}
              onPress={() => {
                tap();
                router.push({ pathname: '/arac/duzenle', params: { id: v.id } });
              }}
              style={styles.headerBtn}>
              <Icon name="edit" color={colors.green} size={20} />
              <Text style={styles.headerBtnText}>Düzenle</Text>
            </Pressable>
          ),
        }}
      />

      {yeni ? (
        <View style={styles.added}>
          <Icon name="check" color={colors.ok} size={20} />
          <T style={{ flex: 1 }}>{vehicleName(v)} garaja eklendi.</T>
        </View>
      ) : null}

      <VehicleHero v={v} width={Math.min(width, 640) - space.lg * 2} pressable={false} />

      <View style={styles.qaRow}>
        <Button
          title="Km güncelle"
          variant="ghost"
          style={{ flex: 1 }}
          icon={<Icon name="gauge" color={colors.green} size={18} />}
          onPress={() => router.push({ pathname: '/km', params: { vehicleId: v.id } })}
        />
        <Button
          title="Masraf"
          variant="ghost"
          style={{ flex: 1 }}
          icon={<Icon name="plus" color={colors.green} size={18} />}
          onPress={() => router.push({ pathname: '/masraf/yeni', params: { vehicleId: v.id } })}
        />
      </View>

      {missingDates.length > 0 ? (
        <View style={styles.complete}>
          <View style={{ gap: 2 }}>
            <T variant="h2">Tamamla</T>
            <T variant="small">Tarihi seç; zamanı yaklaşınca Garaj ekranında uyaralım.</T>
          </View>
          {missingDates.map((m) => (
            <DateField key={m.key} label={m.label} value={null} onChange={(d) => updateVehicle(v.id, { [m.key]: d })} />
          ))}
        </View>
      ) : null}

      {reminders.length > 0 ? (
        <Section title="Hatırlatmalar">
          {reminders.map((r) => (
            <ReminderRow key={r.key} title={r.title} date={r.date} days={r.days} />
          ))}
          <T variant="small">{"MTV her yıl Ocak ve Temmuz ayı sonuna kadar iki taksitte ödenir. Tarihleri Düzenle'den değiştirebilirsin."}</T>
        </Section>
      ) : null}

      <Section
        title="Masraflar"
        action={<Text style={styles.total}>{formatTL(total)}</Text>}>
        {expenses.length === 0 ? (
          <T color={colors.muted}>Henüz masraf yok. Yakıt ve bakımı ekledikçe burada görünür.</T>
        ) : (
          expenses.slice(0, 5).map((e) => (
            <Row key={e.id} label={`${e.category} · ${formatTR(e.date)}`} value={formatTL(e.amount)} />
          ))
        )}
      </Section>

      <Section title="Bilgiler">
        <View>
          <Row label="Tür" value={TYPE_LABEL[v.type]} />
          <Row label="Marka ve model" value={`${v.brand} ${v.model}`} />
          {v.year ? <Row label="Model yılı" value={String(v.year)} /> : null}
          {v.fuel ? <Row label="Yakıt" value={v.fuel} /> : null}
          {v.gear ? <Row label="Vites" value={v.gear} /> : null}
          {v.plate ? <Row label="Plaka" value={v.plate} /> : null}
          <Row label={v.type === 'traktor' ? 'Motor saati' : 'Kilometre'} value={v.odometer != null ? `${formatNumber(v.odometer)} ${unit}` : 'Girilmedi'} />
        </View>
      </Section>

      <Button
        title="Aracı sil"
        variant="danger"
        onPress={async () => {
          if (await confirm('Araç silinsin mi?', 'Araç, masrafları ve belgeleri kalıcı olarak silinir.')) {
            removeVehicle(v.id);
            router.replace('/(tabs)');
          }
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 6, minHeight: 40 },
  headerBtnText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.green },
  added: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: '#E3F1E8',
  },
  qaRow: { flexDirection: 'row', gap: space.sm },
  complete: { gap: space.md, padding: space.lg, borderRadius: radius.lg, backgroundColor: '#FBF1D3' },
  total: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
});
