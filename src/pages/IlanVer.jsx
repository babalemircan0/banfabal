import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import logo from '../images/logo.png'
import FotoSecici from '../components/FotoSecici.jsx'
import '../css/IlanVer.css'

const BUCKET = 'ilan-fotograflari'

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
    setSaving(true)
    setError('')
    try {
      const urls = []
      for (const foto of fotolar) {
        const ext = foto.file.name.split('.').pop()
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, foto.file)
        if (upErr) throw upErr
        urls.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl)
      }

      const { error: insErr } = await supabase.from('ilanlar').insert({
        ...form,
        fiyat: Number(form.fiyat),
        metrekare: Number(form.metrekare),
        fotograflar: urls,
        user_id: user.id,
        satici_adi: user.user_metadata?.ad || user.email,
      })
      if (insErr) throw insErr
      navigate('/')
    } catch (err) {
      setError(err.message)
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
          <input required value={form.baslik} onChange={set('baslik')} />
        </label>

        <label>Açıklama
          <textarea rows="4" value={form.aciklama} onChange={set('aciklama')} />
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
            <input required value={form.il} onChange={set('il')} />
          </label>
          <label>İlçe
            <input required value={form.ilce} onChange={set('ilce')} />
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
