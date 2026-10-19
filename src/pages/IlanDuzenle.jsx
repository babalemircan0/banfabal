import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import logo from '../images/logo.png'
import FotoSecici from '../components/FotoSecici.jsx'
import { FOTO_BUCKET, fotoSil } from '../lib/storage.js'
import '../css/IlanVer.css'

export default function IlanDuzenle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [form, setForm] = useState(null)
  const [fotolar, setFotolar] = useState([])
  const [eskiFotograflar, setEskiFotograflar] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        navigate('/giris')
        return
      }
      const u = data.session.user
      setUser(u)

      const { data: ilan } = await supabase.from('ilanlar').select('*').eq('id', id).single()
      if (!ilan || ilan.user_id !== u.id) {
        navigate('/ilanlarim')
        return
      }
      setForm({
        baslik: ilan.baslik || '',
        aciklama: ilan.aciklama || '',
        fiyat: ilan.fiyat ?? '',
        metrekare: ilan.metrekare ?? '',
        il: ilan.il || '',
        ilce: ilan.ilce || '',
        imar_durumu: ilan.imar_durumu || 'Konut',
      })
      setEskiFotograflar(ilan.fotograflar || [])
      setFotolar((ilan.fotograflar || []).map((url) => ({ id: url, url })))
      setReady(true)
    })
  }, [id, navigate])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !form) return
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
      const urller = []
      for (const foto of fotolar) {
        if (!foto.file) {
          urller.push(foto.url)
          continue
        }
        const ext = foto.file.name.split('.').pop().toLowerCase()
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`
        const { error: upErr } = await supabase.storage.from(FOTO_BUCKET).upload(path, foto.file)
        if (upErr) throw upErr
        yuklenenYollar.push(path)
        urller.push(supabase.storage.from(FOTO_BUCKET).getPublicUrl(path).data.publicUrl)
      }

      const { error: updErr } = await supabase
        .from('ilanlar')
        .update({
          ...form,
          baslik: form.baslik.trim(),
          aciklama: form.aciklama.trim(),
          il: form.il.trim(),
          ilce: form.ilce.trim(),
          fiyat,
          metrekare,
          fotograflar: urller,
        })
        .eq('id', id)
      if (updErr) throw updErr

      // Kullanıcının kaldırdığı eski fotoğrafları storage'dan temizle.
      const silinecekler = eskiFotograflar.filter((url) => !urller.includes(url))
      if (silinecekler.length > 0) await fotoSil(supabase, silinecekler)

      navigate('/ilanlarim')
    } catch (err) {
      // Güncelleme başarısız olursa yeni yüklenen fotoğrafları temizle.
      if (yuklenenYollar.length > 0) {
        await supabase.storage.from(FOTO_BUCKET).remove(yuklenenYollar)
      }
      setError('İlan güncellenemedi: ' + (err.message || 'Bilinmeyen hata'))
    } finally {
      setSaving(false)
    }
  }

  if (!ready) return null

  return (
    <div className="ilan-page">
      <form className="ilan-card" onSubmit={handleSubmit}>
        <Link to="/"><img src={logo} alt="Banfabal" className="ilan-logo" /></Link>
        <h2>İlanı Düzenle</h2>

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
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
        <Link to="/ilanlarim" className="ilan-cancel">Vazgeç</Link>
      </form>
    </div>
  )
}
