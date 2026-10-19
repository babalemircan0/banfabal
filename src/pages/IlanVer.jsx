import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import logo from '../images/logo.png'
import FotoSecici from '../components/FotoSecici.jsx'
import { FOTO_BUCKET } from '../lib/storage.js'
import '../css/IlanVer.css'

export default function IlanVer() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [form, setForm] = useState({
    baslik: '',
    aciklama: '',
    fiyat: '',
    metrekare: '',
    il: '',
    ilce: '',
    imar_durumu: 'Konut',
  })
  const [fotolar, setFotolar] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/giris')
      else {
        setUser(data.session.user)
        setReady(true)
      }
    })
  }, [navigate])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError('')

    const fiyat = Number(form.fiyat)
    const metrekare = Number(form.metrekare)
    if (!Number.isFinite(fiyat) || fiyat < 0 || !Number.isFinite(metrekare) || metrekare < 0) {
      setError('Fiyat ve metrekare geçerli bir sayı olmalı.')
      setSaving(false)
      return
    }

    const yuklenenYollar = []
    try {
      const urls = []
      for (const foto of fotolar) {
        const ext = foto.file.name.split('.').pop().toLowerCase()
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`
        const { error: upErr } = await supabase.storage.from(FOTO_BUCKET).upload(path, foto.file)
        if (upErr) throw upErr
        yuklenenYollar.push(path)
        urls.push(supabase.storage.from(FOTO_BUCKET).getPublicUrl(path).data.publicUrl)
      }

      const { error: insErr } = await supabase.from('ilanlar').insert({
        ...form,
        baslik: form.baslik.trim(),
        aciklama: form.aciklama.trim(),
        il: form.il.trim(),
        ilce: form.ilce.trim(),
        fiyat,
        metrekare,
        fotograflar: urls,
        user_id: user.id,
        satici_adi: (user.user_metadata?.ad || '').trim() || user.email,
      })
      if (insErr) throw insErr
      navigate('/')
    } catch (err) {
      // İlan kaydı başarısız olursa yüklenen fotoğrafları temizle.
      if (yuklenenYollar.length > 0) {
        await supabase.storage.from(FOTO_BUCKET).remove(yuklenenYollar)
      }
      setError(err.message || 'İlan yayınlanamadı.')
    } finally {
      setSaving(false)
    }
  }

  if (!ready) return null

  return (
    <div className="ilan-page">
      <form className="ilan-card" onSubmit={handleSubmit}>
        <Link to="/"><img src={logo} alt="Banfabal" className="ilan-logo" /></Link>
        <h2>İlan Ver</h2>

        <label>Başlık
          <input required maxLength={120} value={form.baslik} onChange={set('baslik')} />
        </label>

        <label>Açıklama
          <textarea rows="4" maxLength={2000} value={form.aciklama} onChange={set('aciklama')} />
        </label>

        <div className="ilan-row">
          <label>Fiyat (₺)
            <input required type="number" min="0" value={form.fiyat} onChange={set('fiyat')} />
          </label>
          <label>Metrekare (m²)
            <input required type="number" min="0" value={form.metrekare} onChange={set('metrekare')} />
          </label>
        </div>

        <div className="ilan-row">
          <label>İl
            <input required maxLength={50} value={form.il} onChange={set('il')} />
          </label>
          <label>İlçe
            <input required maxLength={50} value={form.ilce} onChange={set('ilce')} />
          </label>
        </div>

        <label>İmar Durumu
          <select value={form.imar_durumu} onChange={set('imar_durumu')}>
            <option>Konut</option>
            <option>Ticari</option>
            <option>Tarla</option>
            <option>Bağ / Bahçe</option>
            <option>Sanayi</option>
            <option>Diğer</option>
          </select>
        </label>

        <FotoSecici items={fotolar} setItems={setFotolar} />

        {error && <p className="ilan-error">{error}</p>}

        <button type="submit" className="ilan-submit" disabled={saving}>
          {saving ? 'Yayınlanıyor...' : 'İlanı Yayınla'}
        </button>
      </form>
    </div>
  )
}
