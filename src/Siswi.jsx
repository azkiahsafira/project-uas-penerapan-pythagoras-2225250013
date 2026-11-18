// Nisa: siswi SMP bergaya chibi yang memakai hoodie kucing pink muda bertelinga, dengan kerudung putih
// di balik tudungnya, rok panjang biru dongker, memegang pensil, dan melambaikan tangan.
// Memakai kelas "siswa" yang sama dengan Raka agar animasi dasarnya (bernapas, berkedip, melambai,
// melompat) ikut terpakai; tambahannya ada di bagian "Karakter siswi" di App.css.

const GARIS = '#6b5a8e'
const HOODIE = '#ffc2df'
const KULIT = '#ffe0c7'

function Lengan({ d }) {
  return (
    <>
      <path d={d} fill="none" stroke={GARIS} strokeWidth="14" strokeLinecap="round" />
      <path d={d} fill="none" stroke={HOODIE} strokeWidth="10" strokeLinecap="round" />
    </>
  )
}

// lirik: { x, y } antara -1 dan 1, arah bola mata melirik (mengikuti kursor)
export default function Siswi({ ukuran = 120, lirik = null }) {
  const geser = lirik ? `translate(${(lirik.x * 2.2).toFixed(2)} ${(lirik.y * 1.8).toFixed(2)})` : undefined
  return (
    <svg className="siswa siswi" viewBox="0 0 120 190" width={ukuran} height={(ukuran * 190) / 120} role="img" aria-label="Nisa berhoodie kucing melambaikan tangan">
      <ellipse className="s-bayang" cx="60" cy="184" rx="28" ry="4.5" />

      {/* bintang & hati kecil bergantian di atas kepala */}
      <g className="s-hati">
        <path className="h1" d="M104 24 l2.4 5 5.4 .7 -4 3.7 1.1 5.4 -4.9 -2.7 -4.9 2.7 1.1 -5.4 -4 -3.7 5.4 -.7z" />
        <path className="h2" d="M14 30 c-2 -3.5 -7 -2 -6.4 2 c0.6 3 6.4 6.4 6.4 6.4 s5.8 -3.4 6.4 -6.4 c0.6 -4 -4.4 -5.5 -6.4 -2z" />
      </g>

      <g className="s-badan">
        {/* sepatu mengintip dari bawah rok */}
        <ellipse cx="51" cy="170" rx="10" ry="5.5" fill="#fff" stroke={GARIS} strokeWidth="2" />
        <ellipse cx="69" cy="170" rx="10" ry="5.5" fill="#fff" stroke={GARIS} strokeWidth="2" />
        <path d="M44 169 h8 M62 169 h8" stroke="#7cc3ff" strokeWidth="2" strokeLinecap="round" />

        {/* rok panjang */}
        <path d="M40 120 H80 L87 168 H33 Z" fill="#3d5a9e" stroke={GARIS} strokeWidth="2" strokeLinejoin="round" />
        <path className="s-lipit" d="M52 124 L49 166 M68 124 L71 166" />

        {/* badan hoodie dengan hati di dada */}
        <path d="M38 92 Q60 84 82 92 L86 128 Q60 134 34 128 Z" fill={HOODIE} stroke={GARIS} strokeWidth="2.4" strokeLinejoin="round" />
        <path
          d="M60 122 C49 113 51 105 56 105 C59 105 60 108 60 108 C60 108 61 105 64 105 C69 105 71 113 60 122 Z"
          fill="#ff8fc4"
          stroke={GARIS}
          strokeWidth="1.5"
        />

        {/* lengan kiri memegang pensil */}
        <Lengan d="M43 98 Q33 106 35 118" />
        <g className="s-pensil">
          <rect x="22" y="104" width="6" height="24" rx="1.5" transform="rotate(-18 25 116)" />
          <path className="s-pensil-ujung" d="M30.5 128.8 L27.8 136 L25 128" transform="rotate(-18 25 116)" />
        </g>
        <circle cx="37" cy="120" r="5.5" fill={KULIT} stroke={GARIS} strokeWidth="1.6" />

        {/* lengan kanan melambai */}
        <g className="s-lambai">
          <Lengan d="M78 98 Q91 86 95 72" />
          <circle cx="96" cy="67" r="6.5" fill={KULIT} stroke={GARIS} strokeWidth="1.6" />
        </g>

        {/* kepala: tudung kucing, kerudung putih di dalamnya */}
        <g className="s-kepala">
          <path d="M23 46 L26 8 L51 26 Z M97 46 L94 8 L69 26 Z" fill={HOODIE} stroke={GARIS} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M30 36 L32 19 L43 27 Z M90 36 L88 19 L77 27 Z" fill="#ff8fc4" />
          <circle cx="60" cy="58" r="38" fill={HOODIE} stroke={GARIS} strokeWidth="2.6" />
          <circle cx="60" cy="63" r="31" fill="#fff" stroke={GARIS} strokeWidth="1.6" />
          <ellipse cx="60" cy="64" rx="25" ry="26" fill={KULIT} />
          <path d="M84 24 l11 -7 v14 z M84 24 l-11 -7 v14 z" fill="#7cc3ff" stroke={GARIS} strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="84" cy="24" r="3.4" fill="#d9efff" stroke={GARIS} strokeWidth="1.2" />
          <g className="s-mata">
            <g transform={geser}>
              <ellipse cx="50" cy="65" rx="4.6" ry="5.8" />
              <ellipse cx="70" cy="65" rx="4.6" ry="5.8" />
              <circle className="s-kilap" cx="51.5" cy="62.6" r="1.7" />
              <circle className="s-kilap" cx="71.5" cy="62.6" r="1.7" />
              <circle className="s-kilap" cx="48.8" cy="67.4" r="0.85" />
              <circle className="s-kilap" cx="68.8" cy="67.4" r="0.85" />
            </g>
          </g>
          <path className="s-bulu-mata" d="M44.5 60.5 L42.5 58.5 M75.5 60.5 L77.5 58.5" />
          <ellipse className="s-pipi" cx="42.5" cy="74" rx="5" ry="3" />
          <ellipse className="s-pipi" cx="77.5" cy="74" rx="5" ry="3" />
          <path className="s-mulut" d="M54.5 74 Q60 81.5 65.5 74 Z" />
          <path className="s-lidah" d="M57.2 78 Q60 80.6 62.8 78" />
        </g>
      </g>
    </svg>
  )
}
