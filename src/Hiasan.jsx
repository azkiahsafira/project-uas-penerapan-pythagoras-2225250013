// Hiasan animasi yang lucu: latar header (simbol matematika melayang & awan
// berwajah) dan konfeti untuk merayakan jawaban benar.
// Semua gerakan memakai CSS (bagian "Hiasan" di App.css) dan otomatis mati
// saat tes, saat tombol animasi dimatikan, atau saat perangkat meminta gerak dikurangi.

// Simbol yang melayang naik di header. Posisi & waktu dibuat tetap (bukan acak)
// agar tampilan sama setiap kali dibuka.
const SIMBOL = [
  { t: 'a²', x: 6, tunda: 0, lama: 11, besar: 18 },
  { t: '+', x: 16, tunda: 4, lama: 9, besar: 22 },
  { t: '★', x: 27, tunda: 1.5, lama: 10, besar: 14 },
  { t: 'b²', x: 37, tunda: 6, lama: 12, besar: 17 },
  { t: '=', x: 47, tunda: 2.5, lama: 9.5, besar: 20 },
  { t: '△', x: 57, tunda: 7.5, lama: 11, besar: 18 },
  { t: 'c²', x: 66, tunda: 3.5, lama: 10.5, besar: 19 },
  { t: '√', x: 75, tunda: 9, lama: 12, besar: 21 },
  { t: '★', x: 84, tunda: 5, lama: 9, besar: 12 },
  { t: '○', x: 92, tunda: 0.8, lama: 10, besar: 16 },
]

function Awan({ className }) {
  return (
    <svg className={`awan ${className}`} viewBox="0 0 120 60" aria-hidden="true">
      <path d="M22 50 Q4 50 6 36 Q8 24 22 26 Q24 10 42 10 Q56 10 60 22 Q66 14 78 16 Q94 18 94 32 Q112 32 112 42 Q112 50 98 50 Z" />
      <path className="awan-mata" d="M44 34 Q47 31 50 34 M66 34 Q69 31 72 34" />
      <path className="awan-mulut" d="M54 39 Q58 43 62 39" />
      <ellipse className="awan-pipi" cx="40" cy="40" rx="4" ry="2.2" />
      <ellipse className="awan-pipi" cx="76" cy="40" rx="4" ry="2.2" />
    </svg>
  )
}

export function LatarHeader() {
  return (
    <div className="latar" aria-hidden="true">
      <Awan className="awan-1" />
      <Awan className="awan-2" />
      <Burung />
      {SIMBOL.map((s, i) => (
        <span
          key={i}
          className="simbol"
          style={{
            left: `${s.x}%`,
            fontSize: s.besar,
            animationDelay: `${s.tunda}s`,
            animationDuration: `${s.lama}s`,
          }}
        >
          {s.t}
        </span>
      ))}
    </div>
  )
}

const WARNA_KONFETI = ['#2563eb', '#06b6d4', '#f59e0b', '#f472b6', '#22c55e', '#a78bfa']

// Konfeti yang meletup dari tengah elemen induknya lalu memudar (sekali saja).
// Pasang dengan key baru setiap kali ingin meletup lagi.
export function Konfeti({ jumlah = 26 }) {
  return (
    <div className="konfeti" aria-hidden="true">
      {Array.from({ length: jumlah }, (_, i) => {
        const sudut = (i / jumlah) * Math.PI * 2
        const jarak = 55 + ((i * 37) % 45)
        return (
          <i
            key={i}
            style={{
              '--x': `${Math.cos(sudut) * jarak}px`,
              '--y': `${Math.sin(sudut) * jarak - 25}px`,
              '--r': `${(i * 97) % 360}deg`,
              background: WARNA_KONFETI[i % WARNA_KONFETI.length],
              animationDelay: `${(i % 5) * 0.03}s`,
              borderRadius: i % 3 === 0 ? '50%' : '2px',
            }}
          />
        )
      })}
    </div>
  )
}

// Burung kecil yang sesekali terbang melintasi header sambil mengepakkan sayap
export function Burung() {
  return (
    <div className="burung-jalur" aria-hidden="true">
      <svg className="burung" viewBox="0 0 60 40">
        <path className="b-sayap-belakang" d="M30 20 Q22 4 12 10 Q22 14 26 22 Z" />
        <ellipse className="b-badan" cx="30" cy="24" rx="14" ry="10" />
        <circle className="b-kepala" cx="42" cy="18" r="7" />
        <path className="b-paruh" d="M48 17 L55 19 L48 21 Z" />
        <circle className="b-mata" cx="44" cy="16.5" r="1.4" />
        <ellipse className="b-pipi" cx="43" cy="21" rx="2" ry="1.2" />
        <path className="b-ekor" d="M17 22 L6 18 L9 26 Z" />
        <path className="b-sayap" d="M30 22 Q22 6 10 12 Q20 16 24 26 Z" />
      </svg>
    </div>
  )
}

// Kucing yang duduk di bawah halaman: berkedip, ekornya bergoyang,
// dan mengeong saat diklik.
export function Kucing({ onKlik, mengeong }) {
  return (
    <button type="button" className={`kucing-tombol ${mengeong ? 'mengeong' : ''}`} onClick={onKlik} aria-label="Elus kucing">
      {mengeong && <span className="meong">Meong! 🐾</span>}
      <svg className="kucing" viewBox="0 0 90 70" aria-hidden="true">
        <path className="k-ekor" d="M62 56 Q84 54 80 34 Q78 26 72 30" />
        <ellipse className="k-badan" cx="46" cy="52" rx="22" ry="15" />
        <g className="k-kepala">
          <path className="k-telinga" d="M22 22 L25 6 L35 17 Z M48 17 L58 6 L60 22 Z" />
          <path className="k-telinga-dalam" d="M25.5 18 L27 10 L32 16 Z M51 16 L56 10 L57.5 18 Z" />
          <ellipse className="k-wajah" cx="41" cy="28" rx="21" ry="17" />
          <g className="k-mata">
            {mengeong ? (
              <path d="M30 27 Q33 23 36 27 M46 27 Q49 23 52 27" className="k-mata-senang" />
            ) : (
              <>
                <ellipse cx="33" cy="27" rx="3" ry="3.8" />
                <ellipse cx="49" cy="27" rx="3" ry="3.8" />
              </>
            )}
          </g>
          <path className="k-hidung" d="M39.5 32 H42.5 L41 34 Z" />
          <path className="k-mulut" d={mengeong ? 'M37 35 Q41 41 45 35 Z' : 'M37 35 Q39 37.5 41 35 Q43 37.5 45 35'} />
          <path className="k-kumis" d="M18 31 H28 M18 35 L28 34 M54 34 L64 35 M54 31 H64" />
          <ellipse className="k-pipi" cx="28" cy="34" rx="3" ry="1.8" />
          <ellipse className="k-pipi" cx="54" cy="34" rx="3" ry="1.8" />
        </g>
        <ellipse className="k-kaki" cx="36" cy="65" rx="6" ry="3.5" />
        <ellipse className="k-kaki" cx="54" cy="65" rx="6" ry="3.5" />
      </svg>
    </button>
  )
}

// Ilustrasi kecil beranimasi untuk tiap kartu sesi
export function IlustrasiSesi({ nomor }) {
  if (nomor === 1) {
    // segitiga mengintip & berkedip
    return (
      <svg className="ilustrasi il-1" viewBox="0 0 64 64" aria-hidden="true">
        <path className="il-tubuh" d="M14 12 L54 52 L14 52 Z" />
        <path className="il-siku" d="M14 45 H21 V52" />
        <g className="il-mata">
          <circle cx="24" cy="40" r="2.6" />
          <circle cx="33" cy="40" r="2.6" />
        </g>
        <path className="il-mulut" d="M25 45 Q28.5 48.5 32 45" />
      </svg>
    )
  }
  if (nomor === 2) {
    // persegi 9, 16, 25 yang berdenyut bergantian
    return (
      <svg className="ilustrasi il-2" viewBox="0 0 64 64" aria-hidden="true">
        <rect className="il-k k1" x="3" y="42" width="12" height="12" rx="2.5" />
        <rect className="il-k k2" x="18" y="34" width="16" height="16" rx="3" />
        <rect className="il-k k3" x="38" y="22" width="22" height="22" rx="3.5" />
        <text x="9" y="51" textAnchor="middle">9</text>
        <text x="26" y="45" textAnchor="middle">16</text>
        <text x="49" y="36.5" textAnchor="middle">25</text>
      </svg>
    )
  }
  // layang-layang terbang dengan ekor berkibar
  return (
    <svg className="ilustrasi il-3" viewBox="0 0 64 64" aria-hidden="true">
      <path className="il-benang" d="M8 60 Q26 46 38 28" />
      <g className="il-layang">
        <path className="il-kite" d="M38 6 L50 20 L38 34 L26 20 Z" />
        <path className="il-kite-garis" d="M38 6 V34 M26 20 H50" />
        <path className="il-ekor" d="M38 34 Q34 40 38 44 Q42 48 38 54" />
      </g>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Latar seluruh halaman: gumpalan warna lembut, bentuk kecil yang melayang naik,
// dan bintang berkelip. Diletakkan di belakang semua isi (tidak bisa diklik).
// ---------------------------------------------------------------------------
const BENTUK = {
  segitiga: <path d="M4 20 L20 20 L4 4 Z" />,
  lingkaran: <circle cx="12" cy="12" r="8" />,
  bintang: <path d="M12 2 l2.9 6.2 6.8 .8 -5 4.6 1.4 6.7 -6.1 -3.4 -6.1 3.4 1.4 -6.7 -5 -4.6 6.8 -.8z" />,
  hati: <path d="M12 21 C5 15 2 12 2 8.2 2 5.3 4.3 3 7.1 3 9 3 10.8 4 12 5.6 13.2 4 15 3 16.9 3 19.7 3 22 5.3 22 8.2 22 12 19 15 12 21z" />,
  plus: <path d="M10 3 h4 v7 h7 v4 h-7 v7 h-4 v-7 h-7 v-4 h7z" />,
}

// [bentuk, posisi kiri (%), ukuran (px), lama (detik), tunda (detik), warna]
const MELAYANG = [
  // sisi kiri
  ['segitiga', 1, 34, 24, 0, 'biru'],
  ['hati', 5, 26, 20, 7, 'pink'],
  ['bintang', 9, 30, 26, 14, 'pink'],
  ['lingkaran', 3, 20, 22, 18, 'biru'],
  ['plus', 12, 24, 28, 4, 'biru'],
  ['hati', 7, 22, 25, 11, 'pink'],
  // tengah (sebagian tertutup kartu, terlihat di sela-sela)
  ['segitiga', 30, 28, 30, 9, 'pink'],
  ['bintang', 50, 24, 27, 2, 'biru'],
  ['hati', 68, 26, 29, 16, 'pink'],
  // sisi kanan
  ['segitiga', 96, 36, 25, 5, 'pink'],
  ['hati', 91, 28, 21, 12, 'pink'],
  ['bintang', 87, 30, 27, 1, 'biru'],
  ['lingkaran', 94, 22, 23, 16, 'pink'],
  ['plus', 89, 24, 29, 8, 'biru'],
  ['segitiga', 84, 26, 26, 19, 'biru'],
  ['hati', 98, 20, 22, 3, 'pink'],
]

// bintang kecil berkelip: [kiri %, atas %, tunda detik]
const KELIP = [
  [3, 22, 0], [8, 48, 1.2], [5, 72, 2.1], [12, 90, 0.6], [10, 12, 2.8],
  [95, 18, 0.3], [90, 42, 1.8], [97, 64, 2.6], [88, 86, 1.5], [93, 8, 3.1],
  [50, 96, 2.4], [30, 6, 0.9], [70, 4, 1.9],
]

export function LatarHalaman() {
  return (
    <div className="latar-halaman" aria-hidden="true">
      <div className="gumpal g1" />
      <div className="gumpal g2" />
      <div className="gumpal g3" />
      {MELAYANG.map(([b, x, ukuran, lama, tunda, warna], i) => (
        <span
          key={`m${i}`}
          className={`melayang ${warna}`}
          style={{ left: `${x}%`, animationDuration: `${lama}s`, animationDelay: `-${tunda}s` }}
        >
          <svg viewBox="0 0 24 24" width={ukuran} height={ukuran} style={{ animationDelay: `-${tunda / 2}s` }}>
            {BENTUK[b]}
          </svg>
        </span>
      ))}
      {KELIP.map(([x, y, tunda], i) => (
        <span key={`k${i}`} className="kelip" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${tunda}s` }}>
          ✦
        </span>
      ))}
    </div>
  )
}
