// Pemandangan sekolah untuk latar: gedung SMP di header, bus sekolah yang lewat,
// serta hiasan lucu yang beterbangan di latar halaman (kupu-kupu, balon,
// pesawat kertas, awan tersenyum). Semua hanya hiasan (aria-hidden) dan
// ikut berhenti saat animasi dimatikan / saat tes.

// Gedung SMP: bendera merah putih berkibar, jam berputar, siswa melambai dari jendela
export function GedungSMP() {
  const jendela = [
    [86, 78],
    [114, 78],
    [182, 78],
    [210, 78],
    [86, 112],
    [114, 112],
    [182, 112],
    [210, 112],
  ];
  // jendela yang ada siswanya (indeks) beserta warna rambut/jilbab
  const ada = { 1: "#3b2a20", 2: "#f9a8d4", 5: "#f9a8d4", 7: "#3b2a20" };
  return (
    <>
      <div className="rumput-hero" aria-hidden="true" />
      <svg className="gedung-smp" viewBox="0 0 320 170" aria-hidden="true">
        {/* rumput */}
        <ellipse cx="160" cy="166" rx="160" ry="14" className="gs-rumput" />

        {/* pohon kiri & kanan */}
        <g className="gs-pohon kiri">
          <rect
            x="18"
            y="118"
            width="6"
            height="40"
            rx="2"
            className="gs-batang"
          />
          <circle cx="21" cy="110" r="18" className="gs-daun" />
          <circle cx="10" cy="120" r="11" className="gs-daun" />
          <circle cx="32" cy="121" r="11" className="gs-daun" />
          <circle cx="15" cy="104" r="3" className="gs-buah" />
          <circle cx="28" cy="114" r="3" className="gs-buah" />
        </g>
        <g className="gs-pohon kanan">
          <rect
            x="296"
            y="122"
            width="6"
            height="36"
            rx="2"
            className="gs-batang"
          />
          <circle cx="299" cy="114" r="16" className="gs-daun" />
          <circle cx="289" cy="124" r="10" className="gs-daun" />
          <circle cx="309" cy="124" r="10" className="gs-daun" />
        </g>

        {/* tiang & bendera merah putih */}
        <rect
          x="48"
          y="40"
          width="3"
          height="118"
          rx="1.5"
          className="gs-tiang"
        />
        <circle cx="49.5" cy="39" r="3" className="gs-tiang-bola" />
        <g className="gs-bendera">
          <path
            d="M51 44 Q61 40 71 44 T91 44 L91 54 Q81 50 71 54 T51 54 Z"
            fill="#ef4444"
          />
          <path
            d="M51 54 Q61 50 71 54 T91 54 L91 64 Q81 60 71 64 T51 64 Z"
            fill="#ffffff"
          />
        </g>

        {/* badan gedung */}
        <rect
          x="76"
          y="64"
          width="168"
          height="94"
          rx="6"
          className="gs-dinding"
        />
        <path d="M70 66 L160 30 L250 66 Z" className="gs-atap" />
        <rect x="70" y="62" width="180" height="7" rx="3" className="gs-lis" />

        {/* menara jam di tengah */}
        <rect
          x="138"
          y="30"
          width="44"
          height="40"
          rx="4"
          className="gs-menara"
        />
        <path d="M132 32 L160 8 L188 32 Z" className="gs-atap-menara" />
        <circle cx="160" cy="46" r="11" className="gs-jam" />
        <line
          x1="160"
          y1="46"
          x2="160"
          y2="39"
          className="gs-jarum jam-panjang"
        />
        <line
          x1="160"
          y1="46"
          x2="165"
          y2="46"
          className="gs-jarum jam-pendek"
        />
        <circle cx="160" cy="46" r="1.6" className="gs-poros" />

        {/* papan nama */}
        <rect
          x="140"
          y="76"
          width="40"
          height="18"
          rx="5"
          className="gs-papan"
        />
        <text x="160" y="89" className="gs-tulisan">
          SMP
        </text>

        {/* jendela + siswa yang muncul melambai */}
        {jendela.map(([x, y], i) => (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width="24"
              height="22"
              rx="3"
              className="gs-kaca"
            />
            {ada[i] && (
              <g className={`gs-anak a${i}`}>
                <svg
                  x={x}
                  y={y}
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  overflow="hidden"
                >
                  <g className="gs-anak-gerak">
                    <circle cx="12" cy="15" r="6" fill="#fde2c8" />
                    <path d="M6 14 Q12 4 18 14 Q12 10 6 14 Z" fill={ada[i]} />
                    <circle cx="10" cy="15.5" r="0.9" fill="#1e2a4d" />
                    <circle cx="14" cy="15.5" r="0.9" fill="#1e2a4d" />
                    <path
                      d="M10.5 18 Q12 19.4 13.5 18"
                      stroke="#1e2a4d"
                      strokeWidth="0.8"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <g className="gs-tangan">
                      <circle cx="20" cy="13" r="2" fill="#fde2c8" />
                    </g>
                  </g>
                </svg>
              </g>
            )}
            <path
              d={`M${x + 12} ${y} V${y + 22} M${x} ${y + 11} H${x + 24}`}
              className="gs-bingkai"
            />
          </g>
        ))}

        {/* pintu */}
        <rect
          x="146"
          y="118"
          width="28"
          height="40"
          rx="4"
          className="gs-pintu"
        />
        <line x1="160" y1="118" x2="160" y2="158" className="gs-bingkai" />
        <circle cx="156" cy="139" r="1.4" className="gs-gagang" />
        <circle cx="164" cy="139" r="1.4" className="gs-gagang" />
        <rect
          x="140"
          y="156"
          width="40"
          height="5"
          rx="2"
          className="gs-tangga"
        />

        {/* pagar */}
        <g className="gs-pagar">
          {[88, 106, 124, 192, 210, 228].map((x) => (
            <rect key={x} x={x} y="146" width="4" height="14" rx="2" />
          ))}
          <rect x="84" y="150" width="50" height="3" rx="1.5" />
          <rect x="186" y="150" width="50" height="3" rx="1.5" />
        </g>
      </svg>
    </>
  );
}

// Bus sekolah kuning yang sesekali lewat di bawah header
export function BusSekolah() {
  return (
    <div className="bus-jalur" aria-hidden="true">
      <svg className="bus" viewBox="0 0 120 60">
        <rect
          x="4"
          y="10"
          width="106"
          height="36"
          rx="9"
          fill="#fcd34d"
          stroke="#1e2a4d"
          strokeWidth="2.5"
        />
        <rect
          x="96"
          y="20"
          width="16"
          height="16"
          rx="3"
          fill="#bfe3ff"
          stroke="#1e2a4d"
          strokeWidth="2"
        />
        {[12, 34, 56, 78].map((x, i) => (
          <g key={x}>
            <rect
              x={x}
              y="16"
              width="17"
              height="13"
              rx="3"
              fill="#bfe3ff"
              stroke="#1e2a4d"
              strokeWidth="2"
            />
            <circle
              cx={x + 8.5}
              cy="26"
              r="4"
              fill="#fde2c8"
              className={`bus-penumpang p${i}`}
            />
          </g>
        ))}
        <rect x="8" y="33" width="86" height="4" rx="2" fill="#f59e0b" />
        <text x="50" y="44" className="bus-tulisan">
          SEKOLAH
        </text>
        <circle
          cx="111"
          cy="40"
          r="2.5"
          fill="#fff7cc"
          stroke="#1e2a4d"
          strokeWidth="1.2"
        />
        <g className="bus-roda">
          <circle cx="28" cy="47" r="8" fill="#1e2a4d" />
          <circle cx="28" cy="47" r="3" fill="#e5e7eb" />
          <rect x="27" y="40" width="2" height="14" fill="#e5e7eb" />
        </g>
        <g className="bus-roda kanan">
          <circle cx="88" cy="47" r="8" fill="#1e2a4d" />
          <circle cx="88" cy="47" r="3" fill="#e5e7eb" />
          <rect x="87" y="40" width="2" height="14" fill="#e5e7eb" />
        </g>
      </svg>
      <span className="bus-asap" />
      <span className="bus-asap a2" />
    </div>
  );
}

// Hiasan latar halaman: kupu-kupu, balon, pesawat kertas, awan tersenyum
const KUPU = [
  ["k1", "#f9a8d4", "#f472b6"],
  ["k2", "#93c5fd", "#3b82f6"],
  ["k3", "#fde68a", "#f59e0b"],
];
const BALON = [
  ["b1", "#f9a8d4", 8],
  ["b2", "#7cc3ff", 92],
  ["b3", "#c4b5fd", 76],
];

export function HiasanLucu() {
  return (
    <div className="hiasan-lucu" aria-hidden="true">
      {KUPU.map(([k, sayap, garis]) => (
        <span key={k} className={`kupu ${k}`}>
          <svg viewBox="0 0 40 32" width="34" height="28">
            <g className="kupu-sayap kiri">
              <path
                d="M20 16 C8 0 0 6 4 14 C0 22 10 28 20 18 Z"
                fill={sayap}
                stroke={garis}
                strokeWidth="1.5"
              />
              <circle cx="9" cy="12" r="2.2" fill="#fff" opacity="0.8" />
            </g>
            <g className="kupu-sayap kanan">
              <path
                d="M20 16 C32 0 40 6 36 14 C40 22 30 28 20 18 Z"
                fill={sayap}
                stroke={garis}
                strokeWidth="1.5"
              />
              <circle cx="31" cy="12" r="2.2" fill="#fff" opacity="0.8" />
            </g>
            <ellipse cx="20" cy="17" rx="2" ry="7" fill="#1e2a4d" />
            <path
              d="M19 10 Q16 4 13 3 M21 10 Q24 4 27 3"
              stroke="#1e2a4d"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ))}
      {BALON.map(([b, warna, x]) => (
        <span key={b} className={`balon ${b}`} style={{ left: `${x}%` }}>
          <svg viewBox="0 0 40 90" width="34" height="76">
            <path
              d="M20 50 Q16 62 22 72 Q27 80 20 90"
              stroke="#94a3b8"
              strokeWidth="1.2"
              fill="none"
            />
            <ellipse cx="20" cy="24" rx="16" ry="21" fill={warna} />
            <ellipse cx="13" cy="15" rx="4" ry="6" fill="#fff" opacity="0.55" />
            <path d="M17 44 L23 44 L20 50 Z" fill={warna} />
            <circle cx="15" cy="25" r="1.4" fill="#1e2a4d" />
            <circle cx="25" cy="25" r="1.4" fill="#1e2a4d" />
            <path
              d="M16 30 Q20 33 24 30"
              stroke="#1e2a4d"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ))}
      <span className="pesawat-kertas">
        <svg viewBox="0 0 48 32" width="46" height="30">
          <path
            d="M2 16 L46 2 L30 30 L22 20 Z"
            fill="#ffffff"
            stroke="#7cc3ff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M22 20 L46 2 L18 18 Z"
            fill="#dbeafe"
            stroke="#7cc3ff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="awan-senyum">
        <svg viewBox="0 0 120 64" width="110" height="58">
          <path
            d="M24 56 Q4 56 6 40 Q8 26 24 28 Q26 10 46 10 Q62 8 68 22 Q76 12 90 18 Q104 24 100 36 Q116 38 114 50 Q112 58 98 56 Z"
            fill="#ffffff"
            stroke="#dbeafe"
            strokeWidth="2"
          />
          <circle cx="48" cy="38" r="2.4" fill="#1e2a4d" />
          <circle cx="70" cy="38" r="2.4" fill="#1e2a4d" />
          <path
            d="M53 45 Q59 50 65 45"
            stroke="#1e2a4d"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="42" cy="45" r="3.5" fill="#fbcfe8" />
          <circle cx="76" cy="45" r="3.5" fill="#fbcfe8" />
        </svg>
      </span>
    </div>
  );
}
