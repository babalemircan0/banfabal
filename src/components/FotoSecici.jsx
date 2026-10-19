const MAX_FOTO = 10

// items: [{ id, url, file? }]  (ilk eleman kapak fotoğrafıdır)
export default function FotoSecici({ items, setItems }) {
  const handleAdd = (e) => {
    const yeni = Array.from(e.target.files).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }))
    setItems([...items, ...yeni].slice(0, MAX_FOTO))
    e.target.value = ''
  }

  const remove = (id) => setItems(items.filter((i) => i.id !== id))

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

      {items.length > 0 && (
        <>
          <p className="foto-hint">Birden fazla fotoğraf ekleyebilirsin. Kapak yapmak için fotoğrafa "Kapak yap" de.</p>
          <div className="foto-grid">
            {items.map((item, idx) => (
              <div className={idx === 0 ? 'foto-item kapak' : 'foto-item'} key={item.id}>
                <img src={item.url} alt="" />
                {idx === 0 && <span className="foto-badge">Kapak</span>}
                <button type="button" className="foto-remove" title="Kaldır" onClick={() => remove(item.id)}>
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
