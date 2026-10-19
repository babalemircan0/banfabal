import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import logo from '../images/logo.png'
import '../css/Auth.css'

function hataMesaji(mesaj) {
  if (mesaj.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı.'
  if (mesaj.includes('Email not confirmed')) return 'E-posta adresin henüz doğrulanmamış.'
  return 'Giriş yapılamadı. Lütfen tekrar dene.'
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
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
        <Link to="/"><img src={logo} alt="Banfabal" className="auth-logo" /></Link>
        <h2>Giriş Yap</h2>

        <label>E-posta
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Şifre
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>

        <p className="auth-switch">
          Hesabın yok mu? <Link to="/kayit">Kayıt ol</Link>
        </p>
      </form>
    </div>
  )
}
