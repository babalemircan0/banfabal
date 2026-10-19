import '../css/Yukleniyor.css'

export default function SayfaYukleniyor() {
  return (
    <div className="sayfa-yukleniyor" role="status" aria-live="polite">
      <span className="sayfa-yukleniyor-spinner" aria-hidden="true" />
      <p>Yükleniyor...</p>
    </div>
  )
}
