// "Siku", maskot aplikasi: segitiga siku-siku yang bisa berekspresi.
// Digambar dengan SVG dan dianimasikan dengan CSS (lihat bagian Maskot di App.css).
//
// Props:
//   suasana : 'halo' (melambai) | 'senang' (jawaban benar) | 'mikir' (jawaban belum tepat)
//             | 'tidur' (lama tidak disentuh) | 'menari' (merayakan sesi selesai)
//   ukuran  : lebar dalam piksel
//   diam    : true = tanpa animasi (dipakai saat tes agar tidak mengganggu)
//   lirik   : { x, y } antara -1 dan 1, arah bola mata melirik (mengikuti kursor)
//   topi    : true = memakai topi wisuda

const LABEL = {
  halo: 'Maskot Siku melambaikan tangan',
  senang: 'Maskot Siku senang',
  mikir: 'Maskot Siku sedang berpikir',
  tidur: 'Maskot Siku sedang tidur',
  menari: 'Maskot Siku menari gembira',
}

export default function Maskot({ suasana = 'halo', ukuran = 140, diam = false, lirik = null, topi = false }) {
  const senang = suasana === 'senang' || suasana === 'menari'
  const mikir = suasana === 'mikir'
  const tidur = suasana === 'tidur'
  const geser = lirik ? `translate(${(lirik.x * 2.4).toFixed(2)} ${(lirik.y * 2).toFixed(2)})` : undefined

  return (
    <svg
      className={`maskot ${suasana} ${diam ? 'diam' : ''}`}
      viewBox="0 0 160 150"
      width={ukuran}
      height={(ukuran * 150) / 160}
      role="img"
      aria-label={LABEL[suasana] ?? LABEL.halo}
    >
      {/* bayangan di lantai */}
      <ellipse className="bayang" cx="82" cy="142" rx="44" ry="5" />

      {/* bintang kecil / tanda tanya / Zzz */}
      {!mikir && !tidur && (
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
      {tidur && (
        <g className="zzz">
          <text className="z1" x="104" y="52">
            z
          </text>
          <text className="z2" x="116" y="38">
            z
          </text>
          <text className="z3" x="130" y="22">
            Z
          </text>
        </g>
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
        ) : tidur ? (
          <g className="mata-senang">
            <path d="M50 88 Q55 92 60 88" />
            <path d="M71 88 Q76 92 81 88" />
          </g>
        ) : (
          <g className="mata">
            <g transform={geser}>
              <ellipse cx="55" cy="88" rx="4.6" ry="5.6" />
              <ellipse cx="76" cy="88" rx="4.6" ry="5.6" />
              <circle className="kilap" cx={mikir ? 55.5 : 56.6} cy={mikir ? 84.5 : 85.8} r="1.6" />
              <circle className="kilap" cx={mikir ? 76.5 : 77.6} cy={mikir ? 84.5 : 85.8} r="1.6" />
            </g>
          </g>
        )}
        {senang ? (
          <path className="mulut-buka" d="M57 97 Q66 111 75 97 Z" />
        ) : tidur ? (
          <ellipse className="mulut-buka" cx="66" cy="101" rx="3" ry="3.6" />
        ) : mikir ? (
          <path className="mulut" d="M61 102 Q66 99 71 102" />
        ) : (
          <path className="mulut" d="M59 98 Q66 106 73 98" />
        )}

        {/* topi wisuda di puncak segitiga */}
        {topi && (
          <g className="topi">
            <path className="topi-dasar" d="M22 22 V29 Q34 35 46 29 V22 Z" />
            <path className="topi-atas" d="M6 19 L34 8 L62 19 L34 30 Z" />
            <g className="rumbai">
              <path d="M34 19 L56 23 L56 36" />
              <circle cx="56" cy="38" r="3.2" />
            </g>
          </g>
        )}

        {/* lengan kanan (melambai) */}
        <g className="lengan lengan-lambai">
          <path d={mikir || tidur ? 'M87 81 Q102 84 104 96' : 'M87 81 Q100 70 104 58'} />
          <circle cx="104" cy={mikir || tidur ? 99 : 55} r="5" />
        </g>
      </g>
    </svg>
  )
}
