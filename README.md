# Banfabal

React + Vite ile geliştirilmiş, Supabase altyapısını kullanan emlak ilan platformu.

## Özellikler

- İlan listeleme ve filtreleme (arama, il, imar durumu, fiyat, metrekare)
- İlan ekleme, düzenleme ve yönetme
- İlan detay sayfası
- Kullanıcı kaydı ve girişi (Supabase Auth)
- Üyeler arası mesajlaşma
- Hesap yönetimi

## Kullanılan Teknolojiler

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [React Router](https://reactrouter.com)
- [Supabase](https://supabase.com)
- [Oxlint](https://oxc.rs)

## Kurulum

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışır.

## Komutlar

- `npm run dev` — Geliştirme sunucusunu başlatır
- `npm run build` — Üretim için derler
- `npm run preview` — Derlenmiş sürümü önizler
- `npm run lint` — Kod kontrolü yapar

## Supabase Yapılandırması

Supabase bağlantı bilgileri `src/supabaseClient.js` dosyasında tanımlıdır.
