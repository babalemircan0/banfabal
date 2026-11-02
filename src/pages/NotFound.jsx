import { Link } from 'react-router-dom'
import '../css/Auth.css'

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sayfa bulunamadı</h2>
        <p className="auth-switch">Aradığın sayfa taşınmış veya hiç var olmamış olabilir.</p>
        <Link to="/" className="auth-submit">Ana sayfaya dön</Link>
      </div>
    </div>
  )
}
