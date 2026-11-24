import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DateField } from '@/components/date-field';
import { Icon } from '@/components/icons';
import { ReminderRow } from '@/components/reminder-row';
import { Button, Card, Field, Row, Screen, T } from '@/components/ui';
import { VehicleCard } from '@/components/vehicle-card';
import { odometerUnit, TYPE_LABEL } from '@/lib/catalog';
import { confirm } from '@/lib/confirm';
import { formatTR } from '@/lib/dates';
import { formatNumber, formatTL, parseIntSafe } from '@/lib/format';
import { remindersFor, useStore } from '@/lib/store';
import { colors, space } from '@/theme';

export default function VehicleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, updateVehicle, removeVehicle } = useStore();
  const v = state.vehicles.find((x) => x.id === id);
  const [odoText, setOdoText] = useState('');
  const [editDates, setEditDates] = useState(false);

  if (!v) {
    return (
      <Screen edges={[]}>
        <T>Araç bulunamadı.</T>
        <Button title="Garaja dön" onPress={() => router.replace('/(tabs)')} />
      </Screen>
    );
  }

  const reminders = remindersFor(v);
  const expenses = state.expenses.filter((e) => e.vehicleId === v.id);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const unit = odometerUnit(v.type);

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: v.nickname || `${v.brand} ${v.model}` }} />
      <VehicleCard v={v} />

      <Card style={{ gap: 2 }}>
        <T variant="h2" style={{ marginBottom: 4 }}>
          Hatırlatmalar
        </T>
        {reminders.length === 0 ? (
          <T color={colors.muted}>Henüz tarih eklenmedi.</T>
        ) : (
          reminders.map((r) => <ReminderRow key={r.key} title={r.title} date={r.date} days={r.days} />)
        )}
        <Button
          title={editDates ? 'Tarihleri kapat' : 'Tarihleri düzenle'}
          variant="ghost"
          style={{ marginTop: space.sm }}
          onPress={() => setEditDates((x) => !x)}
        />
        {editDates ? (
          <View style={{ gap: space.md, marginTop: space.md }}>
            <DateField label="Sonraki muayene" value={v.inspectionDate} onChange={(d) => updateVehicle(v.id, { inspectionDate: d })} />
            <DateField label="Trafik sigortası bitişi" value={v.insuranceEnd} onChange={(d) => updateVehicle(v.id, { insuranceEnd: d })} />
            <DateField label="Kasko bitişi" value={v.cascoEnd} onChange={(d) => updateVehicle(v.id, { cascoEnd: d })} />
          </View>
        ) : null}
        <T variant="small" style={{ marginTop: space.sm }}>
          MTV her yıl Ocak ve Temmuz ayı sonuna kadar iki taksitte ödenir.
        </T>
      </Card>

      <Card style={{ gap: space.md }}>
        <T variant="h2">{v.type === 'traktor' ? 'Motor saati' : 'Kilometre'}</T>
        <T variant="title">{v.odometer != null ? `${formatNumber(v.odometer)} ${unit}` : 'Girilmedi'}</T>
        <View style={styles.odoRow}>
          <View style={{ flex: 1 }}>
            <Field
              label={`Yeni ${unit}`}
              value={odoText}
              onChangeText={(t) => setOdoText(t.replace(/\D/g, ''))}
              keyboardType="number-pad"
              placeholder={v.odometer != null ? String(v.odometer + 500) : ''}
            />
          </View>
          <Button
            title="Güncelle"
            style={{ alignSelf: 'flex-end' }}
            disabled={!parseIntSafe(odoText)}
            onPress={() => {
              updateVehicle(v.id, { odometer: parseIntSafe(odoText) });
              setOdoText('');
            }}
          />
        </View>
      </Card>

      <Card style={{ gap: space.sm }}>
        <View style={styles.head}>
          <T variant="h2">Masraflar</T>
          <T variant="h3">{formatTL(total)}</T>
        </View>
        {expenses.slice(0, 5).map((e) => (
          <Row key={e.id} label={`${e.category} · ${formatTR(e.date)}`} value={formatTL(e.amount)} />
        ))}
        <Button
          title="Masraf ekle"
          variant="ghost"
          icon={<Icon name="plus" color={colors.green} size={18} />}
          onPress={() => router.push({ pathname: '/masraf/yeni', params: { vehicleId: v.id } })}
        />
      </Card>

      <Card>
        <T variant="h2" style={{ marginBottom: 4 }}>
          Bilgiler
        </T>
        <Row label="Tür" value={TYPE_LABEL[v.type]} />
        <Row label="Marka" value={v.brand} />
        <Row label="Model" value={v.model} />
        {v.year ? <Row label="Model yılı" value={String(v.year)} /> : null}
        {v.fuel ? <Row label="Yakıt" value={v.fuel} /> : null}
        {v.gear ? <Row label="Vites" value={v.gear} /> : null}
        {v.plate ? <Row label="Plaka" value={v.plate} /> : null}
      </Card>

      <Button
        title="Aracı sil"
        variant="danger"
        onPress={async () => {
          if (await confirm('Araç silinsin mi?', 'Araç, masrafları ve belgeleri bu telefondan kalıcı olarak silinir.')) {
            removeVehicle(v.id);
            router.replace('/(tabs)');
          }
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  odoRow: { flexDirection: 'row', gap: space.md },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
