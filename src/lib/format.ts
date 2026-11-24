// Plaka ve sayı biçimlendirme.

const PLATE_RE = /^(0[1-9]|[1-7][0-9]|8[01])([A-Z]{1,3})(\d{2,4})$/;

/** Kullanıcının yazdığını büyük harfe çevirir, boşlukları normalleştirir: "26adg26" → "26 ADG 26" */
export function formatPlate(raw: string): string {
  const clean = raw
    .toLocaleUpperCase('tr-TR')
    .replace(/İ/g, 'I')
    .replace(/[^0-9A-Z]/g, '');
  const m = /^(\d{0,2})([A-Z]{0,3})(\d{0,4})/.exec(clean);
  if (!m) return clean;
  return [m[1], m[2], m[3]].filter(Boolean).join(' ');
}

/** Türkiye plakası geçerli mi (il kodu 01–81, 1–3 harf, 2–4 rakam) */
export function isValidPlate(plate: string): boolean {
  return PLATE_RE.test(plate.replace(/\s/g, ''));
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('tr-TR').format(n);
}

export function formatTL(n: number): string {
  return `₺${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(n)}`;
}

/** "1.250,50" veya "1250.5" → 1250.5 */
export function parseAmount(raw: string): number | null {
  const s = raw.trim().replace(/\s/g, '');
  if (!s) return null;
  const normalized = s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s;
  const n = Number(normalized);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function parseIntSafe(raw: string): number | null {
  const s = raw.replace(/\D/g, '');
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
