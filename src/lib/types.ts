export type VehicleType = 'otomobil' | 'motosiklet' | 'traktor';
export type Fuel = 'Benzin' | 'Dizel' | 'LPG' | 'Hibrit' | 'Elektrik';
export type Gear = 'Manuel' | 'Otomatik';

export interface Vehicle {
  id: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number | null;
  fuel: Fuel | null;
  gear: Gear | null;
  plate: string; // "26 ADG 26" biçiminde, traktörde boş olabilir
  odometer: number | null; // km; traktörde motor saati
  color: string;
  nickname: string;
  // Tarihler ISO "YYYY-AA-GG"
  inspectionDate: string | null; // sonraki muayene
  insuranceEnd: string | null; // trafik sigortası bitişi
  cascoEnd: string | null; // kasko bitişi
  createdAt: string;
}

export const EXPENSE_CATEGORIES = [
  'Yakıt',
  'Bakım',
  'Sigorta',
  'Vergi',
  'Muayene',
  'Lastik',
  'Yıkama',
  'Otopark ve yol',
  'Ceza',
  'Diğer',
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  id: string;
  vehicleId: string;
  category: ExpenseCategory;
  amount: number; // TL
  date: string; // ISO
  odometer: number | null;
  note: string;
}

export const DOC_TYPES = ['Ruhsat', 'Trafik sigortası', 'Kasko', 'Muayene raporu', 'Ehliyet', 'Diğer'] as const;
export type DocType = (typeof DOC_TYPES)[number];

export interface VehicleDoc {
  id: string;
  vehicleId: string;
  type: DocType;
  number: string; // poliçe / belge no (isteğe bağlı)
  endDate: string | null; // ISO
  note: string;
}

export interface AppState {
  version: 1;
  onboarded: boolean;
  vehicles: Vehicle[];
  expenses: Expense[];
  docs: VehicleDoc[];
}

export const FREE_VEHICLE_LIMIT = 1;
