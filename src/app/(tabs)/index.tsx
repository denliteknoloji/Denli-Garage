import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icons';
import { ReminderRow } from '@/components/reminder-row';
import { Button, Card, Empty, Screen, T, tap } from '@/components/ui';
import { VehicleCard } from '@/components/vehicle-card';
import { formatTL } from '@/lib/format';
import { monthKey, todayISO } from '@/lib/dates';
import { remindersFor, useStore } from '@/lib/store';
import { FREE_VEHICLE_LIMIT } from '@/lib/types';
import { colors, space } from '@/theme';

export function openAddVehicle(count: number) {
  if (count >= FREE_VEHICLE_LIMIT) router.push('/plus');
  else router.push('/arac/yeni');
}

export default function Garage() {
  const { state } = useStore();
  const { vehicles, expenses } = state;

  const upcoming = vehicles
    .flatMap((v) => remindersFor(v).map((r) => ({ ...r, vehicle: v })))
    .sort((a, b) => a.days - b.days)
    .slice(0, 4);

  const thisMonth = monthKey(todayISO());
  const monthTotal = expenses.filter((e) => monthKey(e.date) === thisMonth).reduce((s, e) => s + e.amount, 0);

  return (
    <Screen>
      <View style={styles.header}>
        <T variant="title">Garajım</T>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Araç ekle"
          onPress={() => {
            tap();
            openAddVehicle(vehicles.length);
          }}
          style={styles.add}>
          <Icon name="plus" color={colors.night} />
        </Pressable>
      </View>

      {vehicles.length === 0 ? (
        <Empty
          title="Garajın boş"
          text="İlk aracını ekle; muayene, sigorta ve masraflarını buradan takip et."
          action={<Button title="Araç ekle" variant="brass" onPress={() => router.push('/arac/yeni')} />}
        />
      ) : (
        <>
          <View style={{ gap: space.md }}>
            {vehicles.map((v) => (
              <VehicleCard key={v.id} v={v} />
            ))}
          </View>

          <Card style={{ gap: 2 }}>
            <View style={styles.cardHead}>
              <T variant="h2">Yaklaşanlar</T>
              <Icon name="bell" color={colors.muted} size={20} />
            </View>
            {upcoming.length === 0 ? (
              <T color={colors.muted}>Araç ayrıntılarına muayene ve sigorta tarihlerini ekle, zamanı gelince burada görünsün.</T>
            ) : (
              upcoming.map((r) => (
                <ReminderRow
                  key={r.key}
                  title={r.title}
                  date={r.date}
                  days={r.days}
                  subtitle={vehicles.length > 1 ? r.vehicle.plate || r.vehicle.brand : undefined}
                />
              ))
            )}
          </Card>

          <Pressable onPress={() => router.push('/(tabs)/masraf')}>
            <Card style={styles.month}>
              <View>
                <T variant="label">Bu ay</T>
                <T variant="title" style={{ fontSize: 26 }}>
                  {formatTL(monthTotal)}
                </T>
              </View>
              <Button title="Masraf ekle" variant="ghost" onPress={() => router.push('/masraf/yeni')} />
            </Card>
          </Pressable>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  add: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.brass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  month: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md },
});
