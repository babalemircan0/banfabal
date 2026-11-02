import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { basHarfler, fiyatFormatla, sayiFormatla, tarihFormatla } from '../lib/format.js'
import { ILLER, ilceleriGetir } from '../lib/iller.js'
import '../css/Home.css'

const BOS_FILTRE = {
  arama: '',
  il: '',
  ilce: '',
  imar: '',
  minFiyat: '',
  maxFiyat: '',
  minM2: '',
  maxM2: '',
}

const IMAR_SECENEKLERI = ['Konut', 'Ticari', 'Tarla', 'Bağ / Bahçe', 'Sanayi', 'Diğer']

const SIRALAMALAR = [
  { deger: 'yeni', etiket: 'En yeni' },
  { deger: 'fiyatArtan', etiket: 'Fiyat: artan' },
  { deger: 'fiyatAzalan', etiket: 'Fiyat: azalan' },
  { deger: 'alanArtan', etiket: 'Alan: küçükten büyüğe' },
  { deger: 'alanAzalan', etiket: 'Alan: büyükten küçüğe' },
]

const CHIP_ETIKETLERI = {
  arama: (deger) => `"${deger}"`,
  il: (deger) => `İl: ${deger}`,
  ilce: (deger) => `İlçe: ${deger}`,
  imar: (deger) => `İmar: ${deger}`,
  minFiyat: (deger) => `Min ${fiyatFormatla(deger)}`,
  maxFiyat: (deger) => `Max ${fiyatFormatla(deger)}`,
  minM2: (deger) => `Min ${sayiFormatla(deger)} m²`,
  maxM2: (deger) => `Max ${sayiFormatla(deger)} m²`,
}

const YIL = new Date().getFullYear()

const sayi = (deger) => {
  const n = Number(deger)
  return Number.isFinite(n) ? n : 0
}

export default function Home() {
  const [ilanlar, setIlanlar] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState(BOS_FILTRE)
  const [filtreAcik, setFiltreAcik] = useState(false)
  const [siralama, setSiralama] = useState('yeni')
  const [hata, setHata] = useState('')

  useEffect(() => {
    supabase
      .from('ilanlar')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setHata('İlanlar yüklenemedi. Lütfen sayfayı yenile.')
        setIlanlar(data || [])
        setLoading(false)
      })
  }, [])

  const setF = (k) => (e) => {
    const deger = e.target.value
    setFiltre((onceki) => ({ ...onceki, [k]: deger }))
  }

  const filtreKaldir = (k) => setFiltre((onceki) => ({
    ...onceki,
    [k]: '',
    ...(k === 'il' ? { ilce: '' } : {}),
  }))

  const ilFiltreDegistir = (e) => {
    const il = e.target.value
    setFiltre((onceki) => ({ ...onceki, il, ilce: '' }))
  }

  const tr = (s) => (s || '').toLocaleLowerCase('tr-TR')

  const filtreli = ilanlar.filter((i) => {
    if (filtre.arama && !tr(i.baslik).includes(tr(filtre.arama))) return false
    if (filtre.il && !tr(i.il).includes(tr(filtre.il))) return false
    if (filtre.ilce && !tr(i.ilce).includes(tr(filtre.ilce))) return false
    if (filtre.imar && i.imar_durumu !== filtre.imar) return false
    if (filtre.minFiyat && Number(i.fiyat) < Number(filtre.minFiyat)) return false
    if (filtre.maxFiyat && Number(i.fiyat) > Number(filtre.maxFiyat)) return false
    if (filtre.minM2 && Number(i.metrekare) < Number(filtre.minM2)) return false
    if (filtre.maxM2 && Number(i.metrekare) > Number(filtre.maxM2)) return false
    return true
  })

  const sonuclar = [...filtreli].sort((a, b) => {
    if (siralama === 'fiyatArtan') return sayi(a.fiyat) - sayi(b.fiyat)
    if (siralama === 'fiyatAzalan') return sayi(b.fiyat) - sayi(a.fiyat)
    if (siralama === 'alanArtan') return sayi(a.metrekare) - sayi(b.metrekare)
    if (siralama === 'alanAzalan') return sayi(b.metrekare) - sayi(a.metrekare)
    return (b.created_at || '').localeCompare(a.created_at || '')
  })

  const seciliFiltreler = Object.entries(filtre).filter(([, deger]) => String(deger).trim() !== '')
  const aktifFiltreSayisi = seciliFiltreler.length

  const ilSayisi = new Set(
    ilanlar.map((i) => tr(i.il).trim()).filter(Boolean),
  ).size

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              Türkiye'nin arsa pazaryeri
            </span>

            <h1 className="hero-title">
              Doğru <span className="hero-accent">arsayı</span>, doğru yerde bulun.
            </h1>

            <p className="hero-lead">
              Konut, ticari, tarla ve bağ-bahçe arsalarını tek yerde keşfedin.
              Aracı yok; doğrudan satıcıyla görüşün.
            </p>

            <div className="hero-actions">
              <a className="hero-btn hero-btn-primary" href="#ilanlar">İlanları Keşfet</a>
              <Link className="hero-btn hero-btn-ghost" to="/ilan-ver">Ücretsiz İlan Ver</Link>
            </div>

            <p className="hero-types">
              Konut <span aria-hidden="true">·</span> Ticari <span aria-hidden="true">·</span> Tarla <span aria-hidden="true">·</span> Bağ / Bahçe <span aria-hidden="true">·</span> Sanayi
            </p>

            <dl className="hero-stats">
              <div>
                <dt>Aktif ilan</dt>
                <dd>{loading ? '—' : sayiFormatla(ilanlar.length)}</dd>
              </div>
              <div>
                <dt>Farklı il</dt>
                <dd>{loading ? '—' : sayiFormatla(ilSayisi)}</dd>
              </div>
              <div>
                <dt>İlan verme</dt>
                <dd className="hero-stat-text">Ücretsiz</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <main className="listings">
        <section className="filter-panel" id="ilanlar" aria-label="İlan filtreleri">
          <div className="filter-top">
            <div className="filter-search">
              <svg className="filter-search-icon" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <line x1="12.8" y1="12.8" x2="17" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Başlıkta ara"
                aria-label="Başlıkta ara"
                value={filtre.arama}
                onChange={setF('arama')}
              />
              {filtre.arama && (
                <button
                  type="button"
                  className="filter-search-clear"
                  onClick={() => filtreKaldir('arama')}
                  aria-label="Aramayı temizle"
                >
                  ×
                </button>
              )}
            </div>

            <button
              type="button"
              className={`filter-toggle ${filtreAcik ? 'acik' : ''}`}
              onClick={() => setFiltreAcik((acik) => !acik)}
              aria-expanded={filtreAcik}
            >
              Filtreler
              {aktifFiltreSayisi > 0 && <span className="filter-count">{aktifFiltreSayisi}</span>}
              <svg className="filter-chevron" viewBox="0 0 12 8" aria-hidden="true">
                <path
                  d="M1 1.5 6 6.5 11 1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {filtreAcik && (
            <div className="filters">
              <div className="filter-group">
                <span className="filter-group-title">Konum</span>
                <label>İl
                  <select value={filtre.il} onChange={ilFiltreDegistir}>
                    <option value="">Tüm iller</option>
                    {ILLER.map((il) => (
                      <option key={il.ad} value={il.ad}>{il.ad}</option>
                    ))}
                  </select>
                </label>
                <label>İlçe
                  <select
                    value={filtre.ilce}
                    onChange={setF('ilce')}
                    disabled={!filtre.il}
                  >
                    <option value="">{filtre.il ? 'Tüm ilçeler' : 'Önce il seçin'}</option>
                    {ilceleriGetir(filtre.il).map((ilce) => (
                      <option key={ilce} value={ilce}>{ilce}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="filter-group">
                <span className="filter-group-title">İmar durumu</span>
                <label>Tür
                  <select value={filtre.imar} onChange={setF('imar')}>
                    <option value="">Tümü</option>
                    {IMAR_SECENEKLERI.map((secenek) => (
                      <option key={secenek}>{secenek}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="filter-group">
                <span className="filter-group-title">Fiyat (₺)</span>
                <div className="filter-range">
                  <label>Min
                    <input type="number" min="0" placeholder="0" value={filtre.minFiyat} onChange={setF('minFiyat')} />
                  </label>
                  <span className="filter-range-sep" aria-hidden="true">–</span>
                  <label>Max
                    <input type="number" min="0" placeholder="Sınırsız" value={filtre.maxFiyat} onChange={setF('maxFiyat')} />
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <span className="filter-group-title">Alan (m²)</span>
                <div className="filter-range">
                  <label>Min
                    <input type="number" min="0" placeholder="0" value={filtre.minM2} onChange={setF('minM2')} />
                  </label>
                  <span className="filter-range-sep" aria-hidden="true">–</span>
                  <label>Max
                    <input type="number" min="0" placeholder="Sınırsız" value={filtre.maxM2} onChange={setF('maxM2')} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {seciliFiltreler.length > 0 && (
            <div className="filter-chips">
              {seciliFiltreler.map(([anahtar, deger]) => (
                <button
                  key={anahtar}
                  type="button"
                  className="filter-chip"
                  onClick={() => filtreKaldir(anahtar)}
                  title="Filtreyi kaldır"
                >
                  {CHIP_ETIKETLERI[anahtar](deger)}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
              <button
                type="button"
                className="filter-chip-clear"
                onClick={() => setFiltre(BOS_FILTRE)}
              >
                Tümünü temizle
              </button>
            </div>
          )}
        </section>

        <div className="listings-head">
          <div>
            <h1 className="listings-title">Satılık arsalar</h1>
            <p className="listings-sub">
              {loading ? 'İlanlar yükleniyor...' : `${filtreli.length} ilan bulundu`}
            </p>
          </div>

          <label className="sort">
            <span>Sırala</span>
            <select value={siralama} onChange={(e) => setSiralama(e.target.value)}>
              {SIRALAMALAR.map((secenek) => (
                <option key={secenek.deger} value={secenek.deger}>{secenek.etiket}</option>
              ))}
            </select>
          </label>
        </div>

        {hata ? (
          <p className="listings-empty">{hata}</p>
        ) : loading ? (
          <p className="listings-empty">Yükleniyor...</p>
        ) : ilanlar.length === 0 ? (
          <p className="listings-empty">İlan yoktur.</p>
        ) : sonuclar.length === 0 ? (
          <div className="listings-empty">
            <p>Filtreye uyan ilan bulunamadı.</p>
            <button type="button" className="empty-btn" onClick={() => setFiltre(BOS_FILTRE)}>
              Filtreleri temizle
            </button>
          </div>
        ) : (
          <div className="listings-grid">
            {sonuclar.map((i) => (
              <Link to={`/ilan/${i.id}`} className="listing-card" key={i.id}>
                <div className="listing-media">
                  {i.fotograflar?.[0] ? (
                    <img src={i.fotograflar[0]} alt={i.baslik} loading="lazy" />
                  ) : (
                    <div className="listing-noimg">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <circle cx="8.5" cy="9.5" r="1.5" />
                        <path d="m3 16 5-4 4 3 3-2 6 5" />
                      </svg>
                      <span>Fotoğraf yok</span>
                    </div>
                  )}
                  {i.imar_durumu && <span className="listing-badge">{i.imar_durumu}</span>}
                </div>

                <div className="listing-body">
                  <div className="listing-top">
                    <h3>{i.baslik}</h3>
                    <p className={i.fiyat != null && i.fiyat !== '' ? 'listing-price' : 'listing-price yok'}>
                      {fiyatFormatla(i.fiyat)}
                    </p>
                  </div>

                  <div className="listing-meta">
                    <span className="listing-meta-item">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      {[i.il, i.ilce].filter(Boolean).join(' / ') || 'Konum belirtilmedi'}
                    </span>

                    <span className="listing-meta-item">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M9 3v18" />
                      </svg>
                      {i.metrekare != null && i.metrekare !== ''
                        ? `${sayiFormatla(i.metrekare)} m²`
                        : 'Alan belirtilmedi'}
                    </span>

                    {i.yol_cephe != null && (
                      <span className="listing-meta-item">
                        Yola cephe: {sayiFormatla(i.yol_cephe)} m
                      </span>
                    )}
                  </div>

                  <p className="listing-desc">
                    {i.aciklama?.trim() || 'Bu ilan için henüz açıklama eklenmemiş.'}
                  </p>

                  <div className="listing-footer">
                    <div className="listing-owner">
                      <span className="listing-avatar" aria-hidden="true">
                        {basHarfler(i.satici_adi)}
                      </span>
                      <span>
                        <strong>{i.satici_adi || 'İlan sahibi'}</strong>
                        <em>{tarihFormatla(i.created_at)}</em>
                      </span>
                    </div>

                    <span className="listing-cta">
                      İlanı gör
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-links">
          <Link to="/kvkk">KVKK Aydınlatma Metni</Link>
          <Link to="/gizlilik">Gizlilik Politikası</Link>
          <Link to="/kullanim-sartlari">Kullanım Şartları</Link>
          <Link to="/cerez-politikasi">Çerez Politikası</Link>
        </div>
        <p className="footer-copy">© {YIL} Banfabal. Tüm hakları saklıdır.</p>
      </footer>
    </>
  )
}
