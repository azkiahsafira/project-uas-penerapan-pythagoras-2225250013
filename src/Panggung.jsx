import { useEffect, useState } from 'react'
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

// Panggung header: balon kata, prisma 3D, anak SMP, dan maskot Siku.
// Siku dan anak SMP bisa diklik. Saat `diam` (tes berlangsung) semua animasi
// berhenti dan karakter tidak bisa diklik.
export default function Panggung({ halaman, diam }) {
  const [pesan, setPesan] = useState(null) // { teks, siapa, n }
  const [hitungan, setHitungan] = useState(0)

  // Balon kata kembali ke sapaan menu setelah beberapa detik
  useEffect(() => {
    if (!pesan) return undefined
    const t = setTimeout(() => setPesan(null), 2800)
    return () => clearTimeout(t)
  }, [pesan])

  const klik = (siapa) => {
    if (diam) return
    const daftar = siapa === 'siku' ? SORAK : SAPA_SISWA
    setPesan({ teks: daftar[hitungan % daftar.length], siapa, n: hitungan })
    setHitungan(hitungan + 1)
  }

  const teks = !diam && pesan ? pesan.teks : SAPAAN[halaman]

  return (
    <div className={`panggung ${diam ? 'diam' : ''}`}>
      {/* key: balon kata dianimasikan ulang setiap isinya berganti */}
      <p className="gelembung" key={pesan ? `p${pesan.n}` : halaman} aria-live="polite">
        {teks}
      </p>
      <div className="panggung-isi">
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
          <Siswa ukuran={104} />
        </button>
        <button
          type="button"
          className={`tombol-karakter tombol-siku ${pesan?.siapa === 'siku' ? 'disapa' : ''}`}
          key={pesan?.siapa === 'siku' ? `k${pesan.n}` : 'siku'}
          onClick={() => klik('siku')}
          disabled={diam}
          aria-label="Sapa Siku"
        >
          {pesan?.siapa === 'siku' && <Konfeti jumlah={22} />}
          <Maskot ukuran={92} diam={diam} suasana={pesan?.siapa === 'siku' ? 'senang' : 'halo'} />
        </button>
      </div>
      {!diam && <p className="petunjuk-klik">Klik Siku atau Raka!</p>}
    </div>
  )
}
