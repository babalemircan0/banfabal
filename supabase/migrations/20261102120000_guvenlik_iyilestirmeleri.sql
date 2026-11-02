-- Güvenlik iyileştirmeleri
-- Uygulama tarihi: 2026-11-02
--
-- 1. Mesaj güncelleme tetikleyicisinin arama yolunu sabitler.
-- 2. mesajlar tablosundaki iki ayrı permissive UPDATE politikasını tek politikada birleştirir.
--    Alan bazlı yetki kontrolü mesaj_guncelleme_kontrol tetikleyicisinde devam eder.

alter function public.mesaj_guncelleme_kontrol() set search_path = '';

drop policy if exists "alici mesaji okundu yapar" on public.mesajlar;
drop policy if exists "gonderen mesajini duzenler" on public.mesajlar;

create policy "taraflar mesaji gunceller" on public.mesajlar
  for update to authenticated
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
  )
  with check (
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
