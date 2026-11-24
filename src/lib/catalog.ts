import type { VehicleType } from './types';

// Türkiye'de yaygın markalar: hızlı seçim için. Liste dışı marka elle yazılabilir.
export const BRANDS: Record<VehicleType, string[]> = {
  otomobil: [
    'Fiat', 'Renault', 'Volkswagen', 'Toyota', 'Hyundai', 'Ford', 'Opel', 'Peugeot', 'Citroën',
    'Dacia', 'Honda', 'BMW', 'Mercedes-Benz', 'Audi', 'Skoda', 'Seat', 'Kia', 'Nissan', 'Togg',
    'Volvo', 'Tesla', 'Chery', 'BYD', 'MG', 'Suzuki', 'Mazda', 'Jeep', 'Land Rover', 'Porsche', 'Cupra',
  ],
  motosiklet: [
    'Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW Motorrad', 'Ducati', 'KTM', 'Triumph', 'Harley-Davidson',
    'Kuba', 'Mondial', 'Bajaj', 'CFMoto', 'Benelli', 'Vespa', 'Piaggio', 'Sym', 'Kymco', 'TVS', 'RKS',
  ],
  traktor: [
    'New Holland', 'Massey Ferguson', 'John Deere', 'Tümosan', 'Başak', 'Erkunt', 'Case IH', 'Kubota',
    'Deutz-Fahr', 'Landini', 'Hattat', 'Antonio Carraro', 'Same', 'Fendt', 'Solis',
  ],
};

export const TYPE_LABEL: Record<VehicleType, string> = {
  otomobil: 'Otomobil',
  motosiklet: 'Motosiklet',
  traktor: 'Traktör',
};

/** Traktörde kilometre yerine motor saati tutulur */
export function odometerUnit(type: VehicleType): string {
  return type === 'traktor' ? 'motor saati' : 'km';
}
