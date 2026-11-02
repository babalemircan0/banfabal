import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { fotoSil } from '../lib/storage.js'
import { fiyatFormatla } from '../lib/format.js'
import '../css/Hesap.css'

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
      const { data: rows, error: fetchError } = await supabase
        .from('ilanlar')
        .select('*')
        .eq('user_id', data.session.user.id)
        .order('created_at', { ascending: false })
      if (fetchError) setError('İlanlar yüklenemedi.')
      setIlanlar(rows || [])
      setLoading(false)
    })
  }, [navigate])

  const handleDelete = async (ilan) => {
    if (!window.confirm('Bu ilanı silmek istediğine emin misin?')) return
    setError('')

    const { error } = await supabase.from('ilanlar').delete().eq('id', ilan.id)
    if (error) {
      setError('İlan silinemedi.')
      return
    }

    setIlanlar(ilanlar.filter((i) => i.id !== ilan.id))

    // İlan kaydı silindikten sonra fotoğrafları temizle.
    const fotoHatasi = await fotoSil(supabase, ilan.fotograflar)
    if (fotoHatasi) console.error('Fotoğraflar silinemedi:', fotoHatasi.message)
  }

  return (
    <div className="hesap-page">
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
                  <p className="ilanlarim-price">{fiyatFormatla(i.fiyat)}</p>
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
