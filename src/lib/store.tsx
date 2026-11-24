// Uygulama verisi: cihazda saklanan tek bir durum nesnesi.
// Hesap ve bulut senkronu (Supabase) bir sonraki aşamada bu katmanın arkasına eklenecek.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { daysUntil, nextMTVDeadline } from './dates';
import { uid } from './format';
import { loadRaw, saveRaw } from './storage';
import type { AppState, Expense, Vehicle, VehicleDoc } from './types';

const KEY = 'denli-garage:v1';

const EMPTY: AppState = { version: 1, onboarded: false, vehicles: [], expenses: [], docs: [] };

function load(): AppState {
  const raw = loadRaw(KEY);
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      version: 1,
      onboarded: Boolean(parsed.onboarded),
      vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      docs: Array.isArray(parsed.docs) ? parsed.docs : [],
    };
  } catch {
    return EMPTY;
  }
}

export type NewVehicle = Omit<Vehicle, 'id' | 'createdAt'>;
export type NewExpense = Omit<Expense, 'id'>;
export type NewDoc = Omit<VehicleDoc, 'id'>;

interface Store {
  state: AppState;
  finishOnboarding: () => void;
  addVehicle: (v: NewVehicle) => Vehicle;
  updateVehicle: (id: string, patch: Partial<NewVehicle>) => void;
  removeVehicle: (id: string) => void;
  addExpense: (e: NewExpense) => void;
  removeExpense: (id: string) => void;
  addDoc: (d: NewDoc) => void;
  removeDoc: (id: string) => void;
  resetAll: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    saveRaw(KEY, JSON.stringify(state));
  }, [state]);

  const finishOnboarding = useCallback(() => setState((s) => ({ ...s, onboarded: true })), []);

  const addVehicle = useCallback((v: NewVehicle) => {
    const vehicle: Vehicle = { ...v, id: uid(), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, vehicles: [...s.vehicles, vehicle] }));
    return vehicle;
  }, []);

  const updateVehicle = useCallback((id: string, patch: Partial<NewVehicle>) => {
    setState((s) => ({ ...s, vehicles: s.vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v)) }));
  }, []);

  const removeVehicle = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      vehicles: s.vehicles.filter((v) => v.id !== id),
      expenses: s.expenses.filter((e) => e.vehicleId !== id),
      docs: s.docs.filter((d) => d.vehicleId !== id),
    }));
  }, []);

  const addExpense = useCallback((e: NewExpense) => {
    setState((s) => ({ ...s, expenses: [{ ...e, id: uid() }, ...s.expenses] }));
  }, []);

  const removeExpense = useCallback((id: string) => {
    setState((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== id) }));
  }, []);

  const addDoc = useCallback((d: NewDoc) => {
    setState((s) => ({ ...s, docs: [...s.docs, { ...d, id: uid() }] }));
  }, []);

  const removeDoc = useCallback((id: string) => {
    setState((s) => ({ ...s, docs: s.docs.filter((d) => d.id !== id) }));
  }, []);

  const resetAll = useCallback(() => setState({ ...EMPTY, onboarded: true }), []);

  const value = useMemo<Store>(
    () => ({ state, finishOnboarding, addVehicle, updateVehicle, removeVehicle, addExpense, removeExpense, addDoc, removeDoc, resetAll }),
    [state, finishOnboarding, addVehicle, updateVehicle, removeVehicle, addExpense, removeExpense, addDoc, removeDoc, resetAll],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore, StoreProvider içinde kullanılmalı');
  return ctx;
}

export interface Reminder {
  key: string;
  vehicleId: string;
  title: string;
  date: string; // ISO
  days: number;
}

/** Bir aracın tüm hatırlatmaları, en yakın tarih önce */
export function remindersFor(v: Vehicle): Reminder[] {
  const list: Reminder[] = [];
  const push = (key: string, title: string, date: string | null) => {
    if (date) list.push({ key: `${v.id}:${key}`, vehicleId: v.id, title, date, days: daysUntil(date) });
  };
  push('muayene', 'Muayene', v.inspectionDate);
  push('sigorta', 'Trafik sigortası', v.insuranceEnd);
  push('kasko', 'Kasko', v.cascoEnd);
  if (v.type !== 'traktor' || v.plate) push('mtv', 'MTV taksidi', nextMTVDeadline());
  return list.sort((a, b) => a.days - b.days);
}
