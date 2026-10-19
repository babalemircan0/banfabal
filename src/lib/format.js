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
