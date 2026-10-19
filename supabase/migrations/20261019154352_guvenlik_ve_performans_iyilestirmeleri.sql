-- Banfabal güvenlik ve performans iyileştirmeleri
-- Uygulama tarihi: 2026-10-19
-- Supabase project ref: jndhfuascjxjbjobneun
--
-- Bu migration şunları yapar:
--   1. Eski arsalar tablosunda RLS'i etkinleştirir.
--   2. auth.uid() çağrılarını (select auth.uid()) ile optimize eder.
--   3. Konuşma oluştururken satıcının ilan sahibi olduğunu doğrular.
--   4. Mesaj ve konuşma politikalarını sıkılaştırır.
--   5. Storage yüklemelerini kullanıcı klasörüyle sınırlar.
--   6. Bucket için boyut ve MIME türü limitleri koyar.
--   7. Sorgularda kullanılan foreign key ve sıralama kolonlarına indeks ekler.

-- 1) Kullanılmayan eski arsalar tablosunu RLS ile koru
alter table public.arsalar enable row level security;

drop policy if exists "arsalari herkes gorur" on public.arsalar;
create policy "arsalari herkes gorur" on public.arsalar
  for select using (true);

drop policy if exists "giris yapan arsa ekler" on public.arsalar;
create policy "giris yapan arsa ekler" on public.arsalar
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "kullanici kendi arsasini gunceller" on public.arsalar;
create policy "kullanici kendi arsasini gunceller" on public.arsalar
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "kullanici kendi arsasini siler" on public.arsalar;
create policy "kullanici kendi arsasini siler" on public.arsalar
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- 2) İlan politikalarını (select auth.uid()) ile optimize et
drop policy if exists "giris yapan ilan ekler" on public.ilanlar;
create policy "giris yapan ilan ekler" on public.ilanlar
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "kullanici kendi ilanini gunceller" on public.ilanlar;
create policy "kullanici kendi ilanini gunceller" on public.ilanlar
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "kullanici kendi ilanini siler" on public.ilanlar;
create policy "kullanici kendi ilanini siler" on public.ilanlar
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- 3) Yorum politikalarını optimize et
drop policy if exists "giris yapan yorum yapar" on public.yorumlar;
create policy "giris yapan yorum yapar" on public.yorumlar
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "kullanici kendi yorumunu siler" on public.yorumlar;
create policy "kullanici kendi yorumunu siler" on public.yorumlar
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- 4) Konuşma politikalarını optimize et ve satıcı doğrulaması ekle
drop policy if exists "taraflar konusmayi gorur" on public.konusmalar;
create policy "taraflar konusmayi gorur" on public.konusmalar
  for select to authenticated
  using (
    (select auth.uid()) = alici_id
    or (select auth.uid()) = satici_id
  );

drop policy if exists "alici konusma baslatir" on public.konusmalar;
create policy "alici konusma baslatir" on public.konusmalar
  for insert to authenticated
  with check (
    (select auth.uid()) = alici_id
    and alici_id <> satici_id
    and exists (
      select 1
      from public.ilanlar i
      where i.id = konusmalar.ilan_id
        and i.user_id = konusmalar.satici_id
    )
  );

alter table public.konusmalar
  add constraint konusmalar_alici_satici_farkli check (alici_id <> satici_id);

-- 5) Mesaj politikalarını optimize et
drop policy if exists "taraflar mesajlari gorur" on public.mesajlar;
create policy "taraflar mesajlari gorur" on public.mesajlar
  for select to authenticated
  using (
    exists (
      select 1
      from public.konusmalar k
      where k.id = mesajlar.konusma_id
        and (
          k.alici_id = (select auth.uid())
          or k.satici_id = (select auth.uid())
        )
    )
  );

drop policy if exists "taraflar mesaj gonderir" on public.mesajlar;
create policy "taraflar mesaj gonderir" on public.mesajlar
  for insert to authenticated
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

drop policy if exists "alici mesaji okundu yapar" on public.mesajlar;
create policy "alici mesaji okundu yapar" on public.mesajlar
  for update to authenticated
  using (
    gonderen_id <> (select auth.uid())
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
    gonderen_id <> (select auth.uid())
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

alter table public.mesajlar
  add constraint mesajlar_metin_bos_olamaz check (btrim(metin) <> '');
alter table public.mesajlar alter column metin set not null;

-- 6) Storage politikasını kullanıcı klasörüyle sınırla
drop policy if exists "giris yapan fotograf yukler" on storage.objects;
create policy "giris yapan fotograf yukler" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'ilan-fotograflari'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "kullanici kendi fotografini siler" on storage.objects;
create policy "kullanici kendi fotografini siler" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'ilan-fotograflari'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/avif']
where id = 'ilan-fotograflari';

-- 7) Sorgu performansı için eksik indeksler
create index if not exists ilanlar_user_id_idx on public.ilanlar (user_id);
create index if not exists ilanlar_created_at_idx on public.ilanlar (created_at desc);
create index if not exists konusmalar_alici_id_idx on public.konusmalar (alici_id);
create index if not exists konusmalar_satici_id_idx on public.konusmalar (satici_id);
create index if not exists konusmalar_created_at_idx on public.konusmalar (created_at desc);
create index if not exists mesajlar_gonderen_id_idx on public.mesajlar (gonderen_id);
create index if not exists mesajlar_konusma_created_idx on public.mesajlar (konusma_id, created_at);
create index if not exists yorumlar_user_id_idx on public.yorumlar (user_id);
create index if not exists yorumlar_ilan_created_idx on public.yorumlar (ilan_id, created_at desc);
