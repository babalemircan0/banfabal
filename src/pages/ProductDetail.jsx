import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import logo from '../images/logo.png'
import MesajModal from '../components/MesajModal.jsx'
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
    const { error } = await supabase.from('yorumlar').delete().eq('id', yid)
    if (!error) setYorumlar(yorumlar.filter((y) => y.id !== yid))
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

  return (
    <div className="detail-page">
      <header className="detail-header">
        <Link to="/"><img src={logo} alt="Banfabal" className="detail-logo" /></Link>
        <Link to="/" className="detail-back">← İlanlara dön</Link>
      </header>

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
            <p className="detail-price">{Number(ilan.fiyat).toLocaleString('tr-TR')} ₺</p>
            <ul className="detail-list">
              <li><span>İlan Sahibi</span>{ilan.satici_adi || 'Belirtilmemiş'}</li>
              <li><span>Konum</span>{ilan.il} / {ilan.ilce}</li>
              <li><span>Metrekare</span>{ilan.metrekare} m²</li>
              <li><span>İmar Durumu</span>{ilan.imar_durumu}</li>
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

            {ilan.aciklama && (
              <>
                <h2>Açıklama</h2>
                <p className="detail-desc">{ilan.aciklama}</p>
              </>
            )}
          </div>
        </div>
      )}

      {mesajAcik && user && ilan && (
        <MesajModal ilan={ilan} user={user} onClose={() => setMesajAcik(false)} />
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
                    <span>{new Date(y.created_at).toLocaleDateString('tr-TR')}</span>
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
