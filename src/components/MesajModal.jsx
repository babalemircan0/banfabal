import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Sohbet from './Sohbet.jsx'

// İlan üzerinden satıcıyla konuşmayı bulur (yoksa oluşturur) ve pencerede açar
export default function MesajModal({ ilan, user, onClose }) {
  const [konusma, setKonusma] = useState(null)
  const [hata, setHata] = useState('')

  useEffect(() => {
    let aktif = true

    const baslat = async () => {
      const { data: mevcut } = await supabase
        .from('konusmalar')
        .select('*')
        .eq('ilan_id', ilan.id)
        .eq('alici_id', user.id)
        .maybeSingle()

      if (mevcut) {
        if (aktif) setKonusma(mevcut)
        return
      }

      const { data, error } = await supabase
        .from('konusmalar')
        .insert({
          ilan_id: ilan.id,
          ilan_baslik: ilan.baslik,
          alici_id: user.id,
          alici_adi: user.user_metadata?.ad || user.email,
          satici_id: ilan.user_id,
          satici_adi: ilan.satici_adi,
        })
        .select()
        .single()

      if (!aktif) return
      if (error) setHata('Konuşma başlatılamadı.')
      else setKonusma(data)
    }

    baslat()
    return () => {
      aktif = false
    }
  }, [ilan, user])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>×</button>
        {hata ? (
          <p className="sohbet-error">{hata}</p>
        ) : !konusma ? (
          <p className="sohbet-empty">Yükleniyor...</p>
        ) : (
          <Sohbet konusma={konusma} user={user} />
        )}
      </div>
    </div>
  )
}
