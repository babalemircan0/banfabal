import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Sohbet from '../components/Sohbet.jsx'
import logo from '../images/logo.png'
import '../css/Mesajlar.css'

export default function Mesajlar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [konusmalar, setKonusmalar] = useState([])
  const [okunmamis, setOkunmamis] = useState({})
  const [secili, setSecili] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hata, setHata] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/giris')
      else setUser(data.session.user)
    })
  }, [navigate])

  useEffect(() => {
    if (!user) return

    const yukle = async () => {
      setHata('')
      const { data: k, error: konusmaHatasi } = await supabase
        .from('konusmalar')
        .select('*')
        .or(`alici_id.eq.${user.id},satici_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (konusmaHatasi) setHata('Konuşmalar yüklenemedi.')

      const liste = k || []
      setKonusmalar(liste)

      const sayilar = {}
      const konusmaIdleri = liste.map((x) => x.id)
      if (konusmaIdleri.length > 0) {
        const { data: m } = await supabase
          .from('mesajlar')
          .select('konusma_id')
          .in('konusma_id', konusmaIdleri)
          .eq('okundu', false)
          .neq('gonderen_id', user.id)

        ;(m || []).forEach((x) => {
          sayilar[x.konusma_id] = (sayilar[x.konusma_id] || 0) + 1
        })
      }

      setOkunmamis(sayilar)
      setLoading(false)
    }
    yukle()

    const kanal = supabase
      .channel('mesajlar-liste')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mesajlar' }, yukle)
      .subscribe()

    return () => supabase.removeChannel(kanal)
  }, [user])

  const sec = (k) => {
    setSecili(k)
    setOkunmamis((o) => ({ ...o, [k.id]: 0 }))
  }

  if (!user) return null

  return (
    <div className="mesajlar-page">
      <header className="mesajlar-header">
        <Link to="/"><img src={logo} alt="Banfabal" className="mesajlar-logo" /></Link>
        <Link to="/" className="mesajlar-back">← Ana sayfa</Link>
      </header>

      <div className="mesajlar-layout">
        <aside className="mesajlar-list">
          <h2>Mesajlar</h2>
          {hata && <p className="mesajlar-empty">{hata}</p>}
          {loading ? (
            <p className="mesajlar-empty">Yükleniyor...</p>
          ) : konusmalar.length === 0 ? (
            <p className="mesajlar-empty">Henüz mesajın yok.</p>
          ) : (
            konusmalar.map((k) => {
              const karsi = user.id === k.alici_id ? k.satici_adi : k.alici_adi
              const sayi = okunmamis[k.id] || 0
              return (
                <button
                  type="button"
                  key={k.id}
                  className={secili?.id === k.id ? 'konusma active' : 'konusma'}
                  onClick={() => sec(k)}
                >
                  <div>
                    <strong>{karsi || 'Kullanıcı'}</strong>
                    <span>{k.ilan_baslik}</span>
                  </div>
                  {sayi > 0 && <em className="nav-badge">{sayi}</em>}
                </button>
              )
            })
          )}
        </aside>

        <section className="mesajlar-chat">
          {secili ? (
            <Sohbet key={secili.id} konusma={secili} user={user} />
          ) : (
            <p className="mesajlar-empty">Bir konuşma seç.</p>
          )}
        </section>
      </div>
    </div>
  )
}
