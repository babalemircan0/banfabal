import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Sohbet from '../components/Sohbet.jsx'
import { basHarfler } from '../lib/format.js'
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
          .is('silindi_at', null)

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

  const toplamOkunmamis = Object.values(okunmamis).reduce((toplam, sayi) => toplam + sayi, 0)

  return (
    <div className="mesajlar-page">
      <div className="mesajlar-layout">
        <aside className="mesajlar-list">
          <div className="mesajlar-list-head">
            <h2>Mesajlar</h2>
            {toplamOkunmamis > 0 && <span className="mesajlar-count">{toplamOkunmamis}</span>}
          </div>

          <div className="mesajlar-konusmalar">
            {hata && <p className="mesajlar-empty">{hata}</p>}

            {loading ? (
              <div className="mesajlar-skeleton">
                {[0, 1, 2].map((i) => (
                  <div className="skeleton-row" key={i}>
                    <span className="skeleton-avatar" />
                    <span className="skeleton-lines">
                      <span />
                      <span />
                    </span>
                  </div>
                ))}
              </div>
            ) : konusmalar.length === 0 ? (
              <div className="mesajlar-empty-box">
                <span className="empty-icon" aria-hidden="true">✉</span>
                <strong>Henüz mesajın yok</strong>
                <span>Bir ilana göz atıp satıcıya mesaj gönderebilirsin.</span>
              </div>
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
                    <span className="konusma-avatar" aria-hidden="true">
                      {basHarfler(karsi)}
                    </span>
                    <span className="konusma-info">
                      <span className="konusma-ust">
                        <strong>{karsi || 'Kullanıcı'}</strong>
                        {sayi > 0 && <em className="konusma-badge">{sayi}</em>}
                      </span>
                      <span className="konusma-ilan">{k.ilan_baslik || 'İlan'}</span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <section className="mesajlar-chat">
          {secili ? (
            <Sohbet key={secili.id} konusma={secili} user={user} />
          ) : (
            <div className="sohbet-bos">
              <span className="sohbet-bos-icon" aria-hidden="true">💬</span>
              <strong>Bir konuşma seç</strong>
              <p>Soldaki listeden bir konuşmaya dokunarak mesajlaşmaya başla.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
