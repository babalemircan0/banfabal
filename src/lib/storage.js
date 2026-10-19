export const FOTO_BUCKET = 'ilan-fotograflari'

// Supabase public URL'sinden storage içindeki dosya yolunu çıkarır.
export function fotoYolu(url, bucket = FOTO_BUCKET) {
  if (!url) return null
  const isaret = `/storage/v1/object/public/${bucket}/`
  const baslangic = url.indexOf(isaret)
  if (baslangic === -1) return null
  const yol = url.slice(baslangic + isaret.length).split('?')[0]
  try {
    return decodeURIComponent(yol)
  } catch {
    return yol
  }
}

// Verilen public URL'lere ait dosyaları storage'dan siler.
export async function fotoSil(supabase, urls, bucket = FOTO_BUCKET) {
  const yollar = (urls || []).map((url) => fotoYolu(url, bucket)).filter(Boolean)
  if (yollar.length === 0) return null
  const { error } = await supabase.storage.from(bucket).remove(yollar)
  return error
}
