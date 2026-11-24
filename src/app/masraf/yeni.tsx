import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { DateField } from '@/components/date-field';
import { Button, Card, Chips, Field, Screen, T } from '@/components/ui';
import { todayISO } from '@/lib/dates';
import { parseAmount, parseIntSafe } from '@/lib/format';
import { useStore } from '@/lib/store';
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '@/lib/types';
import { colors, space } from '@/theme';

export default function NewExpense() {
  const params = useLocalSearchParams<{ vehicleId?: string }>();
  const { state, addExpense } = useStore();
  const { vehicles } = state;

  const labelOf = (id: string) => {
    const v = vehicles.find((x) => x.id === id);
    return v ? v.plate || `${v.brand} ${v.model}` : '';
  };
  const vehicleLabels = vehicles.map((v) => labelOf(v.id));

  const [vehicleId, setVehicleId] = useState(params.vehicleId ?? vehicles[0]?.id ?? '');
  const [category, setCategory] = useState<ExpenseCategory | null>('Yakıt');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<string | null>(todayISO());
  const [odo, setOdo] = useState('');
  const [note, setNote] = useState('');
  const [tried, setTried] = useState(false);

  const amountNum = parseAmount(amount);
  const valid = Boolean(vehicleId && category && amountNum && amountNum > 0 && date);

  const save = () => {
    setTried(true);
    if (!valid || !category || !amountNum || !date) return;
    addExpense({ vehicleId, category, amount: amountNum, date, odometer: parseIntSafe(odo), note: note.trim() });
    router.back();
  };

  if (vehicles.length === 0) {
    return (
      <Screen edges={[]}>
        <T>Masraf eklemek için önce bir araç ekle.</T>
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen edges={[]}>
        {vehicles.length > 1 ? (
          <Chips
            label="Araç"
            options={vehicleLabels}
            value={labelOf(vehicleId)}
            onChange={(l) => setVehicleId(vehicles[vehicleLabels.indexOf(l)]?.id ?? vehicleId)}
          />
        ) : null}
        <Card style={{ gap: space.lg }}>
          <Chips label="Kategori" options={EXPENSE_CATEGORIES} value={category} onChange={setCategory} />
          <Field
            label="Tutar (₺)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="1.500"
            error={tried && !amountNum ? 'Tutar gerekli' : null}
          />
          <DateField label="Tarih" value={date} onChange={setDate} />
          <Field label="Kilometre (isteğe bağlı)" value={odo} onChangeText={(t) => setOdo(t.replace(/\D/g, ''))} keyboardType="number-pad" />
          <Field label="Not (isteğe bağlı)" value={note} onChangeText={setNote} placeholder="Örn. Opet, depo full" />
        </Card>
        {tried && !valid ? (
          <T color={colors.danger} style={{ textAlign: 'center' }}>
            Tutar ve tarihi kontrol et.
          </T>
        ) : null}
        <Button title="Kaydet" onPress={save} />
        <T variant="small" style={{ textAlign: 'center' }}>
          Fişi okutarak ekleme Plus ile bir sonraki sürümde geliyor.
        </T>
      </Screen>
    </KeyboardAvoidingView>
  );
}
