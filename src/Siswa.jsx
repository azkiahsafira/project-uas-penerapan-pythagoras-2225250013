// Karakter anak SMP berseragam (kemeja putih, dasi & bawahan biru dongker)
// yang memegang buku dan melambaikan tangan. Digambar dengan SVG,
// dianimasikan dengan CSS (lihat bagian "Karakter siswa" di App.css).

export default function Siswa({ ukuran = 120 }) {
  return (
    <svg className="siswa" viewBox="0 0 120 200" width={ukuran} height={(ukuran * 200) / 120} role="img" aria-label="Anak SMP melambaikan tangan">
      <ellipse className="s-bayang" cx="60" cy="194" rx="30" ry="4.5" />

      <g className="s-badan">
        {/* kaki & sepatu */}
        <rect className="s-dongker" x="45" y="140" width="13" height="44" rx="5" />
        <rect className="s-dongker" x="62" y="140" width="13" height="44" rx="5" />
        <ellipse className="s-sepatu" cx="50" cy="187" rx="10" ry="5" />
        <ellipse className="s-sepatu" cx="70" cy="187" rx="10" ry="5" />

        {/* celana */}
        <path className="s-dongker" d="M39 118 H81 L84 150 H36 Z" />

        {/* lengan kiri memegang buku */}
        <path className="s-lengan" d="M42 86 Q32 100 34 114" />
        <rect className="s-buku" x="20" y="102" width="18" height="23" rx="3" />
        <path className="s-buku-garis" d="M24 109 H34 M24 114 H32" />
        <circle className="s-kulit" cx="36" cy="116" r="5.5" />

        {/* kemeja */}
        <rect className="s-kemeja" x="38" y="78" width="44" height="48" rx="13" />
        <path className="s-kerah" d="M50 80 L60 92 L70 80" />
        <path className="s-dongker" d="M57.5 89 H62.5 L64.5 109 L60 115 L55.5 109 Z" />
        <rect className="s-lencana" x="68" y="94" width="8" height="6" rx="1.5" />

        {/* lengan kanan melambai */}
        <g className="s-lambai">
          <path className="s-lengan" d="M79 86 Q92 76 96 62" />
          <circle className="s-kulit" cx="97" cy="57" r="6" />
        </g>

        {/* leher & kepala */}
        <rect className="s-kulit" x="54" y="68" width="12" height="13" rx="4" />
        <g className="s-kepala">
          <circle className="s-kulit" cx="36.5" cy="52" r="5" />
          <circle className="s-kulit" cx="83.5" cy="52" r="5" />
          <circle className="s-kulit" cx="60" cy="50" r="24" />
          <path className="s-rambut" d="M35 52 Q33 22 60 21 Q88 21 85 53 Q82 37 68 34 Q58 42 42 41 Q37 45 35 52 Z" />
          <g className="s-mata">
            <ellipse cx="51" cy="53" rx="3.2" ry="4" />
            <ellipse cx="69" cy="53" rx="3.2" ry="4" />
            <circle className="s-kilap" cx="52" cy="51.5" r="1.1" />
            <circle className="s-kilap" cx="70" cy="51.5" r="1.1" />
          </g>
          <path className="s-alis" d="M47 46 Q51 44 55 46 M65 46 Q69 44 73 46" />
          <ellipse className="s-pipi" cx="45.5" cy="61" rx="4.5" ry="2.6" />
          <ellipse className="s-pipi" cx="74.5" cy="61" rx="4.5" ry="2.6" />
          <path className="s-mulut" d="M54 62 Q60 68.5 66 62" />
        </g>
      </g>
    </svg>
  )
}
