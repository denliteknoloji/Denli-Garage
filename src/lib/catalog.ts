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

// Markaya göre Türkiye'de en çok görülen modeller: hızlı seçim için. Liste dışı model elle yazılabilir.
export const MODELS: Record<string, string[]> = {
  Fiat: ['Egea', 'Egea Cross', 'Doblo', 'Fiorino', 'Linea', 'Panda', '500', 'Palio', 'Albea'],
  Renault: ['Clio', 'Megane', 'Taliant', 'Symbol', 'Captur', 'Austral', 'Fluence', 'Kangoo'],
  Volkswagen: ['Polo', 'Golf', 'Passat', 'Jetta', 'T-Roc', 'Tiguan', 'Caddy', 'Transporter'],
  Toyota: ['Corolla', 'C-HR', 'Yaris', 'Auris', 'RAV4', 'Hilux', 'Proace City'],
  Hyundai: ['i20', 'i10', 'Accent Blue', 'Elantra', 'Tucson', 'Bayon', 'Kona'],
  Ford: ['Focus', 'Fiesta', 'Puma', 'Kuga', 'Courier', 'Transit Connect', 'Transit Custom', 'Ranger'],
  Opel: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Combo'],
  Peugeot: ['208', '2008', '301', '308', '3008', '5008', 'Partner', 'Rifter'],
  'Citroën': ['C3', 'C4', 'C-Elysée', 'C3 Aircross', 'C5 Aircross', 'Berlingo'],
  Dacia: ['Sandero', 'Sandero Stepway', 'Duster', 'Logan', 'Jogger', 'Lodgy'],
  Honda: ['Civic', 'City', 'Jazz', 'CR-V', 'HR-V'],
  BMW: ['1 Serisi', '3 Serisi', '5 Serisi', 'X1', 'X3', 'X5'],
  'Mercedes-Benz': ['A Serisi', 'C Serisi', 'E Serisi', 'CLA', 'GLA', 'GLC', 'Vito', 'Sprinter'],
  Audi: ['A3', 'A4', 'A6', 'Q2', 'Q3', 'Q5'],
  Skoda: ['Octavia', 'Superb', 'Fabia', 'Scala', 'Kamiq', 'Karoq', 'Kodiaq'],
  Seat: ['Leon', 'Ibiza', 'Arona', 'Ateca'],
  Kia: ['Ceed', 'Rio', 'Sportage', 'Stonic', 'Picanto', 'Niro'],
  Nissan: ['Qashqai', 'Juke', 'Micra', 'X-Trail'],
  Togg: ['T10X', 'T10F'],
  Tesla: ['Model Y', 'Model 3'],
  Volvo: ['XC40', 'XC60', 'XC90', 'S60', 'S90'],
  Chery: ['Tiggo 7 Pro', 'Tiggo 8 Pro', 'Omoda 5'],
  BYD: ['Atto 3', 'Seal', 'Dolphin', 'Seal U'],
  MG: ['ZS', 'MG4', 'HS'],
  Suzuki: ['Vitara', 'Swift', 'S-Cross'],
  Jeep: ['Renegade', 'Compass', 'Avenger'],
  // Motosiklet
  Yamaha: ['NMAX', 'XMAX', 'MT-07', 'MT-25', 'YZF-R25', 'Tracer 9', 'Tricity'],
  Kawasaki: ['Ninja 650', 'Z650', 'Z900', 'Versys 650', 'Ninja ZX-6R'],
  'BMW Motorrad': ['S 1000 RR', 'R 1250 GS', 'F 900 R', 'G 310 R', 'R 1300 GS'],
  Ducati: ['Panigale V4', 'Monster', 'Multistrada V4', 'Scrambler'],
  KTM: ['Duke 390', 'Duke 790', 'Adventure 390', 'RC 390'],
  Vespa: ['Primavera', 'Sprint', 'GTS'],
  Kuba: ['Bluebird', 'Trendy', 'Superlight'],
  Mondial: ['Drift L', 'Lavinia', 'X-Treme'],
  CFMoto: ['250NK', '450SR', '800MT'],
  Sym: ['Jet X', 'Fiddle', 'Symphony'],
  Bajaj: ['Pulsar NS200', 'Dominar 400'],
  // Traktör
  'New Holland': ['TT75', 'TD75', 'T480', 'TT4.75'],
};

export function modelsFor(type: VehicleType, brand: string): string[] {
  if (type === 'motosiklet' && brand === 'Honda') return ['PCX', 'Activa', 'Dio', 'CB125F', 'CBR650R', 'Forza 250', 'NC750X'];
  if (type === 'motosiklet' && brand === 'Suzuki') return ['Address', 'Burgman', 'GSX-R125', 'V-Strom 650'];
  if (type !== 'otomobil' && (brand === 'BMW' || brand === 'Toyota')) return [];
  return MODELS[brand] ?? [];
}

export const TYPE_LABEL: Record<VehicleType, string> = {
  otomobil: 'Otomobil',
  motosiklet: 'Motosiklet',
  traktor: 'Traktör',
};

/** Traktörde kilometre yerine motor saati tutulur */
export function odometerUnit(type: VehicleType): string {
  return type === 'traktor' ? 'motor saati' : 'km';
}
