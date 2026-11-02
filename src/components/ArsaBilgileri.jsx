import {
  ALTYAPI_SECENEKLERI,
  IMAR_SECENEKLERI,
  TAPU_SECENEKLERI,
} from '../lib/ilanForm.js'
import { ILLER, ilVarMi, ilceleriGetir } from '../lib/iller.js'

export default function ArsaBilgileri({ form, set, ilDegistir, altyapiDegistir }) {
  const ilceler = ilceleriGetir(form.il)

  return (
    <>
      <fieldset className="ilan-section">
        <legend>Konum</legend>
        <div className="ilan-row">
          <label>İl
            <select required value={form.il} onChange={ilDegistir}>
              <option value="">İl seçin</option>
              {form.il && !ilVarMi(form.il) && <option value={form.il}>{form.il}</option>}
              {ILLER.map((il) => (
                <option key={il.ad} value={il.ad}>{il.ad}</option>
              ))}
            </select>
          </label>
          <label>İlçe
            {ilceler.length > 0 ? (
              <select required value={form.ilce} onChange={set('ilce')}>
                <option value="">İlçe seçin</option>
                {form.ilce && !ilceler.includes(form.ilce) && (
                  <option value={form.ilce}>{form.ilce}</option>
                )}
                {ilceler.map((ilce) => (
                  <option key={ilce} value={ilce}>{ilce}</option>
                ))}
              </select>
            ) : (
              <input
                required
                maxLength={50}
                placeholder={form.il ? 'İlçe yazın' : 'Önce il seçin'}
                value={form.ilce}
                onChange={set('ilce')}
                disabled={!form.il}
              />
            )}
          </label>
        </div>
        <label>Mahalle / Köy
          <input maxLength={80} placeholder="Örn. Çayyolu" value={form.mahalle} onChange={set('mahalle')} />
        </label>
      </fieldset>

      <fieldset className="ilan-section">
        <legend>Kadastro bilgileri</legend>
        <p className="ilan-section-hint">Tapu ve kadastro kayıtlarındaki bilgiler.</p>
        <div className="ilan-grid-3">
          <label>Ada
            <input maxLength={20} placeholder="Örn. 1234" value={form.ada} onChange={set('ada')} />
          </label>
          <label>Parsel
            <input maxLength={20} placeholder="Örn. 56" value={form.parsel} onChange={set('parsel')} />
          </label>
          <label>Pafta
            <input maxLength={20} placeholder="Örn. G17C" value={form.pafta} onChange={set('pafta')} />
          </label>
        </div>
      </fieldset>

      <fieldset className="ilan-section">
        <legend>Arsa özellikleri</legend>
        <div className="ilan-row">
          <label>İmar durumu
            <select value={form.imar_durumu} onChange={set('imar_durumu')}>
              {IMAR_SECENEKLERI.map((secenek) => (
                <option key={secenek}>{secenek}</option>
              ))}
            </select>
          </label>
          <label>Tapu durumu
            <select value={form.tapu_durumu} onChange={set('tapu_durumu')}>
              {TAPU_SECENEKLERI.map((secenek) => (
                <option key={secenek}>{secenek}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="ilan-grid-4">
          <label>KAKS (emsal)
            <input type="number" min="0" step="0.01" placeholder="1.50" value={form.kaks} onChange={set('kaks')} />
          </label>
          <label>TAKS
            <input type="number" min="0" step="0.01" placeholder="0.30" value={form.taks} onChange={set('taks')} />
          </label>
          <label>Gabari
            <input type="number" min="0" step="0.01" placeholder="12.50" value={form.gabari} onChange={set('gabari')} />
          </label>
          <label>Yola cephe (m)
            <input type="number" min="0" step="0.01" placeholder="Örn. 20" value={form.yol_cephe} onChange={set('yol_cephe')} />
          </label>
        </div>
      </fieldset>

      <fieldset className="ilan-section">
        <legend>Altyapı</legend>
        <p className="ilan-section-hint">Arsada mevcut olan altyapıları işaretleyin.</p>
        <div className="ilan-ozellik-grid">
          {[...ALTYAPI_SECENEKLERI, ...form.altyapilar.filter((a) => !ALTYAPI_SECENEKLERI.includes(a))]
            .map((secenek) => {
              const secili = form.altyapilar.includes(secenek)
              return (
                <label key={secenek} className={`ilan-ozellik ${secili ? 'secili' : ''}`}>
                  <input
                    type="checkbox"
                    checked={secili}
                    onChange={() => altyapiDegistir(secenek)}
                  />
                  <span className="ilan-ozellik-isaret" aria-hidden="true">
                    <svg viewBox="0 0 12 10">
                      <path
                        d="M1 5.2 4.1 8.3 11 1.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{secenek}</span>
                </label>
              )
            })}
        </div>
      </fieldset>
    </>
  )
}
