import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { saatFormatla } from '../lib/format.js'

export default function Sohbet({ konusma, user }) {
  const [mesajlar, setMesajlar] = useState([])
  const [metin, setMetin] = useState('')
  const [gonderiyor, setGonderiyor] = useState(false)
  const [hata, setHata] = useState('')
  const alt = useRef(null)

  const karsiTaraf = user.id === konusma.alici_id ? konusma.satici_adi : konusma.alici_adi

  useEffect(() => {
    let aktif = true

    const okunduYap = () =>
      supabase
        .from('mesajlar')
        .update({ okundu: true })
        .eq('konusma_id', konusma.id)
        .neq('gonderen_id', user.id)
        .eq('okundu', false)
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
          setMesajlar((m) => (m.some((x) => x.id === payload.new.id) ? m : [...m, payload.new]))
          if (payload.new.gonderen_id !== user.id) okunduYap()
        }
      )
      .subscribe()

    return () => {
      aktif = false
      supabase.removeChannel(kanal)
    }
  }, [konusma.id, user.id])

  useEffect(() => {
    alt.current?.scrollIntoView({ behavior: 'smooth' })
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
      setMesajlar((m) => (m.some((x) => x.id === data.id) ? m : [...m, data]))
      setMetin('')
    }
  }

  return (
    <div className="sohbet">
      <div className="sohbet-head">
        <strong>{karsiTaraf || 'Kullanıcı'}</strong>
        <span>
          İlan:{' '}
          <Link to={`/ilan/${konusma.ilan_id}`}>{konusma.ilan_baslik || 'İlan'}</Link>
        </span>
      </div>

      <div className="sohbet-body">
        {mesajlar.length === 0 && <p className="sohbet-empty">Henüz mesaj yok. İlk mesajı sen yaz.</p>}
        {mesajlar.map((m) => (
          <div key={m.id} className={m.gonderen_id === user.id ? 'bubble me' : 'bubble'}>
            <p>{m.metin}</p>
            <span>{saatFormatla(m.created_at)}</span>
          </div>
        ))}
        <div ref={alt} />
      </div>

      {hata && <p className="sohbet-error">{hata}</p>}

      <form className="sohbet-form" onSubmit={gonder}>
        <input
          placeholder="Mesajını yaz..."
          value={metin}
          onChange={(e) => setMetin(e.target.value)}
        />
        <button type="submit" disabled={gonderiyor}>Gönder</button>
      </form>
    </div>
  )
}
