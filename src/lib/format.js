export function sayiFormatla(deger) {
  const sayi = Number(deger)
  if (!Number.isFinite(sayi)) return '-'
  return sayi.toLocaleString('tr-TR')
}

export function fiyatFormatla(deger) {
  const sayi = Number(deger)
  if (!Number.isFinite(sayi)) return 'Fiyat belirtilmemiş'
  return `${sayi.toLocaleString('tr-TR')} ₺`
}

export function tarihFormatla(deger) {
  if (!deger) return '-'
  const tarih = new Date(deger)
  if (Number.isNaN(tarih.getTime())) return '-'
  return tarih.toLocaleDateString('tr-TR')
}

export function saatFormatla(deger) {
  if (!deger) return ''
  const tarih = new Date(deger)
  if (Number.isNaN(tarih.getTime())) return ''
  return tarih.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

export function gunEtiketi(deger) {
  if (!deger) return ''
  const tarih = new Date(deger)
  if (Number.isNaN(tarih.getTime())) return ''

  const ayniGun = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const bugun = new Date()
  if (ayniGun(tarih, bugun)) return 'Bugün'

  const dun = new Date()
  dun.setDate(bugun.getDate() - 1)
  if (ayniGun(tarih, dun)) return 'Dün'

  return tarih.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function basHarfler(ad) {
  const temiz = (ad || '').trim()
  if (!temiz) return '?'
  return temiz
    .split(/\s+/)
    .slice(0, 2)
    .map((parca) => parca.charAt(0).toLocaleUpperCase('tr-TR'))
    .join('')
}
