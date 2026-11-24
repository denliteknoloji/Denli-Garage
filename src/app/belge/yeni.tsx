import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { DateField } from '@/components/date-field';
import { Button, Card, Chips, Field, Screen, T } from '@/components/ui';
import { useStore } from '@/lib/store';
import { DOC_TYPES, type DocType } from '@/lib/types';
import { space } from '@/theme';

export default function NewDoc() {
  const { state, addDoc, updateVehicle } = useStore();
  const { vehicles } = state;
  const labels = vehicles.map((v) => v.plate || `${v.brand} ${v.model}`);

  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? '');
  const [type, setType] = useState<DocType | null>('Trafik sigortası');
  const [number, setNumber] = useState('');
  const [endDate, setEndDate] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const save = () => {
    if (!vehicleId || !type) return;
    addDoc({ vehicleId, type, number: number.trim(), endDate, note: note.trim() });
    // Poliçe ve muayene tarihleri aracın hatırlatmalarına da yazılır
    if (endDate && type === 'Trafik sigortası') updateVehicle(vehicleId, { insuranceEnd: endDate });
    if (endDate && type === 'Kasko') updateVehicle(vehicleId, { cascoEnd: endDate });
    if (endDate && type === 'Muayene raporu') updateVehicle(vehicleId, { inspectionDate: endDate });
    router.back();
  };

  if (vehicles.length === 0) {
    return (
      <Screen edges={[]}>
        <T>Belge eklemek için önce bir araç ekle.</T>
      </Screen>
    );
  }

  const endLabel = type === 'Muayene raporu' ? 'Sonraki muayene tarihi' : 'Bitiş tarihi (varsa)';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen edges={[]}>
        {vehicles.length > 1 ? (
          <Chips
            label="Araç"
            options={labels}
            value={labels[vehicles.findIndex((v) => v.id === vehicleId)] ?? null}
            onChange={(l) => setVehicleId(vehicles[labels.indexOf(l)]?.id ?? vehicleId)}
          />
        ) : null}
        <Card style={{ gap: space.lg }}>
          <Chips label="Belge türü" options={DOC_TYPES} value={type} onChange={setType} />
          <Field label="Belge / poliçe no (isteğe bağlı)" value={number} onChangeText={setNumber} autoCapitalize="characters" />
          <DateField label={endLabel} value={endDate} onChange={setEndDate} hint="Sigorta ve muayene tarihleri hatırlatmalara da eklenir." />
          <Field label="Not (isteğe bağlı)" value={note} onChangeText={setNote} placeholder="Örn. Acente adı" />
        </Card>
        <Button title="Torpido'ya ekle" onPress={save} disabled={!type} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
