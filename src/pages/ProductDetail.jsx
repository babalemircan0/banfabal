import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import MesajModal from '../components/MesajModal.jsx'
import { fiyatFormatla, sayiFormatla, tarihFormatla } from '../lib/format.js'
import { ALTYAPI_SECENEKLERI } from '../lib/ilanForm.js'
import '../css/Mesajlar.css'
import '../css/ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const [ilan, setIlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aktif, setAktif] = useState(0)
  const [user, setUser] = useState(null)
  const [yorumlar, setYorumlar] = useState([])
  const [yorum, setYorum] = useState('')
  const [uyari, setUyari] = useState('')
  const [gonderiyor, setGonderiyor] = useState(false)
  const [mesajAcik, setMesajAcik] = useState(false)
  const [mesajUyari, setMesajUyari] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session) setUyari('')
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    supabase
      .from('yorumlar')
      .select('*')
      .eq('ilan_id', id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setYorumlar(data || []))
  }, [id])

  const mesajGonder = () => {
    if (!user) {
      setMesajUyari('Mesaj göndermek için giriş yapmanız gerekiyor.')
      return
    }
    setMesajUyari('')
    setMesajAcik(true)
  }

  const girisGerekli = () => {
    if (!user) setUyari('Yorum yapmak için giriş yapmanız gerekiyor.')
  }

  const yorumGonder = async (e) => {
    e.preventDefault()
    if (!user) {
      girisGerekli()
      return
    }
    if (!yorum.trim()) return
    setGonderiyor(true)
    setUyari('')
    const { data, error } = await supabase
      .from('yorumlar')
      .insert({
        ilan_id: id,
        user_id: user.id,
        yazar_adi: user.user_metadata?.ad || user.email,
        metin: yorum.trim(),
      })
      .select()
      .single()
    setGonderiyor(false)
    if (error) setUyari('Yorum gönderilemedi.')
    else {
      setYorumlar([data, ...yorumlar])
      setYorum('')
    }
  }

  const yorumSil = async (yid) => {
    if (!window.confirm('Bu yorumu silmek istediğine emin misin?')) return
    const { error } = await supabase.from('yorumlar').delete().eq('id', yid)
    if (error) setUyari('Yorum silinemedi.')
    else {
      setUyari('')
      setYorumlar(yorumlar.filter((y) => y.id !== yid))
    }
  }

  useEffect(() => {
    supabase
      .from('ilanlar')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setIlan(data)
        setLoading(false)
      })
  }, [id])

  const adaParsel = [
    ilan?.ada && `Ada ${ilan.ada}`,
    ilan?.parsel && `Parsel ${ilan.parsel}`,
    ilan?.pafta && `Pafta ${ilan.pafta}`,
  ].filter(Boolean).join(' · ')

  const imarDegerleri = [
    ilan?.kaks != null && `KAKS ${sayiFormatla(ilan.kaks)}`,
    ilan?.taks != null && `TAKS ${sayiFormatla(ilan.taks)}`,
    ilan?.gabari != null && `Gabari ${sayiFormatla(ilan.gabari)}`,
  ].filter(Boolean).join(' · ')

  return (
    <div className="detail-page">
      {loading ? (
        <p className="detail-info">Yükleniyor...</p>
      ) : !ilan ? (
        <p className="detail-info">İlan bulunamadı.</p>
      ) : (
        <div className="detail-content">
          <div className="detail-gallery">
            {ilan.fotograflar?.length > 0 ? (
              <>
                <img className="detail-main" src={ilan.fotograflar[aktif]} alt={ilan.baslik} />
                <div className="detail-thumbs">
                  {ilan.fotograflar.map((url, idx) => (
                    <img
                      key={url}
                      src={url}
                      alt=""
                      className={idx === aktif ? 'active' : ''}
                      onClick={() => setAktif(idx)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="detail-noimg">Fotoğraf yok</div>
            )}
          </div>

          <div className="detail-info-box">
            <h1>{ilan.baslik}</h1>
            <p className="detail-price">{fiyatFormatla(ilan.fiyat)}</p>
            <ul className="detail-list">
              <li><span>İlan Sahibi</span>{ilan.satici_adi || <span className="detail-yok">Belirtilmedi</span>}</li>
              <li>
                <span>Konum</span>
                {[ilan.il, ilan.ilce, ilan.mahalle].filter(Boolean).join(' / ') || (
                  <span className="detail-yok">Belirtilmedi</span>
                )}
              </li>
              <li>
                <span>Metrekare</span>
                {ilan.metrekare != null && ilan.metrekare !== ''
                  ? `${sayiFormatla(ilan.metrekare)} m²`
                  : <span className="detail-yok">Belirtilmedi</span>}
              </li>
              <li>
                <span>İmar Durumu</span>
                {ilan.imar_durumu
                  ? <span className="detail-badge">{ilan.imar_durumu}</span>
                  : <span className="detail-yok">Belirtilmedi</span>}
              </li>
              <li>
                <span>Ada / Parsel</span>
                {adaParsel || <span className="detail-yok">Belirtilmedi</span>}
              </li>
              <li>
                <span>Tapu Durumu</span>
                {ilan.tapu_durumu || <span className="detail-yok">Belirtilmedi</span>}
              </li>
              <li>
                <span>İmar Değerleri</span>
                {imarDegerleri || <span className="detail-yok">Belirtilmedi</span>}
              </li>
              <li>
                <span>Yola Cephe</span>
                {ilan.yol_cephe != null
                  ? `${sayiFormatla(ilan.yol_cephe)} m`
                  : <span className="detail-yok">Belirtilmedi</span>}
              </li>
            </ul>

            {user?.id !== ilan.user_id && (
              <>
                <button type="button" className="detail-message-btn" onClick={mesajGonder}>
                  Mesaj Gönder
                </button>
                {mesajUyari && (
                  <p className="comment-warning">
                    {mesajUyari} <Link to="/giris">Giriş yap</Link>
                  </p>
                )}
              </>
            )}

            <h2>Açıklama</h2>
            {ilan.aciklama ? (
              <p className="detail-desc">{ilan.aciklama}</p>
            ) : (
              <p className="detail-desc detail-yok">Belirtilmedi</p>
            )}
          </div>
        </div>
      )}

      {mesajAcik && user && ilan && (
        <MesajModal ilan={ilan} user={user} onClose={() => setMesajAcik(false)} />
      )}

      {!loading && ilan && (
        <section className="detail-features">
          <h2>Özellikler</h2>
          <div className="detail-feature-group">
            <h3>Altyapı</h3>
            {ilan.altyapilar?.length > 0 ? (
              <ul className="detail-feature-grid">
                {[
                  ...ALTYAPI_SECENEKLERI,
                  ...ilan.altyapilar.filter((a) => !ALTYAPI_SECENEKLERI.includes(a)),
                ].map((secenek) => {
                  const varMi = ilan.altyapilar.includes(secenek)
                  return (
                    <li key={secenek} className={varMi ? 'var' : ''}>
                      <span className="detail-feature-check" aria-hidden="true">
                        <svg viewBox="0 0 12 10">
                          <path
                            d="M1 5.2 4.1 8.3 11 1.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {secenek}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="detail-feature-empty">Belirtilmedi</p>
            )}
          </div>
        </section>
      )}

      {!loading && ilan && (
        <section className="comments">
          <h2>Yorumlar ({yorumlar.length})</h2>

          <form className="comment-form" onSubmit={yorumGonder}>
            <textarea
              rows="3"
              placeholder="Yorumunu yaz..."
              value={yorum}
              onChange={(e) => setYorum(e.target.value)}
              onClick={girisGerekli}
              readOnly={!user}
            />
            <button type="submit" disabled={gonderiyor}>
              {gonderiyor ? 'Gönderiliyor...' : 'Yorum Yap'}
            </button>
          </form>

          {uyari && (
            <p className="comment-warning">
              {uyari} {!user && <Link to="/giris">Giriş yap</Link>}
            </p>
          )}

          {yorumlar.length === 0 ? (
            <p className="comment-empty">Henüz yorum yok.</p>
          ) : (
            <ul className="comment-list">
              {yorumlar.map((y) => (
                <li key={y.id}>
                  <div className="comment-head">
                    <strong>{y.yazar_adi}</strong>
                    <span>{tarihFormatla(y.created_at)}</span>
                    {user?.id === y.user_id && (
                      <button type="button" onClick={() => yorumSil(y.id)}>Sil</button>
                    )}
                  </div>
                  <p>{y.metin}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
