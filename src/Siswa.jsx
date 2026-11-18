// Raka: anak SMP bergaya chibi yang memakai hoodie dinosaurus biru muda (duri pink & ekor kecil),
// memegang buku a², dan melambaikan tangan.
// Digambar dengan SVG, dianimasikan dengan CSS (bagian "Karakter siswa" di App.css): kelompok
// s-badan/s-kepala/s-mata/s-lambai/s-hati menentukan gerak bernapas, menggeleng, berkedip, dan melambai.

const GARIS = '#6b5a8e'
const HOODIE = '#8fcaff'
const HOODIE_MUDA = '#bfe3ff'
const KULIT = '#ffe0c7'

// lengan berupa lengan hoodie: garis tepi tebal lalu isi warna hoodie
function Lengan({ d }) {
  return (
    <>
      <path d={d} fill="none" stroke={GARIS} strokeWidth="14" strokeLinecap="round" />
      <path d={d} fill="none" stroke={HOODIE} strokeWidth="10" strokeLinecap="round" />
    </>
  )
}

// lirik: { x, y } antara -1 dan 1, arah bola mata melirik (mengikuti kursor)
export default function Siswa({ ukuran = 120, lirik = null }) {
  const geser = lirik ? `translate(${(lirik.x * 2.2).toFixed(2)} ${(lirik.y * 1.8).toFixed(2)})` : undefined
  return (
    <svg className="siswa" viewBox="0 0 120 190" width={ukuran} height={(ukuran * 190) / 120} role="img" aria-label="Raka berhoodie dinosaurus melambaikan tangan">
      <ellipse className="s-bayang" cx="60" cy="184" rx="28" ry="4.5" />

      {/* hati kecil yang muncul bergantian di atas kepala */}
      <g className="s-hati">
        <path className="h1" d="M100 30 c-3 -5 -10 -3 -9 3 c1 4 9 9 9 9 s8 -5 9 -9 c1 -6 -6 -8 -9 -3z" />
        <path className="h2" d="M18 22 c-2 -3.5 -7 -2 -6.4 2 c0.6 3 6.4 6.4 6.4 6.4 s5.8 -3.4 6.4 -6.4 c0.6 -4 -4.4 -5.5 -6.4 -2z" />
      </g>

      <g className="s-badan">
        {/* kaki bercelana biru dongker & sepatu kets */}
        <rect x="46" y="130" width="12" height="36" rx="5" fill="#3d5a9e" stroke={GARIS} strokeWidth="2" />
        <rect x="62" y="130" width="12" height="36" rx="5" fill="#3d5a9e" stroke={GARIS} strokeWidth="2" />
        <ellipse cx="51" cy="168" rx="10" ry="5.5" fill="#fff" stroke={GARIS} strokeWidth="2" />
        <ellipse cx="69" cy="168" rx="10" ry="5.5" fill="#fff" stroke={GARIS} strokeWidth="2" />
        <path d="M44 167 h8 M62 167 h8" stroke="#ff8fc4" strokeWidth="2" strokeLinecap="round" />

        {/* ekor dino kecil */}
        <path d="M80 126 Q100 134 106 118 Q96 124 84 118 Z" fill={HOODIE} stroke={GARIS} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M94 124 l3 -6 l3 4 z" fill="#ff8fc4" stroke={GARIS} strokeWidth="1.2" strokeLinejoin="round" />

        {/* badan hoodie & kantong */}
        <path d="M38 92 Q60 84 82 92 L86 136 Q60 142 34 136 Z" fill={HOODIE} stroke={GARIS} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M46 116 H74 V126 Q60 131 46 126 Z" fill={HOODIE_MUDA} stroke={GARIS} strokeWidth="1.8" />
        <path d="M56 94 L55 106 M64 94 L65 106" stroke="#fff" strokeWidth="2" strokeLinecap="round" />

        {/* lengan kiri memegang buku */}
        <Lengan d="M43 98 Q33 106 35 118" />
        <g className="s-buku-grup">
          <rect x="19" y="104" width="19" height="24" rx="3.5" fill="#ff8fc4" stroke={GARIS} strokeWidth="1.8" />
          <path className="s-buku-garis" d="M23 111 H34 M23 116 H31" />
          <text className="s-buku-teks" x="28.5" y="125" textAnchor="middle">a²</text>
        </g>
        <circle cx="37" cy="120" r="5.5" fill={KULIT} stroke={GARIS} strokeWidth="1.6" />

        {/* lengan kanan melambai */}
        <g className="s-lambai">
          <Lengan d="M78 98 Q91 86 95 72" />
          <circle cx="96" cy="67" r="6.5" fill={KULIT} stroke={GARIS} strokeWidth="1.6" />
        </g>

        {/* kepala bertudung dino */}
        <g className="s-kepala">
          <path
            d="M41 28 L49 9 L57 23 Z M56 21 L64 3 L72 21 Z M71 23 L80 9 L85 30 Z"
            fill="#ff8fc4"
            stroke={GARIS}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="60" cy="58" r="38" fill={HOODIE} stroke={GARIS} strokeWidth="2.6" />
          <circle cx="60" cy="63" r="31" fill={HOODIE_MUDA} />
          <path d="M33 86 l4 -5 l4 5 l4 -5 l4 5 M71 86 l4 -5 l4 5 l4 -5 l4 5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="60" cy="63" r="27" fill={KULIT} stroke={GARIS} strokeWidth="1.8" />
          <path d="M33 60 Q35 38 60 37 Q85 38 87 60 Q76 47 67 51 Q59 43 49 51 Q41 47 33 60 Z" fill="#5b4033" />
          <g className="s-mata">
            <g transform={geser}>
              <ellipse cx="49" cy="65" rx="4.8" ry="6" />
              <ellipse cx="71" cy="65" rx="4.8" ry="6" />
              <circle className="s-kilap" cx="50.5" cy="62.5" r="1.8" />
              <circle className="s-kilap" cx="72.5" cy="62.5" r="1.8" />
              <circle className="s-kilap" cx="47.7" cy="67.5" r="0.9" />
              <circle className="s-kilap" cx="69.7" cy="67.5" r="0.9" />
            </g>
          </g>
          <ellipse className="s-pipi" cx="42" cy="75" rx="5" ry="3" />
          <ellipse className="s-pipi" cx="78" cy="75" rx="5" ry="3" />
          <path className="s-mulut" d="M54.5 74 Q60 81.5 65.5 74 Z" />
          <path className="s-lidah" d="M57.2 78 Q60 80.6 62.8 78" />
        </g>
      </g>
    </svg>
  )
}
