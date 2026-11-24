import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icons';
import { urgencyColor } from '@/components/reminder-row';
import { Button, T, tap } from '@/components/ui';
import { VehicleArt } from '@/components/vehicle-art';
import { VehicleHero } from '@/components/vehicle-hero';
import { formatTR, monthKey, relativeDays, todayISO } from '@/lib/dates';
import { formatTL } from '@/lib/format';
import { remindersFor, useStore } from '@/lib/store';
import { colors, fonts, radius, space } from '@/theme';

function QuickAction({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.qa, pressed && { backgroundColor: '#E9E5D9' }]}>
      <Icon name={icon} color={colors.green} size={22} />
      <Text style={styles.qaText}>{label}</Text>
    </Pressable>
  );
}

export default function Garage() {
  const { state } = useStore();
  const { vehicles, expenses } = state;
  const { width } = useWindowDimensions();
  const cardW = Math.min(width, 640) - space.lg * 2;
  const [index, setIndex] = useState(0);

  if (vehicles.length === 0) {
    return (
      <SafeAreaView edges={['top']} style={styles.root}>
        <ScrollView contentContainerStyle={styles.content}>
          <T variant="title" style={{ marginTop: space.sm }}>
            Garaj
          </T>
          <View style={styles.emptyStage}>
            <View style={styles.emptyDoor}>
              {[0, 1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.emptySlat} />
              ))}
            </View>
            <VehicleArt type="otomobil" width={200} body="rgba(244,241,232,.18)" glass="rgba(244,241,232,.08)" tire="rgba(244,241,232,.12)" />
          </View>
          <T variant="h2">Garajın şimdilik boş</T>
          <T color={colors.muted}>Aracını dört kısa adımda ekle. Muayene, sigorta ve masrafları sonra tek dokunuşla eklersin.</T>
          <Button title="İlk aracını ekle" variant="brass" onPress={() => router.push('/arac/yeni')} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const current = vehicles[Math.min(index, vehicles.length - 1)];
  const reminders = remindersFor(current);
  const next = reminders[0];
  const rest = reminders.slice(1);
  const missing = !current.inspectionDate || !current.insuranceEnd;

  const thisMonth = monthKey(todayISO());
  const monthTotal = expenses
    .filter((e) => e.vehicleId === current.id && monthKey(e.date) === thisMonth)
    .reduce((s, e) => s + e.amount, 0);

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <T variant="title">Garaj</T>
          <T variant="label">{vehicles.length === 1 ? '1 araç' : `${vehicles.length} araç`}</T>
        </View>

        <ScrollView
          horizontal
          pagingEnabled={vehicles.length > 1}
          snapToInterval={vehicles.length > 1 ? cardW + space.md : undefined}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          scrollEnabled={vehicles.length > 1}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / (cardW + space.md)))}
          contentContainerStyle={{ gap: space.md }}
          style={{ marginHorizontal: -space.lg }}
          contentInset={{ left: space.lg, right: space.lg }}>
          <View style={{ width: space.lg - space.md }} />
          {vehicles.map((v) => (
            <VehicleHero key={v.id} v={v} width={cardW} />
          ))}
          <View style={{ width: space.lg - space.md }} />
        </ScrollView>
        {vehicles.length > 1 ? (
          <View style={styles.dots}>
            {vehicles.map((v, i) => (
              <View key={v.id} style={[styles.dot, i === index && styles.dotOn]} />
            ))}
          </View>
        ) : null}

        <View style={styles.qaRow}>
          <QuickAction icon="fuel" label="Yakıt" onPress={() => router.push({ pathname: '/masraf/yeni', params: { kategori: 'Yakıt', vehicleId: current.id } })} />
          <QuickAction icon="gauge" label="Km" onPress={() => router.push({ pathname: '/km', params: { vehicleId: current.id } })} />
          <QuickAction icon="wrench" label="Bakım" onPress={() => router.push({ pathname: '/masraf/yeni', params: { kategori: 'Bakım', vehicleId: current.id } })} />
          <QuickAction icon="doc" label="Belge" onPress={() => router.push('/belge/yeni')} />
        </View>

        {next ? (
          <Pressable onPress={() => router.push({ pathname: '/arac/[id]', params: { id: current.id } })} style={styles.next}>
            <View style={[styles.nextBadge, { backgroundColor: urgencyColor(next.days) }]}>
              <Text style={styles.nextDays}>{Math.abs(next.days)}</Text>
              <Text style={styles.nextUnit}>{next.days < 0 ? 'gün geçti' : 'gün'}</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <T variant="label">Sıradaki</T>
              <T variant="h2">{next.title}</T>
              <T variant="small">{formatTR(next.date)}</T>
            </View>
            <Icon name="chevron" color={colors.muted} size={20} />
          </Pressable>
        ) : null}

        {missing ? (
          <Pressable onPress={() => router.push({ pathname: '/arac/[id]', params: { id: current.id } })} style={styles.prompt}>
            <Icon name="bell" color={colors.brassDeep} size={20} />
            <T style={{ flex: 1 }}>
              {!current.inspectionDate && !current.insuranceEnd
                ? 'Muayene ve sigorta tarihlerini ekle, zamanı gelince hatırlatalım.'
                : !current.inspectionDate
                  ? 'Muayene tarihini ekle, zamanı gelince hatırlatalım.'
                  : 'Sigorta bitiş tarihini ekle, zamanı gelince hatırlatalım.'}
            </T>
            <Icon name="chevron" color={colors.muted} size={18} />
          </Pressable>
        ) : null}

        {rest.length > 0 ? (
          <View>
            <T variant="label" style={{ marginBottom: 4 }}>
              Ardından
            </T>
            {rest.map((r) => (
              <View key={r.key} style={styles.restRow}>
                <View style={[styles.restDot, { backgroundColor: urgencyColor(r.days) }]} />
                <T style={{ flex: 1 }}>{r.title}</T>
                <T variant="small">{formatTR(r.date)}</T>
                <Text style={[styles.restDays, { color: urgencyColor(r.days) }]}>{relativeDays(r.days)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Pressable onPress={() => router.push('/(tabs)/masraf')} style={styles.month}>
          <View style={{ flex: 1 }}>
            <T variant="label">Bu ay bu araca</T>
            <Text style={styles.monthValue}>{formatTL(monthTotal)}</Text>
          </View>
          <Text style={styles.link}>Masraflar</Text>
          <Icon name="chevron" color={colors.green} size={18} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  content: { padding: space.lg, paddingBottom: 130, gap: space.lg },
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: space.sm },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: -space.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.line },
  dotOn: { width: 18, backgroundColor: colors.green },
  qaRow: { flexDirection: 'row', gap: space.sm },
  qa: {
    flex: 1,
    minHeight: 68,
    borderRadius: radius.md,
    backgroundColor: '#EFECE3',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  qaText: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink },
  next: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  nextBadge: { width: 68, height: 68, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  nextDays: { fontFamily: fonts.bold, fontSize: 26, color: colors.white, letterSpacing: -0.5, lineHeight: 28 },
  nextUnit: { fontFamily: fonts.semibold, fontSize: 10.5, color: 'rgba(255,255,255,.9)' },
  prompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: '#FBF1D3',
  },
  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 46,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  restDot: { width: 8, height: 8, borderRadius: 4 },
  restDays: { fontFamily: fonts.semibold, fontSize: 12.5, minWidth: 82, textAlign: 'right' },
  month: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: space.sm },
  monthValue: { fontFamily: fonts.bold, fontSize: 26, color: colors.ink, letterSpacing: -0.5 },
  link: { fontFamily: fonts.semibold, fontSize: 14, color: colors.green },
  emptyStage: {
    height: 190,
    borderRadius: radius.lg,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 18,
    overflow: 'hidden',
  },
  emptyDoor: { position: 'absolute', top: 18, left: 18, right: 18, gap: 10 },
  emptySlat: { height: 16, borderRadius: 4, backgroundColor: 'rgba(244,241,232,.06)' },
});
