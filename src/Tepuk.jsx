import { useEffect, useRef, useState } from 'react'
import Maskot from './Maskot.jsx'
import { PERISTIWA, bunyikan, suaraTepukNyala } from './perayaan.js'

// Layar perayaan penuh saat jawaban benar (menu Belajar & Latihan, TIDAK dipakai saat tes).
// Cara memakai: panggil rayakan({ beruntun }) dari perayaan.js; <LayarBenar /> dipasang sekali di App.
// Tampil singkat (±1,8 detik) lalu hilang sendiri, atau langsung hilang bila diklik,
// supaya siswa cepat kembali ke penjelasan (tidak menambah beban kognitif yang tidak perlu).

const KATA = ['BENAR!', 'HEBAT!', 'KEREN!', 'MANTAP!', 'PINTAR!', 'LUAR BIASA!', 'JOSS!', 'SUPER!']
const PUJIAN = [
  'Kamu makin jago Pythagoras!',
  'Tepuk tangan untukmu!',
  'Siku bangga sama kamu!',
  'Teruskan, kamu bisa!',
  'Jawabanmu tepat sekali!',
  'Otakmu lagi panas, nih!',
]
const WARNA = ['#38bdf8', '#7cc3ff', '#f472b6', '#f9a8d4', '#fbbf24', '#a78bfa', '#34d399']
const acak = (arr) => arr[Math.floor(Math.random() * arr.length)]

export default function LayarBenar() {
  const [tampil, setTampil] = useState(null)
  const pengatur = useRef(null)

  useEffect(() => {
    const saatRayakan = (e) => {
      const { beruntun } = e.detail
      clearTimeout(pengatur.current)
      setTampil({
        id: Date.now(),
        kata: acak(KATA),
        sub: beruntun >= 2 ? `🔥 ${beruntun} benar berturut-turut!` : acak(PUJIAN),
      })
      if (suaraTepukNyala()) {
        try {
          bunyikan()
        } catch {
          // perangkat tidak mendukung suara: perayaan tetap tampil
        }
      }
      pengatur.current = setTimeout(() => setTampil(null), 1900)
    }
    window.addEventListener(PERISTIWA, saatRayakan)
    return () => {
      window.removeEventListener(PERISTIWA, saatRayakan)
      clearTimeout(pengatur.current)
    }
  }, [])

  useEffect(() => {
    if (!tampil) return undefined
    const tutup = (e) => e.key === 'Escape' && setTampil(null)
    window.addEventListener('keydown', tutup)
    return () => window.removeEventListener('keydown', tutup)
  }, [tampil])

  if (!tampil) return null

  return (
    <div className="layar-benar" key={tampil.id} role="status" aria-live="assertive" onClick={() => setTampil(null)}>
      <div className="lb-sinar" aria-hidden="true" />
      <div className="lb-hujan" aria-hidden="true">
        {Array.from({ length: 70 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 37) % 100}%`,
              background: WARNA[i % WARNA.length],
              animationDelay: `${(i % 14) * 0.05}s`,
              animationDuration: `${1.3 + (i % 5) * 0.15}s`,
              '--putar': `${((i * 53) % 2 ? 1 : -1) * (360 + ((i * 41) % 360))}deg`,
              '--geser': `${((i * 29) % 80) - 40}px`,
              borderRadius: i % 3 === 0 ? '50%' : '2px',
              width: i % 4 === 0 ? 12 : 8,
              height: i % 4 === 0 ? 12 : 14,
            }}
          />
        ))}
      </div>
      <span className="lb-tangan kiri" aria-hidden="true">👏</span>
      <span className="lb-tangan kanan" aria-hidden="true">👏</span>
      <span className="lb-bintang b1" aria-hidden="true">⭐</span>
      <span className="lb-bintang b2" aria-hidden="true">🌟</span>
      <span className="lb-bintang b3" aria-hidden="true">✨</span>
      <span className="lb-bintang b4" aria-hidden="true">🎉</span>
      <div className="lb-isi">
        <div className="lb-maskot">
          <Maskot suasana="menari" ukuran={150} topi />
        </div>
        <p className="lb-kata">{tampil.kata}</p>
        <p className="lb-sub">{tampil.sub}</p>
        <p className="lb-ket">Klik di mana saja untuk lanjut</p>
      </div>
    </div>
  )
}
