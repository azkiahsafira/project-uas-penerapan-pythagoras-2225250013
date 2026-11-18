// Pemandangan bawah laut untuk header, selaras dengan latar "Akuarium 3D" (Latar3D.jsx):
// - LatarHeaderLaut: permukaan air bergelombang, sinar matahari, dan gelembung berisi simbol Pythagoras yang naik
// - KapalSelam: kapal selam bermata besar dengan menara berbentuk segitiga siku-siku (sisi 3, 4, 5) dan jendela
//   bulat 9 + 16 = 25 (= 3² + 4² = 5²). Bisa diklik: melaju, baling-baling berputar kencang, dan berbicara.
// - DasarLaut: pasir, rumput laut bergoyang, karang, kerang, bintang laut, dan buih yang naik
// - PenyuLewat: penyu & kawanan ikan kecil yang berenang melintas
// Semuanya hiasan (kecuali tombol kapal selam) dan ikut berhenti saat animasi dimatikan / saat tes.
import { useEffect, useState } from 'react'

const SIMBOL_LAUT = [
  { t: 'a²', x: 4, besar: 15, tunda: 0, lama: 11 },
  { t: 'b²', x: 15, besar: 12, tunda: 4, lama: 9 },
  { t: 'c²', x: 27, besar: 17, tunda: 2, lama: 12 },
  { t: '√', x: 39, besar: 13, tunda: 6, lama: 10 },
  { t: '90°', x: 52, besar: 11, tunda: 1, lama: 13 },
  { t: '+', x: 63, besar: 13, tunda: 5, lama: 9 },
  { t: '=', x: 74, besar: 12, tunda: 3, lama: 11 },
  { t: '5²', x: 85, besar: 15, tunda: 7, lama: 10 },
  { t: '△', x: 94, besar: 13, tunda: 2.5, lama: 12 },
]

export function LatarHeaderLaut() {
  return (
    <div className="latar latar-laut" aria-hidden="true">
      <div className="laut-sinar" />
      <div className="laut-permukaan" />
      {SIMBOL_LAUT.map((s) => (
        <span
          key={s.t}
          className="laut-simbol"
          style={{ left: `${s.x}%`, '--b': `${s.besar}px`, animationDelay: `${s.tunda}s`, animationDuration: `${s.lama}s` }}
        >
          {s.t}
        </span>
      ))}
    </div>
  )
}

const UCAPAN_KAPAL = [
  'Blub! 3² + 4² = 5² 🚀',
  'Jendelaku: 9 + 16 = 25 ✨',
  'Menaraku segitiga siku-siku 📐',
  'Ayo menyelam ke materi! 🌊',
]

export function KapalSelam({ diam = false }) {
  const [klik, setKlik] = useState(0)
  const [ucap, setUcap] = useState(null)

  useEffect(() => {
    if (!ucap) return undefined
    const t = setTimeout(() => setUcap(null), 2400)
    return () => clearTimeout(t)
  }, [ucap])

  return (
    <button
      type="button"
      className="kapal-selam-tombol"
      disabled={diam}
      aria-label="Kapal selam Pythagoras"
      onClick={() => {
        setUcap(UCAPAN_KAPAL[klik % UCAPAN_KAPAL.length])
        setKlik(klik + 1)
      }}
    >
      {ucap && (
        <span className="kapal-ucap" key={`ucap-${klik}`} role="status">
          {ucap}
        </span>
      )}
      {/* key: animasi "melaju" diputar ulang setiap diklik */}
      <svg className={`kapal-selam ${klik ? 'melaju' : ''}`} key={klik} viewBox="0 0 320 180" aria-hidden="true">
        <defs>
          <linearGradient id="ks-badan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd9ea" />
            <stop offset="1" stopColor="#f58bbd" />
          </linearGradient>
          <linearGradient id="ks-menara" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d6edff" />
            <stop offset="1" stopColor="#6fb3f0" />
          </linearGradient>
          <linearGradient id="ks-sorot" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff6c7" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff6c7" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="ks-kaca" cx="0.35" cy="0.3" r="0.75">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#a9dcff" />
          </radialGradient>
        </defs>

        {/* sorot lampu depan */}
        <polygon className="ks-sorot" points="286,128 320,98 320,170" fill="url(#ks-sorot)" />

        {/* buih dari baling-baling */}
        <g className="ks-buih">
          <circle cx="16" cy="112" r="5" />
          <circle cx="8" cy="94" r="3.6" />
          <circle cx="18" cy="78" r="2.6" />
        </g>

        {/* periskop */}
        <path d="M128 34 V12 H148" fill="none" stroke="#1e2a4d" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M128 34 V12 H148" fill="none" stroke="#a9dcff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="151" cy="12" r="5" fill="url(#ks-kaca)" className="ks-garis" />

        {/* menara: segitiga siku-siku dengan sisi 3 : 4 : 5 */}
        <path d="M118 88 V34 L190 88 Z" fill="url(#ks-menara)" className="ks-garis" strokeLinejoin="round" />
        <path d="M118 76 H130 V88" fill="none" stroke="#ffffff" strokeWidth="2.5" />
        <text x="108" y="66" className="ks-label">
          3
        </text>
        <text x="150" y="84" className="ks-label putih">
          4
        </text>
        <text x="160" y="56" className="ks-label">
          5
        </text>

        {/* sirip ekor */}
        <path d="M50 98 L24 80 L34 108 Z" fill="#6fb3f0" className="ks-garis" strokeLinejoin="round" />
        <path d="M50 154 L24 172 L34 144 Z" fill="#6fb3f0" className="ks-garis" strokeLinejoin="round" />

        {/* baling-baling */}
        <rect x="18" y="122" width="22" height="9" rx="4" fill="#b9a3ea" className="ks-garis" />
        <g className="ks-baling">
          <ellipse cx="18" cy="126" rx="5" ry="17" fill="#ffd27a" className="ks-garis" />
          <ellipse cx="18" cy="126" rx="17" ry="5" fill="#ffd27a" className="ks-garis" />
          <circle cx="18" cy="126" r="4.5" fill="#f58bbd" className="ks-garis" />
        </g>

        {/* badan */}
        <rect x="36" y="84" width="252" height="86" rx="43" fill="url(#ks-badan)" className="ks-garis" />
        <path
          d="M70 100 Q160 88 250 100"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.7"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M64 156 H262"
          stroke="#ffffff"
          strokeOpacity="0.5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 10"
        />

        {/* jendela bulat 9 + 16 = 25: makin besar mengikuti luas persegi 3², 4², 5² */}
        <circle cx="74" cy="126" r="12" fill="url(#ks-kaca)" className="ks-garis" />
        <text x="74" y="131" className="ks-angka">
          9
        </text>
        <text x="94" y="131" className="ks-tanda">
          +
        </text>
        <circle cx="120" cy="126" r="16" fill="url(#ks-kaca)" className="ks-garis" />
        <text x="120" y="131" className="ks-angka">
          16
        </text>
        <text x="146" y="131" className="ks-tanda">
          =
        </text>
        <circle cx="176" cy="126" r="20" fill="url(#ks-kaca)" className="ks-garis" />
        <text x="176" y="132" className="ks-angka besar">
          25
        </text>

        {/* wajah lucu di depan */}
        <g className="ks-mata">
          <circle cx="226" cy="114" r="10.5" fill="#ffffff" className="ks-garis" />
          <circle cx="254" cy="114" r="10.5" fill="#ffffff" className="ks-garis" />
          <circle cx="228" cy="116" r="6.5" fill="#1e2a4d" />
          <circle cx="256" cy="116" r="6.5" fill="#1e2a4d" />
          <circle cx="230.5" cy="113" r="2.4" fill="#ffffff" />
          <circle cx="258.5" cy="113" r="2.4" fill="#ffffff" />
        </g>
        <ellipse cx="216" cy="134" rx="7" ry="4" fill="#ff6fa8" opacity="0.55" />
        <ellipse cx="266" cy="134" rx="7" ry="4" fill="#ff6fa8" opacity="0.55" />
        <path d="M232 134 Q240 144 248 134" fill="#e0568f" className="ks-garis" strokeLinejoin="round" />

        {/* lampu depan */}
        <circle cx="282" cy="128" r="6" fill="#fff6c7" className="ks-garis" />
      </svg>
    </button>
  )
}

const RUMPUT = [
  ['M12 120 C2 96 22 80 12 56 C4 38 18 22 12 4', '#8fd0e8', 0],
  ['M30 120 C40 98 22 84 32 62 C40 46 26 34 32 18', '#f5a9cf', 0.6],
  ['M48 120 C40 102 56 90 48 70 C42 56 54 46 50 34', '#c6b3f2', 1.2],
]

export function DasarLaut() {
  return (
    <>
      <div className="rumput-hero pasir-laut" aria-hidden="true" />
      {['kiri', 'kanan'].map((sisi) => (
        <svg key={sisi} className={`rumput-laut ${sisi}`} viewBox="0 0 60 122" aria-hidden="true">
          {RUMPUT.map(([d, warna, tunda]) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke={warna}
              strokeWidth="9"
              strokeLinecap="round"
              style={{ animationDelay: `${tunda}s` }}
            />
          ))}
        </svg>
      ))}
      <svg className="hias-dasar" viewBox="0 0 120 40" aria-hidden="true">
        {/* kerang */}
        <path d="M8 36 Q8 14 24 12 Q40 14 40 36 Z" fill="#ffd3e6" stroke="#1e2a4d" strokeWidth="2" />
        <path d="M24 13 V35 M16 16 L14 35 M32 16 L34 35" stroke="#f58bbd" strokeWidth="1.6" />
        {/* bintang laut berwajah */}
        <path
          d="M84 6 L89 18 L102 18 L92 26 L96 38 L84 31 L72 38 L76 26 L66 18 L79 18 Z"
          fill="#ffb38a"
          stroke="#1e2a4d"
          strokeWidth="2"
          strokeLinejoin="round"
          className="bintang-laut"
        />
        <circle cx="80.5" cy="22" r="1.8" fill="#1e2a4d" />
        <circle cx="87.5" cy="22" r="1.8" fill="#1e2a4d" />
        <path d="M81 27 Q84 30 87 27" fill="none" stroke="#1e2a4d" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {[12, 30, 58, 76, 90].map((x, i) => (
        <span key={x} className="laut-buih" style={{ left: `${x}%`, animationDelay: `${i * 1.3}s` }} aria-hidden="true" />
      ))}
    </>
  )
}

export function PenyuLewat() {
  return (
    <>
      <div className="penyu-jalur" aria-hidden="true">
        <svg className="penyu" viewBox="0 0 130 74">
          <ellipse className="penyu-kaki depan" cx="88" cy="58" rx="16" ry="6" fill="#ffd9c4" stroke="#1e2a4d" strokeWidth="2" />
          <ellipse
            className="penyu-kaki belakang"
            cx="30"
            cy="58"
            rx="11"
            ry="5"
            fill="#ffd9c4"
            stroke="#1e2a4d"
            strokeWidth="2"
          />
          <circle cx="104" cy="34" r="15" fill="#ffd9c4" stroke="#1e2a4d" strokeWidth="2.4" />
          <ellipse cx="58" cy="38" rx="40" ry="26" fill="#8fc9f5" stroke="#1e2a4d" strokeWidth="2.4" />
          <path
            d="M58 16 L70 26 L66 42 L50 42 L46 26 Z M30 30 L46 26 M70 26 L86 30 M50 42 L40 56 M66 42 L76 56"
            fill="#cfe8ff"
            stroke="#6fb3f0"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="108" cy="30" r="4.5" fill="#1e2a4d" />
          <circle cx="109.6" cy="28.4" r="1.6" fill="#ffffff" />
          <ellipse cx="102" cy="40" rx="4" ry="2.4" fill="#ff6fa8" opacity="0.55" />
          <path d="M110 38 Q114 42 117 37" fill="none" stroke="#1e2a4d" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div className="ikan-jalur" aria-hidden="true">
        {['#f58bbd', '#6fb3f0', '#b9a3ea'].map((warna, i) => (
          <svg key={warna} className={`ikan-kecil i${i}`} viewBox="0 0 48 30">
            <path d="M14 15 L2 5 L4 15 L2 25 Z" fill={warna} stroke="#1e2a4d" strokeWidth="1.6" strokeLinejoin="round" />
            <ellipse cx="26" cy="15" rx="16" ry="11" fill={warna} stroke="#1e2a4d" strokeWidth="1.8" />
            <circle cx="33" cy="12" r="4" fill="#ffffff" />
            <circle cx="34" cy="12.5" r="2.4" fill="#1e2a4d" />
            <ellipse cx="31" cy="19" rx="3" ry="1.6" fill="#ff6fa8" opacity="0.6" />
          </svg>
        ))}
      </div>
    </>
  )
}
