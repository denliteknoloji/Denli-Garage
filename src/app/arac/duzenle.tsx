// Aracı düzenle: tüm bilgiler ve tarihler tek ekranda.
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { DateField } from '@/components/date-field';
import { Plate } from '@/components/plate';
import { Button, Chips, Field, Screen, T } from '@/components/ui';
import { odometerUnit } from '@/lib/catalog';
import { formatPlate, isValidPlate, parseIntSafe } from '@/lib/format';
import { useStore } from '@/lib/store';
import type { Fuel, Gear } from '@/lib/types';
import { colors, space } from '@/theme';

const FUELS: readonly Fuel[] = ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik'];
const GEARS: readonly Gear[] = ['Manuel', 'Otomatik'];

export default function EditVehicle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, updateVehicle } = useStore();
  const v = state.vehicles.find((x) => x.id === id);

  const [brand, setBrand] = useState(v?.brand ?? '');
  const [model, setModel] = useState(v?.model ?? '');
  const [year, setYear] = useState(v?.year ? String(v.year) : '');
  const [fuel, setFuel] = useState<Fuel | null>(v?.fuel ?? null);
  const [gear, setGear] = useState<Gear | null>(v?.gear ?? null);
  const [plate, setPlate] = useState(v?.plate ?? '');
  const [odo, setOdo] = useState(v?.odometer != null ? String(v.odometer) : '');
  const [nickname, setNickname] = useState(v?.nickname ?? '');
  const [inspection, setInspection] = useState(v?.inspectionDate ?? null);
  const [insurance, setInsurance] = useState(v?.insuranceEnd ?? null);
  const [casco, setCasco] = useState(v?.cascoEnd ?? null);
  const [tried, setTried] = useState(false);

  if (!v) {
    return (
      <Screen edges={[]}>
        <T>Araç bulunamadı.</T>
      </Screen>
    );
  }

  const thisYear = new Date().getFullYear();
  const yearNum = parseIntSafe(year);
  const plateRequired = v.type !== 'traktor';
  const errors = {
    brand: !brand.trim() ? 'Marka gerekli' : null,
    model: !model.trim() ? 'Model gerekli' : null,
    year: year && (!yearNum || yearNum < 1950 || yearNum > thisYear + 1) ? `1950 ile ${thisYear + 1} arasında bir yıl yaz` : null,
    plate: plate && !isValidPlate(plate) ? 'Plaka biçimi: 26 ADG 26' : plateRequired && !plate ? 'Plaka gerekli' : null,
  };
  const valid = !Object.values(errors).some(Boolean);
  const show = (k: keyof typeof errors) => (tried ? errors[k] : null);

  const save = () => {
    setTried(true);
    if (!valid) return;
    updateVehicle(v.id, {
      brand: brand.trim(),
      model: model.trim(),
      year: yearNum,
      fuel,
      gear: v.type === 'traktor' ? null : gear,
      plate,
      odometer: parseIntSafe(odo),
      nickname: nickname.trim(),
      inspectionDate: inspection,
      insuranceEnd: insurance,
      cascoEnd: casco,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen edges={[]}>
        <View style={{ gap: space.lg }}>
          <T variant="h2">Araç</T>
          <Field label="Marka" value={brand} onChangeText={setBrand} error={show('brand')} />
          <Field label="Model" value={model} onChangeText={setModel} error={show('model')} />
          <Field label="Model yılı" value={year} onChangeText={setYear} keyboardType="number-pad" maxLength={4} error={errors.year} />
          <Field label="Takma ad" value={nickname} onChangeText={setNickname} placeholder="Örn. Babamın arabası" />
          <Chips label="Yakıt" options={FUELS} value={fuel} onChange={(f) => setFuel(fuel === f ? null : f)} />
          {v.type !== 'traktor' ? <Chips label="Vites" options={GEARS} value={gear} onChange={(g) => setGear(gear === g ? null : g)} /> : null}
          <View style={{ gap: 10 }}>
            <Field
              label={plateRequired ? 'Plaka' : 'Plaka (varsa)'}
              value={plate}
              onChangeText={(t) => setPlate(formatPlate(t))}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={11}
              error={tried || (plate.replace(/\s/g, '').length >= 5 && !isValidPlate(plate)) ? errors.plate : null}
            />
            {plate && isValidPlate(plate) ? <Plate value={plate} size={18} /> : null}
          </View>
          <Field
            label={v.type === 'traktor' ? 'Motor saati' : 'Kilometre'}
            value={odo}
            onChangeText={(t) => setOdo(t.replace(/\D/g, ''))}
            keyboardType="number-pad"
            hint={`Güncel ${odometerUnit(v.type)}`}
          />
        </View>

        <View style={{ gap: space.lg }}>
          <T variant="h2">Tarihler</T>
          <DateField label="Sonraki muayene" value={inspection} onChange={setInspection} />
          <DateField label="Trafik sigortası bitişi" value={insurance} onChange={setInsurance} />
          <DateField label="Kasko bitişi" value={casco} onChange={setCasco} />
        </View>

        {tried && !valid ? (
          <T color={colors.danger} style={{ textAlign: 'center' }}>
            Kırmızı işaretli alanları düzelt.
          </T>
        ) : null}
        <Button title="Kaydet" onPress={save} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
