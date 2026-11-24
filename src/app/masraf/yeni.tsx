// Masraf ekle: önce tutar, sonra kategori. Tarih varsayılan olarak bugün.
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DateField } from '@/components/date-field';
import { Icon, type IconName } from '@/components/icons';
import { Button, Chips, T, tap } from '@/components/ui';
import { vehicleName } from '@/components/vehicle-hero';
import { toISO, todayISO } from '@/lib/dates';
import { parseAmount, parseIntSafe } from '@/lib/format';
import { useStore } from '@/lib/store';
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '@/lib/types';
import { colors, fonts, radius, space } from '@/theme';

const CAT_ICON: Record<ExpenseCategory, IconName> = {
  Yakıt: 'fuel',
  Bakım: 'wrench',
  Sigorta: 'shield',
  Vergi: 'doc',
  Muayene: 'check',
  Lastik: 'gauge',
  Yıkama: 'star',
  'Otopark ve yol': 'home',
  Ceza: 'bell',
  Diğer: 'wallet',
};

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toISO(d);
}

export default function NewExpense() {
  const params = useLocalSearchParams<{ vehicleId?: string; kategori?: string }>();
  const { state, addExpense } = useStore();
  const { vehicles } = state;

  const initialCat = EXPENSE_CATEGORIES.find((c) => c === params.kategori) ?? null;
  const [vehicleId, setVehicleId] = useState(params.vehicleId ?? vehicles[0]?.id ?? '');
  const [category, setCategory] = useState<ExpenseCategory | null>(initialCat);
  const [amount, setAmount] = useState('');
  const [dateMode, setDateMode] = useState<'bugun' | 'dun' | 'diger'>('bugun');
  const [otherDate, setOtherDate] = useState<string | null>(null);
  const [odo, setOdo] = useState('');
  const [note, setNote] = useState('');
  const [more, setMore] = useState(false);
  const [tried, setTried] = useState(false);

  if (vehicles.length === 0) {
    return (
      <SafeAreaView style={styles.root}>
        <T>Masraf eklemek için önce bir araç ekle.</T>
      </SafeAreaView>
    );
  }

  const amountNum = parseAmount(amount);
  const date = dateMode === 'bugun' ? todayISO() : dateMode === 'dun' ? yesterdayISO() : otherDate;
  const valid = Boolean(vehicleId && category && amountNum && amountNum > 0 && date);
  const labels = vehicles.map((v) => v.plate || vehicleName(v));

  const save = () => {
    setTried(true);
    if (!valid || !category || !amountNum || !date) return;
    addExpense({ vehicleId, category, amount: amountNum, date, odometer: parseIntSafe(odo), note: note.trim() });
    router.back();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView edges={['bottom']} style={styles.root}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <View style={styles.amountBox}>
            <Text style={styles.currency}>₺</Text>
            <TextInput
              value={amount}
              onChangeText={(t) => setAmount(t.replace(/[^\d.,]/g, ''))}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor="#B9C2BC"
              autoFocus
              style={styles.amount}
              accessibilityLabel="Tutar"
            />
          </View>
          {tried && !amountNum ? (
            <T variant="small" color={colors.danger} style={{ textAlign: 'center' }}>
              Tutarı yaz
            </T>
          ) : null}

          {vehicles.length > 1 ? (
            <Chips
              label="Araç"
              options={labels}
              value={labels[vehicles.findIndex((v) => v.id === vehicleId)] ?? null}
              onChange={(l) => setVehicleId(vehicles[labels.indexOf(l)]?.id ?? vehicleId)}
            />
          ) : null}

          <View style={{ gap: 8 }}>
            <T variant="label">Ne için?</T>
            <View style={styles.cats}>
              {EXPENSE_CATEGORIES.map((c) => {
                const on = c === category;
                return (
                  <Pressable
                    key={c}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    onPress={() => {
                      tap();
                      setCategory(c);
                    }}
                    style={[styles.cat, on && styles.catOn]}>
                    <Icon name={CAT_ICON[c]} color={on ? colors.brass : colors.green} size={22} />
                    <Text numberOfLines={1} style={[styles.catText, on && { color: colors.cream }]}>
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {tried && !category ? (
              <T variant="small" color={colors.danger}>
                Bir kategori seç
              </T>
            ) : null}
          </View>

          <View style={{ gap: 8 }}>
            <T variant="label">Ne zaman?</T>
            <View style={styles.dateRow}>
              {(
                [
                  ['bugun', 'Bugün'],
                  ['dun', 'Dün'],
                  ['diger', 'Başka gün'],
                ] as const
              ).map(([k, l]) => (
                <Pressable
                  key={k}
                  accessibilityRole="button"
                  onPress={() => {
                    tap();
                    setDateMode(k);
                  }}
                  style={[styles.dateChip, dateMode === k && styles.catOn]}>
                  <Text style={[styles.dateText, dateMode === k && { color: colors.cream }]}>{l}</Text>
                </Pressable>
              ))}
            </View>
            {dateMode === 'diger' ? <DateField label="Tarih" value={otherDate} onChange={setOtherDate} /> : null}
          </View>

          {more ? (
            <View style={{ gap: space.md }}>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Not (örn. Opet, depo full)"
                placeholderTextColor="#9AA59F"
                style={styles.input}
              />
              <TextInput
                value={odo}
                onChangeText={(t) => setOdo(t.replace(/\D/g, ''))}
                keyboardType="number-pad"
                placeholder="Kilometre (isteğe bağlı)"
                placeholderTextColor="#9AA59F"
                style={styles.input}
              />
            </View>
          ) : (
            <Pressable onPress={() => setMore(true)} style={styles.more}>
              <Icon name="plus" color={colors.green} size={18} />
              <Text style={styles.moreText}>Not veya kilometre ekle</Text>
            </Pressable>
          )}
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Kaydet" onPress={save} />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  body: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
  amountBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: space.md },
  currency: { fontFamily: fonts.bold, fontSize: 34, color: colors.muted },
  amount: { minWidth: 120, fontFamily: fonts.bold, fontSize: 52, color: colors.ink, letterSpacing: -1, textAlign: 'center', outlineWidth: 0 },
  cats: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  cat: {
    width: '31.5%',
    minHeight: 74,
    borderRadius: radius.md,
    backgroundColor: '#EFECE3',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  catOn: { backgroundColor: colors.green },
  catText: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink },
  dateRow: { flexDirection: 'row', gap: space.sm },
  dateChip: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.pill,
    backgroundColor: '#EFECE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: space.lg,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.ink,
  },
  more: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  moreText: { fontFamily: fonts.semibold, fontSize: 14.5, color: colors.green },
  footer: { padding: space.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
});
