import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import '../css/Auth.css'

export default function SignUp() {
  const navigate = useNavigate()
  const [ad, setAd] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!ad.trim()) {
      setError('Ad soyad gerekli.')
      return
    }
    if (password !== password2) {
      setError('Şifreler eşleşmiyor.')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { ad: ad.trim() } },
    })
    setLoading(false)
    if (error) setError(error.message)
    else if (data.session) navigate('/')
    else setInfo('Kayıt oluşturuldu. E-postanı doğrulayıp giriş yapabilirsin.')
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Kayıt Ol</h2>

        <label>Ad Soyad
          <input required autoComplete="name" value={ad} onChange={(e) => setAd(e.target.value)} />
        </label>
        <label>E-posta
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Şifre
          <input type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>Şifre (tekrar)
          <input type="password" required minLength={6} autoComplete="new-password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
        </label>

        {error && <p className="auth-error">{error}</p>}
        {info && <p className="auth-info">{info}</p>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </button>

        <p className="auth-switch">
          Zaten hesabın var mı? <Link to="/giris">Giriş yap</Link>
        </p>

        <p className="auth-legal">
          Kayıt olarak <Link to="/kullanim-sartlari">Kullanım Şartları</Link> ve{' '}
          <Link to="/gizlilik">Gizlilik Politikası</Link>’nı kabul etmiş olursun.
        </p>
      </form>
    </div>
  )
}
