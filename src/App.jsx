import { useEffect, useState } from 'react'
import Belajar from './Belajar.jsx'
import EfekKlik from './Efek.jsx'
import { HewanHidup } from './Hewan.jsx'
import { PemberitahuanOffline, TombolInstall } from './Install.jsx'
import { hentikan } from './suara.js'
import { LatarHalaman, LatarHeader } from './Hiasan.jsx'
import Ikon from './Ikon.jsx'
import Latihan from './Latihan.jsx'
import Panggung from './Panggung.jsx'
import Tes from './Tes.jsx'
import Segitiga from './Segitiga.jsx'
import { NAMA, bulat, hitung, isTripel } from './pythagoras.js'
import './App.css'

// Sisi yang dicari: 'c' (miring), 'a' (alas), atau 'b' (tinggi)
const MODE = {
  c: { label: 'Sisi miring (c)', input: ['a', 'b'] },
  a: { label: 'Alas (a)', input: ['b', 'c'] },
  b: { label: 'Tinggi (b)', input: ['a', 'c'] },
}

const MENU = [
  ['belajar', 'Belajar'],
  ['kalkulator', 'Kalkulator'],
  ['latihan', 'Latihan Soal'],
  ['tes', 'Tes'],
]

const KUNCI_ANIMASI = 'pythagoras-animasi'


function bacaAnimasi() {
  try {
    return localStorage.getItem(KUNCI_ANIMASI) !== 'mati'
  } catch {
    return true
  }
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
  const [fokusTes, setFokusTes] = useState(false)
  const [animasi, setAnimasi] = useState(bacaAnimasi)

  // Kelas di <html> mematikan semua animasi (lihat "tanpa-animasi" di App.css)
  useEffect(() => {
    document.documentElement.classList.toggle('tanpa-animasi', !animasi)
    try {
      localStorage.setItem(KUNCI_ANIMASI, animasi ? 'nyala' : 'mati')
    } catch {
      // penyimpanan tidak tersedia: pilihan hanya berlaku selama halaman terbuka
    }
  }, [animasi])

  // bacaan suara berhenti setiap pindah menu atau saat tes dimulai
  useEffect(() => {
    hentikan()
  }, [halaman, fokusTes])
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
      {/* Latar animasi untuk seluruh halaman, disembunyikan saat tes */}
      {!fokusTes && <LatarHalaman />}
      <EfekKlik aktif={!fokusTes && animasi} />
      {/* Hewan di pinggir layar: panda & beruang mengintip, bebek berjalan melintas */}
      {!fokusTes && (
        <>
          <HewanHidup jenis="panda" className="pengintip kanan" />
          <HewanHidup jenis="beruang" className="pengintip kiri" />
          <HewanHidup jenis="bebek" className="pejalan" />
        </>
      )}
      <PemberitahuanOffline />
      <header className="hero">
        {!fokusTes && <LatarHeader />}
        <div className="hero-teks">
          <span className="lencana">Media Belajar · SMP Kelas 8</span>
          <h1>Penerapan Teorema Pythagoras</h1>
          <p>Belajar sedikit demi sedikit, dari mengenal segitiga sampai soal sehari-hari.</p>
          {!fokusTes && <TombolInstall />}
        </div>
        <Panggung halaman={halaman} diam={fokusTes} />
      </header>

      {/* Selama tes berlangsung menu disembunyikan agar siswa tidak membuka materi/kalkulator */}
      {!fokusTes && (
        <nav className="menu" aria-label="Menu utama">
          {MENU.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={halaman === id ? 'aktif' : ''}
              aria-current={halaman === id ? 'page' : undefined}
              onClick={() => setHalaman(id)}
            >
              <Ikon nama={id} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Belajar & Latihan tetap terpasang (hanya disembunyikan) agar progres dan skor tidak hilang saat pindah tab */}
      <div className="halaman" hidden={halaman !== 'belajar'}>
        <Belajar />
      </div>

      <div className="halaman" hidden={halaman !== 'latihan'}>
        <Latihan />
      </div>

      <div className="halaman" hidden={halaman !== 'tes'}>
        <Tes onFokus={setFokusTes} />
      </div>

      {halaman === 'kalkulator' && (
        <div className="halaman">
          <div className="grid">
            <section className="kartu ada-hewan">
              <HewanHidup jenis="anjing" className="hinggap kanan" />
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
                    {NAMA[cari]} = <strong className="angka-muncul" key={bulat(sisi[cari])}>{bulat(sisi[cari])}</strong>
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
    
            <section className="kartu gambar gambar-kalkulator">
              <h2>Gambar</h2>
              {/* key: segitiga digambar ulang (beranimasi) setiap hasil baru */}
              <Segitiga key={sisi ? `${sisi.a}-${sisi.b}-${sisi.c}` : 'kosong'} sisi={sisi} cari={cari} />
              <p className="ket">Garis berwarna adalah sisi yang dicari.</p>
            </section>
          </div>
    
          <section>
            <h2 className="judul-hewan">
              Contoh Soal Kehidupan Sehari-hari
              <HewanHidup jenis="kucing" className="sebaris" />
            </h2>
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
        </div>
      )}

      <footer className="kaki">
        <button type="button" className="kecil tombol-animasi" aria-pressed={animasi} onClick={() => setAnimasi(!animasi)}>
          {animasi ? '✨ Animasi: nyala' : '⏸ Animasi: mati'}
        </button>
        <p>Project UAS Algoritma Pemrograman · Azkiah Safira · 2225250013</p>
      </footer>
    </main>
  )
}

export default App
