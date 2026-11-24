import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, View } from 'react-native';

import { GarageMark, Icon, type IconName } from '@/components/icons';
import { Button, Card, Screen, T, tap } from '@/components/ui';
import { confirm } from '@/lib/confirm';
import { useStore } from '@/lib/store';
import { FREE_VEHICLE_LIMIT } from '@/lib/types';
import { colors, space } from '@/theme';

const SITE = 'https://garage.getdenli.com';

function LinkRow({ icon, title, onPress }: { icon: IconName; title: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.link, pressed && { opacity: 0.6 }]}>
      <Icon name={icon} color={colors.green} size={20} />
      <T style={{ flex: 1 }}>{title}</T>
      <Icon name="chevron" color={colors.muted} size={18} />
    </Pressable>
  );
}

export default function Profile() {
  const { state, resetAll } = useStore();
  const open = (path: string) => WebBrowser.openBrowserAsync(`${SITE}/${path}`).catch(() => {});

  return (
    <Screen>
      <T variant="title" style={{ marginTop: space.sm }}>
        Profil
      </T>

      <Card style={styles.plan}>
        <View style={styles.planMark}>
          <GarageMark size={44} />
        </View>
        <View style={{ flex: 1 }}>
          <T variant="h3" color={colors.cream}>
            Ücretsiz plan
          </T>
          <T variant="small" color={colors.sage}>
            {state.vehicles.length} / {FREE_VEHICLE_LIMIT} araç kullanılıyor
          </T>
        </View>
      </Card>

      <Button title="Plus'ı incele" variant="brass" icon={<Icon name="star" color={colors.night} size={20} />} onPress={() => router.push('/plus')} />

      <Card style={{ paddingVertical: space.xs }}>
        <LinkRow icon="shield" title="Gizlilik ve çerezler" onPress={() => open('gizlilik.html')} />
        <LinkRow icon="doc" title="KVKK aydınlatma metni" onPress={() => open('kvkk.html')} />
        <LinkRow icon="doc" title="Kullanım koşulları" onPress={() => open('kosullar.html')} />
        <LinkRow icon="home" title="garage.getdenli.com" onPress={() => open('')} />
      </Card>

      <Card style={{ gap: space.sm }}>
        <T variant="h3">Hesap</T>
        <T color={colors.muted}>
          Google, Apple ve e-posta ile giriş bir sonraki sürümde geliyor. Şimdilik verilerin yalnızca bu telefonda saklanıyor; uygulamayı
          silersen veriler de silinir.
        </T>
      </Card>

      <Button
        title="Tüm verileri sil"
        variant="danger"
        icon={<Icon name="trash" color={colors.danger} size={20} />}
        onPress={async () => {
          if (await confirm('Tüm veriler silinsin mi?', 'Araçlar, masraflar ve belgeler bu telefondan kalıcı olarak silinir.', 'Hepsini sil'))
            resetAll();
        }}
      />

      <T variant="small" style={{ textAlign: 'center' }}>
        Denli Garage {Constants.expoConfig?.version ?? ''} · Bir Denli Teknoloji markası
      </T>
    </Screen>
  );
}

const styles = StyleSheet.create({
  plan: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.green, borderColor: colors.green },
  planMark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.night,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
});
