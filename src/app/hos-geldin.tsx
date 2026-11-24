import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GarageMark, Icon, type IconName } from '@/components/icons';
import { Button, T } from '@/components/ui';
import { IS_DEMO } from '@/lib/demo';
import { useStore } from '@/lib/store';
import { colors, space } from '@/theme';

const POINTS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'vault', title: 'Torpido', text: 'Ruhsat, poliçe ve belgeler cebinde' },
  { icon: 'bell', title: 'Hatırlatmalar', text: 'Muayene, sigorta, kasko, MTV zamanında' },
  { icon: 'wallet', title: 'Masraflar', text: 'Yakıt, bakım ve tüm giderler tek yerde' },
];

export default function Welcome() {
  const { finishOnboarding, loadSample } = useStore();

  const start = () => {
    finishOnboarding();
    router.replace('/(tabs)');
  };

  const startSample = () => {
    loadSample();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <View style={styles.mark}>
          <GarageMark size={72} />
        </View>
        <T variant="title" color={colors.cream} style={styles.title}>
          Aracının her şeyi,{'\n'}tek garajda.
        </T>
        <T color={colors.sage} style={{ textAlign: 'center', maxWidth: 300 }}>
          Belgeler, bakım, masraf ve hatırlatmalar. Aklında tutmana gerek yok.
        </T>
      </View>

      <View style={styles.points}>
        {POINTS.map((p) => (
          <View key={p.title} style={styles.point}>
            <View style={styles.pointIcon}>
              <Icon name={p.icon} color={colors.brass} />
            </View>
            <View style={{ flex: 1 }}>
              <T variant="h3" color={colors.cream}>
                {p.title}
              </T>
              <T variant="small" color={colors.sage}>
                {p.text}
              </T>
            </View>
          </View>
        ))}
      </View>

      {IS_DEMO ? (
        <View style={styles.bottom}>
          <Button title="Örnek araçla dene" variant="brass" onPress={startSample} />
          <Button title="Kendi aracınla dene" variant="ghostLight" onPress={start} />
          <T variant="small" color={colors.sage} style={{ textAlign: 'center' }}>
            Bu bir deneme sürümü. Girdiğin bilgiler sunucuya gönderilmez; yalnızca bu tarayıcıda tutulur ve 24 saat sonra
            kendiliğinden silinir. Lütfen gerçek belge veya kişisel bilgi girme.
          </T>
        </View>
      ) : (
        <View style={styles.bottom}>
          <Button title="Başla" variant="brass" onPress={start} />
          <T variant="small" color={colors.sage} style={{ textAlign: 'center' }}>
            Verilerin şimdilik bu telefonda saklanır. Hesap ve bulut yedeği bir sonraki sürümde geliyor.
          </T>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.night, paddingHorizontal: space.xl, justifyContent: 'space-between' },
  top: { alignItems: 'center', gap: space.lg, paddingTop: space.xxl },
  mark: {
    width: 104,
    height: 104,
    borderRadius: 30,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { textAlign: 'center', fontSize: 34, lineHeight: 38 },
  points: { gap: space.md },
  point: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.md,
    borderRadius: 18,
    backgroundColor: 'rgba(244,241,232,.06)',
  },
  pointIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: { gap: space.md, paddingBottom: space.lg },
});
