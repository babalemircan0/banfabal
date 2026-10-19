import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import logo from '../images/logo.png'
import '../css/Hesap.css'

const BUCKET = 'ilan-fotograflari'

export default function Ilanlarim() {
  const navigate = useNavigate()
  const [ilanlar, setIlanlar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        navigate('/giris')
        return
      }
      const { data: rows } = await supabase
        .from('ilanlar')
        .select('*')
        .eq('user_id', data.session.user.id)
        .order('created_at', { ascending: false })
      setIlanlar(rows || [])
      setLoading(false)
    })
  }, [navigate])

  const handleDelete = async (ilan) => {
    if (!window.confirm('Bu ilanı silmek istediğine emin misin?')) return
    setError('')

    const paths = (ilan.fotograflar || []).map((url) => url.split(`/${BUCKET}/`)[1])
    if (paths.length > 0) await supabase.storage.from(BUCKET).remove(paths)

    const { error } = await supabase.from('ilanlar').delete().eq('id', ilan.id)
    if (error) setError('İlan silinemedi.')
    else setIlanlar(ilanlar.filter((i) => i.id !== ilan.id))
  }

  return (
    <div className="hesap-page">
      <header className="hesap-header">
        <Link to="/"><img src={logo} alt="Banfabal" className="hesap-logo" /></Link>
        <Link to="/" className="hesap-back">← Ana sayfa</Link>
      </header>

      <div className="hesap-wide">
        <div className="hesap-title">
          <h2>İlanlarım</h2>
          <Link to="/ilan-ver" className="hesap-btn">+ İlan Ver</Link>
        </div>

        {error && <p className="hesap-error">{error}</p>}

        {loading ? (
          <p className="hesap-empty">Yükleniyor...</p>
        ) : ilanlar.length === 0 ? (
          <p className="hesap-empty">Henüz ilanın yok.</p>
        ) : (
          <ul className="ilanlarim-list">
            {ilanlar.map((i) => (
              <li key={i.id} className="ilanlarim-item">
                {i.fotograflar?.[0] ? (
                  <img src={i.fotograflar[0]} alt={i.baslik} />
                ) : (
                  <div className="ilanlarim-noimg">Fotoğraf yok</div>
                )}
                <div className="ilanlarim-info">
                  <Link to={`/ilan/${i.id}`}>{i.baslik}</Link>
                  <p>{i.il} / {i.ilce} · {i.metrekare} m²</p>
                  <p className="ilanlarim-price">{Number(i.fiyat).toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="ilanlarim-actions">
                  <Link to={`/ilan-duzenle/${i.id}`} className="hesap-edit">Düzenle</Link>
                  <button type="button" className="hesap-delete" onClick={() => handleDelete(i)}>
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
