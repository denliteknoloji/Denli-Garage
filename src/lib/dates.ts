// Tarih yardımcıları. Uygulamada tarihler ISO (YYYY-AA-GG) saklanır, ekranda GG.AA.YYYY gösterilir.

export function todayISO(): string {
  const d = new Date();
  return toISO(d);
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "15.03.2027" → "2027-03-15"; geçersizse null */
export function parseTR(input: string): string | null {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(input.trim());
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (d.getFullYear() !== Number(yyyy) || d.getMonth() !== Number(mm) - 1 || d.getDate() !== Number(dd)) return null;
  return toISO(d);
}

/** "2027-03-15" → "15.03.2027" */
export function formatTR(iso: string | null | undefined): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

/** Yazarken GG.AA.YYYY maskesi uygular */
export function maskDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

export function daysUntil(iso: string): number {
  const today = fromISO(todayISO());
  const target = fromISO(iso);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function relativeDays(days: number): string {
  if (days === 0) return 'Bugün';
  if (days === 1) return 'Yarın';
  if (days > 0) return `${days} gün kaldı`;
  if (days === -1) return 'Dün geçti';
  return `${-days} gün geçti`;
}

/**
 * Motorlu Taşıtlar Vergisi yılda iki taksitte ödenir: Ocak ve Temmuz ayı sonuna kadar.
 * Bugünden sonraki ilk son ödeme gününü döndürür.
 */
export function nextMTVDeadline(): string {
  const now = fromISO(todayISO());
  const y = now.getFullYear();
  const candidates = [new Date(y, 0, 31), new Date(y, 6, 31), new Date(y + 1, 0, 31)];
  const next = candidates.find((d) => d.getTime() >= now.getTime()) ?? candidates[2];
  return toISO(next);
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}
