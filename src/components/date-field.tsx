// Tarih alanı (Android/iOS): dokununca telefonun kendi takvim seçicisi açılır. Dışarıya ISO tarih verir.
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatTR, toISO } from '@/lib/dates';
import { colors, fonts, radius, space } from '@/theme';

import { Icon } from './icons';
import { T, tap } from './ui';

function toDate(iso: string | null): Date {
  if (!iso) return new Date();
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function DateField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string | null;
  onChange: (iso: string | null) => void;
  hint?: string;
}) {
  const [iosOpen, setIosOpen] = useState(false);

  const open = () => {
    tap();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: toDate(value),
        mode: 'date',
        onChange: (event, date) => {
          if (event.type === 'set' && date) onChange(toISO(date));
        },
      });
    } else {
      setIosOpen((x) => !x);
    }
  };

  return (
    <View style={{ gap: 6 }}>
      <T variant="label">{label}</T>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${value ? formatTR(value) : 'seçilmedi'}`} onPress={open} style={styles.box}>
          <Icon name="bell" color={value ? colors.green : colors.muted} size={18} />
          <Text style={[styles.value, !value && { color: '#9AA59F' }]}>{value ? formatTR(value) : 'Tarih seç'}</Text>
        </Pressable>
        {value ? (
          <Pressable accessibilityRole="button" accessibilityLabel={`${label} tarihini temizle`} hitSlop={8} onPress={() => onChange(null)} style={styles.clear}>
            <Icon name="close" color={colors.muted} size={18} />
          </Pressable>
        ) : null}
      </View>
      {Platform.OS === 'ios' && iosOpen ? (
        <DateTimePicker
          value={toDate(value)}
          mode="date"
          display="inline"
          locale="tr-TR"
          onChange={(_e, date) => {
            if (date) onChange(toISO(date));
          }}
        />
      ) : null}
      {hint ? <T variant="small">{hint}</T> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  box: {
    flex: 1,
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  value: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  clear: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEDE6',
  },
});
