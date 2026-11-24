// Web önizlemesi için tarayıcının localStorage'ı.
export function loadRaw(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function saveRaw(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    // yoksay
  }
}
