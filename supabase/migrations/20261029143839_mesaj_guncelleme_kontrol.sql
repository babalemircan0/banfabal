-- Mesaj güncellemelerinde rol bazlı alan kontrolü
-- Uygulama tarihi: 2026-10-29
--
-- RLS politikaları satır bazlıdır ve sütun yetkileri tüm kimliği doğrulanmış
-- kullanıcılar için ortaktır. Bu tetikleyici, karşı tarafın mesaj metnini
-- değiştirmesini engeller:
--   - Gönderen yalnızca metin, duzenlendi_at ve silindi_at alanlarını değiştirebilir.
--   - Karşı taraf yalnızca okundu alanını değiştirebilir.

create or replace function public.mesaj_guncelleme_kontrol()
returns trigger
language plpgsql
as $$
declare
  kullanici_id uuid := (select auth.uid());
begin
  if kullanici_id = old.gonderen_id then
    if new.gonderen_id is distinct from old.gonderen_id
      or new.konusma_id is distinct from old.konusma_id
      or new.created_at is distinct from old.created_at
      or new.okundu is distinct from old.okundu then
      raise exception 'Mesajın yalnızca metni düzenlenebilir veya silinebilir.';
    end if;
    return new;
  end if;

  if kullanici_id is not null then
    if new.gonderen_id is distinct from old.gonderen_id
      or new.konusma_id is distinct from old.konusma_id
      or new.metin is distinct from old.metin
      or new.created_at is distinct from old.created_at
      or new.duzenlendi_at is distinct from old.duzenlendi_at
      or new.silindi_at is distinct from old.silindi_at then
      raise exception 'Yalnızca okundu durumu güncellenebilir.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists mesaj_guncelleme_kontrol on public.mesajlar;
create trigger mesaj_guncelleme_kontrol
  before update on public.mesajlar
  for each row execute function public.mesaj_guncelleme_kontrol();
