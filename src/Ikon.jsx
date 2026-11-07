// Ikon garis sederhana (24x24) untuk menu. Warna mengikuti teks (currentColor).
const PATH = {
  belajar: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  kalkulator: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </>
  ),
  latihan: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </>
  ),
  tes: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
}

export default function Ikon({ nama }) {
  return (
    <svg
      className="ikon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATH[nama]}
    </svg>
  )
}

// Hiasan header: segitiga 3-4-5 dengan persegi di tiap sisinya.
export function HiasanPythagoras() {
  const s = 14
  const x0 = 4 * s + 8
  const y0 = 7 * s + 8
  const titik = (p) => p.map((q) => q.join(',')).join(' ')
  const O = [x0, y0]
  const A = [x0 + 3 * s, y0]
  const B = [x0, y0 - 4 * s]
  return (
    <svg className="hiasan" viewBox={`0 0 ${11 * s + 16} ${10 * s + 16}`} aria-hidden="true">
      <polygon points={titik([O, A, [A[0], y0 + 3 * s], [x0, y0 + 3 * s]])} className="h-persegi h1" />
      <polygon points={titik([O, B, [x0 - 4 * s, B[1]], [x0 - 4 * s, y0]])} className="h-persegi h2" />
      <polygon points={titik([A, B, [B[0] + 4 * s, B[1] - 3 * s], [A[0] + 4 * s, A[1] - 3 * s]])} className="h-persegi h3" />
      <polygon points={titik([O, A, B])} className="h-segitiga" />
      <text x={x0 + 1.5 * s} y={y0 + 1.8 * s} textAnchor="middle">9</text>
      <text x={x0 - 2 * s} y={y0 - 1.8 * s} textAnchor="middle">16</text>
      <text x={x0 + 3.5 * s} y={y0 - 3.2 * s} textAnchor="middle">25</text>
    </svg>
  )
}
