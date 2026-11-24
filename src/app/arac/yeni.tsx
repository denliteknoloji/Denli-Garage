import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { DateField } from '@/components/date-field';
import { Plate } from '@/components/plate';
import { Button, Card, Chips, Field, Screen, T } from '@/components/ui';
import { BRANDS, odometerUnit, TYPE_LABEL } from '@/lib/catalog';
import { formatPlate, isValidPlate, parseIntSafe } from '@/lib/format';
import { useStore } from '@/lib/store';
import type { Fuel, Gear, VehicleType } from '@/lib/types';
import { colors, space } from '@/theme';

const TYPES = ['Otomobil', 'Motosiklet', 'Traktör'] as const;
type TypeLabel = (typeof TYPES)[number];
const TYPE_BY_LABEL: Record<TypeLabel, VehicleType> = { Otomobil: 'otomobil', Motosiklet: 'motosiklet', Traktör: 'traktor' };
const FUELS: readonly Fuel[] = ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik'];
const GEARS: readonly Gear[] = ['Manuel', 'Otomatik'];

export default function NewVehicle() {
  const { addVehicle } = useStore();
  const [type, setType] = useState<VehicleType>('otomobil');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [fuel, setFuel] = useState<Fuel | null>(null);
  const [gear, setGear] = useState<Gear | null>(null);
  const [plate, setPlate] = useState('');
  const [odo, setOdo] = useState('');
  const [nickname, setNickname] = useState('');
  const [inspection, setInspection] = useState<string | null>(null);
  const [insurance, setInsurance] = useState<string | null>(null);
  const [casco, setCasco] = useState<string | null>(null);
  const [tried, setTried] = useState(false);

  const thisYear = new Date().getFullYear();
  const yearNum = parseIntSafe(year);
  const plateRequired = type !== 'traktor';
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
    const v = addVehicle({
      type,
      brand: brand.trim(),
      model: model.trim(),
      year: yearNum,
      fuel,
      gear: type === 'traktor' ? null : gear,
      plate,
      odometer: parseIntSafe(odo),
      color: '',
      nickname: nickname.trim(),
      inspectionDate: inspection,
      insuranceEnd: insurance,
      cascoEnd: casco,
    });
    router.replace({ pathname: '/arac/[id]', params: { id: v.id } });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen edges={[]}>
        <Chips
          label="Araç türü"
          options={TYPES}
          value={TYPE_LABEL[type] as TypeLabel}
          onChange={(l) => {
            setType(TYPE_BY_LABEL[l]);
            setBrand('');
          }}
        />

        <Card style={{ gap: space.lg }}>
          <T variant="h2">Araç bilgileri</T>
          <View style={{ gap: 10 }}>
            <Field label="Marka" value={brand} onChangeText={setBrand} placeholder="Listeden seç ya da yaz" error={show('brand')} />
            <Chips options={BRANDS[type].slice(0, 12)} value={BRANDS[type].includes(brand) ? brand : null} onChange={setBrand} />
          </View>
          <Field
            label="Model"
            value={model}
            onChangeText={setModel}
            placeholder={type === 'traktor' ? 'Örn. TT75' : 'Örn. Egea Cross'}
            error={show('model')}
          />
          <Field label="Model yılı" value={year} onChangeText={setYear} keyboardType="number-pad" maxLength={4} placeholder="2021" error={errors.year} />
          <Chips label="Yakıt" options={FUELS} value={fuel} onChange={setFuel} />
          {type !== 'traktor' ? <Chips label="Vites" options={GEARS} value={gear} onChange={setGear} /> : null}
          <View style={{ gap: 10 }}>
            <Field
              label={plateRequired ? 'Plaka' : 'Plaka (varsa)'}
              value={plate}
              onChangeText={(t) => setPlate(formatPlate(t))}
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder="26 ADG 26"
              maxLength={11}
              error={tried || (plate.replace(/\s/g, '').length >= 5 && !isValidPlate(plate)) ? errors.plate : null}
            />
            {plate && isValidPlate(plate) ? <Plate value={plate} size={18} /> : null}
          </View>
          <Field
            label={type === 'traktor' ? 'Motor saati' : 'Kilometre'}
            value={odo}
            onChangeText={(t) => setOdo(t.replace(/\D/g, ''))}
            keyboardType="number-pad"
            placeholder={type === 'traktor' ? '1240' : '48200'}
            hint={`Güncel ${odometerUnit(type)}`}
          />
          <Field label="Takma ad (isteğe bağlı)" value={nickname} onChangeText={setNickname} placeholder="Örn. Babamın arabası" />
        </Card>

        <Card style={{ gap: space.lg }}>
          <View>
            <T variant="h2">Tarihler</T>
            <T variant="small">Doldurduğun tarihler için zamanı yaklaşınca hatırlatma görürsün.</T>
          </View>
          <DateField label="Sonraki muayene" value={inspection} onChange={setInspection} />
          <DateField label="Trafik sigortası bitişi" value={insurance} onChange={setInsurance} />
          <DateField label="Kasko bitişi (varsa)" value={casco} onChange={setCasco} />
        </Card>

        {tried && !valid ? (
          <T color={colors.danger} style={{ textAlign: 'center' }}>
            Kırmızı işaretli alanları düzelt.
          </T>
        ) : null}
        <Button title="Garaja ekle" onPress={save} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
