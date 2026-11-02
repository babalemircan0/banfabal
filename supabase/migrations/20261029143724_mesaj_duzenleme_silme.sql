-- Mesaj düzenleme, silme ve görüldü bilgisi
-- Uygulama tarihi: 2026-10-29
--
-- Bu migration şunları yapar:
--   1. Mesajlara düzenlenme ve silinme zaman damgalarını ekler.
--   2. Gönderenin kendi mesajını düzenlemesine/silmesine izin verir.
--   3. Silinen mesajların metninin temizlenebilmesi için kontrolü günceller.
--   4. Silinmiş mesajların okunmamış sayılmaması için indeks ekler.

alter table public.mesajlar
  add column if not exists duzenlendi_at timestamptz,
  add column if not exists silindi_at timestamptz;

-- Silinmiş mesajlarda metin boş bırakılabilir; aktif mesajlar boş olamaz.
alter table public.mesajlar drop constraint if exists mesajlar_metin_bos_olamaz;
alter table public.mesajlar
  add constraint mesajlar_metin_bos_olamaz
  check (silindi_at is not null or btrim(metin) <> '');

-- Gönderen kendi mesajını düzenleyebilir ve silebilir (soft delete).
drop policy if exists "gonderen mesajini duzenler" on public.mesajlar;
create policy "gonderen mesajini duzenler" on public.mesajlar
  for update to authenticated
  using (
    gonderen_id = (select auth.uid())
    and exists (
      select 1
      from public.konusmalar k
      where k.id = mesajlar.konusma_id
        and (
          k.alici_id = (select auth.uid())
          or k.satici_id = (select auth.uid())
        )
    )
  )
  with check (
    gonderen_id = (select auth.uid())
    and exists (
      select 1
      from public.konusmalar k
      where k.id = mesajlar.konusma_id
        and (
          k.alici_id = (select auth.uid())
          or k.satici_id = (select auth.uid())
        )
    )
  );

-- Gönderen yalnızca mesaj metnini ve zaman damgalarını güncelleyebilir.
grant update (metin, duzenlendi_at, silindi_at) on public.mesajlar to authenticated;

-- Okunmamış mesaj sayımı silinmiş mesajları hesaba katmasın.
create index if not exists mesajlar_okunmamis_idx
  on public.mesajlar (konusma_id)
  where okundu = false and silindi_at is null;
