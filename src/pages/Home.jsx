import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import logo from '../images/logo.png'
import '../css/Home.css'

const BOS_FILTRE = {
  arama: '',
  il: '',
  imar: '',
  minFiyat: '',
  maxFiyat: '',
  minM2: '',
  maxM2: '',
}

export default function Home() {
  const [user, setUser] = useState(null)
  const [ilanlar, setIlanlar] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState(BOS_FILTRE)
  const [filtreAcik, setFiltreAcik] = useState(false)
  const [menuAcik, setMenuAcik] = useState(false)
  const [okunmamis, setOkunmamis] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setOkunmamis(0)
      return
    }

    const say = async () => {
      const { count } = await supabase
        .from('mesajlar')
        .select('id', { count: 'exact', head: true })
        .eq('okundu', false)
        .neq('gonderen_id', user.id)
      setOkunmamis(count || 0)
    }
    say()

    const kanal = supabase
      .channel('navbar-bildirim')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mesajlar' }, say)
      .subscribe()

    return () => supabase.removeChannel(kanal)
  }, [user])

  useEffect(() => {
    supabase
      .from('ilanlar')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setIlanlar(data || [])
        setLoading(false)
      })
  }, [])

  const handleLogout = () => supabase.auth.signOut()

  const setF = (k) => (e) => setFiltre({ ...filtre, [k]: e.target.value })

  const tr = (s) => (s || '').toLocaleLowerCase('tr-TR')

  const filtreli = ilanlar.filter((i) => {
    if (filtre.arama && !tr(i.baslik).includes(tr(filtre.arama))) return false
    if (filtre.il && !tr(i.il).includes(tr(filtre.il))) return false
    if (filtre.imar && i.imar_durumu !== filtre.imar) return false
    if (filtre.minFiyat && Number(i.fiyat) < Number(filtre.minFiyat)) return false
    if (filtre.maxFiyat && Number(i.fiyat) > Number(filtre.maxFiyat)) return false
    if (filtre.minM2 && Number(i.metrekare) < Number(filtre.minM2)) return false
    if (filtre.maxM2 && Number(i.metrekare) > Number(filtre.maxM2)) return false
    return true
  })

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="Banfabal" />
          </Link>
          {user && (
            <span className="navbar-welcome">
              Hoşgeldin, {user.user_metadata?.ad || user.email}
            </span>
          )}
        </div>

        <nav className="navbar-links">
          {user ? (
            <>
              <Link to="/ilan-ver" className="nav-btn nav-btn-primary">İlan Ver</Link>

              <div className="nav-menu">
                <button
                  type="button"
                  className="nav-btn"
                  onClick={() => setMenuAcik(!menuAcik)}
                >
                  Hesabım ▾
                  {okunmamis > 0 && <span className="nav-badge">{okunmamis}</span>}
                </button>
                {menuAcik && (
                  <div className="nav-dropdown" onClick={() => setMenuAcik(false)}>
                    <Link to="/hesabim">Hesabım</Link>
                    <Link to="/ilanlarim">İlanlarım</Link>
                    <Link to="/mesajlar">
                      Mesajlar
                      {okunmamis > 0 && <span className="nav-badge">{okunmamis}</span>}
                    </Link>
                  </div>
                )}
              </div>

              <button type="button" className="nav-btn" onClick={handleLogout}>
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/giris" className="nav-btn">Giriş Yap</Link>
              <Link to="/kayit" className="nav-btn nav-btn-primary">Kayıt Ol</Link>
            </>
          )}
        </nav>
      </header>

      <main className="listings">
        <div className="filter-bar">
          <button
            type="button"
            className="filter-toggle"
            onClick={() => setFiltreAcik(!filtreAcik)}
          >
            Filtrele {filtreAcik ? '▲' : '▼'}
          </button>
        </div>

        {filtreAcik && (
        <div className="filters">
          <label className="filter-search">Ara
            <input placeholder="Başlıkta ara" value={filtre.arama} onChange={setF('arama')} />
          </label>
          <label>İl
            <input value={filtre.il} onChange={setF('il')} />
          </label>
          <label>İmar Durumu
            <select value={filtre.imar} onChange={setF('imar')}>
              <option value="">Tümü</option>
              <option>Konut</option>
              <option>Ticari</option>
              <option>Tarla</option>
              <option>Bağ / Bahçe</option>
              <option>Sanayi</option>
              <option>Diğer</option>
            </select>
          </label>
          <label>Min Fiyat
            <input type="number" min="0" value={filtre.minFiyat} onChange={setF('minFiyat')} />
          </label>
          <label>Max Fiyat
            <input type="number" min="0" value={filtre.maxFiyat} onChange={setF('maxFiyat')} />
          </label>
          <label>Min m²
            <input type="number" min="0" value={filtre.minM2} onChange={setF('minM2')} />
          </label>
          <label>Max m²
            <input type="number" min="0" value={filtre.maxM2} onChange={setF('maxM2')} />
          </label>
          <button type="button" className="filter-clear" onClick={() => setFiltre(BOS_FILTRE)}>
            Temizle
          </button>
        </div>
        )}

        {loading ? (
          <p className="listings-empty">Yükleniyor...</p>
        ) : ilanlar.length === 0 ? (
          <p className="listings-empty">İlan yoktur.</p>
        ) : filtreli.length === 0 ? (
          <p className="listings-empty">Filtreye uyan ilan bulunamadı.</p>
        ) : (
          <div className="listings-grid">
            {filtreli.map((i) => (
              <Link to={`/ilan/${i.id}`} className="listing-card" key={i.id}>
                {i.fotograflar?.[0] ? (
                  <img src={i.fotograflar[0]} alt={i.baslik} />
                ) : (
                  <div className="listing-noimg">Fotoğraf yok</div>
                )}
                <div className="listing-body">
                  <h3>{i.baslik}</h3>
                  <p className="listing-meta">{i.il} / {i.ilce} · {i.metrekare} m²</p>
                  <p className="listing-price">{Number(i.fiyat).toLocaleString('tr-TR')} ₺</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p className="footer-copy">© {new Date().getFullYear()} Banfabal. Tüm hakları saklıdır.</p>
      </footer>
    </>
  )
}
