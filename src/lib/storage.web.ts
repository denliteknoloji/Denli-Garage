// Web = deneme sürümü. Veriler yalnızca bu tarayıcıda tutulur, sunucuya gönderilmez
// ve denemeye başlandıktan 24 saat sonra kendiliğinden silinir.
export const DEMO_TTL_MS = 24 * 60 * 60 * 1000;

interface Envelope {
  startedAt: number;
  data: string;
}

function read(key: string): Envelope | null {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    if (!raw) return null;
    const env = JSON.parse(raw) as Partial<Envelope>;
    if (typeof env.startedAt !== 'number' || typeof env.data !== 'string') return null;
    return env as Envelope;
  } catch {
    return null;
  }
}

export function loadRaw(key: string): string | null {
  const env = read(key);
  if (!env) return null;
  if (Date.now() - env.startedAt > DEMO_TTL_MS) {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // yoksay
    }
    return null;
  }
  return env.data;
}

export function saveRaw(key: string, value: string): void {
  try {
    const startedAt = read(key)?.startedAt ?? Date.now();
    globalThis.localStorage?.setItem(key, JSON.stringify({ startedAt, data: value }));
  } catch {
    // yoksay
  }
}

/** Deneme verilerinin silineceği zaman (ms); henüz kayıt yoksa null */
export function demoExpiresAt(key: string): number | null {
  const env = read(key);
  return env ? env.startedAt + DEMO_TTL_MS : null;
}

export function clearRaw(key: string): void {
  try {
    globalThis.localStorage?.removeItem(key);
  } catch {
    // yoksay
  }
}
