import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import '../css/Auth.css'

export default function SifreYenile() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hazir, setHazir] = useState(false)
  const [oturumVar, setOturumVar] = useState(false)

  useEffect(() => {
    let aktif = true

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!aktif) return
      if (event === 'PASSWORD_RECOVERY' || session) setOturumVar(true)
      setHazir(true)
    })

    supabase.auth.getSession().then(({ data }) => {
      if (!aktif) return
      if (data.session) setOturumVar(true)
      setHazir(true)
    })

    return () => {
      aktif = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.')
      return
    }
    if (password !== password2) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError('Şifre güncellenemedi. Bağlantının süresi dolmuş olabilir; yeni bir bağlantı isteyebilirsin.')
      return
    }

    await supabase.auth.signOut()
    navigate('/giris', {
      replace: true,
      state: { mesaj: 'Şifren başarıyla güncellendi. Yeni şifrenle giriş yapabilirsin.' },
    })
  }

  if (!hazir) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-switch">Bağlantı kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  if (!oturumVar) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Bağlantı Geçersiz</h2>
          <p className="auth-lead">
            Şifre sıfırlama bağlantısının süresi dolmuş veya daha önce kullanılmış olabilir.
          </p>
          <Link to="/sifre-sifirla" className="auth-submit">Yeni Bağlantı İste</Link>
          <p className="auth-switch">
            <Link to="/giris">← Giriş sayfasına dön</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Yeni Şifre Belirle</h2>

        <p className="auth-lead">
          Hesabın için yeni bir şifre oluştur. Güvenli bir şifre seçmeyi unutma.
        </p>

        <label>Yeni şifre
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label>Yeni şifre (tekrar)
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
        </button>

        <p className="auth-switch">
          <Link to="/giris">← Giriş sayfasına dön</Link>
        </p>
      </form>
    </div>
  )
}
