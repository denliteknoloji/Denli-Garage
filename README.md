# Denli Garage

Aracının her şeyi, tek garajda. Araç bilgileri, Torpido (belgeler), masraflar ve muayene / sigorta / kasko / MTV hatırlatmaları.

- Site: https://garage.getdenli.com
- Instagram: @denligarage
- Bir Denli Teknoloji markası

## Teknoloji

Expo SDK 58 · React Native · TypeScript · Expo Router · expo-sqlite (cihazda saklama).
Hesap, bulut yedeği (Supabase) ve Plus aboneliği (RevenueCat) sonraki aşamada eklenecek.

## Çalıştırma

```bash
npm install
npx expo start          # geliştirme sunucusu
npx tsc --noEmit        # tür kontrolü
npx expo lint           # lint
```

## Android APK (test için)

```bash
npx eas-cli@latest build --profile preview --platform android
```

Ya da expo.dev → proje → Builds → "Build from GitHub" ile `preview` profilini seç.

## Klasörler

- `src/app/`: ekranlar (Expo Router). `(tabs)` alt menü: Garaj, Torpido, Masraf, Profil.
- `src/components/`: ortak bileşenler (TR plaka, araç kartı, hatırlatma satırı, formlar).
- `src/lib/`: veri katmanı (`store.tsx`), tarih ve biçim yardımcıları, marka listesi.
- `src/theme/`: renkler ve yazı tipleri (sitedeki tasarım diliyle aynı).

## Güvenlik

Anahtarlar (Supabase, RevenueCat) yalnızca `.env` içinde tutulur; `.env` repoya girmez. Supabase `service_role` anahtarı uygulamaya asla eklenmez.
