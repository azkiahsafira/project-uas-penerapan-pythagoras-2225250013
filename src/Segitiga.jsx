import { bulat } from './pythagoras.js'

// Gambar segitiga siku-siku. Sisi `cari` diberi warna;
// jika `sembunyikan` true, panjang sisi `cari` ditulis "?".
export default function Segitiga({ sisi, cari, sembunyikan = false }) {
  const W = 300
  const H = 220
  const pad = 40
  const padKiri = 70 // ruang untuk label sisi b
  const a = sisi?.a ?? 4
  const b = sisi?.b ?? 3
  const skala = Math.min((W - padKiri - pad) / a, (H - pad * 2) / b)
  const x0 = padKiri
  const y0 = H - pad
  const x1 = x0 + a * skala
  const y1 = y0 - b * skala
  const label = (k) => {
    if (!sisi) return k
    if (sembunyikan && k === cari) return `${k} = ?`
    return `${k} = ${bulat(sisi[k])}`
  }
  const kelas = (k) => (k === cari ? 'sisi dicari' : 'sisi')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="segitiga" role="img" aria-label="Gambar segitiga siku-siku">
      <polygon points={`${x0},${y0} ${x1},${y0} ${x0},${y1}`} className="bidang" />
      <line x1={x0} y1={y0} x2={x1} y2={y0} className={kelas('a')} />
      <line x1={x0} y1={y0} x2={x0} y2={y1} className={kelas('b')} />
      <line x1={x1} y1={y0} x2={x0} y2={y1} className={kelas('c')} />
      <rect x={x0} y={y0 - 12} width="12" height="12" className="siku" />
      <text x={(x0 + x1) / 2} y={y0 + 22} textAnchor="middle">{label('a')}</text>
      <text x={x0 - 8} y={(y0 + y1) / 2} textAnchor="end" dominantBaseline="middle">{label('b')}</text>
      <text x={(x0 + x1) / 2 + 10} y={(y0 + y1) / 2 - 10}>{label('c')}</text>
    </svg>
  )
}
