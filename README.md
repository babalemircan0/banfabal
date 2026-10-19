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

## Canlı Uygulama

https://banfabal.vercel.app

## Kurulum

```bash
npm install
cp .env.example .env
npm run dev
```

`.env` dosyasına Supabase proje URL'sini ve publishable (anon) anahtarını girin.

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışır.

## Komutlar

- `npm run dev` — Geliştirme sunucusunu başlatır
- `npm run build` — Üretim için derler
- `npm run preview` — Derlenmiş sürümü önizler
- `npm run lint` — Kod kontrolü yapar

## Supabase Yapılandırması

Bağlantı bilgileri ortam değişkenlerinden okunur:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Bu değerler Vite tarafından build sırasında tarayıcıya gömülür. Publishable/anon anahtar tarayıcıda kullanılmak üzere tasarlandığı için gizli değildir; veri güvenliği Supabase RLS politikalarıyla sağlanır. `service_role` anahtarı asla frontend'de kullanılmamalıdır.

## Vercel

Proje Vercel'e dağıtılmıştır. Aynı ortam değişkenleri Vercel'de `Production`, `Preview` ve `Development` ortamları için tanımlıdır. SPA yönlendirmeleri `vercel.json` içindeki rewrite kuralıyla desteklenir.
