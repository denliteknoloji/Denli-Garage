// Web deneme sürümü: örnek garaj verisi. Plaka ve tutarlar örnektir, gerçek bir kişiye ait değildir.
import { Platform } from 'react-native';

import { toISO } from './dates';
import type { AppState } from './types';

export const IS_DEMO = Platform.OS === 'web';

function inDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function sampleState(): AppState {
  const vid = 'ornek-egea';
  return {
    version: 1,
    onboarded: true,
    vehicles: [
      {
        id: vid,
        type: 'otomobil',
        brand: 'Fiat',
        model: 'Egea Cross',
        year: 2021,
        fuel: 'Benzin',
        gear: 'Manuel',
        plate: '26 ADG 26',
        odometer: 48200,
        color: '',
        nickname: '',
        inspectionDate: inDays(12),
        insuranceEnd: inDays(111),
        cascoEnd: inDays(200),
        createdAt: new Date().toISOString(),
      },
    ],
    expenses: [
      { id: 'o1', vehicleId: vid, category: 'Yakıt', amount: 1850, date: inDays(0), odometer: 48200, note: 'Depo full' },
      { id: 'o2', vehicleId: vid, category: 'Yıkama', amount: 350, date: inDays(-4), odometer: null, note: '' },
      { id: 'o3', vehicleId: vid, category: 'Yakıt', amount: 1700, date: inDays(-12), odometer: 47650, note: '' },
      { id: 'o4', vehicleId: vid, category: 'Bakım', amount: 4200, date: inDays(-35), odometer: 46900, note: 'Yağ ve filtre değişimi' },
      { id: 'o5', vehicleId: vid, category: 'Yakıt', amount: 1650, date: inDays(-40), odometer: 46700, note: '' },
      { id: 'o6', vehicleId: vid, category: 'Lastik', amount: 9800, date: inDays(-70), odometer: 45200, note: 'Kış lastiği' },
    ],
    docs: [
      { id: 'd1', vehicleId: vid, type: 'Ruhsat', number: '', endDate: null, note: '' },
      { id: 'd2', vehicleId: vid, type: 'Trafik sigortası', number: 'ÖRNEK-12345', endDate: inDays(111), note: '' },
      { id: 'd3', vehicleId: vid, type: 'Kasko', number: '', endDate: inDays(200), note: '' },
    ],
  };
}
