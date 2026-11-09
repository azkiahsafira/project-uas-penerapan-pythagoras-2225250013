import { bulat } from './pythagoras.js'

// Segitiga siku-siku dengan posisi diputar/dicerminkan (temuan IL1: siswa tertukar
// menentukan sisi miring bila segitiga tidak dalam posisi biasa).
// - mode tunjuk (onPilih ada): sisi bisa diketuk, label panjang disembunyikan
// - setelah itu: label a, b, c tampil seperti gambar biasa (biru = diketahui, merah muda = dicari)
export default function SegitigaPutar({ sisi, cari, orientasi, onPilih, pilihan, sembunyikan = false, tampilLabel = true }) {
  const W = 300
  const H = 240
  const pad = 44
  // perbandingan sisi dibatasi agar segitiga yang sangat pipih tetap mudah diketuk
  const rasio = Math.min(Math.max(sisi.b / sisi.a, 0.4), 2.5)
  const sudut = (orientasi.sudut * Math.PI) / 180
  const ubah = ([x, y]) => {
    const xc = orientasi.cermin ? -x : x
    return [xc * Math.cos(sudut) - y * Math.sin(sudut), xc * Math.sin(sudut) + y * Math.cos(sudut)]
  }
  // titik dasar: O = sudut siku-siku, A di ujung sisi a, B di ujung sisi b (sumbu y SVG ke bawah)
  const mentah = [ubah([0, 0]), ubah([1, 0]), ubah([0, -rasio])]
  const xs = mentah.map((p) => p[0])
  const ys = mentah.map((p) => p[1])
  const skala = Math.min((W - pad * 2) / (Math.max(...xs) - Math.min(...xs)), (H - pad * 2) / (Math.max(...ys) - Math.min(...ys)))
  const geserX = (W - (Math.max(...xs) - Math.min(...xs)) * skala) / 2 - Math.min(...xs) * skala
  const geserY = (H - (Math.max(...ys) - Math.min(...ys)) * skala) / 2 - Math.min(...ys) * skala
  const [O, A, B] = mentah.map(([x, y]) => [x * skala + geserX, y * skala + geserY])
  const pusat = [(O[0] + A[0] + B[0]) / 3, (O[1] + A[1] + B[1]) / 3]

  const garis = { a: [O, A], b: [O, B], c: [A, B] }

  // penanda sudut siku-siku: persegi kecil di O searah sisi a dan b
  const satuan = (p) => {
    const d = Math.hypot(p[0] - O[0], p[1] - O[1])
    return [(p[0] - O[0]) / d, (p[1] - O[1]) / d]
  }
  const ua = satuan(A)
  const ub = satuan(B)
  const s = 14
  const siku = [
    [O[0] + ua[0] * s, O[1] + ua[1] * s],
    [O[0] + (ua[0] + ub[0]) * s, O[1] + (ua[1] + ub[1]) * s],
    [O[0] + ub[0] * s, O[1] + ub[1] * s],
  ]

  // label di luar segitiga: titik tengah sisi digeser menjauhi titik berat
  const posisiLabel = (k) => {
    const [p, q] = garis[k]
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
    const d = [m[0] - pusat[0], m[1] - pusat[1]]
    const pj = Math.hypot(...d) || 1
    return [m[0] + (d[0] / pj) * 22, m[1] + (d[1] / pj) * 22]
  }
  const label = (k) => {
    if (sembunyikan && k === cari) return `${k} = ?`
    return `${k} = ${bulat(sisi[k])}`
  }
  const kelas = (k) => {
    if (onPilih) return `sisi ${pilihan?.salah?.includes(k) ? 'keliru' : ''}`
    // sebelum langkah 1-2 selesai, sisi yang dicari belum diwarnai agar tidak membocorkan jawaban "Ditanya"
    if (!tampilLabel) return 'sisi'
    if (k === cari) return 'sisi dicari'
    return `sisi ${pilihan?.benar === k ? 'miring-ketemu' : ''}`
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`segitiga segitiga-putar ${onPilih ? 'bisa-tunjuk' : ''}`}
      role="img"
      aria-label={onPilih ? 'Segitiga siku-siku yang diputar. Ketuk sisi miringnya.' : 'Gambar segitiga siku-siku'}
    >
      <polygon points={[O, A, B].map((p) => p.join(',')).join(' ')} className="bidang" />
      {Object.entries(garis).map(([k, [p, q]]) => (
        <line key={k} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} className={kelas(k)} />
      ))}
      <polygon points={[O, ...siku].map((p) => p.join(',')).join(' ')} className="siku" />
      {tampilLabel &&
        !onPilih &&
        ['a', 'b', 'c'].map((k) => {
          const [x, y] = posisiLabel(k)
          return (
            <text key={k} x={x} y={y} textAnchor="middle" dominantBaseline="middle">
              {label(k)}
            </text>
          )
        })}
      {/* area ketuk yang lebar di atas setiap sisi (mudah diketuk jari di HP) */}
      {onPilih &&
        Object.entries(garis).map(([k, [p, q]]) => (
          <line
            key={`ketuk-${k}`}
            x1={p[0]}
            y1={p[1]}
            x2={q[0]}
            y2={q[1]}
            className="area-ketuk"
            role="button"
            tabIndex={0}
            aria-label={`Sisi ${['a', 'b', 'c'].indexOf(k) + 1}`}
            onClick={() => onPilih(k)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onPilih(k)
              }
            }}
          />
        ))}
    </svg>
  )
}
