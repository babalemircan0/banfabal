# Veritabanı Şeması

Banfabal, Supabase (PostgreSQL) üzerinde aşağıdaki tabloları kullanır.

## İlişkiler

```text
auth.users
  ├── ilanlar.user_id
  ├── yorumlar.user_id
  ├── konusmalar.alici_id
  ├── konusmalar.satici_id
  └── mesajlar.gonderen_id

ilanlar
  ├── yorumlar.ilan_id
  └── konusmalar.ilan_id

konusmalar
  └── mesajlar.konusma_id
```

Tüm ilan, yorum, konuşma ve mesaj kayıtlarında `ON DELETE CASCADE` kullanılır. Bir ilan silindiğinde yorumları, konuşmaları ve mesajları da silinir; bir kullanıcı silindiğinde kullanıcıya ait kayıtlar temizlenir.

## `ilanlar`

| Kolon | Tip | Not |
|---|---|---|
| `id` | uuid | PK, `gen_random_uuid()` |
| `user_id` | uuid | İlan sahibi, `auth.users` |
| `baslik` | text | İlan başlığı |
| `aciklama` | text | Açıklama |
| `fiyat` | numeric | TL |
| `metrekare` | numeric | m² |
| `il` / `ilce` | text | Konum |
| `mahalle` | text | Mahalle / köy |
| `ada` / `parsel` / `pafta` | text | Kadastro bilgileri |
| `imar_durumu` | text | Konut, Ticari, Tarla vb. |
| `tapu_durumu` | text | Müstakil, Hisseli, İfrazlı, Tahsis |
| `kaks` / `taks` / `gabari` | numeric | İmar değerleri |
| `yol_cephe` | numeric | Yola cephe (metre) |
| `altyapilar` | text[] | Yol, Elektrik, Su, Doğalgaz, İnternet |
| `fotograflar` | text[] | Public storage URL'leri |
| `satici_adi` | text | Görünen satıcı adı |
| `created_at` | timestamptz | Oluşturma zamanı |

## `yorumlar`

| Kolon | Tip | Not |
|---|---|---|
| `id` | uuid | PK |
| `ilan_id` | uuid | `ilanlar.id`, cascade |
| `user_id` | uuid | `auth.users.id`, cascade |
| `yazar_adi` | text | Görünen ad |
| `metin` | text | Yorum |
| `created_at` | timestamptz | Oluşturma zamanı |

## `konusmalar`

| Kolon | Tip | Not |
|---|---|---|
| `id` | uuid | PK |
| `ilan_id` | uuid | `ilanlar.id`, cascade |
| `alici_id` | uuid | `auth.users.id`, cascade |
| `satici_id` | uuid | `auth.users.id`, cascade |
| `ilan_baslik` | text | Liste görünümü için |
| `alici_adi` | text | Görünen ad |
| `satici_adi` | text | Görünen ad |
| `created_at` | timestamptz | Oluşturma zamanı |

Ek kural: `(ilan_id, alici_id)` benzersizdir ve `alici_id <> satici_id` olmalıdır.

## `mesajlar`

| Kolon | Tip | Not |
|---|---|---|
| `id` | uuid | PK |
| `konusma_id` | uuid | `konusmalar.id`, cascade |
| `gonderen_id` | uuid | `auth.users.id`, cascade |
| `metin` | text | Silinmemişse boş olamaz |
| `okundu` | boolean | Varsayılan `false` |
| `duzenlendi_at` | timestamptz | Düzenlenme zamanı (boşsa hiç düzenlenmedi) |
| `silindi_at` | timestamptz | Silinme zamanı; silinen mesajların metni boşaltılır (soft delete) |
| `created_at` | timestamptz | Oluşturma zamanı |

## Legacy `arsalar`

Uygulama tarafından kullanılmaz. Eski denemelerden kalmıştır; güvenlik için RLS etkinleştirilmiş ve sahiplik politikaları eklenmiştir.
