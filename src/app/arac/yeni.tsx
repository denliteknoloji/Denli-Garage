// Araç ekleme: her adımda tek soru. Tür → marka → model → plaka ve kilometre.
// Tarihler (muayene, sigorta, kasko) araç sayfasındaki "Tamamla" kartından sonradan eklenir.
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icons';
import { Plate } from '@/components/plate';
import { Button, Chips, T, tap } from '@/components/ui';
import { VehicleArt } from '@/components/vehicle-art';
import { BRANDS, modelsFor, odometerUnit } from '@/lib/catalog';
import { formatPlate, isValidPlate, parseIntSafe } from '@/lib/format';
import { useStore } from '@/lib/store';
import type { Fuel, VehicleType } from '@/lib/types';
import { colors, fonts, radius, space } from '@/theme';

const TYPES: { type: VehicleType; title: string; text: string }[] = [
  { type: 'otomobil', title: 'Otomobil', text: 'Binek, SUV, hafif ticari' },
  { type: 'motosiklet', title: 'Motosiklet', text: 'Motosiklet ve skuter' },
  { type: 'traktor', title: 'Traktör', text: 'Motor saatiyle takip' },
];
const FUELS: readonly Fuel[] = ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik'];
const STEPS = 4;

export default function NewVehicle() {
  const { addVehicle } = useStore();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<VehicleType>('otomobil');
  const [brand, setBrand] = useState('');
  const [query, setQuery] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | null>(null);
  const [plate, setPlate] = useState('');
  const [odo, setOdo] = useState('');
  const [fuel, setFuel] = useState<Fuel | null>(null);
  const [tried, setTried] = useState(false);

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 30 }, (_, i) => now + 1 - i);
  }, []);

  const brands = BRANDS[type];
  const q = query.trim().toLocaleLowerCase('tr-TR');
  const filtered = q ? brands.filter((b) => b.toLocaleLowerCase('tr-TR').includes(q)) : brands;
  const exact = brands.some((b) => b.toLocaleLowerCase('tr-TR') === q);
  const models = modelsFor(type, brand);

  const plateRequired = type !== 'traktor';
  const plateOk = plate ? isValidPlate(plate) : !plateRequired;

  const back = () => {
    tap();
    if (step === 0) router.back();
    else setStep((s) => s - 1);
  };

  const pickType = (t: VehicleType) => {
    tap();
    if (t !== type) {
      setBrand('');
      setModel('');
    }
    setType(t);
    setStep(1);
  };

  const pickBrand = (b: string) => {
    tap();
    if (b !== brand) setModel('');
    setBrand(b);
    setQuery('');
    setStep(2);
  };

  const save = () => {
    setTried(true);
    if (!plateOk) return;
    const v = addVehicle({
      type,
      brand,
      model: model.trim(),
      year,
      fuel,
      gear: null,
      plate,
      odometer: parseIntSafe(odo),
      color: '',
      nickname: '',
      inspectionDate: null,
      insuranceEnd: null,
      cascoEnd: null,
    });
    router.replace({ pathname: '/arac/[id]', params: { id: v.id, yeni: '1' } });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" accessibilityLabel={step === 0 ? 'Kapat' : 'Geri'} hitSlop={10} onPress={back} style={styles.topBtn}>
          <View style={step === 0 ? null : { transform: [{ scaleX: -1 }] }}>
            <Icon name={step === 0 ? 'close' : 'chevron'} color={colors.ink} size={22} />
          </View>
        </Pressable>
        <View style={styles.progress}>
          {Array.from({ length: STEPS }, (_, i) => (
            <View key={i} style={[styles.dot, i <= step && { backgroundColor: colors.green }]} />
          ))}
        </View>
        <Text style={styles.stepText}>
          {step + 1}/{STEPS}
        </Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {step === 0 ? (
          <ScrollView contentContainerStyle={styles.body}>
            <T variant="title">Ne ekliyorsun?</T>
            {TYPES.map((t) => (
              <Pressable
                key={t.type}
                accessibilityRole="button"
                onPress={() => pickType(t.type)}
                style={({ pressed }) => [styles.typeTile, pressed && { opacity: 0.9, transform: [{ scale: 0.985 }] }]}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.typeTitle}>{t.title}</Text>
                  <Text style={styles.typeText}>{t.text}</Text>
                </View>
                <VehicleArt type={t.type} width={120} />
              </Pressable>
            ))}
          </ScrollView>
        ) : null}

        {step === 1 ? (
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <T variant="title">Markası ne?</T>
            <View style={styles.search}>
              <Icon name="search" color={colors.muted} size={18} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Marka ara ya da yaz"
                placeholderTextColor="#9AA59F"
                style={styles.searchInput}
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={() => query.trim() && pickBrand(filtered[0] ?? query.trim())}
              />
            </View>
            <View style={styles.grid}>
              {filtered.map((b) => (
                <Pressable
                  key={b}
                  accessibilityRole="button"
                  onPress={() => pickBrand(b)}
                  style={({ pressed }) => [styles.brand, b === brand && styles.brandActive, pressed && { opacity: 0.7 }]}>
                  <Text numberOfLines={1} style={[styles.brandText, b === brand && { color: colors.cream }]}>
                    {b}
                  </Text>
                </Pressable>
              ))}
            </View>
            {q && !exact ? (
              <Button title={`“${query.trim()}” olarak devam et`} variant="ghost" onPress={() => pickBrand(query.trim())} />
            ) : null}
          </ScrollView>
        ) : null}

        {step === 2 ? (
          <>
            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
              <View>
                <T variant="label">{brand}</T>
                <T variant="title">Modeli ne?</T>
              </View>
              {models.length > 0 ? <Chips options={models} value={models.includes(model) ? model : null} onChange={setModel} /> : null}
              <TextInput
                value={model}
                onChangeText={setModel}
                placeholder={models.length ? 'Listede yoksa yaz' : type === 'traktor' ? 'Örn. TT75' : 'Model adını yaz'}
                placeholderTextColor="#9AA59F"
                style={styles.bigInput}
                autoCorrect={false}
              />
              <View style={{ gap: 8 }}>
                <T variant="label">Model yılı (isteğe bağlı)</T>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {years.map((y) => (
                    <Pressable
                      key={y}
                      accessibilityRole="button"
                      onPress={() => {
                        tap();
                        setYear(year === y ? null : y);
                      }}
                      style={[styles.year, year === y && styles.brandActive]}>
                      <Text style={[styles.yearText, year === y && { color: colors.cream }]}>{y}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
            <View style={styles.footer}>
              <Button title="Devam" disabled={!model.trim()} onPress={() => setStep(3)} />
            </View>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
              <View>
                <T variant="label">
                  {brand} {model}
                  {year ? ` · ${year}` : ''}
                </T>
                <T variant="title">{plateRequired ? 'Plakası ve kilometresi' : 'Motor saati ve plaka'}</T>
              </View>

              <View style={styles.platePreview}>
                {plate && isValidPlate(plate) ? (
                  <Plate value={plate} size={26} />
                ) : (
                  <View style={styles.plateGhost}>
                    <Text style={styles.plateGhostText}>{plate || '26 ADG 26'}</Text>
                  </View>
                )}
              </View>

              <View style={{ gap: 6 }}>
                <T variant="label">{plateRequired ? 'Plaka' : 'Plaka (varsa)'}</T>
                <TextInput
                  value={plate}
                  onChangeText={(t) => setPlate(formatPlate(t))}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  placeholder="26 ADG 26"
                  placeholderTextColor="#9AA59F"
                  maxLength={11}
                  style={[styles.bigInput, tried && !plateOk && { borderColor: colors.danger }]}
                />
                {tried && !plateOk ? (
                  <T variant="small" color={colors.danger}>
                    {plate ? 'Plakayı il kodu, harf ve rakamla yaz: 26 ADG 26' : 'Plaka gerekli'}
                  </T>
                ) : null}
              </View>

              <View style={{ gap: 6 }}>
                <T variant="label">{type === 'traktor' ? 'Motor saati' : 'Kilometre'} (isteğe bağlı)</T>
                <View style={styles.unitRow}>
                  <TextInput
                    value={odo}
                    onChangeText={(t) => setOdo(t.replace(/\D/g, ''))}
                    keyboardType="number-pad"
                    placeholder={type === 'traktor' ? '1240' : '48200'}
                    placeholderTextColor="#9AA59F"
                    style={[styles.bigInput, { flex: 1 }]}
                  />
                  <Text style={styles.unit}>{odometerUnit(type)}</Text>
                </View>
              </View>

              <Chips label="Yakıt (isteğe bağlı)" options={FUELS} value={fuel} onChange={(f) => setFuel(fuel === f ? null : f)} />
            </ScrollView>
            <View style={styles.footer}>
              <Button title="Garaja ekle" variant="brass" onPress={save} />
              <T variant="small" style={{ textAlign: 'center' }}>
                Muayene ve sigorta tarihlerini sonra tek dokunuşla eklersin.
              </T>
            </View>
          </>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.sm },
  topBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEDE6',
  },
  progress: { flex: 1, flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 5, borderRadius: radius.pill, backgroundColor: colors.line },
  stepText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.muted, width: 30, textAlign: 'right' },
  body: { padding: space.lg, paddingBottom: space.xxl, gap: space.lg },
  typeTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.lg,
    paddingLeft: space.lg,
    paddingRight: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.green,
  },
  typeTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.cream, letterSpacing: -0.3 },
  typeText: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.sage },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 52,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  searchInput: { flex: 1, fontFamily: fonts.medium, fontSize: 16, color: colors.ink, minHeight: 48 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  brand: {
    width: '31.5%',
    minHeight: 54,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  brandActive: { backgroundColor: colors.green, borderColor: colors.green },
  brandText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  bigInput: {
    minHeight: 58,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: space.lg,
    fontFamily: fonts.semibold,
    fontSize: 19,
    color: colors.ink,
  },
  year: {
    minWidth: 64,
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  yearText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  platePreview: { alignItems: 'center', paddingVertical: space.lg, borderRadius: radius.lg, backgroundColor: colors.green },
  plateGhost: {
    height: 55,
    borderRadius: 9,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(244,241,232,.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  plateGhostText: { fontFamily: fonts.bold, fontSize: 26, letterSpacing: 1, color: 'rgba(244,241,232,.45)' },
  unitRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  unit: { fontFamily: fonts.semibold, fontSize: 15, color: colors.muted },
  footer: { padding: space.lg, gap: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, backgroundColor: colors.paper },
});
