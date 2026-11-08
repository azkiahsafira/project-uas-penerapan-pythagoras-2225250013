// Adegan lucu di latar belakang halaman (bukan header):
// - Raka belajar di meja (menulis, membalik buku, "Hmm… → Aha!")
// - Dua Siku mengobrol bergantian
// - Nisa menulis di papan tulis
// - Siku mengibarkan bendera "SEMANGAT!" bersama kelinci
// Di layar lebar adegan ditaruh di ruang kosong kiri & kanan kartu;
// di layar sempit ditampilkan berjajar di bawah halaman (TamanBawah).
// Semua hanya hiasan (aria-hidden) dan disembunyikan saat tes.

import { useId } from 'react'

const GARIS = '#1e2a4d'

function RakaBelajar() {
  return (
    <svg className="tb tb-belajar" viewBox="0 0 160 150">
      {/* lampu meja */}
      <path d="M128 96 L128 60 L116 48" stroke={GARIS} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M104 42 L124 38 L120 54 Z" fill="#fbbf24" stroke={GARIS} strokeWidth="2" strokeLinejoin="round" />
      <path className="tb-cahaya" d="M110 50 L92 92 L124 92 L118 52 Z" fill="#fde68a" />
      {/* kursi */}
      <rect x="22" y="70" width="10" height="56" rx="4" fill="#c4b5fd" stroke={GARIS} strokeWidth="2" />
      {/* badan */}
      <g className="tb-angguk">
        <rect x="36" y="76" width="40" height="30" rx="12" fill="#fff" stroke={GARIS} strokeWidth="2" />
        <path d="M56 78 L53 90 L56 96 L59 90 Z" fill="#ef4444" />
        <circle cx="56" cy="54" r="21" fill="#fde2c8" stroke={GARIS} strokeWidth="2" />
        <path d="M35 52 Q38 28 58 31 Q76 33 77 50 Q66 40 52 42 Q42 43 35 52 Z" fill="#3b2a20" />
        <g className="tb-kedip">
          <circle cx="49" cy="56" r="2.6" fill={GARIS} />
          <circle cx="64" cy="56" r="2.6" fill={GARIS} />
        </g>
        <circle cx="44" cy="63" r="3.5" fill="#fbcfe8" />
        <circle cx="69" cy="63" r="3.5" fill="#fbcfe8" />
        <path d="M52 66 Q56 69 60 66" stroke={GARIS} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
      {/* meja */}
      <rect x="8" y="96" width="144" height="9" rx="4" fill="#fbcfe8" stroke={GARIS} strokeWidth="2" />
      <rect x="18" y="104" width="7" height="34" rx="3" fill="#f9a8d4" stroke={GARIS} strokeWidth="2" />
      <rect x="135" y="104" width="7" height="34" rx="3" fill="#f9a8d4" stroke={GARIS} strokeWidth="2" />
      {/* buku terbuka */}
      <path d="M70 95 L86 86 L102 95 Z" fill="#7cc3ff" stroke={GARIS} strokeWidth="2" strokeLinejoin="round" />
      <path d="M86 86 L72 88 L72 95 L86 95 Z" fill="#fff" stroke={GARIS} strokeWidth="1.5" />
      <path className="tb-halaman" d="M86 86 L100 88 L100 95 L86 95 Z" fill="#fff" stroke={GARIS} strokeWidth="1.5" />
      {/* tangan & pensil menulis */}
      <g className="tb-tulis">
        <circle cx="80" cy="92" r="5" fill="#fde2c8" stroke={GARIS} strokeWidth="1.8" />
        <path d="M82 92 L94 78" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        <path d="M94 78 L96 75" stroke="#fb7185" strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* gelembung pikiran */}
      <circle cx="86" cy="30" r="3" fill="#fff" stroke="#bfdbfe" strokeWidth="1.5" />
      <circle cx="94" cy="22" r="4.5" fill="#fff" stroke="#bfdbfe" strokeWidth="1.5" />
      <rect x="98" y="2" width="58" height="24" rx="12" fill="#fff" stroke="#bfdbfe" strokeWidth="1.5" />
      <text className="tb-pikir p1" x="127" y="18">
        Hmm… 🤔
      </text>
      <text className="tb-pikir p2" x="127" y="18">
        Aha! 💡
      </text>
    </svg>
  )
}

function SikuKecil({ warna, balik = false, kelas }) {
  return (
    <g className={kelas} transform={balik ? 'translate(170 0) scale(-1 1)' : undefined}>
      <ellipse cx="38" cy="132" rx="26" ry="4" fill="rgba(30,42,77,0.12)" />
      <path d="M14 128 L14 70 L64 128 Z" fill={warna} stroke={GARIS} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="14" y="118" width="10" height="10" fill="none" stroke={GARIS} strokeWidth="1.8" />
      <circle cx="28" cy="106" r="2.4" fill={GARIS} />
      <circle cx="38" cy="106" r="2.4" fill={GARIS} />
      <path d="M29 112 Q33 116 37 112" stroke={GARIS} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="23" cy="112" r="2.6" fill="#fbcfe8" />
      <circle cx="43" cy="112" r="2.6" fill="#fbcfe8" />
      <g className="tb-lambai">
        <path d="M52 112 Q60 106 64 98" stroke={GARIS} strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="65" cy="96" r="3.6" fill="#fff" stroke={GARIS} strokeWidth="1.8" />
      </g>
    </g>
  )
}

function SikuNgobrol() {
  const kalimat = [
    ['k1', 8, 'Hai! 👋'],
    ['k2', 92, 'Halo, Siku!'],
    ['k3', 8, 'Belajar yuk!'],
    ['k4', 92, 'Ayo! ✏️'],
  ]
  return (
    <svg className="tb tb-ngobrol" viewBox="0 0 170 140">
      <SikuKecil warna="#bfe3ff" kelas="tb-siku kiri" />
      <SikuKecil warna="#fbcfe8" kelas="tb-siku kanan" balik />
      {kalimat.map(([k, x, teks]) => (
        <g key={k} className={`tb-ucap ${k}`}>
          <rect x={x} y="22" width="70" height="24" rx="12" fill="#fff" stroke="#bfdbfe" strokeWidth="1.5" />
          <path
            d={x < 50 ? `M${x + 18} 45 L${x + 22} 55 L${x + 28} 45 Z` : `M${x + 52} 45 L${x + 48} 55 L${x + 42} 45 Z`}
            fill="#fff"
          />
          <text x={x + 35} y="38">
            {teks}
          </text>
        </g>
      ))}
    </svg>
  )
}

function NisaPapanTulis() {
  // id unik: adegan ini bisa tampil dua kali (samping & bawah)
  const idKlip = `tb-tulis-${useId().replace(/:/g, '')}`
  return (
    <svg className="tb tb-papan" viewBox="0 0 160 150">
      {/* papan tulis */}
      <rect x="44" y="10" width="110" height="74" rx="6" fill="#c08457" />
      <rect x="49" y="15" width="100" height="64" rx="4" fill="#2f6f5e" />
      <clipPath id={idKlip}>
        <rect className="tb-kapur-buka" x="52" y="20" width="94" height="56" />
      </clipPath>
      <g clipPath={`url(#${idKlip})`} fill="#fff" className="tb-kapur">
        <text x="99" y="40">
          3² + 4²
        </text>
        <text x="99" y="60">
          = 5²
        </text>
      </g>
      <text className="tb-centang" x="136" y="70">
        ✓
      </text>
      <rect x="60" y="84" width="78" height="4" rx="2" fill="#a16207" />
      {/* Nisa */}
      <g className="tb-nisa">
        <path d="M14 140 Q14 100 34 98 Q54 100 54 140 Z" fill="#1e3a8a" stroke={GARIS} strokeWidth="2" />
        <path d="M18 112 Q34 92 50 112 L46 120 L22 120 Z" fill="#fff" stroke={GARIS} strokeWidth="2" />
        <path d="M12 76 Q12 48 34 48 Q56 48 56 76 Q56 104 34 106 Q12 104 12 76 Z" fill="#fff" stroke={GARIS} strokeWidth="2" />
        <circle cx="34" cy="76" r="15" fill="#fde2c8" />
        <g className="tb-kedip">
          <circle cx="29" cy="76" r="2.2" fill={GARIS} />
          <circle cx="40" cy="76" r="2.2" fill={GARIS} />
        </g>
        <circle cx="25" cy="82" r="2.6" fill="#fbcfe8" />
        <circle cx="44" cy="82" r="2.6" fill="#fbcfe8" />
        <path d="M31 84 Q34.5 87 38 84" stroke={GARIS} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* tangan memegang kapur, bergerak menulis */}
        <g className="tb-kapur-tangan">
          <path d="M48 110 L64 74" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
          <path d="M48 110 L64 74" stroke={GARIS} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="65" cy="72" r="4.5" fill="#fde2c8" stroke={GARIS} strokeWidth="1.5" />
          <rect x="66" y="64" width="3" height="8" rx="1" fill="#fff" stroke={GARIS} strokeWidth="1" />
        </g>
      </g>
    </svg>
  )
}

function SikuSemangat() {
  return (
    <svg className="tb tb-semangat" viewBox="0 0 160 150">
      {/* hati melayang */}
      <text className="tb-hati h1" x="30" y="40">
        💗
      </text>
      <text className="tb-hati h2" x="70" y="30">
        💙
      </text>
      {/* Siku dengan bendera */}
      <g className="tb-loncat">
        <ellipse cx="54" cy="142" rx="30" ry="4" fill="rgba(30,42,77,0.12)" />
        <path d="M24 136 L24 66 L86 136 Z" fill="#bfe3ff" stroke={GARIS} strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="24" y="124" width="12" height="12" fill="none" stroke={GARIS} strokeWidth="1.8" />
        <circle cx="40" cy="108" r="2.6" fill={GARIS} />
        <circle cx="52" cy="108" r="2.6" fill={GARIS} />
        <path d="M41 115 Q46 120 51 115" stroke={GARIS} strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="34" cy="115" r="3" fill="#fbcfe8" />
        <circle cx="58" cy="115" r="3" fill="#fbcfe8" />
        {/* tiang & bendera */}
        <path d="M66 112 L80 46" stroke={GARIS} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="69" cy="100" r="4" fill="#fff" stroke={GARIS} strokeWidth="1.8" />
        <g className="tb-panji">
          <path
            d="M80 46 L152 38 L142 58 L154 78 L76 72 Z"
            fill="#f9a8d4"
            stroke={GARIS}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <text x="112" y="62" transform="rotate(-5 112 62)">
            SEMANGAT!
          </text>
        </g>
      </g>
      {/* kelinci melompat */}
      <g className="tb-kelinci">
        <ellipse cx="130" cy="143" rx="14" ry="3" fill="rgba(30,42,77,0.12)" />
        <ellipse cx="124" cy="104" rx="4" ry="12" fill="#fff" stroke={GARIS} strokeWidth="1.8" />
        <ellipse cx="136" cy="104" rx="4" ry="12" fill="#fff" stroke={GARIS} strokeWidth="1.8" />
        <ellipse cx="130" cy="130" rx="14" ry="11" fill="#fff" stroke={GARIS} strokeWidth="1.8" />
        <circle cx="130" cy="118" r="10" fill="#fff" stroke={GARIS} strokeWidth="1.8" />
        <circle cx="126" cy="117" r="1.6" fill={GARIS} />
        <circle cx="134" cy="117" r="1.6" fill={GARIS} />
        <circle cx="130" cy="121" r="1.6" fill="#fb7185" />
      </g>
    </svg>
  )
}

// Layar lebar: adegan di ruang kosong kiri & kanan kartu
export function TamanSamping() {
  return (
    <div className="taman-samping" aria-hidden="true">
      <div className="taman-kolom kiri">
        <div className="taman-adegan atas">
          <RakaBelajar />
        </div>
        <div className="taman-adegan bawah">
          <NisaPapanTulis />
        </div>
      </div>
      <div className="taman-kolom kanan">
        <div className="taman-adegan atas">
          <SikuNgobrol />
        </div>
        <div className="taman-adegan bawah">
          <SikuSemangat />
        </div>
      </div>
    </div>
  )
}

// Layar sempit (HP/tablet): adegan berjajar di bawah halaman
export function TamanBawah() {
  return (
    <div className="taman-bawah" aria-hidden="true">
      <RakaBelajar />
      <SikuNgobrol />
      <NisaPapanTulis />
      <SikuSemangat />
    </div>
  )
}
