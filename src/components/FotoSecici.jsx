import { useEffect, useRef, useState } from 'react'

const MAX_FOTO = 10
const MAX_BOYUT = 5 * 1024 * 1024

// items: [{ id, url, file? }]  (ilk eleman kapak fotoğrafıdır)
export default function FotoSecici({ items, setItems }) {
  const [hata, setHata] = useState('')
  const itemsRef = useRef(items)

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => {
        if (item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url)
      })
    }
  }, [])

  const handleAdd = (e) => {
    const secilenler = Array.from(e.target.files || [])
    const bosluk = MAX_FOTO - items.length
    const kabul = []
    const reddedilen = []

    secilenler.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        reddedilen.push(`${file.name}: görsel dosyası değil`)
      } else if (file.size > MAX_BOYUT) {
        reddedilen.push(`${file.name}: 5 MB sınırını aşıyor`)
      } else if (kabul.length >= bosluk) {
        reddedilen.push(`${file.name}: en fazla ${MAX_FOTO} fotoğraf eklenebilir`)
      } else {
        kabul.push({
          id: crypto.randomUUID(),
          url: URL.createObjectURL(file),
          file,
        })
      }
    })

    if (kabul.length > 0) setItems([...items, ...kabul])
    setHata(reddedilen.length > 0 ? `Eklenemedi → ${reddedilen.join(', ')}` : '')
    e.target.value = ''
  }

  const remove = (id) => {
    const silinecek = items.find((item) => item.id === id)
    if (silinecek?.url?.startsWith('blob:')) URL.revokeObjectURL(silinecek.url)
    setItems(items.filter((item) => item.id !== id))
    setHata('')
  }

  const makeCover = (id) => {
    const secili = items.find((i) => i.id === id)
    setItems([secili, ...items.filter((i) => i.id !== id)])
  }

  return (
    <div className="foto-secici">
      <label>Fotoğraflar ({items.length}/{MAX_FOTO})
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleAdd}
          disabled={items.length >= MAX_FOTO}
        />
      </label>

      <p className="foto-hint">En fazla {MAX_FOTO} fotoğraf, fotoğraf başına en çok 5 MB.</p>
      {hata && <p className="ilan-error">{hata}</p>}

      {items.length > 0 && (
        <>
          <p className="foto-hint">Birden fazla fotoğraf ekleyebilirsin. Kapak yapmak için fotoğrafa "Kapak yap" de.</p>
          <div className="foto-grid">
            {items.map((item, idx) => (
              <div className={idx === 0 ? 'foto-item kapak' : 'foto-item'} key={item.id}>
                <img src={item.url} alt="" />
                {idx === 0 && <span className="foto-badge">Kapak</span>}
                <button type="button" className="foto-remove" title="Kaldır" aria-label="Fotoğrafı kaldır" onClick={() => remove(item.id)}>
                  ×
                </button>
                {idx !== 0 && (
                  <button type="button" className="foto-cover" onClick={() => makeCover(item.id)}>
                    Kapak yap
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
