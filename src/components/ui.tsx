// Ortak arayüz bileşenleri: metin, buton, kart, alan, seçim çipi, ekran iskeleti.
import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, fonts, radius, shadow, space } from '@/theme';

type TextVariant = 'title' | 'h2' | 'h3' | 'body' | 'label' | 'small';

export function T({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines,
}: {
  children: ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  return (
    <Text numberOfLines={numberOfLines} style={[textStyles[variant], color ? { color } : null, style]}>
      {children}
    </Text>
  );
}

const textStyles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 34, letterSpacing: -0.6, color: colors.ink },
  h2: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, letterSpacing: -0.3, color: colors.ink },
  h3: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.ink },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.ink },
  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: colors.muted },
  small: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17, color: colors.muted },
});

export function tap() {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'brass' | 'ghost' | 'danger';
  icon?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.45 },
        style,
      ]}>
      {icon}
      <Text style={[styles.buttonText, { color: v.fg }]}>{title}</Text>
    </Pressable>
  );
}

const buttonVariants = {
  primary: { bg: colors.green, fg: colors.cream, border: colors.green },
  brass: { bg: colors.brass, fg: colors.night, border: colors.brass },
  ghost: { bg: 'transparent', fg: colors.green, border: colors.line },
  danger: { bg: 'transparent', fg: colors.danger, border: '#EBC8C0' },
} as const;

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Field({
  label,
  hint,
  error,
  ...props
}: TextInputProps & { label: string; hint?: string; error?: string | null }) {
  return (
    <View style={{ gap: 6 }}>
      <T variant="label">{label}</T>
      <TextInput
        placeholderTextColor="#9AA59F"
        {...props}
        style={[styles.input, error ? { borderColor: colors.danger } : null, props.style]}
      />
      {error ? (
        <T variant="small" color={colors.danger}>
          {error}
        </T>
      ) : hint ? (
        <T variant="small">{hint}</T>
      ) : null}
    </View>
  );
}

export function Chips<V extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly V[];
  value: V | null;
  onChange: (v: V) => void;
  label?: string;
}) {
  return (
    <View style={{ gap: 6 }}>
      {label ? <T variant="label">{label}</T> : null}
      <View style={styles.chipsRow}>
        {options.map((o) => {
          const active = o === value;
          return (
            <Pressable
              key={o}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => {
                tap();
                onChange(o);
              }}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && { color: colors.cream }]}>{o}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: colors.paper }}>
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, { flex: 1 }, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <T variant="body" color={colors.muted}>
        {label}
      </T>
      <T variant="h3" style={{ flexShrink: 1, textAlign: 'right' }}>
        {value}
      </T>
    </View>
  );
}

export function Empty({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <Card style={{ alignItems: 'center', paddingVertical: space.xxl, gap: space.sm }}>
      <T variant="h3">{title}</T>
      <T variant="body" color={colors.muted} style={{ textAlign: 'center', maxWidth: 280 }}>
        {text}
      </T>
      {action ? <View style={{ marginTop: space.md }}>{action}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.pill,
    paddingHorizontal: space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    borderWidth: 1.5,
  },
  buttonText: { fontFamily: fonts.semibold, fontSize: 16 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: '#ECE8DD',
    ...shadow.card,
  },
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
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  content: { padding: space.lg, paddingBottom: 120, gap: space.lg },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
});
