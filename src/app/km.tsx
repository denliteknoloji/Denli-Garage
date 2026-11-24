// Kilometre / motor saati güncelleme: tek büyük alan.
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, T } from '@/components/ui';
import { vehicleName } from '@/components/vehicle-hero';
import { odometerUnit } from '@/lib/catalog';
import { formatNumber, parseIntSafe } from '@/lib/format';
import { useStore } from '@/lib/store';
import { colors, fonts, radius, space } from '@/theme';

export default function Odometer() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { state, updateVehicle } = useStore();
  const v = state.vehicles.find((x) => x.id === vehicleId) ?? state.vehicles[0];
  const [text, setText] = useState('');

  if (!v) {
    return (
      <SafeAreaView style={styles.root}>
        <T>Önce bir araç ekle.</T>
      </SafeAreaView>
    );
  }

  const unit = odometerUnit(v.type);
  const value = parseIntSafe(text);
  const lower = value != null && v.odometer != null && value < v.odometer;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView edges={['bottom']} style={styles.root}>
        <View style={{ gap: 4 }}>
          <T variant="label">{vehicleName(v)}</T>
          <T variant="h2">
            Şu anki {unit}: {v.odometer != null ? formatNumber(v.odometer) : 'girilmedi'}
          </T>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={(t) => setText(t.replace(/\D/g, ''))}
            keyboardType="number-pad"
            autoFocus
            placeholder={v.odometer != null ? String(v.odometer) : '0'}
            placeholderTextColor="#B9C2BC"
            style={styles.input}
            maxLength={7}
          />
          <Text style={styles.unit}>{unit}</Text>
        </View>
        {lower ? (
          <T variant="small" color={colors.warn}>
            Yeni değer eskisinden düşük. Yanlış yazmadıysan yine de kaydedebilirsin.
          </T>
        ) : null}
        <Button
          title="Kaydet"
          disabled={value == null}
          onPress={() => {
            updateVehicle(v.id, { odometer: value });
            router.back();
          }}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper, padding: space.lg, gap: space.lg },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: space.lg,
  },
  input: { flex: 1, minHeight: 76, fontFamily: fonts.bold, fontSize: 38, color: colors.ink, letterSpacing: -0.5 },
  unit: { fontFamily: fonts.semibold, fontSize: 16, color: colors.muted },
});
