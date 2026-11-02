import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { basHarfler, gunEtiketi, saatFormatla } from '../lib/format.js'

export default function Sohbet({ konusma, user }) {
  const [mesajlar, setMesajlar] = useState([])
  const [metin, setMetin] = useState('')
  const [gonderiyor, setGonderiyor] = useState(false)
  const [duzenlenen, setDuzenlenen] = useState(null)
  const [duzenleMetin, setDuzenleMetin] = useState('')
  const [islemde, setIslemde] = useState(null)
  const [hata, setHata] = useState('')
  const alt = useRef(null)
  const oncekiAdet = useRef(0)

  const karsiTaraf = user.id === konusma.alici_id ? konusma.satici_adi : konusma.alici_adi

  const mesajBirlestir = (yeni) =>
    setMesajlar((m) =>
      m.some((x) => x.id === yeni.id)
        ? m.map((x) => (x.id === yeni.id ? { ...x, ...yeni } : x))
        : [...m, yeni]
    )

  useEffect(() => {
    let aktif = true

    const okunduYap = () =>
      supabase
        .from('mesajlar')
        .update({ okundu: true })
        .eq('konusma_id', konusma.id)
        .neq('gonderen_id', user.id)
        .eq('okundu', false)
        .is('silindi_at', null)
        .then(({ error }) => {
          if (error) console.error('Okundu işaretlenemedi:', error.message)
        })

    supabase
      .from('mesajlar')
      .select('*')
      .eq('konusma_id', konusma.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (!aktif) return
        setMesajlar(data || [])
        okunduYap()
      })

    const kanal = supabase
      .channel('sohbet-' + konusma.id)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mesajlar',
          filter: `konusma_id=eq.${konusma.id}`,
        },
        (payload) => {
          mesajBirlestir(payload.new)
          if (payload.new.gonderen_id !== user.id) okunduYap()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mesajlar',
          filter: `konusma_id=eq.${konusma.id}`,
        },
        (payload) => {
          mesajBirlestir(payload.new)
        }
      )
      .subscribe()

    return () => {
      aktif = false
      supabase.removeChannel(kanal)
    }
  }, [konusma.id, user.id])

  useEffect(() => {
    if (mesajlar.length > oncekiAdet.current) {
      alt.current?.scrollIntoView({ behavior: 'smooth' })
    }
    oncekiAdet.current = mesajlar.length
  }, [mesajlar])

  const gonder = async (e) => {
    e.preventDefault()
    if (!metin.trim()) return
    setGonderiyor(true)
    setHata('')
    const { data, error } = await supabase
      .from('mesajlar')
      .insert({ konusma_id: konusma.id, gonderen_id: user.id, metin: metin.trim() })
      .select()
      .single()
    setGonderiyor(false)
    if (error) setHata('Mesaj gönderilemedi.')
    else {
      mesajBirlestir(data)
      setMetin('')
    }
  }

  const duzenlemeyeBasla = (m) => {
    setDuzenlenen(m.id)
    setDuzenleMetin(m.metin)
    setHata('')
  }

  const duzenlemeyiIptal = () => {
    setDuzenlenen(null)
    setDuzenleMetin('')
  }

  const duzenlemeyiKaydet = async (e) => {
    e.preventDefault()
    const yeniMetin = duzenleMetin.trim()
    if (!yeniMetin) {
      setHata('Mesaj boş olamaz.')
      return
    }

    const mevcut = mesajlar.find((m) => m.id === duzenlenen)
    if (mevcut && mevcut.metin === yeniMetin) {
      duzenlemeyiIptal()
      return
    }

    setIslemde(duzenlenen)
    setHata('')
    const { data, error } = await supabase
      .from('mesajlar')
      .update({ metin: yeniMetin, duzenlendi_at: new Date().toISOString() })
      .eq('id', duzenlenen)
      .eq('gonderen_id', user.id)
      .select()
      .single()
    setIslemde(null)

    if (error) {
      setHata('Mesaj düzenlenemedi.')
      return
    }

    mesajBirlestir(data)
    duzenlemeyiIptal()
  }

  const sil = async (m) => {
    if (!window.confirm('Bu mesajı silmek istediğine emin misin?')) return

    setIslemde(m.id)
    setHata('')
    const { data, error } = await supabase
      .from('mesajlar')
      .update({ metin: '', silindi_at: new Date().toISOString() })
      .eq('id', m.id)
      .eq('gonderen_id', user.id)
      .select()
      .single()
    setIslemde(null)

    if (error) {
      setHata('Mesaj silinemedi.')
      return
    }

    mesajBirlestir(data)
    if (duzenlenen === m.id) duzenlemeyiIptal()
  }

  return (
    <div className="sohbet">
      <div className="sohbet-head">
        <span className="sohbet-avatar" aria-hidden="true">{basHarfler(karsiTaraf)}</span>
        <div className="sohbet-head-info">
          <strong>{karsiTaraf || 'Kullanıcı'}</strong>
          <span>
            <Link to={`/ilan/${konusma.ilan_id}`} className="sohbet-ilan-link">
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
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
              {konusma.ilan_baslik || 'İlan'}
            </Link>
          </span>
        </div>
      </div>

      <div className="sohbet-body">
        {mesajlar.length > 0 && <div className="sohbet-spacer" aria-hidden="true" />}

        {mesajlar.length === 0 && (
          <div className="sohbet-empty">
            <span className="sohbet-empty-icon" aria-hidden="true">👋</span>
            <p>Henüz mesaj yok. İlk mesajı sen yaz.</p>
          </div>
        )}

        {mesajlar.map((m, i) => {
          const kendi = m.gonderen_id === user.id
          const duzenleniyor = duzenlenen === m.id
          const onceki = mesajlar[i - 1]
          const yeniGun =
            !onceki ||
            new Date(onceki.created_at).toDateString() !== new Date(m.created_at).toDateString()

          return (
            <Fragment key={m.id}>
              {yeniGun && <div className="sohbet-gun">{gunEtiketi(m.created_at)}</div>}

              <div
                className={[
                  'bubble',
                  kendi ? 'me' : '',
                  m.silindi_at ? 'silindi' : '',
                  duzenleniyor ? 'duzenleniyor' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {duzenleniyor ? (
                  <form className="bubble-edit" onSubmit={duzenlemeyiKaydet}>
                    <input
                      autoFocus
                      value={duzenleMetin}
                      onChange={(e) => setDuzenleMetin(e.target.value)}
                      maxLength={2000}
                      aria-label="Mesajı düzenle"
                    />
                    <div className="bubble-edit-actions">
                      <button type="submit" disabled={islemde === m.id}>
                        Kaydet
                      </button>
                      <button type="button" onClick={duzenlemeyiIptal}>Vazgeç</button>
                    </div>
                  </form>
                ) : (
                  <p>{m.silindi_at ? 'Bu mesaj silindi.' : m.metin}</p>
                )}

                <span className={m.silindi_at ? 'bubble-meta silindi-meta' : 'bubble-meta'}>
                  {saatFormatla(m.created_at)}
                  {!m.silindi_at && m.duzenlendi_at ? (
                    <span className="bubble-etiket"> · düzenlendi</span>
                  ) : null}
                  {kendi && !m.silindi_at ? (
                    <span className={m.okundu ? 'bubble-etiket bubble-durum okundu' : 'bubble-etiket bubble-durum'}>
                      {m.okundu ? ' · ✓✓ Görüldü' : ' · ✓ Gönderildi'}
                    </span>
                  ) : null}
                </span>

                {kendi && !m.silindi_at && !duzenleniyor && (
                  <div className="bubble-actions">
                    <button
                      type="button"
                      onClick={() => duzenlemeyeBasla(m)}
                      disabled={islemde === m.id}
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      className="sil"
                      onClick={() => sil(m)}
                      disabled={islemde === m.id}
                    >
                      Sil
                    </button>
                  </div>
                )}
              </div>
            </Fragment>
          )
        })}
        <div ref={alt} />
      </div>

      {hata && <p className="sohbet-error">{hata}</p>}

      <form className="sohbet-form" onSubmit={gonder}>
        <input
          placeholder="Mesajını yaz..."
          value={metin}
          onChange={(e) => setMetin(e.target.value)}
          aria-label="Mesaj"
        />
        <button type="submit" disabled={gonderiyor}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
          <span>Gönder</span>
        </button>
      </form>
    </div>
  )
}
