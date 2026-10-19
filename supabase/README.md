# Supabase Veritabanı

Bu klasör, Banfabal uygulamasının Supabase şemasını ve güvenlik politikalarını içerir.

- **Project ref:** `jndhfuascjxjbjobneun`
- **API URL:** `https://jndhfuascjxjbjobneun.supabase.co`

## Tablolar

| Tablo | Açıklama | RLS |
|---|---|---|
| `ilanlar` | Emlak ilanları | Açık |
| `yorumlar` | İlan yorumları | Açık |
| `konusmalar` | Alıcı-satıcı konuşmaları | Açık |
| `mesajlar` | Konuşma mesajları | Açık |
| `arsalar` | Eski/legacy tablo (uygulama kullanmıyor) | Açık |

## RLS Özeti

### `ilanlar`
- `SELECT`: Herkes.
- `INSERT`: Giriş yapan kullanıcı, yalnızca kendi `user_id` değeriyle.
- `UPDATE` / `DELETE`: Yalnızca ilan sahibi.

### `yorumlar`
- `SELECT`: Herkes.
- `INSERT`: Giriş yapan kullanıcı, yalnızca kendi `user_id` değeriyle.
- `DELETE`: Yalnızca yorum sahibi.

### `konusmalar`
- `SELECT`: Yalnızca `alici_id` veya `satici_id` olan kullanıcı.
- `INSERT`: `alici_id = auth.uid()`, `alici_id <> satici_id` ve `satici_id` ilanın sahibi olmalı.
- `UPDATE` / `DELETE`: İstemciden kapalı.

### `mesajlar`
- `SELECT`: Yalnızca konuşmanın tarafları.
- `INSERT`: Gönderen `auth.uid()` olmalı ve konuşmanın tarafı olmalı.
- `UPDATE`: Yalnızca karşı taraf `okundu` alanını güncelleyebilir. Kolon seviyesinde yalnızca `okundu` UPDATE yetkisi vardır.
- `DELETE`: İstemciden kapalı.

## Storage

Bucket: `ilan-fotograflari` (public read)

- Yükleme: yalnızca `auth.uid()` ile aynı klasöre (`<user_id>/dosya`).
- Silme: yalnızca kendi klasöründen.
- Maksimum dosya boyutu: **5 MB**
- İzin verilen türler: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/avif`

## Migration Uygulama

Supabase CLI ile:

```bash
supabase link --project-ref jndhfuascjxjbjobneun
supabase db push
```

veya tek dosyayı SQL Editor üzerinden çalıştırabilirsiniz:

```bash
supabase/migrations/20261019154352_guvenlik_ve_performans_iyilestirmeleri.sql
```

## Not

Supabase Auth panelinde **Leaked Password Protection** (HaveIBeenPwned kontrolü) ayrıca etkinleştirilmelidir. Bu ayar SQL migration kapsamında değildir.
