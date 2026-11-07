import { useState } from 'react'
import Belajar from './Belajar.jsx'
import Latihan from './Latihan.jsx'
import Segitiga from './Segitiga.jsx'
import { NAMA, bulat, hitung, isTripel } from './pythagoras.js'
import './App.css'

// Sisi yang dicari: 'c' (miring), 'a' (alas), atau 'b' (tinggi)
const MODE = {
  c: { label: 'Sisi miring (c)', input: ['a', 'b'] },
  a: { label: 'Alas (a)', input: ['b', 'c'] },
  b: { label: 'Tinggi (b)', input: ['a', 'c'] },
}

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

function App() {
  const [halaman, setHalaman] = useState('belajar')
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
  const tripel = sisi && isTripel(sisi)

  return (
    <main>
      <header>
        <h1>Penerapan Teorema Pythagoras</h1>
        <p>Media belajar teorema Pythagoras untuk siswa SMP.</p>
        <nav className="menu">
          <button
            type="button"
            className={halaman === 'belajar' ? 'aktif' : ''}
            aria-current={halaman === 'belajar' ? 'page' : undefined}
            onClick={() => setHalaman('belajar')}
          >
            Belajar
          </button>
          <button
            type="button"
            className={halaman === 'kalkulator' ? 'aktif' : ''}
            aria-current={halaman === 'kalkulator' ? 'page' : undefined}
            onClick={() => setHalaman('kalkulator')}
          >
            Kalkulator
          </button>
          <button
            type="button"
            className={halaman === 'latihan' ? 'aktif' : ''}
            aria-current={halaman === 'latihan' ? 'page' : undefined}
            onClick={() => setHalaman('latihan')}
          >
            Latihan Soal
          </button>
        </nav>
      </header>

      {/* Belajar & Latihan tetap terpasang (hanya disembunyikan) agar progres dan skor tidak hilang saat pindah tab */}
      <div hidden={halaman !== 'belajar'}>
        <Belajar />
      </div>

      <div hidden={halaman !== 'latihan'}>
        <Latihan />
      </div>

      {halaman === 'kalkulator' && (
        <>
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
        </>
      )}
    </main>
  )
}

export default App
