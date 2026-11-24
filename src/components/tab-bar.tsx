// Yüzen alt menü: dört sekme ve ortada pirinç renkli "+" (hızlı ekleme).
import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radius } from '@/theme';

import { Icon, type IconName } from './icons';
import { tap } from './ui';

const META: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Garaj', icon: 'home' },
  torpido: { label: 'Torpido', icon: 'vault' },
  masraf: { label: 'Masraf', icon: 'wallet' },
  profil: { label: 'Profil', icon: 'user' },
};

export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const routes = state.routes.filter((r) => META[r.name]);

  const item = (routeName: string) => {
    const index = state.routes.findIndex((r) => r.name === routeName);
    const route = state.routes[index];
    if (!route) return null;
    const focused = state.index === index;
    const m = META[routeName];
    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={m.label}
        onPress={() => {
          tap();
          if (!focused) navigateToTab(route.key);
        }}
        style={styles.item}>
        <Icon name={m.icon} color={focused ? colors.brass : colors.sage} size={23} />
        <Text style={[styles.label, focused && { color: colors.brass }]}>{m.label}</Text>
      </Pressable>
    );
  };

  const names = routes.map((r) => r.name);
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.bar}>
        {names.slice(0, 2).map(item)}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hızlı ekle"
          onPress={() => {
            tap();
            router.push('/ekle');
          }}
          style={({ pressed }) => [styles.plus, pressed && { transform: [{ scale: 0.94 }] }]}>
          <Icon name="plus" color={colors.night} size={26} />
        </Pressable>
        {names.slice(2).map(item)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 12 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: radius.lg + 4,
    paddingHorizontal: 6,
    paddingVertical: 8,
    shadowColor: '#0A2A20',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 50 },
  label: { fontFamily: fonts.semibold, fontSize: 11, color: colors.sage },
  plus: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.brass,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
});
