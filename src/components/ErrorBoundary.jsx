import { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logo.png'
import '../css/Auth.css'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hata: null }
  }

  static getDerivedStateFromError(hata) {
    return { hata }
  }

  componentDidCatch(hata, bilgi) {
    console.error('Beklenmeyen uygulama hatası:', hata, bilgi)
  }

  render() {
    if (this.state.hata) {
      return (
        <div className="auth-page">
          <div className="auth-card">
            <img src={logo} alt="Banfabal" className="auth-logo" />
            <h2>Bir şeyler ters gitti</h2>
            <p className="auth-switch">
              Sayfayı yenilemeyi deneyebilir veya ana sayfaya dönebilirsin.
            </p>
            <button
              type="button"
              className="auth-submit"
              onClick={() => window.location.reload()}
            >
              Sayfayı yenile
            </button>
            <Link
              to="/"
              className="auth-submit"
              onClick={() => this.setState({ hata: null })}
            >
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
