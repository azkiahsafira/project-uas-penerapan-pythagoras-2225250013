// Karakter anak SMP bergaya chibi (kepala besar, mata berbinar) berseragam
// putih-biru dongker, memegang buku, dan melambaikan tangan.
// Digambar dengan SVG, dianimasikan dengan CSS (bagian "Karakter siswa" di App.css).

export default function Siswa({ ukuran = 120 }) {
  return (
    <svg className="siswa" viewBox="0 0 120 190" width={ukuran} height={(ukuran * 190) / 120} role="img" aria-label="Anak SMP melambaikan tangan">
      <ellipse className="s-bayang" cx="60" cy="184" rx="28" ry="4.5" />

      {/* hati kecil yang muncul bergantian di atas kepala */}
      <g className="s-hati">
        <path className="h1" d="M96 30 c-3 -5 -10 -3 -9 3 c1 4 9 9 9 9 s8 -5 9 -9 c1 -6 -6 -8 -9 -3z" />
        <path className="h2" d="M24 22 c-2 -3.5 -7 -2 -6.4 2 c0.6 3 6.4 6.4 6.4 6.4 s5.8 -3.4 6.4 -6.4 c0.6 -4 -4.4 -5.5 -6.4 -2z" />
      </g>

      <g className="s-badan">
        {/* kaki & sepatu */}
        <rect className="s-dongker" x="46" y="128" width="12" height="38" rx="5" />
        <rect className="s-dongker" x="62" y="128" width="12" height="38" rx="5" />
        <ellipse className="s-sepatu" cx="51" cy="168" rx="10" ry="5.5" />
        <ellipse className="s-sepatu" cx="69" cy="168" rx="10" ry="5.5" />
        <ellipse className="s-kilap-sepatu" cx="47" cy="166" rx="3" ry="1.4" />
        <ellipse className="s-kilap-sepatu" cx="65" cy="166" rx="3" ry="1.4" />

        {/* celana */}
        <path className="s-dongker" d="M40 112 H80 L83 138 H37 Z" />

        {/* lengan kiri memegang buku */}
        <path className="s-lengan" d="M43 96 Q33 106 35 118" />
        <g className="s-buku-grup">
          <rect className="s-buku" x="19" y="104" width="19" height="24" rx="3.5" />
          <path className="s-buku-garis" d="M23 111 H34 M23 116 H31" />
          <text className="s-buku-teks" x="28.5" y="125" textAnchor="middle">a²</text>
        </g>
        <circle className="s-kulit" cx="37" cy="120" r="5.5" />

        {/* kemeja */}
        <rect className="s-kemeja" x="39" y="88" width="42" height="40" rx="14" />
        <path className="s-kerah" d="M51 90 L60 100 L69 90" />
        <path className="s-dongker" d="M57.8 97 H62.2 L64 112 L60 117 L56 112 Z" />
        <rect className="s-lencana" x="67" y="102" width="8" height="6" rx="1.5" />

        {/* lengan kanan melambai */}
        <g className="s-lambai">
          <path className="s-lengan" d="M78 96 Q91 86 95 72" />
          <circle className="s-kulit" cx="96" cy="67" r="6.5" />
        </g>

        {/* kepala besar */}
        <g className="s-kepala">
          <circle className="s-kulit" cx="30.5" cy="60" r="5.5" />
          <circle className="s-kulit" cx="89.5" cy="60" r="5.5" />
          <circle className="s-kulit" cx="60" cy="58" r="30" />
          <path
            className="s-rambut"
            d="M29 60 Q26 26 60 25 Q95 25 91 61 Q88 42 72 39 Q66 47 52 45 Q44 46 37 50 Q31 53 29 60 Z"
          />
          {/* rambut mencuat (ahoge) */}
          <path className="s-ahoge" d="M60 27 Q63 13 74 15" />
          <g className="s-mata">
            <ellipse cx="48.5" cy="62" rx="4.8" ry="6" />
            <ellipse cx="71.5" cy="62" rx="4.8" ry="6" />
            <circle className="s-kilap" cx="50" cy="59.5" r="1.8" />
            <circle className="s-kilap" cx="73" cy="59.5" r="1.8" />
            <circle className="s-kilap" cx="47.2" cy="64.5" r="0.9" />
            <circle className="s-kilap" cx="70.2" cy="64.5" r="0.9" />
          </g>
          <ellipse className="s-pipi" cx="41" cy="72" rx="5.5" ry="3.2" />
          <ellipse className="s-pipi" cx="79" cy="72" rx="5.5" ry="3.2" />
          <path className="s-mulut" d="M54 71 Q60 80 66 71 Z" />
          <path className="s-lidah" d="M57 75.5 Q60 78.5 63 75.5" />
        </g>
      </g>
    </svg>
  )
}
