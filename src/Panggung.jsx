import { useEffect, useRef, useState } from 'react'
import { Konfeti } from './Hiasan.jsx'
import Maskot from './Maskot.jsx'
import Prisma3D from './Prisma3D.jsx'
import Siswa from './Siswa.jsx'

// Kalimat balon kata di header, berganti sesuai menu
const SAPAAN = {
  belajar: 'Hai, aku Siku! Yuk belajar pelan-pelan, satu langkah dulu.',
  kalkulator: 'Masukkan dua sisi, nanti aku bantu hitung sisi ketiga!',
  latihan: 'Ayo latihan! Salah itu wajar, coba lagi ya.',
  tes: 'Kerjakan sendiri ya. Kamu pasti bisa!',
}

// Sorakan saat Siku diklik (sengaja tanpa rumus agar tidak membocorkan pre-test)
const SORAK = [
  'Hore! Kamu keren! ⭐',
  'Semangat! Kamu pasti bisa!',
  'Pelan-pelan saja, pahami tiap langkah 😉',
  'Belajar itu seru, kan?',
  'Aku segitiga paling bahagia sedunia!',
  'Tos dulu dong! ✋',
]

const SAPA_SISWA = ['Halo! Aku Raka, kita belajar bareng ya!', 'Aku juga lagi belajar Pythagoras, lho!', 'Ayo kita jadi juara kelas! 🏆']

const LAMA_TIDUR = 25000 // ms tanpa gerakan sebelum Siku tertidur

// Panggung header: balon kata, prisma 3D, anak SMP (Raka), dan maskot Siku.
// - Siku & Raka bisa diklik, dan bola mata mereka mengikuti kursor/jari.
// - Bila halaman lama tidak disentuh, Siku tertidur (Zzz) sampai ada gerakan.
// - Saat `diam` (tes berlangsung) semua animasi berhenti dan karakter tidak bisa diklik.
export default function Panggung({ halaman, diam }) {
  const [pesan, setPesan] = useState(null) // { teks, siapa, n }
  const [hitungan, setHitungan] = useState(0)
  const [lirik, setLirik] = useState(null)
  const [tidur, setTidur] = useState(false)
  const isiRef = useRef(null)
  const aktifTerakhir = useRef(0)

  // Balon kata kembali ke sapaan menu setelah beberapa detik
  useEffect(() => {
    if (!pesan) return undefined
    const t = setTimeout(() => setPesan(null), 2800)
    return () => clearTimeout(t)
  }, [pesan])

  // Lacak kursor: bola mata melirik, dan catat waktu aktif terakhir
  useEffect(() => {
    if (diam) return undefined
    aktifTerakhir.current = performance.now()
    let bingkai = 0
    const gerak = (e) => {
      aktifTerakhir.current = performance.now()
      setTidur(false)
      if (bingkai) return
      bingkai = requestAnimationFrame(() => {
        bingkai = 0
        const kotak = isiRef.current?.getBoundingClientRect()
        if (!kotak) return
        const dx = e.clientX - (kotak.left + kotak.width / 2)
        const dy = e.clientY - (kotak.top + kotak.height / 2)
        const jarak = Math.hypot(dx, dy) || 1
        const kuat = Math.min(1, jarak / 220)
        setLirik({ x: (dx / jarak) * kuat, y: (dy / jarak) * kuat })
      })
    }
    const aktif = () => {
      aktifTerakhir.current = performance.now()
      setTidur(false)
    }
    const cek = setInterval(() => {
      if (performance.now() - aktifTerakhir.current > LAMA_TIDUR) setTidur(true)
    }, 2000)
    window.addEventListener('pointermove', gerak)
    window.addEventListener('pointerdown', aktif)
    window.addEventListener('keydown', aktif)
    window.addEventListener('scroll', aktif, { passive: true })
    return () => {
      cancelAnimationFrame(bingkai)
      clearInterval(cek)
      window.removeEventListener('pointermove', gerak)
      window.removeEventListener('pointerdown', aktif)
      window.removeEventListener('keydown', aktif)
      window.removeEventListener('scroll', aktif)
    }
  }, [diam])

  const klik = (siapa) => {
    if (diam) return
    const daftar = siapa === 'siku' ? SORAK : SAPA_SISWA
    const bangun = siapa === 'siku' && tidur
    setTidur(false)
    setPesan({ teks: bangun ? 'Hoaam... aku bangun! Ayo belajar lagi! 😄' : daftar[hitungan % daftar.length], siapa, n: hitungan })
    setHitungan(hitungan + 1)
  }

  const sedangTidur = tidur && !diam && !pesan
  const teks = diam ? SAPAAN[halaman] : pesan ? pesan.teks : sedangTidur ? 'Zzz... Siku ketiduran. Klik Siku untuk membangunkan!' : SAPAAN[halaman]
  const suasanaSiku = pesan?.siapa === 'siku' ? 'senang' : sedangTidur ? 'tidur' : 'halo'

  return (
    <div className={`panggung ${diam ? 'diam' : ''}`}>
      {/* key: balon kata dianimasikan ulang setiap isinya berganti */}
      <p className="gelembung" key={pesan ? `p${pesan.n}` : sedangTidur ? 'tidur' : halaman} aria-live="polite">
        {teks}
      </p>
      <div className="panggung-isi" ref={isiRef}>
        <Prisma3D />
        <button
          type="button"
          className={`tombol-karakter tombol-siswa ${pesan?.siapa === 'siswa' ? 'disapa' : ''}`}
          key={pesan?.siapa === 'siswa' ? `s${pesan.n}` : 'siswa'}
          onClick={() => klik('siswa')}
          disabled={diam}
          aria-label="Sapa anak SMP"
        >
          {pesan?.siapa === 'siswa' && <Konfeti jumlah={16} />}
          <Siswa ukuran={104} lirik={diam ? null : lirik} />
        </button>
        <button
          type="button"
          className={`tombol-karakter tombol-siku ${pesan?.siapa === 'siku' ? 'disapa' : ''}`}
          key={pesan?.siapa === 'siku' ? `k${pesan.n}` : 'siku'}
          onClick={() => klik('siku')}
          disabled={diam}
          aria-label={sedangTidur ? 'Bangunkan Siku' : 'Sapa Siku'}
        >
          {pesan?.siapa === 'siku' && <Konfeti jumlah={22} />}
          <Maskot ukuran={92} diam={diam} suasana={suasanaSiku} lirik={diam ? null : lirik} />
        </button>
      </div>
      {!diam && <p className="petunjuk-klik">Klik Siku atau Raka!</p>}
    </div>
  )
}
