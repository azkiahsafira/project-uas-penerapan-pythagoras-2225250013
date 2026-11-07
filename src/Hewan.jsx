// Hewan-hewan lucu yang tersebar di halaman: anak ayam, bebek, panda,
// katak, dan anjing (kelinci, kucing, beruang ada di Hiasan.jsx).
// Masing-masing bergerak sendiri dan "bersuara" saat diklik.
// Gaya & animasinya ada di bagian "Taman hewan" dan "Hewan tersebar" di App.css.

import { useEffect, useState } from 'react'
import { Beruang, Kelinci, Kucing } from './Hiasan.jsx'
import { SUARA_HEWAN } from './kalimat.js'

function Tombol({ nama, label, bersuara, teks, onKlik, children }) {
  return (
    <button type="button" className={`hewan-tombol ${nama}-tombol ${bersuara ? 'bersuara' : ''}`} onClick={onKlik} aria-label={label}>
      {bersuara && <span className="suara-hewan">{teks}</span>}
      {children}
    </button>
  )
}

function MataSenang({ x1, x2, y }) {
  return <path className="h-mata-senang" d={`M${x1 - 3} ${y} Q${x1} ${y - 3} ${x1 + 3} ${y} M${x2 - 3} ${y} Q${x2} ${y - 3} ${x2 + 3} ${y}`} />
}

export function AnakAyam(props) {
  return (
    <Tombol nama="ayam" label="Elus anak ayam" {...props}>
      <svg className="ayam" viewBox="0 0 60 64" aria-hidden="true">
        <ellipse className="h-bayang" cx="30" cy="61" rx="14" ry="2.5" />
        <g className="ay-badan">
          <path className="ay-jambul" d="M28 14 Q26 6 31 5 Q30 10 34 9 Q32 13 30 15 Z" />
          <circle className="ay-tubuh" cx="30" cy="36" r="20" />
          <ellipse className="ay-sayap" cx="15" cy="40" rx="6" ry="9" transform="rotate(20 15 40)" />
          <ellipse className="ay-sayap ay-sayap-kanan" cx="45" cy="40" rx="6" ry="9" transform="rotate(-20 45 40)" />
          <g className="h-mata">
            {props.bersuara ? (
              <MataSenang x1={23} x2={37} y={31} />
            ) : (
              <>
                <circle cx="23" cy="31" r="2.6" />
                <circle cx="37" cy="31" r="2.6" />
              </>
            )}
          </g>
          <path className="ay-paruh" d={props.bersuara ? 'M26 36 L34 36 L30 43 Z M26 36 L30 33 L34 36 Z' : 'M26 36 L34 36 L30 41 Z'} />
          <ellipse className="h-pipi" cx="19" cy="37" rx="3" ry="1.8" />
          <ellipse className="h-pipi" cx="41" cy="37" rx="3" ry="1.8" />
          <path className="ay-kaki" d="M24 55 V60 M21 60 H27 M36 55 V60 M33 60 H39" />
        </g>
      </svg>
    </Tombol>
  )
}

export function Bebek(props) {
  return (
    <Tombol nama="bebek" label="Elus bebek" {...props}>
      <svg className="bebek" viewBox="0 0 76 64" aria-hidden="true">
        <ellipse className="h-bayang" cx="40" cy="61" rx="20" ry="2.5" />
        <g className="bb-badan">
          <path className="bb-tubuh" d="M14 40 Q14 28 30 30 L52 32 Q66 30 68 40 Q68 56 44 57 Q18 58 14 40 Z" />
          <path className="bb-ekor" d="M64 36 L72 30 L69 41 Z" />
          <path className="bb-sayap" d="M34 40 Q46 34 56 42 Q48 50 36 46 Z" />
          <circle className="bb-tubuh" cx="24" cy="24" r="13" />
          <g className="h-mata">
            {props.bersuara ? <MataSenang x1={21} x2={21} y={21} /> : <circle cx="21" cy="21" r="2.4" />}
          </g>
          <path className="bb-paruh" d={props.bersuara ? 'M4 26 Q8 20 14 23 L14 29 Q8 32 4 26 Z' : 'M5 26 Q9 22 14 24 L14 28 Q9 30 5 26 Z'} />
          <ellipse className="h-pipi" cx="27" cy="28" rx="3" ry="1.8" />
          <path className="bb-kaki" d="M34 56 L32 61 L38 61 M46 56 L44 61 L50 61" />
        </g>
      </svg>
    </Tombol>
  )
}

export function Panda(props) {
  return (
    <Tombol nama="panda" label="Elus panda" {...props}>
      <svg className="panda" viewBox="0 0 76 76" aria-hidden="true">
        <ellipse className="h-bayang" cx="38" cy="73" rx="20" ry="2.5" />
        <g className="pd-badan">
          <ellipse className="pd-putih" cx="38" cy="56" rx="18" ry="15" />
          <ellipse className="pd-hitam" cx="25" cy="70" rx="7" ry="4" />
          <ellipse className="pd-hitam" cx="51" cy="70" rx="7" ry="4" />
          {/* bambu yang dipegang */}
          <g className="pd-bambu">
            <rect x="52" y="28" width="5" height="34" rx="2" />
            <path d="M52 40 H57 M52 51 H57" className="pd-ruas" />
            <path className="pd-daun" d="M57 32 Q66 26 70 30 Q63 33 57 34 Z" />
          </g>
          <path className="pd-lengan" d="M24 50 Q18 56 22 62 M52 50 Q58 48 56 42" />
          <g className="pd-kepala">
            <circle className="pd-hitam" cx="23" cy="14" r="7" />
            <circle className="pd-hitam" cx="53" cy="14" r="7" />
            <circle className="pd-putih" cx="38" cy="29" r="17" />
            <ellipse className="pd-hitam" cx="30" cy="28" rx="5" ry="6" transform="rotate(-20 30 28)" />
            <ellipse className="pd-hitam" cx="46" cy="28" rx="5" ry="6" transform="rotate(20 46 28)" />
            <g className="h-mata pd-mata">
              {props.bersuara ? (
                <MataSenang x1={30} x2={46} y={28} />
              ) : (
                <>
                  <circle cx="30.5" cy="28" r="1.8" />
                  <circle cx="45.5" cy="28" r="1.8" />
                </>
              )}
            </g>
            <ellipse className="pd-hidung" cx="38" cy="34" rx="2.6" ry="1.8" />
            <path className="h-mulut" d={props.bersuara ? 'M34 37 Q38 43 42 37 Z' : 'M35 37 Q38 39.5 41 37'} />
            <ellipse className="h-pipi" cx="27" cy="36" rx="3" ry="1.8" />
            <ellipse className="h-pipi" cx="49" cy="36" rx="3" ry="1.8" />
          </g>
        </g>
      </svg>
    </Tombol>
  )
}

export function Katak(props) {
  return (
    <Tombol nama="katak" label="Elus katak" {...props}>
      <svg className="katak" viewBox="0 0 70 60" aria-hidden="true">
        <ellipse className="h-bayang" cx="35" cy="57" rx="20" ry="2.5" />
        <g className="kt-badan">
          <ellipse className="kt-hijau" cx="35" cy="40" rx="24" ry="16" />
          <ellipse className="kt-perut" cx="35" cy="45" rx="13" ry="9" />
          <circle className="kt-hijau" cx="22" cy="22" r="9" />
          <circle className="kt-hijau" cx="48" cy="22" r="9" />
          <circle className="kt-putih" cx="22" cy="21" r="6" />
          <circle className="kt-putih" cx="48" cy="21" r="6" />
          <g className="h-mata">
            {props.bersuara ? (
              <MataSenang x1={22} x2={48} y={22} />
            ) : (
              <>
                <circle cx="23" cy="22" r="3" />
                <circle cx="49" cy="22" r="3" />
              </>
            )}
          </g>
          <path className="h-mulut kt-mulut" d={props.bersuara ? 'M24 33 Q35 46 46 33 Z' : 'M24 33 Q35 41 46 33'} />
          <ellipse className="h-pipi" cx="17" cy="34" rx="3.5" ry="2" />
          <ellipse className="h-pipi" cx="53" cy="34" rx="3.5" ry="2" />
          <path className="kt-kaki" d="M14 52 Q6 54 8 58 M56 52 Q64 54 62 58" />
        </g>
      </svg>
    </Tombol>
  )
}

export function Anjing(props) {
  return (
    <Tombol nama="anjing" label="Elus anjing" {...props}>
      <svg className="anjing" viewBox="0 0 80 72" aria-hidden="true">
        <ellipse className="h-bayang" cx="38" cy="69" rx="22" ry="2.5" />
        <g className="aj-badan">
          <path className="aj-ekor" d="M58 52 Q72 46 70 34" />
          <ellipse className="aj-tubuh" cx="40" cy="54" rx="20" ry="14" />
          <ellipse className="aj-tubuh" cx="28" cy="67" rx="6" ry="3.5" />
          <ellipse className="aj-tubuh" cx="50" cy="67" rx="6" ry="3.5" />
          <g className="aj-kepala">
            <ellipse className="aj-telinga" cx="18" cy="26" rx="7" ry="13" transform="rotate(18 18 26)" />
            <ellipse className="aj-telinga" cx="54" cy="26" rx="7" ry="13" transform="rotate(-18 54 26)" />
            <circle className="aj-tubuh" cx="36" cy="27" r="17" />
            <ellipse className="aj-moncong" cx="36" cy="34" rx="9" ry="7" />
            <ellipse className="aj-bercak" cx="44" cy="20" rx="6" ry="5" />
            <ellipse className="aj-hidung" cx="36" cy="30.5" rx="3.4" ry="2.4" />
            <g className="h-mata">
              {props.bersuara ? (
                <MataSenang x1={29} x2={43} y={24} />
              ) : (
                <>
                  <circle cx="29" cy="24" r="2.4" />
                  <circle cx="43" cy="24" r="2.4" />
                </>
              )}
            </g>
            <path className="h-mulut" d="M32 35 Q36 38 40 35" />
            <path className="aj-lidah" d="M34 36.5 Q36 44 38 36.5 Z" />
            <ellipse className="h-pipi" cx="24" cy="32" rx="3" ry="1.8" />
            <ellipse className="h-pipi" cx="48" cy="32" rx="3" ry="1.8" />
          </g>
        </g>
      </svg>
    </Tombol>
  )
}

// ---------------------------------------------------------------------------
// HewanHidup: hewan yang mengurus suaranya sendiri, sehingga bisa diletakkan
// di mana saja (di atas kartu, di pinggir layar, berjalan melintas).
// Setiap diklik, hewan memunculkan kalimat berikutnya dari SUARA_HEWAN.
// ---------------------------------------------------------------------------
const KOMPONEN = {
  kelinci: Kelinci,
  ayam: AnakAyam,
  kucing: Kucing,
  bebek: Bebek,
  panda: Panda,
  katak: Katak,
  anjing: Anjing,
  beruang: Beruang,
}

export function HewanHidup({ jenis, className = '' }) {
  const [klik, setKlik] = useState(0)
  const [bersuara, setBersuara] = useState(false)

  useEffect(() => {
    if (!bersuara) return undefined
    const t = setTimeout(() => setBersuara(false), 1700)
    return () => clearTimeout(t)
  }, [bersuara, klik])

  const Komponen = KOMPONEN[jenis]
  const daftar = SUARA_HEWAN[jenis]
  return (
    <div className={`hewan-hidup ${className}`}>
      <Komponen
        key={klik}
        bersuara={bersuara}
        mengeong={bersuara}
        teks={daftar[(klik - 1 + daftar.length) % daftar.length]}
        onKlik={() => {
          setKlik(klik + 1)
          setBersuara(true)
        }}
      />
    </div>
  )
}
