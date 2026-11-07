// Karakter siswi SMP bergaya chibi: berjilbab putih, kemeja putih, rok panjang
// biru dongker, memegang pensil, dan melambaikan tangan.
// Memakai kelas "siswa" yang sama dengan Raka agar warna & animasi dasarnya
// (bernapas, berkedip, melambai, melompat) ikut terpakai; tambahannya ada di
// bagian "Karakter siswi" di App.css.

// lirik: { x, y } antara -1 dan 1, arah bola mata melirik (mengikuti kursor)
export default function Siswi({ ukuran = 120, lirik = null }) {
  const geser = lirik ? `translate(${(lirik.x * 2.2).toFixed(2)} ${(lirik.y * 1.8).toFixed(2)})` : undefined
  return (
    <svg className="siswa siswi" viewBox="0 0 120 190" width={ukuran} height={(ukuran * 190) / 120} role="img" aria-label="Siswi SMP berjilbab melambaikan tangan">
      <ellipse className="s-bayang" cx="60" cy="184" rx="28" ry="4.5" />

      {/* bintang kecil bergantian di atas kepala */}
      <g className="s-hati">
        <path className="h1" d="M98 24 l2.4 5 5.4 .7 -4 3.7 1.1 5.4 -4.9 -2.7 -4.9 2.7 1.1 -5.4 -4 -3.7 5.4 -.7z" />
        <path className="h2" d="M22 30 c-2 -3.5 -7 -2 -6.4 2 c0.6 3 6.4 6.4 6.4 6.4 s5.8 -3.4 6.4 -6.4 c0.6 -4 -4.4 -5.5 -6.4 -2z" />
      </g>

      <g className="s-badan">
        {/* sepatu mengintip dari bawah rok */}
        <ellipse className="s-sepatu" cx="51" cy="170" rx="10" ry="5.5" />
        <ellipse className="s-sepatu" cx="69" cy="170" rx="10" ry="5.5" />
        <ellipse className="s-kilap-sepatu" cx="47" cy="168" rx="3" ry="1.4" />
        <ellipse className="s-kilap-sepatu" cx="65" cy="168" rx="3" ry="1.4" />

        {/* rok panjang */}
        <path className="s-dongker s-rok" d="M40 112 H80 L87 168 H33 Z" />
        <path className="s-lipit" d="M52 116 L49 166 M68 116 L71 166" />

        {/* lengan kiri memegang pensil */}
        <path className="s-lengan" d="M43 96 Q33 106 35 118" />
        <g className="s-pensil">
          <rect x="22" y="104" width="6" height="24" rx="1.5" transform="rotate(-18 25 116)" />
          <path className="s-pensil-ujung" d="M30.5 128.8 L27.8 136 L25 128" transform="rotate(-18 25 116)" />
        </g>
        <circle className="s-kulit" cx="37" cy="120" r="5.5" />

        {/* kemeja */}
        <rect className="s-kemeja" x="39" y="88" width="42" height="36" rx="14" />
        <rect className="s-lencana" x="67" y="104" width="8" height="6" rx="1.5" />

        {/* lengan kanan melambai */}
        <g className="s-lambai">
          <path className="s-lengan" d="M78 96 Q91 86 95 72" />
          <circle className="s-kulit" cx="96" cy="67" r="6.5" />
        </g>

        {/* kepala berjilbab */}
        <g className="s-kepala">
          <path className="s-jilbab" d="M27 62 Q25 21 60 21 Q95 21 93 62 Q95 90 82 103 L60 111 L38 103 Q25 90 27 62 Z" />
          <ellipse className="s-kulit" cx="60" cy="63" rx="22" ry="23" />
          <path className="s-jilbab-tepi" d="M37 54 Q60 34 83 54" />
          <circle className="s-bros" cx="60" cy="100" r="3.2" />
          <g className="s-mata">
            <g transform={geser}>
              <ellipse cx="50" cy="64" rx="4.6" ry="5.8" />
              <ellipse cx="70" cy="64" rx="4.6" ry="5.8" />
              <circle className="s-kilap" cx="51.5" cy="61.6" r="1.7" />
              <circle className="s-kilap" cx="71.5" cy="61.6" r="1.7" />
              <circle className="s-kilap" cx="48.8" cy="66.4" r="0.85" />
              <circle className="s-kilap" cx="68.8" cy="66.4" r="0.85" />
            </g>
          </g>
          <path className="s-bulu-mata" d="M44.5 59.5 L42.5 57.5 M75.5 59.5 L77.5 57.5" />
          <ellipse className="s-pipi" cx="42.5" cy="73" rx="5" ry="3" />
          <ellipse className="s-pipi" cx="77.5" cy="73" rx="5" ry="3" />
          <path className="s-mulut" d="M54.5 73 Q60 80.5 65.5 73 Z" />
          <path className="s-lidah" d="M57.2 77 Q60 79.6 62.8 77" />
        </g>
      </g>
    </svg>
  )
}
