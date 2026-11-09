import { useEffect, useState } from 'react'
import { hentikanMusik, mulaiMusik, musikNyala, simpanPilihanMusik } from './musik.js'

// Tombol 🎵 di pojok layar untuk menyalakan/mematikan musik latar.
// Tidak dipasang saat tes (App), sehingga musik otomatis berhenti selama tes.
export default function TombolMusik() {
  const [nyala, setNyala] = useState(musikNyala)

  useEffect(() => {
    if (!nyala) {
      hentikanMusik()
      return undefined
    }
    // browser hanya mengizinkan suara setelah ada sentuhan/klik: coba langsung,
    // lalu coba lagi pada sentuhan pertama bila masih diblokir
    mulaiMusik()
    const sentuh = () => mulaiMusik()
    const terlihat = () => (document.hidden ? hentikanMusik() : mulaiMusik())
    window.addEventListener('pointerdown', sentuh, { once: true })
    window.addEventListener('keydown', sentuh, { once: true })
    document.addEventListener('visibilitychange', terlihat)
    return () => {
      window.removeEventListener('pointerdown', sentuh)
      window.removeEventListener('keydown', sentuh)
      document.removeEventListener('visibilitychange', terlihat)
      hentikanMusik()
    }
  }, [nyala])

  return (
    <button
      type="button"
      className={`tombol-musik ${nyala ? 'nyala' : ''}`}
      aria-pressed={nyala}
      aria-label={nyala ? 'Matikan musik latar' : 'Nyalakan musik latar'}
      title={nyala ? 'Matikan musik' : 'Nyalakan musik'}
      onClick={() => {
        simpanPilihanMusik(!nyala)
        setNyala(!nyala)
      }}
    >
      <span className="tm-ikon" aria-hidden="true">
        {nyala ? '🎵' : '🔇'}
      </span>
      <span className="tm-teks">{nyala ? 'Musik: nyala' : 'Musik: mati'}</span>
      {nyala && (
        <span className="tm-not" aria-hidden="true">
          <i>♪</i>
          <i>♫</i>
          <i>♪</i>
        </span>
      )}
    </button>
  )
}
