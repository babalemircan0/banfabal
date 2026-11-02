# Banfabal

React + Vite ile geliştirilmiş, Supabase altyapısını kullanan emlak ilan platformu.

[![CI](https://github.com/babalemircan0/banfabal/actions/workflows/ci.yml/badge.svg)](https://github.com/babalemircan0/banfabal/actions/workflows/ci.yml)

## Canlı Uygulama

https://banfabal.vercel.app

## Özellikler

- İlan listeleme ve filtreleme (arama, il, imar durumu, fiyat, metrekare)
- İlan ekleme, düzenleme, fotoğraf yükleme ve yönetme
- Ada, parsel, pafta, tapu durumu, KAKS/TAKS ve altyapı bilgileriyle detaylı arsa ilanı
- İlan detay sayfası ve yorumlar
- Kullanıcı kaydı ve girişi (Supabase Auth)
- Şifre sıfırlama ve şifre yenileme akışı
- Alıcı-satıcı arasında canlı mesajlaşma (Supabase Realtime)
- Mesaj düzenleme, silme ve görüldü bilgisi
- Okunmamış mesaj bildirimi
- Tüm sayfalarda ortak ve sayfaya göre uyarlanan menü barı
- KVKK aydınlatma, gizlilik, kullanım şartları ve çerez politikası sayfaları
- Hesap ve ilan yönetimi
- Responsive arayüz
- 404 sayfası ve hata sınırı

## Kullanılan Teknolojiler

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [React Router](https://reactrouter.com)
- [Supabase](https://supabase.com) (Auth, Postgres, Storage, Realtime)
- [Oxlint](https://oxc.rs)
- [Vercel](https://vercel.com)

## Kurulum

```bash
npm install
cp .env.example .env
npm run dev
```

`.env` dosyasına Supabase proje URL'sini ve publishable (anon) anahtarını girin:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışır.

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run build` | Üretim için derler |
| `npm run preview` | Derlenmiş sürümü önizler |
| `npm run lint` | Kod kontrolü yapar |
| `npm run lint:fix` | Otomatik düzeltilebilen lint sorunlarını giderir |
| `npm run check` | Lint ve build'i birlikte çalıştırır |

## Proje Yapısı

```text
.
├── src/
│   ├── components/        # Foto seçici, sohbet, modal, hata sınırı
│   ├── css/               # Sayfa ve bileşen stilleri
│   ├── lib/               # Format ve storage yardımcıları
│   ├── pages/             # Route sayfaları
│   ├── supabaseClient.js  # Supabase istemcisi
│   ├── App.jsx            # Router ve lazy loading
│   └── main.jsx
├── supabase/
│   ├── migrations/        # Veritabanı migration dosyaları
│   └── README.md          # RLS ve storage politikaları
├── docs/
│   └── veritabani.md      # Tablo şeması ve ilişkiler
├── .github/workflows/ci.yml
└── vercel.json            # SPA rewrite kuralı
```

## Supabase Yapılandırması

Bağlantı bilgileri ortam değişkenlerinden okunur:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Bu değerler Vite tarafından build sırasında tarayıcıya gömülür. Publishable/anon anahtar tarayıcıda kullanılmak üzere tasarlandığı için gizli değildir; veri güvenliği Supabase RLS politikalarıyla sağlanır. `service_role` anahtarı asla frontend'de kullanılmamalıdır.

### Veritabanı ve güvenlik

- Tablo şeması: [`docs/veritabani.md`](docs/veritabani.md)
- RLS, storage ve migration detayları: [`supabase/README.md`](supabase/README.md)
- Migration: [`supabase/migrations/20261019154352_guvenlik_ve_performans_iyilestirmeleri.sql`](supabase/migrations/20261019154352_guvenlik_ve_performans_iyilestirmeleri.sql)

Tüm tablolarda RLS açıktır. Kullanıcılar yalnızca kendi ilanlarını, yorumlarını ve konuşmalarını yönetebilir. Fotoğraf yükleme ve silme işlemleri kullanıcı klasörüyle sınırlıdır; bucket için 5 MB ve görsel MIME türü limitleri tanımlıdır.

### Şifre sıfırlama

Supabase panelinde **Authentication → URL Configuration** bölümünde aşağıdaki adresler tanımlanmalıdır:

- Site URL: `https://banfabal.vercel.app`
- Redirect URL: `https://banfabal.vercel.app/sifre-yenile`
- Geliştirme için: `http://localhost:5173/sifre-yenile`

> Supabase panelinde **Authentication → Password Security → Leaked Password Protection** ayarını da etkinleştirmeniz önerilir.

## CI

`main` branch'ine yapılan push'larda ve pull request'lerde GitHub Actions üzerinde `npm run lint` ve `npm run build` çalışır.

## Vercel

Proje Vercel'e dağıtılmıştır. Ortam değişkenleri Vercel'de `Production`, `Preview` ve `Development` ortamları için tanımlıdır. SPA yönlendirmeleri `vercel.json` içindeki rewrite kuralıyla desteklenir.

`main` branch'ine yapılan her push, Vercel tarafından otomatik olarak production ortamına dağıtılır.
