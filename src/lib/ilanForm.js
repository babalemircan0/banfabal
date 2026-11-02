export const IMAR_SECENEKLERI = ['Konut', 'Ticari', 'Tarla', 'Bağ / Bahçe', 'Sanayi', 'Diğer']

export const TAPU_SECENEKLERI = ['Müstakil tapu', 'Hisseli tapu', 'İfrazlı', 'Tahsis', 'Diğer']

export const ALTYAPI_SECENEKLERI = [
  'Elektrik',
  'Sanayi Elektriği',
  'Su',
  'Doğalgaz',
  'Kanalizasyon',
  'Arıtma',
  'Zemin Etüdü',
  'Yol',
  'Yolu Açılmış',
  'Yolu Açılmamış',
]

// Aynı anda seçilemeyecek altyapı seçenekleri.
const ZIT_ALTYAPILAR = {
  'Yolu Açılmış': 'Yolu Açılmamış',
  'Yolu Açılmamış': 'Yolu Açılmış',
}

export function altyapiSecimiDegistir(mevcut, secenek) {
  const seciliydi = mevcut.includes(secenek)
  let yeni = seciliydi ? mevcut.filter((a) => a !== secenek) : [...mevcut, secenek]
  const zit = ZIT_ALTYAPILAR[secenek]
  if (!seciliydi && zit) yeni = yeni.filter((a) => a !== zit)
  return yeni
}

export const BOS_ILAN_FORM = {
  baslik: '',
  aciklama: '',
  fiyat: '',
  metrekare: '',
  il: '',
  ilce: '',
  mahalle: '',
  ada: '',
  parsel: '',
  pafta: '',
  imar_durumu: 'Konut',
  tapu_durumu: 'Müstakil tapu',
  kaks: '',
  taks: '',
  gabari: '',
  yol_cephe: '',
  altyapilar: [],
}

// Boş bırakılan sayısal alanları null'a, girilenleri sayıya çevirir.
export const sayiVeyaNull = (deger) => {
  const metin = String(deger ?? '').trim()
  if (metin === '') return null
  return Number(metin.replace(',', '.'))
}

export const SAYISAL_ALANLAR = ['kaks', 'taks', 'gabari', 'yol_cephe']

export function sayisalAlanlarGecerliMi(form) {
  return SAYISAL_ALANLAR.every((alan) => {
    const deger = sayiVeyaNull(form[alan])
    return deger === null || (Number.isFinite(deger) && deger >= 0)
  })
}

// Formdaki arsa detaylarını veritabanına uygun biçime getirir.
export function arsaDetaylari(form) {
  return {
    mahalle: form.mahalle.trim() || null,
    ada: form.ada.trim() || null,
    parsel: form.parsel.trim() || null,
    pafta: form.pafta.trim() || null,
    tapu_durumu: form.tapu_durumu || null,
    kaks: sayiVeyaNull(form.kaks),
    taks: sayiVeyaNull(form.taks),
    gabari: sayiVeyaNull(form.gabari),
    yol_cephe: sayiVeyaNull(form.yol_cephe),
    altyapilar: form.altyapilar,
  }
}
