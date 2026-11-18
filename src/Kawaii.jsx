// Tema "Sahabat Kawaii Pythagoras" untuk header, selaras dengan latar 3D (Latar3D.jsx).
// Karakter ORISINAL bergaya kawaii pastel (bukan karakter berhak cipta), masing-masing membawa bagian rumus:
//   Kuadra (penguin biru, a²) · Lila (domba ungu, b²) · Hipo (beruang biru, c² = sisi miring) · Akar (kucing pink, √)
// - LatarHeaderKawaii: langit biru muda bertabur titik pink, hati, bintang, & pita yang melayang
// - TemanKawaii: keempat sahabat berdiri di awan; bisa diklik → melompat & berbicara tentang Pythagoras
// - LantaiAwan: hamparan awan empuk dengan bunga & bintang kecil
// - BenderaPesta, PelangiAwan, PanggungAwan: adegan "panggung pesta" (bendera warna-warni, pelangi yang ujungnya
//   awan berwajah lucu, panggung awan tempat keempat sahabat berdiri, dan papan "Ayo belajar bareng!")
// Semuanya hiasan (kecuali tombol karakter) dan ikut berhenti saat animasi dimatikan / saat tes.
import { useEffect, useState } from 'react'

const GARIS = '#6b5a8e' // garis tepi lembut ungu kecokelatan (khas kartun kawaii)
const PIPI = '#ff9cc6'

// hiasan melayang di header: [jenis, x%, y%, ukuran px, tunda detik]
const HIASAN = [
  ['hati', 4, 20, 16, 0],
  ['bintang', 12, 64, 14, 1.4],
  ['pita', 22, 14, 22, 0.7],
  ['hati', 33, 70, 12, 2.2],
  ['bintang', 46, 10, 12, 0.3],
  ['pita', 58, 66, 18, 1.9],
  ['hati', 68, 16, 14, 1.1],
  ['bintang', 79, 58, 16, 2.6],
  ['pita', 88, 22, 20, 0.5],
  ['hati', 96, 60, 13, 1.7],
]

function Hias({ jenis }) {
  if (jenis === 'hati')
    return (
      <svg viewBox="0 0 20 18">
        <path d="M10 17 C2 11 0 7 2.5 3.5 C5 0.5 8.5 1.5 10 4.5 C11.5 1.5 15 0.5 17.5 3.5 C20 7 18 11 10 17 Z" fill="#ffb3d1" />
      </svg>
    )
  if (jenis === 'bintang')
    return (
      <svg viewBox="0 0 20 20">
        <path
          d="M10 1 L12.6 6.8 L19 7.4 L14.2 11.6 L15.6 18 L10 14.7 L4.4 18 L5.8 11.6 L1 7.4 L7.4 6.8 Z"
          fill="#fff1a8"
          stroke="#f2c14e"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    )
  return (
    <svg viewBox="0 0 30 18">
      <path
        d="M15 9 L3 2 Q0 9 3 16 Z M15 9 L27 2 Q30 9 27 16 Z"
        fill="#8fd0ff"
        stroke="#7cc3ff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="9" r="3.2" fill="#ffc6e0" stroke="#f58bbd" strokeWidth="1.2" />
    </svg>
  )
}

export function LatarHeaderKawaii() {
  return (
    <div className="latar latar-kawaii" aria-hidden="true">
      <div className="kawaii-titik" />
      <BenderaPesta />
      {[1, 2, 3].map((n) => (
        <span key={n} className={`kawaii-awan-arak a${n}`} />
      ))}
      {HIASAN.map(([jenis, x, y, b, tunda]) => (
        <span
          key={`${x}-${y}`}
          className={`kawaii-hias ${jenis}`}
          style={{ left: `${x}%`, top: `${y}%`, width: b, height: b, animationDelay: `${tunda}s` }}
        >
          <Hias jenis={jenis} />
        </span>
      ))}
    </div>
  )
}

// ---- wajah kawaii: mata oval kecil berkilau, pipi merona, mulut mungil ----
function Wajah({ x, y, jarak = 22, mulut = 'senyum' }) {
  return (
    <g className="kw-wajah">
      <g className="kw-mata">
        <ellipse cx={x - jarak / 2} cy={y} rx="4.8" ry="6.2" fill={GARIS} />
        <ellipse cx={x + jarak / 2} cy={y} rx="4.8" ry="6.2" fill={GARIS} />
        <circle cx={x - jarak / 2 + 1.7} cy={y - 2.3} r="1.9" fill="#ffffff" />
        <circle cx={x + jarak / 2 + 1.7} cy={y - 2.3} r="1.9" fill="#ffffff" />
        <circle cx={x - jarak / 2 - 1.5} cy={y + 2.2} r="0.95" fill="#ffffff" />
        <circle cx={x + jarak / 2 - 1.5} cy={y + 2.2} r="0.95" fill="#ffffff" />
      </g>
      <ellipse cx={x - jarak / 2 - 7} cy={y + 9} rx="7" ry="4.2" fill={PIPI} opacity="0.85" />
      <ellipse cx={x + jarak / 2 + 7} cy={y + 9} rx="7" ry="4.2" fill={PIPI} opacity="0.85" />
      {mulut === 'w' ? (
        <path
          d={`M${x - 5} ${y + 7} q2.5 3 5 0 q2.5 3 5 0`}
          fill="none"
          stroke={GARIS}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path d={`M${x - 3.5} ${y + 7} q3.5 3.5 7 0`} fill="none" stroke={GARIS} strokeWidth="1.8" strokeLinecap="round" />
      )}
    </g>
  )
}

// pita kupu-kupu & bunga kecil sebagai aksesori
function Pita({ x, y, warna, putar = 0, besar = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${putar}) scale(${besar})`}>
      <path
        d="M0 0 L-11 -7 Q-14 0 -11 7 Z M0 0 L11 -7 Q14 0 11 7 Z"
        fill={warna}
        stroke={GARIS}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle r="3.2" fill="#ffffff" stroke={GARIS} strokeWidth="1.6" />
    </g>
  )
}

function Bunga({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse
          key={r}
          cx="0"
          cy="-5"
          rx="3.6"
          ry="5"
          fill="#ffa3cf"
          stroke={GARIS}
          strokeWidth="1.2"
          transform={`rotate(${r})`}
        />
      ))}
      <circle r="3" fill="#fff1a8" stroke={GARIS} strokeWidth="1.2" />
    </g>
  )
}

// papan kecil berisi bagian rumus yang dibawa setiap karakter
function Papan({ x, y, teks, warna, warnaTeks }) {
  return (
    <g className="kw-papan">
      <rect x={x - 17} y={y} width="34" height="20" rx="10" fill={warna} stroke={GARIS} strokeWidth="2" />
      <text x={x} y={y + 14.5} className="kw-teks" style={{ fill: warnaTeks }}>
        {teks}
      </text>
      <ellipse cx={x - 13} cy={y + 10} rx="5" ry="4.4" fill="#ffffff" stroke={GARIS} strokeWidth="1.8" />
      <ellipse cx={x + 13} cy={y + 10} rx="5" ry="4.4" fill="#ffffff" stroke={GARIS} strokeWidth="1.8" />
    </g>
  )
}

const TEMAN = [
  {
    id: 'kuadra',
    nama: 'Kuadra',
    kata: ['Halo, aku Kuadra si penguin! a² artinya a × a 🐧', '3² = 9, gampang kan? 💗', 'Ayo kuadratkan sisi siku-sikunya ✨'],
    gambar: (
      <>
        {/* penguin biru muda: sirip, kaki oranye, perut & topeng wajah putih, paruh oranye, syal pink */}
        <ellipse cx="34" cy="96" rx="7" ry="16" fill="#8fcaff" stroke={GARIS} strokeWidth="2.4" transform="rotate(25 34 96)" />
        <ellipse cx="86" cy="96" rx="7" ry="16" fill="#8fcaff" stroke={GARIS} strokeWidth="2.4" transform="rotate(-25 86 96)" />
        <ellipse cx="60" cy="100" rx="23" ry="21" fill="#8fcaff" stroke={GARIS} strokeWidth="2.6" />
        <ellipse cx="60" cy="102" rx="15" ry="15" fill="#ffffff" />
        <ellipse cx="60" cy="64" rx="34" ry="30" fill="#8fcaff" stroke={GARIS} strokeWidth="2.6" />
        <path d="M58 35 Q54 24 62 22 Q60 28 64 34 Z" fill="#8fcaff" stroke={GARIS} strokeWidth="2" strokeLinejoin="round" />
        <path d="M60 50 C44 50 34 60 36 72 C38 84 50 88 60 88 C70 88 82 84 84 72 C86 60 76 50 60 50 Z" fill="#ffffff" />
        <path d="M36 88 Q60 98 84 88 L84 95 Q60 104 36 95 Z" fill="#ff8fc4" stroke={GARIS} strokeWidth="2" />
        <Wajah x={60} y={68} />
        <path d="M55 74 L65 74 L60 80 Z" fill="#ffb35c" stroke={GARIS} strokeWidth="1.6" strokeLinejoin="round" />
        <Pita x={78} y={42} warna="#ff8fc4" putar={-18} />
        <Papan x={60} y={102} teks="a²" warna="#ffd3e6" warnaTeks="#c2477f" />
      </>
    ),
  },
  {
    id: 'lila',
    nama: 'Lila',
    kata: ['Aku Lila, pembawa b² 🐑', 'a² + b² ... hasilnya c²! 🌸', 'Pelan-pelan, kamu pasti bisa 💜'],
    gambar: (
      <>
        <ellipse cx="60" cy="100" rx="22" ry="20" fill="#ebdcff" stroke={GARIS} strokeWidth="2.6" />
        {/* bulu domba seperti awan */}
        <g fill="#dcc8ff" stroke={GARIS} strokeWidth="2.4">
          <circle cx="34" cy="56" r="13" />
          <circle cx="86" cy="56" r="13" />
          <circle cx="44" cy="38" r="14" />
          <circle cx="76" cy="38" r="14" />
          <circle cx="60" cy="32" r="15" />
        </g>
        {/* telinga terkulai */}
        <ellipse cx="27" cy="72" rx="10" ry="6" fill="#ffe7f1" stroke={GARIS} strokeWidth="2.2" transform="rotate(-25 27 72)" />
        <ellipse cx="93" cy="72" rx="10" ry="6" fill="#ffe7f1" stroke={GARIS} strokeWidth="2.2" transform="rotate(25 93 72)" />
        <ellipse cx="60" cy="68" rx="28" ry="25" fill="#fff6fb" stroke={GARIS} strokeWidth="2.6" />
        <path d="M50 44 Q60 38 70 44" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <Wajah x={60} y={70} jarak={20} />
        <Bunga x={82} y={44} />
        <Papan x={60} y={102} teks="b²" warna="#ebdcff" warnaTeks="#7a4fc4" />
      </>
    ),
  },
  {
    id: 'hipo',
    nama: 'Hipo',
    kata: ['Aku Hipo, si sisi miring c² 🐻', 'Sisi miring selalu paling panjang! 📏', '3² + 4² = 5², itu aku! 👑'],
    gambar: (
      <>
        <circle cx="32" cy="40" r="12" fill="#b5ddff" stroke={GARIS} strokeWidth="2.6" />
        <circle cx="88" cy="40" r="12" fill="#b5ddff" stroke={GARIS} strokeWidth="2.6" />
        <circle cx="32" cy="40" r="6" fill="#ffd3e6" />
        <circle cx="88" cy="40" r="6" fill="#ffd3e6" />
        <ellipse cx="60" cy="100" rx="22" ry="20" fill="#b5ddff" stroke={GARIS} strokeWidth="2.6" />
        <ellipse cx="60" cy="66" rx="34" ry="29" fill="#b5ddff" stroke={GARIS} strokeWidth="2.6" />
        {/* mahkota mungil */}
        <path
          d="M48 40 L46 28 L54 34 L60 24 L66 34 L74 28 L72 40 Z"
          fill="#fff1a8"
          stroke="#d99a2b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <ellipse cx="60" cy="76" rx="11" ry="8" fill="#ffffff" />
        <ellipse cx="60" cy="72" rx="3.6" ry="2.6" fill={GARIS} />
        <Wajah x={60} y={64} jarak={26} mulut="w" />
        <Pita x={60} y={91} warna="#ff8fc4" besar={0.85} />
        <Papan x={60} y={102} teks="c²" warna="#b5ddff" warnaTeks="#2f6fb3" />
      </>
    ),
  },
  {
    id: 'akar',
    nama: 'Akar',
    kata: ['Aku Akar, si kucing √ 🐱', '√25 = 5, meong! ✨', 'Jangan lupa tarik akarnya ya 💕'],
    gambar: (
      <>
        {/* ekor berujung hati */}
        <path d="M80 108 Q104 100 98 80" fill="none" stroke={GARIS} strokeWidth="7" strokeLinecap="round" />
        <path d="M80 108 Q104 100 98 80" fill="none" stroke="#ffc2df" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M98 82 C92 76 94 70 98 71 C102 70 104 76 98 82 Z" fill="#f58bbd" stroke={GARIS} strokeWidth="1.6" />
        <path
          d="M30 52 L30 22 L50 40 Z M90 52 L90 22 L70 40 Z"
          fill="#ffc2df"
          stroke={GARIS}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M34 44 L34 30 L44 40 Z M86 44 L86 30 L76 40 Z" fill="#ffb3d1" />
        <ellipse cx="60" cy="100" rx="22" ry="20" fill="#ffc2df" stroke={GARIS} strokeWidth="2.6" />
        <ellipse cx="60" cy="66" rx="34" ry="28" fill="#ffc2df" stroke={GARIS} strokeWidth="2.6" />
        {/* kalung bintang */}
        <path d="M40 90 Q60 98 80 90" fill="none" stroke="#8fd0ff" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M60 92 L62 97 L67 97.5 L63 100.5 L64.5 105 L60 102.5 L55.5 105 L57 100.5 L53 97.5 L58 97 Z"
          fill="#fff1a8"
          stroke="#d99a2b"
          strokeWidth="1.2"
        />
        <path d="M30 68 H40 M30 74 H40 M80 68 H90 M80 74 H90" stroke={GARIS} strokeWidth="1.6" strokeLinecap="round" />
        <Wajah x={60} y={66} mulut="w" />
        <Pita x={38} y={40} warna="#8fd0ff" putar={20} besar={0.85} />
        <Papan x={60} y={106} teks="√" warna="#b5ddff" warnaTeks="#2f6fb3" />
      </>
    ),
  },
]

// senyap: jumlah klik Siku/Raka/Nisa (hanya bertambah); begitu berganti (mereka diklik), balon sahabat ditutup agar tidak bertumpuk
export function TemanKawaii({ diam = false, senyap = 0 }) {
  const [bicara, setBicara] = useState(null) // { id, teks, n }
  const [hitung, setHitung] = useState({})

  useEffect(() => {
    if (!bicara) return undefined
    const t = setTimeout(() => setBicara(null), 2400)
    return () => clearTimeout(t)
  }, [bicara])

  return (
    <div className="teman-kawaii">
      {TEMAN.map((t, i) => (
        <button
          key={t.id}
          type="button"
          className={`teman-tombol t${i} ${bicara?.id === t.id && bicara.senyap === senyap ? 'girang' : ''}`}
          disabled={diam}
          aria-label={`${t.nama}, sahabat Pythagoras`}
          onClick={() => {
            const n = hitung[t.id] ?? 0
            setBicara({ id: t.id, teks: t.kata[n % t.kata.length], n: Date.now(), senyap })
            setHitung({ ...hitung, [t.id]: n + 1 })
          }}
        >
          {bicara?.id === t.id && bicara.senyap === senyap && (
            // kunci berbeda dari kunci gambar di bawahnya: kunci kembar membuat balon lama tertinggal & menumpuk
            <span className="teman-ucap" key={`ucap-${bicara.n}`} role="status">
              {bicara.teks}
            </span>
          )}
          <svg viewBox="16 0 92 128" key={bicara?.id === t.id ? `gambar-${bicara.n}` : t.id} aria-hidden="true">
            {t.gambar}
          </svg>
          <span className="teman-nama">{t.nama}</span>
        </button>
      ))}
    </div>
  )
}

export function LantaiAwan() {
  return (
    <>
      <div className="rumput-hero lantai-awan" aria-hidden="true" />
      <svg className="hias-awan" viewBox="0 0 140 40" aria-hidden="true">
        {[
          [14, '#f58bbd'],
          [36, '#7cc3ff'],
        ].map(([x, warna]) => (
          <g key={x} className="bunga-awan">
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cx={x} cy={22} rx="4.5" ry="7" fill={warna} transform={`rotate(${r} ${x} 28)`} />
            ))}
            <circle cx={x} cy="28" r="3.6" fill="#fff1a8" />
          </g>
        ))}
        <path
          d="M104 6 L109 18 L122 18 L112 26 L116 38 L104 31 L92 38 L96 26 L86 18 L99 18 Z"
          fill="#fff1a8"
          stroke={GARIS}
          strokeWidth="2"
          strokeLinejoin="round"
          className="bintang-emas"
        />
        <circle cx="100.5" cy="22" r="1.8" fill={GARIS} />
        <circle cx="107.5" cy="22" r="1.8" fill={GARIS} />
        <path d="M101 27 Q104 30 107 27" fill="none" stroke={GARIS} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </>
  )
}

const WARNA_BENDERA = ['#ff8fc4', '#7cc3ff', '#ffe27a', '#c4b5fd', '#b8f0d0']

// untaian bendera segitiga di tepi atas header, melengkung ke bawah di tengah & bergoyang pelan
function BenderaPesta() {
  return (
    <svg className="kawaii-bendera" viewBox="0 0 900 56" preserveAspectRatio="none">
      <path d="M0 6 Q450 46 900 6" fill="none" stroke={GARIS} strokeWidth="2.2" />
      {Array.from({ length: 17 }, (_, i) => {
        const x = 25 + i * 53
        const y = 6 + 20 * (1 - ((x - 450) / 450) ** 2)
        return (
          <path
            key={x}
            className="bendera-satu"
            style={{ animationDelay: `${(i % 5) * -0.4}s` }}
            d={`M${x - 15} ${y} L${x + 15} ${y} L${x} ${y + 26} Z`}
            fill={WARNA_BENDERA[i % WARNA_BENDERA.length]}
            stroke={GARIS}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        )
      })}
    </svg>
  )
}

const WARNA_PELANGI = ['#ff9fcb', '#ffd59a', '#fff1a8', '#b8f0d0', '#9fd6ff', '#cdb8ff']

// awan berwajah di ujung pelangi (mata berkedip, pipi merona)
function AwanWajah({ x, y }) {
  return (
    <g className="awan-wajah" style={{ transformOrigin: `${x}px ${y}px` }}>
      {[
        [-34, 0, 26],
        [0, -14, 34],
        [34, 0, 26],
      ].map(([dx, dy, r]) => (
        <circle key={dx} cx={x + dx} cy={y + dy} r={r} fill="#fff" stroke={GARIS} strokeWidth="3" />
      ))}
      {[
        [-34, 0, 24],
        [0, -14, 32],
        [34, 0, 24],
      ].map(([dx, dy, r]) => (
        <circle key={`i${dx}`} cx={x + dx} cy={y + dy} r={r} className="awan-isi" />
      ))}
      <g className="awan-mata">
        <ellipse cx={x - 9} cy={y - 14} rx="3.4" ry="4.4" fill="#3b2f55" />
        <ellipse cx={x + 9} cy={y - 14} rx="3.4" ry="4.4" fill="#3b2f55" />
      </g>
      <ellipse cx={x - 19} cy={y - 5} rx="5" ry="3" fill={PIPI} />
      <ellipse cx={x + 19} cy={y - 5} rx="5" ry="3" fill={PIPI} />
      <path d={`M${x - 5} ${y - 6} q5 5 10 0`} fill="none" stroke="#3b2f55" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  )
}

// pelangi pastel enam warna yang kedua ujungnya awan berwajah lucu, di belakang panggung para sahabat
export function PelangiAwan() {
  const lebar = 600
  const tebal = 20
  const r0 = lebar / 2 - 30
  const tinggi = r0 + 30
  const busur = (r) => `M${lebar / 2 - r} ${tinggi} A${r} ${r} 0 0 1 ${lebar / 2 + r} ${tinggi}`
  return (
    <svg className="pelangi-awan" viewBox={`0 0 ${lebar} ${tinggi}`} aria-hidden="true">
      <g className="pelangi-busur">
        {WARNA_PELANGI.map((w, i) => (
          <path key={w} d={busur(r0 - i * tebal)} fill="none" stroke={w} strokeWidth={tebal + 0.5} />
        ))}
        <path d={busur(r0 + tebal / 2)} fill="none" stroke={GARIS} strokeWidth="3" />
      </g>
      <AwanWajah x={tebal * 2.6} y={tinggi - 18} />
      <AwanWajah x={lebar - tebal * 2.6} y={tinggi - 18} />
    </svg>
  )
}

// panggung awan untuk keempat sahabat & papan ajakan di depannya
export function PanggungAwan() {
  return (
    <>
      <div className="panggung-awan" aria-hidden="true" />
      <p className="papan-ajak" aria-hidden="true">
        Ayo belajar bareng! 💖
      </p>
    </>
  )
}

// Gambar satu sahabat kawaii (dipakai juga di layar perayaan jawaban benar & pesan semangat)
export function SahabatSvg({ id, className = '' }) {
  const t = TEMAN.find((x) => x.id === id) ?? TEMAN[0]
  return (
    <svg className={className} viewBox="16 0 92 128" aria-hidden="true">
      {t.gambar}
    </svg>
  )
}
