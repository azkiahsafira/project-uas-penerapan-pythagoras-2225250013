import { useEffect, useState } from 'react'
import { bacakan, hentikan, suaraIndonesia, suaraTersedia } from './suara.js'

// Tombol "🔊 Bacakan" / "⏹ Berhenti".
// - bagian    : daftar teks yang dibaca berurutan
// - onMulai   : dipanggil setiap kali tombol mulai membacakan (untuk pencatatan)
// - onBagian  : dipanggil dengan nomor bagian yang sedang dibaca (null bila selesai),
//               dipakai untuk menyorot teks yang sedang dibacakan
// Pasang dengan `key` yang berbeda tiap langkah/soal agar bacaan berhenti saat pindah.
export default function TombolBacakan({ bagian, onMulai, onBagian, label = 'Bacakan' }) {
  const [membaca, setMembaca] = useState(false)
  const [adaSuaraId, setAdaSuaraId] = useState(() => !!suaraIndonesia())

  // daftar suara kadang baru tersedia setelah beberapa saat
  useEffect(() => {
    if (!suaraTersedia()) return undefined
    const perbarui = () => setAdaSuaraId(!!suaraIndonesia())
    window.speechSynthesis.addEventListener?.('voiceschanged', perbarui)
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', perbarui)
  }, [])

  // berhenti membaca saat tombol hilang (pindah langkah / pindah menu)
  useEffect(() => () => hentikan(), [])

  if (!suaraTersedia()) return null

  const selesai = () => {
    setMembaca(false)
    onBagian?.(null)
  }

  return (
    <span className="bacakan">
      <button
        type="button"
        className={`tombol-bacakan ${membaca ? 'membaca' : ''}`}
        aria-pressed={membaca}
        onClick={() => {
          if (membaca) {
            hentikan()
            selesai()
            return
          }
          setMembaca(true)
          onMulai?.()
          bacakan(bagian, { onBagian, onSelesai: selesai })
        }}
      >
        {membaca ? '⏹ Berhenti' : `🔊 ${label}`}
      </button>
      {!adaSuaraId && <span className="ket catatan-suara">Suara bahasa Indonesia belum terpasang di perangkat ini; dibacakan dengan suara bawaan.</span>}
    </span>
  )
}
