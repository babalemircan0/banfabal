import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import ArsaBilgileri from '../components/ArsaBilgileri.jsx'
import FotoSecici from '../components/FotoSecici.jsx'
import { fiyatFormatla } from '../lib/format.js'
import {
  BOS_ILAN_FORM,
  altyapiSecimiDegistir,
  arsaDetaylari,
  sayisalAlanlarGecerliMi,
} from '../lib/ilanForm.js'
import { FOTO_BUCKET } from '../lib/storage.js'
import '../css/IlanVer.css'

export default function IlanVer() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [form, setForm] = useState(BOS_ILAN_FORM)
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

  const set = (k) => (e) => {
    const deger = e.target.value
    setForm((onceki) => ({ ...onceki, [k]: deger }))
  }

  const altyapiDegistir = (secenek) => {
    setForm((onceki) => ({
      ...onceki,
      altyapilar: altyapiSecimiDegistir(onceki.altyapilar, secenek),
    }))
  }

  const ilDegistir = (e) => {
    const il = e.target.value
    setForm((onceki) => ({ ...onceki, il, ilce: '' }))
  }

  const fiyatSayi = Number(form.fiyat)
  const metrekareSayi = Number(form.metrekare)
  const birimFiyat = fiyatSayi > 0 && metrekareSayi > 0 ? fiyatSayi / metrekareSayi : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError('')

    if (!Number.isFinite(fiyatSayi) || fiyatSayi < 0 || !Number.isFinite(metrekareSayi) || metrekareSayi < 0) {
      setError('Fiyat ve metrekare geçerli bir sayı olmalı.')
      setSaving(false)
      return
    }
    if (!sayisalAlanlarGecerliMi(form)) {
      setError('KAKS, TAKS, gabari ve yola cephe 0 veya daha büyük sayı olmalı.')
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
        ...arsaDetaylari(form),
        baslik: form.baslik.trim(),
        aciklama: form.aciklama.trim(),
        il: form.il.trim(),
        ilce: form.ilce.trim(),
        imar_durumu: form.imar_durumu,
        fiyat: fiyatSayi,
        metrekare: metrekareSayi,
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
        <div className="ilan-heading">
          <h2>İlan Ver</h2>
          <p>Arsanızı ücretsiz yayınlayın; alıcılar doğrudan sizinle iletişime geçsin.</p>
        </div>

        <fieldset className="ilan-section">
          <legend>İlan bilgileri</legend>
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

          {birimFiyat !== null && (
            <p className="ilan-hint">
              m² birim fiyatı: <strong>{fiyatFormatla(Math.round(birimFiyat))}</strong>
            </p>
          )}
        </fieldset>

        <ArsaBilgileri form={form} set={set} ilDegistir={ilDegistir} altyapiDegistir={altyapiDegistir} />

        <FotoSecici items={fotolar} setItems={setFotolar} />

        {error && <p className="ilan-error">{error}</p>}

        <button type="submit" className="ilan-submit" disabled={saving}>
          {saving ? 'Yayınlanıyor...' : 'İlanı Yayınla'}
        </button>
      </form>
    </div>
  )
}
