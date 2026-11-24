import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { Icon, type IconName } from '@/components/icons';
import { colors, fonts } from '@/theme';

const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ color }: { color: ColorValue }) => (
    <Icon name={icon} color={typeof color === 'string' ? color : colors.sage} size={23} />
  ),
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brass,
        tabBarInactiveTintColor: colors.sage,
        tabBarStyle: {
          backgroundColor: colors.green,
          borderTopWidth: 0,
          height: 68,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11.5 },
        sceneStyle: { backgroundColor: colors.paper },
      }}>
      <Tabs.Screen name="index" options={tab('Garaj', 'home')} />
      <Tabs.Screen name="torpido" options={tab('Torpido', 'vault')} />
      <Tabs.Screen name="masraf" options={tab('Masraf', 'wallet')} />
      <Tabs.Screen name="profil" options={tab('Profil', 'user')} />
    </Tabs>
  );
}
