// Onay penceresi: Android/iOS'ta yerel Alert, web önizlemesinde tarayıcı onayı.
import { Alert, Platform } from 'react-native';

export function confirm(title: string, message: string, okText = 'Sil'): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(globalThis.confirm?.(`${title}\n\n${message}`) ?? false);
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: 'Vazgeç', style: 'cancel', onPress: () => resolve(false) },
      { text: okText, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
