// "Siku", maskot aplikasi: segitiga siku-siku yang bisa berekspresi.
// Digambar dengan SVG dan dianimasikan dengan CSS (lihat bagian Maskot di App.css).
//
// Props:
//   suasana : 'halo' (melambai) | 'senang' (jawaban benar) | 'mikir' (jawaban belum tepat)
//   ukuran  : lebar dalam piksel
//   diam    : true = tanpa animasi (dipakai saat tes agar tidak mengganggu)

export default function Maskot({ suasana = 'halo', ukuran = 140, diam = false }) {
  const senang = suasana === 'senang'
  const mikir = suasana === 'mikir'

  return (
    <svg
      className={`maskot ${suasana} ${diam ? 'diam' : ''}`}
      viewBox="0 0 160 150"
      width={ukuran}
      height={(ukuran * 150) / 160}
      role="img"
      aria-label={senang ? 'Maskot Siku senang' : mikir ? 'Maskot Siku sedang berpikir' : 'Maskot Siku melambaikan tangan'}
    >
      {/* bayangan di lantai */}
      <ellipse className="bayang" cx="82" cy="142" rx="44" ry="5" />

      {/* bintang kecil */}
      {!mikir && (
        <g className="bintang">
          <path d="M140 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
          <path className="b2" d="M16 46 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
        </g>
      )}
      {mikir && (
        <text className="tanya" x="120" y="44">
          ?
        </text>
      )}

      <g className="badan">
        {/* lengan kiri */}
        <g className="lengan">
          <path d={senang ? 'M32 96 Q20 82 18 68' : 'M32 96 Q20 92 16 82'} />
          <circle cx={senang ? 18 : 16} cy={senang ? 65 : 79} r="5" />
        </g>

        {/* tubuh segitiga */}
        <path className="tubuh" d="M32 28 L132 124 L32 124 Z" />
        <path className="kilau" d="M42 52 L42 72" />
        <path className="siku-tanda" d="M32 110 H46 V124" />

        {/* kaki */}
        <ellipse className="kaki" cx="54" cy="128" rx="10" ry="5" />
        <ellipse className="kaki" cx="108" cy="128" rx="10" ry="5" />

        {/* wajah */}
        <ellipse className="pipi" cx="47" cy="100" rx="5.5" ry="3.2" />
        <ellipse className="pipi" cx="85" cy="100" rx="5.5" ry="3.2" />
        {senang ? (
          <g className="mata-senang">
            <path d="M50 90 Q55 83 60 90" />
            <path d="M71 90 Q76 83 81 90" />
          </g>
        ) : (
          <g className="mata">
            <ellipse cx="55" cy="88" rx="4.6" ry="5.6" />
            <ellipse cx="76" cy="88" rx="4.6" ry="5.6" />
            <circle className="kilap" cx={mikir ? 55.5 : 56.6} cy={mikir ? 84.5 : 85.8} r="1.6" />
            <circle className="kilap" cx={mikir ? 76.5 : 77.6} cy={mikir ? 84.5 : 85.8} r="1.6" />
          </g>
        )}
        {senang ? (
          <path className="mulut-buka" d="M57 97 Q66 111 75 97 Z" />
        ) : mikir ? (
          <path className="mulut" d="M61 102 Q66 99 71 102" />
        ) : (
          <path className="mulut" d="M59 98 Q66 106 73 98" />
        )}

        {/* lengan kanan (melambai) */}
        <g className="lengan lengan-lambai">
          <path d={mikir ? 'M87 81 Q102 84 104 96' : 'M87 81 Q100 70 104 58'} />
          <circle cx="104" cy={mikir ? 99 : 55} r="5" />
        </g>
      </g>
    </svg>
  )
}
