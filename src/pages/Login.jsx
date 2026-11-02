import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import '../css/Auth.css'

function hataMesaji(mesaj) {
  if (mesaj.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı.'
  if (mesaj.includes('Email not confirmed')) return 'E-posta adresin henüz doğrulanmamış.'
  return 'Giriş yapılamadı. Lütfen tekrar dene.'
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info] = useState(location.state?.mesaj || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (error) setError(hataMesaji(error.message))
    else navigate('/')
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Giriş Yap</h2>

        <label>E-posta
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Şifre
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <div className="auth-forgot-row">
          <Link to="/sifre-sifirla" className="auth-forgot">Şifremi unuttum</Link>
        </div>

        {error && <p className="auth-error">{error}</p>}
        {info && <p className="auth-info">{info}</p>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>

        <p className="auth-switch">
          Hesabın yok mu? <Link to="/kayit">Kayıt ol</Link>
        </p>

        <p className="auth-legal">
          Devam ederek <Link to="/kullanim-sartlari">Kullanım Şartları</Link> ve{' '}
          <Link to="/gizlilik">Gizlilik Politikası</Link>’nı kabul etmiş olursun.
        </p>
      </form>
    </div>
  )
}
