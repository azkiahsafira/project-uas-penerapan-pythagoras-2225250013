// Prisma segitiga siku-siku 3-4-5 yang berputar dalam 3D.
// Dibangun dengan CSS 3D transform (tanpa library): 2 sisi segitiga
// (depan & belakang) dan 3 sisi persegi panjang (alas, tegak, miring).
// Ukuran sisi: a = 3 satuan, b = 4 satuan, c = 5 satuan (1 satuan = SATUAN px).

const SATUAN = 20
const A = 3 * SATUAN // alas
const B = 4 * SATUAN // tinggi
const C = 5 * SATUAN // sisi miring
const TEBAL = 2 * SATUAN
const SUDUT = (Math.atan2(B, A) * 180) / Math.PI // kemiringan sisi miring

function Segitiga({ z }) {
  return (
    <div className="p-muka p-segitiga" style={{ width: A, height: B, transform: `translateZ(${z}px)` }}>
      <svg viewBox={`0 0 ${A} ${B}`} width={A} height={B}>
        <polygon points={`0,0 0,${B} ${A},${B}`} />
        <path d={`M0 ${B - 10} H10 V${B}`} className="p-siku" />
      </svg>
    </div>
  )
}

export default function Prisma3D() {
  return (
    <div className="prisma-wadah" aria-hidden="true">
      <div className="prisma" style={{ width: A, height: B }}>
        <Segitiga z={TEBAL / 2} />
        <Segitiga z={-TEBAL / 2} />
        {/* alas (sisi a), terletak di garis bawah segitiga */}
        <div
          className="p-muka p-sisi"
          style={{ width: A, height: TEBAL, left: 0, top: B - TEBAL / 2, transform: 'rotateX(90deg)' }}
        >
          3
        </div>
        {/* sisi tegak (sisi b), terletak di garis kiri segitiga */}
        <div
          className="p-muka p-sisi"
          style={{ width: TEBAL, height: B, left: -TEBAL / 2, top: 0, transform: 'rotateY(90deg)' }}
        >
          4
        </div>
        {/* sisi miring (sisi c), dari pojok kiri atas ke pojok kanan bawah */}
        <div
          className="p-muka p-sisi p-miring"
          style={{
            width: C,
            height: TEBAL,
            left: A / 2 - C / 2,
            top: B / 2 - TEBAL / 2,
            transform: `rotateZ(${SUDUT}deg) rotateX(90deg)`,
          }}
        >
          5
        </div>
      </div>
    </div>
  )
}
