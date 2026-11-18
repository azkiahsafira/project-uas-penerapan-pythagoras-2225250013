import { useEffect, useRef, useState } from 'react'
import { SahabatSvg } from './Kawaii.jsx'
import Maskot from './Maskot.jsx'
import { PERISTIWA, PERISTIWA_SEMANGAT, bunyikan, suaraTepukNyala } from './perayaan.js'

// Layar perayaan penuh saat jawaban benar (menu Belajar & Latihan, TIDAK dipakai saat tes).
// Cara memakai: panggil rayakan({ beruntun }) dari perayaan.js; <LayarBenar /> dipasang sekali di App.
// Ada 6 gaya perayaan bersama sahabat kawaii yang dipilih acak (tidak sama dengan sebelumnya) agar tidak membosankan:
//   konfeti (Siku menari) · pesta sahabat · kembang api · balon terbang · lompat pelangi · hujan bintang.
// Tampil singkat (±2,4 detik) lalu hilang sendiri, atau langsung hilang bila diklik,
// supaya siswa cepat kembali ke penjelasan (tidak menambah beban kognitif yang tidak perlu).

const KATA = ['BENAR!', 'HEBAT!', 'KEREN!', 'MANTAP!', 'PINTAR!', 'LUAR BIASA!', 'JOSS!', 'SUPER!']
const PUJIAN = [
  'Kamu makin jago Pythagoras!',
  'Tepuk tangan untukmu!',
  'Siku bangga sama kamu!',
  'Teruskan, kamu bisa!',
  'Jawabanmu tepat sekali!',
  'Otakmu lagi panas, nih!',
  'a² + b² = c², kamu paham!',
  'Sahabat kawaii bersorak untukmu!',
]
const WARNA = ['#38bdf8', '#7cc3ff', '#f472b6', '#f9a8d4', '#fbbf24', '#a78bfa', '#34d399']
const WARNA_BALON = ['#ffb3d1', '#8fd0ff', '#d8c2ff', '#fff1a8', '#ff8fc4', '#a9dcff']
const SAHABAT = ['kuadra', 'lila', 'hipo', 'akar']
const GAYA = ['konfeti', 'pesta', 'kembang-api', 'balon', 'pelangi', 'bintang']
const LAMA = 2400
const acak = (arr) => arr[Math.floor(Math.random() * arr.length)]

function Konfeti() {
  return (
    <>
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
      <span className="lb-tangan kiri" aria-hidden="true">
        👏
      </span>
      <span className="lb-tangan kanan" aria-hidden="true">
        👏
      </span>
    </>
  )
}

// gaya "pesta": keempat sahabat muncul bergantian dari bawah lalu melompat-lompat
function Pesta() {
  return (
    <div className="lb-pesta" aria-hidden="true">
      {SAHABAT.map((id, i) => (
        <span key={id} className="lb-pesta-teman" style={{ '--i': i }}>
          <SahabatSvg id={id} />
        </span>
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="lb-hati-naik" style={{ left: `${6 + ((i * 47) % 88)}%`, animationDelay: `${(i % 7) * 0.12}s` }}>
          💗
        </span>
      ))}
    </div>
  )
}

// gaya "kembang api": letupan warna-warni di beberapa titik
function KembangApi() {
  const titik = [
    [18, 26],
    [80, 22],
    [30, 70],
    [74, 68],
    [50, 14],
  ]
  return (
    <div className="lb-kembang-api" aria-hidden="true">
      {titik.map(([x, y], n) => (
        <span key={n} className="lb-letupan" style={{ left: `${x}%`, top: `${y}%`, '--tunda': `${n * 0.22}s` }}>
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} style={{ '--sudut': `${(i / 14) * 360}deg`, background: WARNA[(i + n) % WARNA.length] }} />
          ))}
        </span>
      ))}
    </div>
  )
}

// gaya "balon": balon-balon pastel naik dari bawah
function BalonNaik() {
  return (
    <div className="lb-balon" aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className="lb-balon-satu"
          style={{
            left: `${(i * 61) % 96}%`,
            '--warna': WARNA_BALON[i % WARNA_BALON.length],
            animationDelay: `${(i % 8) * 0.1}s`,
            animationDuration: `${1.8 + (i % 4) * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

// gaya "pelangi": pelangi tumbuh, sahabat melompat melintasinya
function Pelangi({ teman }) {
  return (
    <div className="lb-pelangi" aria-hidden="true">
      <span className="lb-pelangi-busur" />
      <span className="lb-pelangi-teman">
        <SahabatSvg id={teman} />
      </span>
    </div>
  )
}

// gaya "bintang": hujan bintang & bintang besar yang berputar
function HujanBintang() {
  return (
    <div className="lb-hujan-bintang" aria-hidden="true">
      <span className="lb-bintang-besar">⭐</span>
      {Array.from({ length: 30 }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 10) * 0.08}s`,
            fontSize: `${14 + (i % 4) * 7}px`,
          }}
        >
          {i % 3 ? '★' : '✦'}
        </span>
      ))}
    </div>
  )
}

export default function LayarBenar() {
  const [tampil, setTampil] = useState(null)
  const pengatur = useRef(null)
  const gayaLalu = useRef(null)

  useEffect(() => {
    const saatRayakan = (e) => {
      const { beruntun } = e.detail
      clearTimeout(pengatur.current)
      const gaya = acak(GAYA.filter((g) => g !== gayaLalu.current))
      gayaLalu.current = gaya
      setTampil({
        id: Date.now(),
        gaya,
        teman: acak(SAHABAT),
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
      pengatur.current = setTimeout(() => setTampil(null), LAMA)
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
  const { gaya, teman } = tampil

  return (
    <div
      className={`layar-benar gaya-${gaya}`}
      key={tampil.id}
      role="status"
      aria-live="assertive"
      onClick={() => setTampil(null)}
    >
      <div className="lb-sinar" aria-hidden="true" />
      {gaya === 'konfeti' && <Konfeti />}
      {gaya === 'pesta' && <Pesta />}
      {gaya === 'kembang-api' && <KembangApi />}
      {gaya === 'balon' && <BalonNaik />}
      {gaya === 'pelangi' && <Pelangi teman={teman} />}
      {gaya === 'bintang' && <HujanBintang />}
      <span className="lb-bintang b1" aria-hidden="true">
        ⭐
      </span>
      <span className="lb-bintang b2" aria-hidden="true">
        🌟
      </span>
      <span className="lb-bintang b3" aria-hidden="true">
        ✨
      </span>
      <span className="lb-bintang b4" aria-hidden="true">
        🎉
      </span>
      <div className="lb-isi">
        {gaya === 'konfeti' ? (
          <div className="lb-maskot">
            <Maskot suasana="menari" ukuran={150} topi />
          </div>
        ) : (
          gaya !== 'pesta' &&
          gaya !== 'pelangi' && (
            <div className={`lb-sahabat ${gaya}`}>
              <SahabatSvg id={teman} />
            </div>
          )
        )}
        <p className="lb-kata">{tampil.kata}</p>
        <p className="lb-sub">{tampil.sub}</p>
        <p className="lb-ket">Klik di mana saja untuk lanjut</p>
      </div>
    </div>
  )
}

// Kalimat semangat saat jawaban salah
const SEMANGAT = {
  petunjuk: [
    'Hampir! Coba lagi ya 💪',
    'Sedikit lagi! Lihat petunjuknya 👀',
    'Tidak apa-apa, ayo coba sekali lagi 😊',
    'Salah itu bagian dari belajar ✨',
  ],
  dibuka: [
    'Tidak apa-apa! Lihat jawabannya, lalu lanjut ya 😊',
    'Sekarang kamu jadi tahu caranya 💡',
    'Pelan-pelan, kamu pasti bisa 🌱',
  ],
  pembahasan: [
    'Tidak apa-apa! Baca pembahasannya ya 📖',
    'Hampir! Lihat langkahnya pelan-pelan 👀',
    'Semangat! Soal berikutnya pasti bisa 💪',
  ],
}

// Siku atau salah satu sahabat kawaii muncul di bawah layar memberi semangat saat jawaban salah (±2,6 detik)
export function LayarSemangat() {
  const [tampil, setTampil] = useState(null)
  const pengatur = useRef(null)

  useEffect(() => {
    const saatSalah = (e) => {
      const daftar = SEMANGAT[e.detail.jenis] ?? SEMANGAT.petunjuk
      clearTimeout(pengatur.current)
      setTampil({ id: Date.now(), teks: acak(daftar), teman: acak(['siku', ...SAHABAT]) })
      pengatur.current = setTimeout(() => setTampil(null), 2600)
    }
    window.addEventListener(PERISTIWA_SEMANGAT, saatSalah)
    return () => {
      window.removeEventListener(PERISTIWA_SEMANGAT, saatSalah)
      clearTimeout(pengatur.current)
    }
  }, [])

  if (!tampil) return null

  return (
    <div className="layar-semangat" key={tampil.id} role="status" aria-live="polite" onClick={() => setTampil(null)}>
      <div className="ls-maskot">
        {tampil.teman === 'siku' ? (
          <Maskot suasana="halo" ukuran={64} />
        ) : (
          <SahabatSvg id={tampil.teman} className="ls-sahabat" />
        )}
      </div>
      <p className="ls-teks">{tampil.teks}</p>
      <span className="ls-hati" aria-hidden="true">
        💗
      </span>
    </div>
  )
}
