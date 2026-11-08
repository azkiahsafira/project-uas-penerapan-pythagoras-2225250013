// Latar belakang "Bawah Laut" untuk semua menu (di belakang kotak-kotak yang tembus pandang):
// - gurita menulis 3² + 4² = 5² di papan kecil
// - paus menyemburkan air
// - kura-kura & Siku si ikan segitiga berenang melintas, diikuti gerombolan ikan kecil
// - rumput laut bergoyang, bintang laut, kerang, pasir, dan gelembung naik
// Hewan bisa diklik: masing-masing bereaksi dan mengucapkan kalimat lucu.
// Semua hanya hiasan (aria-hidden), disembunyikan saat tes, dan berhenti saat animasi dimatikan.
import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

const GARIS = '#1e2a4d'

function Gurita() {
  const idKlip = `lt-tulis-${useId().replace(/:/g, '')}`
  // tentakel: [x awal, arah lengkung, jeda animasi]
  const tentakel = [
    [62, -1, 0],
    [78, -1, -0.4],
    [94, 1, -0.8],
    [110, 1, -1.2],
    [126, 1, -1.6],
  ]
  return (
    <svg className="lt lt-gurita" viewBox="0 0 220 190">
      {/* papan tulis kecil */}
      <g className="lt-papan">
        <rect x="128" y="18" width="86" height="56" rx="8" fill="#c08457" stroke={GARIS} strokeWidth="2" />
        <rect x="134" y="24" width="74" height="44" rx="5" fill="#2f6f5e" />
        <clipPath id={idKlip}>
          <rect className="lt-kapur-buka" x="136" y="26" width="70" height="40" />
        </clipPath>
        <g clipPath={`url(#${idKlip})`} className="lt-kapur">
          <text x="171" y="43">
            3² + 4²
          </text>
          <text x="171" y="61">
            = 5² ✓
          </text>
        </g>
      </g>
      {/* tentakel yang bergoyang */}
      {tentakel.map(([x, arah, jeda]) => (
        <path
          key={x}
          className="lt-tentakel"
          style={{ animationDelay: `${jeda}s` }}
          d={`M${x} 120 Q${x + arah * 14} 150 ${x - arah * 4} 170 Q${x - arah * 12} 182 ${x + arah * 6} 184`}
          stroke="#f472b6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
      ))}
      {/* tentakel yang menulis */}
      <g className="lt-tentakel-tulis">
        <path d="M128 112 Q150 104 156 82" stroke="#f472b6" strokeWidth="11" strokeLinecap="round" fill="none" />
        <rect x="152" y="70" width="5" height="12" rx="1.5" fill="#fff" stroke={GARIS} strokeWidth="1" />
      </g>
      {/* kepala */}
      <g className="lt-kepala-gurita">
        <path
          d="M46 112 Q40 40 94 36 Q148 40 142 112 Q120 128 94 126 Q68 128 46 112 Z"
          fill="#f9a8d4"
          stroke={GARIS}
          strokeWidth="2.5"
        />
        <circle cx="70" cy="62" r="5" fill="#fbcfe8" />
        <circle cx="116" cy="56" r="4" fill="#fbcfe8" />
        <circle cx="104" cy="74" r="3" fill="#fbcfe8" />
        <g className="lt-kedip">
          <ellipse cx="78" cy="92" rx="7" ry="8" fill="#fff" stroke={GARIS} strokeWidth="2" />
          <ellipse cx="110" cy="92" rx="7" ry="8" fill="#fff" stroke={GARIS} strokeWidth="2" />
          <circle cx="80" cy="94" r="3.6" fill={GARIS} />
          <circle cx="112" cy="94" r="3.6" fill={GARIS} />
          <circle cx="81.5" cy="92.5" r="1.2" fill="#fff" />
          <circle cx="113.5" cy="92.5" r="1.2" fill="#fff" />
        </g>
        <circle cx="66" cy="106" r="6" fill="#fb7185" opacity="0.55" />
        <circle cx="122" cy="106" r="6" fill="#fb7185" opacity="0.55" />
        <path d="M88 108 Q94 114 100 108" stroke={GARIS} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
      {/* gelembung dari gurita */}
      <circle className="lt-gel g1" cx="60" cy="40" r="4" />
      <circle className="lt-gel g2" cx="52" cy="30" r="2.6" />
    </svg>
  )
}

function Paus() {
  return (
    <svg className="lt lt-paus" viewBox="0 0 260 170">
      {/* semburan air */}
      <g className="lt-semburan">
        <path
          d="M120 54 Q118 30 104 18 M120 54 Q122 28 120 10 M120 54 Q124 30 138 18"
          stroke="#7cc3ff"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="102" cy="14" r="4.5" fill="#bfe3ff" />
        <circle cx="120" cy="6" r="5" fill="#bfe3ff" />
        <circle cx="140" cy="14" r="4.5" fill="#bfe3ff" />
      </g>
      <g className="lt-badan-paus">
        {/* ekor */}
        <g className="lt-ekor-paus">
          <path
            d="M214 96 Q236 70 252 62 Q244 88 236 98 Q248 110 254 130 Q232 120 214 104 Z"
            fill="#7cc3ff"
            stroke={GARIS}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
        {/* badan */}
        <path
          d="M24 104 Q22 56 92 54 Q170 52 220 98 Q176 150 96 150 Q30 150 24 104 Z"
          fill="#93c5fd"
          stroke={GARIS}
          strokeWidth="2.5"
        />
        <path d="M34 118 Q90 150 176 130 Q140 148 96 148 Q50 148 34 118 Z" fill="#e0f2fe" />
        <path d="M60 128 L70 128 M80 132 L92 132 M104 134 L116 134" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" />
        {/* sirip */}
        <path
          className="lt-sirip-paus"
          d="M104 128 Q116 150 132 146 Q122 132 118 124 Z"
          fill="#7cc3ff"
          stroke={GARIS}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* mata & senyum */}
        <g className="lt-kedip">
          <circle cx="62" cy="96" r="6" fill="#fff" stroke={GARIS} strokeWidth="2" />
          <circle cx="63" cy="97" r="3" fill={GARIS} />
        </g>
        <circle cx="52" cy="110" r="5.5" fill="#fb7185" opacity="0.5" />
        <path d="M34 112 Q46 124 60 116" stroke={GARIS} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function KuraKura() {
  return (
    <svg className="lt lt-kura" viewBox="0 0 140 90">
      <g className="lt-kaki-depan">
        <ellipse cx="96" cy="66" rx="18" ry="7" fill="#86efac" stroke={GARIS} strokeWidth="2" transform="rotate(30 96 66)" />
      </g>
      <g className="lt-kaki-belakang">
        <ellipse cx="36" cy="66" rx="14" ry="6" fill="#86efac" stroke={GARIS} strokeWidth="2" transform="rotate(-30 36 66)" />
      </g>
      <path d="M22 56 L10 60 L22 62 Z" fill="#86efac" stroke={GARIS} strokeWidth="1.8" strokeLinejoin="round" />
      {/* kepala */}
      <circle cx="116" cy="46" r="13" fill="#86efac" stroke={GARIS} strokeWidth="2" />
      <circle cx="121" cy="43" r="2.4" fill={GARIS} />
      <path d="M116 51 Q121 55 126 50" stroke={GARIS} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="113" cy="51" r="2.6" fill="#fbcfe8" />
      {/* tempurung */}
      <path d="M22 60 Q24 18 64 16 Q104 18 106 60 Z" fill="#4ade80" stroke={GARIS} strokeWidth="2.5" />
      <path
        d="M44 58 L52 34 L76 34 L84 58 M52 34 L64 22 L76 34"
        stroke="#166534"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M20 60 H108" stroke={GARIS} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function IkanSiku({ warna = '#fde68a' }) {
  return (
    <svg className="lt lt-ikan-siku" viewBox="0 0 130 90">
      {/* ekor */}
      <path
        className="lt-ekor-ikan"
        d="M100 45 L126 24 L122 45 L126 66 Z"
        fill="#f9a8d4"
        stroke={GARIS}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* badan segitiga siku-siku (menghadap kiri) */}
      <path d="M10 70 L100 70 L100 18 Z" fill={warna} stroke={GARIS} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="90" y="60" width="10" height="10" fill="none" stroke={GARIS} strokeWidth="1.8" />
      <path d="M58 70 Q66 82 76 80 Q72 72 70 70 Z" fill="#f9a8d4" stroke={GARIS} strokeWidth="1.8" strokeLinejoin="round" />
      <g className="lt-kedip">
        <circle cx="56" cy="56" r="4.5" fill="#fff" stroke={GARIS} strokeWidth="1.8" />
        <circle cx="55" cy="57" r="2.2" fill={GARIS} />
      </g>
      <circle cx="66" cy="62" r="3" fill="#fb7185" opacity="0.5" />
      <path d="M38 64 Q42 67 46 64" stroke={GARIS} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function IkanKecil({ warna }) {
  return (
    <svg className="lt lt-ikan-kecil" viewBox="0 0 60 36">
      <path
        className="lt-ekor-ikan"
        d="M42 18 L58 6 L56 18 L58 30 Z"
        fill={warna}
        stroke={GARIS}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <ellipse cx="26" cy="18" rx="20" ry="13" fill={warna} stroke={GARIS} strokeWidth="1.8" />
      <path d="M26 6 Q30 18 26 30" stroke="#fff" strokeWidth="3" fill="none" opacity="0.8" />
      <circle cx="14" cy="15" r="3" fill="#fff" stroke={GARIS} strokeWidth="1.2" />
      <circle cx="13.4" cy="15.4" r="1.5" fill={GARIS} />
      <path d="M8 21 Q11 23 14 21" stroke={GARIS} strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function RumputLaut({ kelas }) {
  return (
    <svg className={`lt lt-rumput ${kelas}`} viewBox="0 0 120 220" preserveAspectRatio="xMidYMax meet">
      <path
        className="lt-helai h1"
        d="M30 220 Q14 170 32 130 Q48 90 30 40"
        stroke="#4ade80"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <path
        className="lt-helai h2"
        d="M62 220 Q78 180 60 140 Q44 100 64 70"
        stroke="#22c55e"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        className="lt-helai h3"
        d="M92 220 Q80 186 96 156 Q110 128 96 104"
        stroke="#86efac"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function DasarLaut() {
  return (
    <svg className="lt lt-dasar" viewBox="0 0 1200 90" preserveAspectRatio="none">
      <path d="M0 40 Q150 20 300 38 T600 36 T900 30 T1200 36 V90 H0 Z" fill="#fde7c3" />
      <path d="M0 52 Q200 40 400 54 T800 50 T1200 52" stroke="#f9d9a6" strokeWidth="4" fill="none" />
    </svg>
  )
}

function BintangLaut() {
  return (
    <svg className="lt lt-bintang-laut" viewBox="0 0 70 70">
      <path
        d="M35 4 L44 26 L67 27 L49 42 L56 65 L35 52 L14 65 L21 42 L3 27 L26 26 Z"
        fill="#fb923c"
        stroke={GARIS}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="29" cy="34" r="2.4" fill={GARIS} />
      <circle cx="41" cy="34" r="2.4" fill={GARIS} />
      <path d="M30 41 Q35 45 40 41" stroke={GARIS} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function Kerang() {
  return (
    <svg className="lt lt-kerang" viewBox="0 0 70 56">
      <path d="M6 48 Q4 14 35 8 Q66 14 64 48 Z" fill="#fbcfe8" stroke={GARIS} strokeWidth="2.2" strokeLinejoin="round" />
      <path
        d="M35 48 V12 M20 48 L26 14 M50 48 L44 14 M10 46 L16 20 M60 46 L54 20"
        stroke="#f472b6"
        strokeWidth="1.8"
        fill="none"
      />
      <rect x="26" y="46" width="18" height="7" rx="3" fill="#f9a8d4" stroke={GARIS} strokeWidth="1.8" />
      {/* mutiara muncul saat kerang diklik */}
      <circle className="lt-mutiara" cx="35" cy="2" r="7" fill="#fff" stroke="#c4b5fd" strokeWidth="2" />
    </svg>
  )
}

const GELEMBUNG = [
  [6, 14, 16, 0],
  [18, 9, 13, -4],
  [31, 18, 19, -9],
  [47, 11, 15, -2],
  [63, 15, 17, -7],
  [78, 10, 12, -5],
  [90, 20, 21, -12],
  [97, 8, 14, -1],
]

// Kalimat tiap hewan saat diklik (bergantian)
const SAPAAN_LAUT = {
  paus: ['Byuuurr! 💦', 'Halo! Aku paus biru 🐳', 'Semprot air untukmu! 💧'],
  gurita: ['Halo! Aku si Gurita pintar 🐙', '3² + 4² = 5², betul kan? ✍️', 'Aku menulis pakai tentakel! 😄'],
  sikuIkan: ['Aku ikan segitiga siku-siku! 🔺', 'Sisi terpanjangku sisi miring 😎', 'Blub blub! 🫧'],
  ikan: ['Wusss! 🐟', 'Kami berenang bersama! 🐠', 'Kejar kami kalau bisa! 😆'],
  kura: ['Pelan-pelan asal paham 🐢', 'Hai! Semangat belajar ya 🐢'],
  bintang: ['Kamu bintangnya! ⭐', 'Berkilau seperti kamu ✨'],
  kerang: ['Ada mutiara! ✨', 'Ilmu itu berharga seperti mutiara 🦪'],
}

// Pembungkus hewan yang bisa diklik: bereaksi (kelas .disapa) dan memunculkan balon kata
function HewanLaut({ nama, kelas, label, children }) {
  const [sapa, setSapa] = useState(null) // { teks, n, x, y }
  const [hitung, setHitung] = useState(0)

  useEffect(() => {
    if (!sapa) return undefined
    const t = setTimeout(() => setSapa(null), 2400)
    return () => clearTimeout(t)
  }, [sapa])

  const daftar = SAPAAN_LAUT[nama]
  return (
    <div className={`${kelas} ${sapa ? 'disapa' : ''}`}>
      <button
        type="button"
        tabIndex={-1}
        className="laut-tombol"
        aria-label={label}
        key={sapa ? `s${sapa.n}` : 'diam'}
        onClick={(e) => {
          // balon kata digambar di lapisan paling depan (bukan di latar) agar tidak tertutup kotak
          const r = e.currentTarget.getBoundingClientRect()
          const x = Math.min(Math.max(r.left + r.width / 2, 130), window.innerWidth - 130)
          const y = Math.max(r.top + r.height * 0.15, 70)
          setSapa({ teks: daftar[hitung % daftar.length], n: hitung, x, y })
          setHitung(hitung + 1)
        }}
      >
        {children}
      </button>
      {sapa &&
        createPortal(
          <span className="laut-ucap" key={sapa.n} style={{ left: sapa.x, top: sapa.y }} role="status">
            {sapa.teks}
          </span>,
          document.body,
        )}
    </div>
  )
}

export default function LatarLaut() {
  return (
    <div className="latar-adegan latar-laut" aria-hidden="true">
      <div className="laut-cahaya" />
      {GELEMBUNG.map(([x, ukuran, lama, tunda]) => (
        <span
          key={x}
          className="laut-gelembung"
          style={{ left: `${x}%`, width: ukuran, height: ukuran, animationDuration: `${lama}s`, animationDelay: `${tunda}s` }}
        />
      ))}
      <HewanLaut nama="paus" kelas="laut-paus" label="Sapa paus">
        <Paus />
      </HewanLaut>
      <HewanLaut nama="sikuIkan" kelas="laut-renang laut-ikan-siku" label="Sapa ikan segitiga">
        <IkanSiku />
      </HewanLaut>
      <HewanLaut nama="ikan" kelas="laut-renang laut-gerombolan" label="Sapa gerombolan ikan">
        <IkanKecil warna="#fdba74" />
        <IkanKecil warna="#a5f3fc" />
        <IkanKecil warna="#c4b5fd" />
      </HewanLaut>
      <HewanLaut nama="kura" kelas="laut-renang laut-kura" label="Sapa kura-kura">
        <KuraKura />
      </HewanLaut>
      <div className="laut-dasar">
        <DasarLaut />
      </div>
      <div className="laut-rumput-kiri">
        <RumputLaut kelas="kiri" />
      </div>
      <div className="laut-rumput-kanan">
        <RumputLaut kelas="kanan" />
      </div>
      <HewanLaut nama="gurita" kelas="laut-gurita" label="Sapa gurita">
        <Gurita />
      </HewanLaut>
      <HewanLaut nama="bintang" kelas="laut-bintang" label="Sapa bintang laut">
        <BintangLaut />
      </HewanLaut>
      <HewanLaut nama="kerang" kelas="laut-kerang" label="Buka kerang">
        <Kerang />
      </HewanLaut>
    </div>
  )
}
