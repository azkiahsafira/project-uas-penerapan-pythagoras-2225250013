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
