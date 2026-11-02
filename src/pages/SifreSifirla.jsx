import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import '../css/Auth.css'

export default function SifreSifirla() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/sifre-yenile`,
    })

    setLoading(false)
    if (error) {
      setError('Sıfırlama e-postası gönderilemedi. Lütfen e-posta adresini kontrol edip tekrar dene.')
      return
    }

    setInfo('E-posta adresine şifre sıfırlama bağlantısı gönderdik. Gelen kutunu ve spam klasörünü kontrol et.')
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Şifremi Unuttum</h2>

        <p className="auth-lead">
          Hesabına bağlı e-posta adresini gir; şifreni yenilemen için bir bağlantı gönderelim.
        </p>

        <label>E-posta
          <input
            type="email"
            required
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {error && <p className="auth-error">{error}</p>}
        {info && <p className="auth-info">{info}</p>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
        </button>

        <p className="auth-switch">
          <Link to="/giris">← Giriş sayfasına dön</Link>
        </p>
      </form>
    </div>
  )
}
