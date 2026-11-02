import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import logo from '../images/logo.png'
import '../css/Navbar.css'

const SAYFA_BASLIKLARI = {
  '/': 'Arsa Pazaryeri',
  '/giris': 'Giriş Yap',
  '/kayit': 'Kayıt Ol',
  '/sifre-sifirla': 'Şifremi Unuttum',
  '/sifre-yenile': 'Yeni Şifre',
  '/ilan-ver': 'İlan Ver',
  '/hesabim': 'Hesabım',
  '/ilanlarim': 'İlanlarım',
  '/mesajlar': 'Mesajlar',
  '/kvkk': 'KVKK Aydınlatma Metni',
  '/gizlilik': 'Gizlilik Politikası',
  '/kullanim-sartlari': 'Kullanım Şartları',
  '/cerez-politikasi': 'Çerez Politikası',
}

function sayfaBasligi(yol) {
  if (SAYFA_BASLIKLARI[yol]) return SAYFA_BASLIKLARI[yol]
  if (yol.startsWith('/ilan-duzenle/')) return 'İlanı Düzenle'
  if (yol.startsWith('/ilan/')) return 'İlan Detayı'
  return 'Sayfa Bulunamadı'
}

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [okunmamis, setOkunmamis] = useState(0)
  const [menuAcik, setMenuAcik] = useState(false)
  const menuRef = useRef(null)

  const baslik = sayfaBasligi(pathname)
  const hesapBolumu = ['/hesabim', '/ilanlarim', '/mesajlar'].some((yol) =>
    pathname.startsWith(yol)
  )

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setMenuAcik(false)

      // Şifre sıfırlama bağlantısı ana sayfaya düşse bile kullanıcıyı doğru ekrana yönlendir.
      if (event === 'PASSWORD_RECOVERY') navigate('/sifre-yenile', { replace: true })
    })

    return () => listener.subscription.unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (!user) {
      setOkunmamis(0)
      return
    }

    let aktif = true

    const say = async () => {
      const { data: konusmalar } = await supabase
        .from('konusmalar')
        .select('id')
        .or(`alici_id.eq.${user.id},satici_id.eq.${user.id}`)

      if (!aktif) return

      const konusmaIdleri = (konusmalar || []).map((k) => k.id)
      if (konusmaIdleri.length === 0) {
        setOkunmamis(0)
        return
      }

      const { count } = await supabase
        .from('mesajlar')
        .select('id', { count: 'exact', head: true })
        .in('konusma_id', konusmaIdleri)
        .eq('okundu', false)
        .neq('gonderen_id', user.id)
        .is('silindi_at', null)

      if (aktif) setOkunmamis(count || 0)
    }

    say()

    const kanal = supabase
      .channel('navbar-bildirim')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mesajlar' }, say)
      .subscribe()

    return () => {
      aktif = false
      supabase.removeChannel(kanal)
    }
  }, [user])

  useEffect(() => {
    setMenuAcik(false)
  }, [pathname])

  useEffect(() => {
    if (!menuAcik) return

    const disariTikla = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAcik(false)
    }
    const escBas = (e) => {
      if (e.key === 'Escape') setMenuAcik(false)
    }

    document.addEventListener('mousedown', disariTikla)
    document.addEventListener('keydown', escBas)
    return () => {
      document.removeEventListener('mousedown', disariTikla)
      document.removeEventListener('keydown', escBas)
    }
  }, [menuAcik])

  const cikisYap = async () => {
    setMenuAcik(false)
    await supabase.auth.signOut()
    navigate('/')
  }

  const kullaniciAdi = user?.user_metadata?.ad || user?.email

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo" aria-label="Banfabal ana sayfa">
          <img src={logo} alt="Banfabal" />
        </Link>
        <span className="navbar-divider" aria-hidden="true" />
        <span className="navbar-page">{baslik}</span>
        {user && (
          <span className="navbar-welcome">
            Hoş geldin, {kullaniciAdi}
          </span>
        )}
      </div>

      <nav className="navbar-links" aria-label="Ana menü">
        {user ? (
          <>
            <NavLink
              to="/ilan-ver"
              className={({ isActive }) => `nav-btn nav-btn-primary${isActive ? ' aktif' : ''}`}
            >
              İlan Ver
            </NavLink>

            <div className="nav-menu" ref={menuRef}>
              <button
                type="button"
                className={`nav-btn nav-btn-menu${hesapBolumu ? ' aktif' : ''}${menuAcik ? ' acik' : ''}`}
                onClick={() => setMenuAcik((acik) => !acik)}
                aria-expanded={menuAcik}
                aria-haspopup="menu"
              >
                Hesabım
                <svg
                  className="nav-chevron"
                  viewBox="0 0 12 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 1.5 6 6.5 11 1.5" />
                </svg>
                {okunmamis > 0 && <span className="nav-badge">{okunmamis}</span>}
              </button>

              {menuAcik && (
                <div className="nav-dropdown" role="menu">
                  <NavLink
                    to="/hesabim"
                    role="menuitem"
                    onClick={() => setMenuAcik(false)}
                    className={({ isActive }) => (isActive ? 'aktif' : '')}
                  >
                    Hesabım
                  </NavLink>
                  <NavLink
                    to="/ilanlarim"
                    role="menuitem"
                    onClick={() => setMenuAcik(false)}
                    className={({ isActive }) => (isActive ? 'aktif' : '')}
                  >
                    İlanlarım
                  </NavLink>
                  <NavLink
                    to="/mesajlar"
                    role="menuitem"
                    onClick={() => setMenuAcik(false)}
                    className={({ isActive }) => (isActive ? 'aktif' : '')}
                  >
                    Mesajlar
                    {okunmamis > 0 && <span className="nav-badge">{okunmamis}</span>}
                  </NavLink>
                  <span className="nav-dropdown-ayrac" aria-hidden="true" />
                  <button type="button" className="nav-dropdown-cikis" onClick={cikisYap} role="menuitem">
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>

            <button type="button" className="nav-btn nav-btn-ghost" onClick={cikisYap}>
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/giris"
              className={({ isActive }) => `nav-btn${isActive ? ' aktif' : ''}`}
            >
              Giriş Yap
            </NavLink>
            <NavLink
              to="/kayit"
              className={({ isActive }) => `nav-btn nav-btn-primary${isActive ? ' aktif' : ''}`}
            >
              Kayıt Ol
            </NavLink>
          </>
        )}
      </nav>
    </header>
  )
}
