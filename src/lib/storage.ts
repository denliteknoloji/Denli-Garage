// Cihazda kalıcı saklama (Android/iOS): expo-sqlite anahtar-değer deposu.
import Storage from 'expo-sqlite/kv-store';

export function loadRaw(key: string): string | null {
  try {
    return Storage.getItemSync(key);
  } catch {
    return null;
  }
}

export function saveRaw(key: string, value: string): void {
  try {
    Storage.setItemSync(key, value);
  } catch {
    // Saklama başarısız olursa uygulama çalışmaya devam eder; veri bellekte kalır.
  }
}

/** Uygulamada süre sınırı yok; yalnızca web deneme sürümünde vardır */
export function demoExpiresAt(_key: string): number | null {
  return null;
}

export function clearRaw(key: string): void {
  try {
    Storage.removeItemSync(key);
  } catch {
    // yoksay
  }
}
