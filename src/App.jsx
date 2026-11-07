import { useState } from 'react'
import './App.css'

// Sisi yang dicari: 'c' (miring), 'a' (alas), atau 'b' (tinggi)
const MODE = {
  c: { label: 'Sisi miring (c)', input: ['a', 'b'] },
  a: { label: 'Alas (a)', input: ['b', 'c'] },
  b: { label: 'Tinggi (b)', input: ['a', 'c'] },
}

const NAMA = { a: 'Alas (a)', b: 'Tinggi (b)', c: 'Sisi miring (c)' }

const CONTOH = [
  {
    judul: 'Tangga bersandar di dinding',
    cerita: 'Tangga sepanjang 5 m bersandar di dinding. Jarak kaki tangga ke dinding 3 m. Berapa tinggi dinding yang dicapai tangga?',
    cari: 'b',
    nilai: { a: '3', c: '5' },
  },
  {
    judul: 'Ukuran layar TV',
    cerita: 'Layar TV lebarnya 80 cm dan tingginya 45 cm. Berapa panjang diagonal layar?',
    cari: 'c',
    nilai: { a: '80', b: '45' },
  },
  {
    judul: 'Layang-layang',
    cerita: 'Benang layang-layang sepanjang 25 m. Jarak mendatar anak ke titik di bawah layang-layang 15 m. Berapa tinggi layang-layang?',
    cari: 'b',
    nilai: { a: '15', c: '25' },
  },
  {
    judul: 'Jalan pintas di lapangan',
    cerita: 'Lapangan berukuran 40 m × 30 m. Berapa jarak jika berjalan memotong secara diagonal?',
    cari: 'c',
    nilai: { a: '40', b: '30' },
  },
]

const bulat = (x) => Math.round(x * 100) / 100

function hitung(cari, nilai) {
  const v = {}
  for (const k of MODE[cari].input) {
    const n = parseFloat(String(nilai[k]).replace(',', '.'))
    if (!Number.isFinite(n) || n <= 0) {
      return { error: `${NAMA[k]} harus berupa angka lebih dari 0.` }
    }
    v[k] = n
  }

  if (cari === 'c') {
    const kuadrat = v.a ** 2 + v.b ** 2
    return {
      sisi: { ...v, c: Math.sqrt(kuadrat) },
      langkah: [
        'c² = a² + b²',
        `c² = ${v.a}² + ${v.b}²`,
        `c² = ${bulat(v.a ** 2)} + ${bulat(v.b ** 2)}`,
        `c² = ${bulat(kuadrat)}`,
        `c = √${bulat(kuadrat)} = ${bulat(Math.sqrt(kuadrat))}`,
      ],
    }
  }

  const lain = cari === 'a' ? 'b' : 'a'
  if (v.c <= v[lain]) {
    return { error: 'Sisi miring (c) harus lebih panjang dari sisi lainnya.' }
  }
  const kuadrat = v.c ** 2 - v[lain] ** 2
  const hasil = Math.sqrt(kuadrat)
  return {
    sisi: { ...v, [cari]: hasil },
    langkah: [
      `${cari}² = c² − ${lain}²`,
      `${cari}² = ${v.c}² − ${v[lain]}²`,
      `${cari}² = ${bulat(v.c ** 2)} − ${bulat(v[lain] ** 2)}`,
      `${cari}² = ${bulat(kuadrat)}`,
      `${cari} = √${bulat(kuadrat)} = ${bulat(hasil)}`,
    ],
  }
}

function Segitiga({ sisi, cari }) {
  const W = 300
  const H = 220
  const pad = 40
  const a = sisi?.a ?? 4
  const b = sisi?.b ?? 3
  const skala = Math.min((W - pad * 2) / a, (H - pad * 2) / b)
  const x0 = pad
  const y0 = H - pad
  const x1 = x0 + a * skala
  const y1 = y0 - b * skala
  const label = (k) => (sisi ? `${k} = ${bulat(sisi[k])}` : k)
  const kelas = (k) => (k === cari ? 'sisi dicari' : 'sisi')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="segitiga" role="img" aria-label="Gambar segitiga siku-siku">
      <polygon points={`${x0},${y0} ${x1},${y0} ${x0},${y1}`} className="bidang" />
      <line x1={x0} y1={y0} x2={x1} y2={y0} className={kelas('a')} />
      <line x1={x0} y1={y0} x2={x0} y2={y1} className={kelas('b')} />
      <line x1={x1} y1={y0} x2={x0} y2={y1} className={kelas('c')} />
      <rect x={x0} y={y0 - 12} width="12" height="12" className="siku" />
      <text x={(x0 + x1) / 2} y={y0 + 22} textAnchor="middle">{label('a')}</text>
      <text x={x0 - 8} y={(y0 + y1) / 2} textAnchor="end" dominantBaseline="middle">{label('b')}</text>
      <text x={(x0 + x1) / 2 + 10} y={(y0 + y1) / 2 - 10}>{label('c')}</text>
    </svg>
  )
}

function App() {
  const [cari, setCari] = useState('c')
  const [nilai, setNilai] = useState({ a: '3', b: '4', c: '' })
  const [hasil, setHasil] = useState(() => hitung('c', { a: '3', b: '4' }))

  const gantiMode = (m) => {
    setCari(m)
    setHasil(null)
  }

  const pakaiContoh = (ct) => {
    const baru = { a: '', b: '', c: '', ...ct.nilai }
    setCari(ct.cari)
    setNilai(baru)
    setHasil(hitung(ct.cari, baru))
  }

  const kirim = (e) => {
    e.preventDefault()
    setHasil(hitung(cari, nilai))
  }

  const sisi = hasil?.sisi
  const tripel =
    sisi && ['a', 'b', 'c'].every((k) => Number.isInteger(bulat(sisi[k])) && Math.abs(sisi[k] - Math.round(sisi[k])) < 1e-9)

  return (
    <main>
      <header>
        <h1>Penerapan Teorema Pythagoras</h1>
        <p>Pada segitiga siku-siku berlaku <strong>c² = a² + b²</strong>, dengan c adalah sisi miring.</p>
      </header>

      <div className="grid">
        <section className="kartu">
          <h2>Kalkulator</h2>
          <div className="tab" role="tablist">
            {Object.keys(MODE).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={cari === m}
                className={cari === m ? 'aktif' : ''}
                onClick={() => gantiMode(m)}
              >
                Cari {MODE[m].label}
              </button>
            ))}
          </div>

          <form onSubmit={kirim}>
            {MODE[cari].input.map((k) => (
              <label key={k}>
                {NAMA[k]}
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  value={nilai[k]}
                  onChange={(e) => setNilai({ ...nilai, [k]: e.target.value })}
                />
              </label>
            ))}
            <button type="submit" className="hitung">Hitung</button>
          </form>

          {hasil?.error && <p className="error">{hasil.error}</p>}

          {sisi && (
            <div className="hasil">
              <p className="jawaban">
                {NAMA[cari]} = <strong>{bulat(sisi[cari])}</strong>
              </p>
              <ol>
                {hasil.langkah.map((l) => (
                  <li key={l}><code>{l}</code></li>
                ))}
              </ol>
              {tripel && (
                <p className="tripel">
                  ({bulat(sisi.a)}, {bulat(sisi.b)}, {bulat(sisi.c)}) adalah <em>tripel Pythagoras</em> — ketiga sisinya bilangan bulat.
                </p>
              )}
            </div>
          )}
        </section>

        <section className="kartu gambar">
          <h2>Gambar</h2>
          <Segitiga sisi={sisi} cari={cari} />
          <p className="ket">Garis berwarna adalah sisi yang dicari.</p>
        </section>
      </div>

      <section>
        <h2>Contoh Soal Kehidupan Sehari-hari</h2>
        <div className="contoh">
          {CONTOH.map((ct) => (
            <article key={ct.judul} className="kartu">
              <h3>{ct.judul}</h3>
              <p>{ct.cerita}</p>
              <button type="button" onClick={() => pakaiContoh(ct)}>Coba hitung</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
