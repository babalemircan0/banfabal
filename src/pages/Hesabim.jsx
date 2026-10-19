import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import logo from '../images/logo.png'
import '../css/Hesap.css'

export default function Hesabim() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/giris')
      else setUser(data.session.user)
    })
  }, [navigate])

  if (!user) return null

  return (
    <div className="hesap-page">
      <header className="hesap-header">
        <Link to="/"><img src={logo} alt="Banfabal" className="hesap-logo" /></Link>
        <Link to="/" className="hesap-back">← Ana sayfa</Link>
      </header>

      <div className="hesap-card">
        <h2>Hesabım</h2>
        <ul className="hesap-list">
          <li><span>Ad Soyad</span>{user.user_metadata?.ad || '-'}</li>
          <li><span>E-posta</span>{user.email}</li>
          <li><span>Üyelik tarihi</span>{new Date(user.created_at).toLocaleDateString('tr-TR')}</li>
        </ul>
        <Link to="/ilanlarim" className="hesap-btn">İlanlarım</Link>
      </div>
    </div>
  )
}
