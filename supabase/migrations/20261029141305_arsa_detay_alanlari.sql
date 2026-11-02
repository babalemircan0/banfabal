-- Arsa ilanları için ada/parsel ve detay alanları.
-- Tüm alanlar isteğe bağlıdır; mevcut ilanlar etkilenmez.

alter table public.ilanlar
  add column if not exists mahalle text,
  add column if not exists ada text,
  add column if not exists parsel text,
  add column if not exists pafta text,
  add column if not exists tapu_durumu text,
  add column if not exists kaks numeric,
  add column if not exists taks numeric,
  add column if not exists gabari numeric,
  add column if not exists yol_cephe numeric,
  add column if not exists altyapilar text[] not null default '{}'::text[];
