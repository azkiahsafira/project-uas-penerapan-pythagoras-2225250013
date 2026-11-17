import { useCallback, useEffect, useRef, useState } from 'react'
import { bangunkanServer } from './api.js'
import Belajar from './Belajar.jsx'
import EfekKlik from './Efek.jsx'
import { HewanHidup } from './Hewan.jsx'
import { PemberitahuanOffline, PemberitahuanVersiBaru, TombolInstall } from './Install.jsx'
import { hentikan } from './suara.js'
import { LatarHalaman } from './Hiasan.jsx'
import { LatarHeaderLaut } from './Lautan.jsx'
import Ikon from './Ikon.jsx'
import Latihan from './Latihan.jsx'
import Panggung from './Panggung.jsx'
import Tes from './Tes.jsx'
import LayarBenar, { LayarSemangat } from './Tepuk.jsx'
import { aturSuaraTepuk, suaraTepukNyala } from './perayaan.js'
import Segitiga from './Segitiga.jsx'
import { HiasanLucu } from './Sekolah.jsx'
import Latar3D from './Latar3D.jsx'
import TombolMusik from './Musik.jsx'
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

// Contoh soal kalkulator = contoh pada materi PDF (docs/materi): Contoh 1–3 dan diagonal layar
const CONTOH = [
  {
    judul: 'Panjang tangga',
    cerita:
      'Tangga disandarkan pada dinding. Jarak kaki tangga ke dinding 3 m dan ujung atas tangga menyentuh dinding pada ketinggian 4 m. Berapa panjang tangga?',
    cari: 'c',
    nilai: { a: '3', b: '4' },
  },
  {
    judul: 'Tinggi layang-layang',
    cerita:
      'Benang layang-layang yang terulur panjangnya 29 m. Jarak mendatar ke titik tepat di bawah layang-layang 20 m. Berapa tinggi layang-layang?',
    cari: 'b',
    nilai: { a: '20', c: '29' },
  },
  {
    judul: 'Jarak terpendek',
    cerita: 'Andi berjalan 15 m ke timur, lalu 20 m ke utara. Berapa jarak terpendek Andi dari titik awal?',
    cari: 'c',
    nilai: { a: '15', b: '20' },
  },
  {
    judul: 'Diagonal layar',
    cerita: 'Layar monitor lebarnya 32 cm dan tingginya 24 cm. Berapa panjang diagonal layarnya?',
    cari: 'c',
    nilai: { a: '32', b: '24' },
  },
]

const URUTAN = MENU.map(([id]) => id)

// Swipe tidak dipakai bila jari mulai di isian, kanvas 3D yang bisa diputar, atau area yang bisa digeser ke samping
function bolehGeser(el) {
  if (el.closest?.('input, textarea, select, .menu, [data-tanpa-geser], canvas:not(.latar-3d-kanvas)')) return false
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    const gaya = getComputedStyle(n)
    if (/(auto|scroll)/.test(gaya.overflowX) && n.scrollWidth > n.clientWidth + 2) return false
  }
  return true
}

function App() {
  const [halaman, setHalaman] = useState('belajar')
  const [arah, setArah] = useState('kanan') // arah geser halaman: menu berikutnya masuk dari kanan
  const [sudahGeser, setSudahGeser] = useState(() => {
    try {
      return localStorage.getItem('pythagoras-sudah-geser') === '1'
    } catch {
      return false
    }
  })
  const menuRef = useRef(null)
  const [fokusTes, setFokusTes] = useState(false)
  const [animasi, setAnimasi] = useState(bacaAnimasi)
  const [suaraTepuk, setSuaraTepuk] = useState(suaraTepukNyala)

  // Kelas di <html> mematikan semua animasi (lihat "tanpa-animasi" di App.css)
  useEffect(() => {
    document.documentElement.classList.toggle('tanpa-animasi', !animasi)
    try {
      localStorage.setItem(KUNCI_ANIMASI, animasi ? 'nyala' : 'mati')
    } catch {
      // penyimpanan tidak tersedia: pilihan hanya berlaku selama halaman terbuka
    }
  }, [animasi])

  // server backend gratis bisa tertidur: sapa sekali saat aplikasi dibuka
  useEffect(() => {
    bangunkanServer()
  }, [])

  // bacaan suara berhenti setiap pindah menu atau saat tes dimulai
  useEffect(() => {
    hentikan()
  }, [halaman, fokusTes])

  // Pindah menu sesuai urutan Belajar → Kalkulator → Latihan Soal → Tes: halaman baru "bergeser" masuk dari arah
  // menu tujuan, dan layar digulir kembali ke menu bila siswa sedang di bawah
  const pindah = useCallback(
    (id) => {
      if (id === halaman) return
      setArah(URUTAN.indexOf(id) > URUTAN.indexOf(halaman) ? 'kanan' : 'kiri')
      setHalaman(id)
      const atasMenu = menuRef.current ? menuRef.current.getBoundingClientRect().top + window.scrollY - 8 : 0
      if (window.scrollY > atasMenu) window.scrollTo({ top: atasMenu, behavior: animasi ? 'smooth' : 'auto' })
    },
    [halaman, animasi],
  )

  // Di HP: geser layar ke kiri = menu berikutnya, ke kanan = menu sebelumnya (tidak aktif saat tes)
  useEffect(() => {
    if (fokusTes) return undefined
    let awal = null
    const mulai = (e) => {
      awal =
        e.touches.length === 1 && bolehGeser(e.target)
          ? { x: e.touches[0].clientX, y: e.touches[0].clientY, t: performance.now() }
          : null
    }
    const selesai = (e) => {
      if (!awal) return
      const t = e.changedTouches[0]
      const dx = t.clientX - awal.x
      const dy = t.clientY - awal.y
      const cepat = performance.now() - awal.t < 700
      awal = null
      if (!cepat || Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.6) return
      const i = URUTAN.indexOf(halaman) + (dx < 0 ? 1 : -1)
      if (i < 0 || i >= URUTAN.length) return
      pindah(URUTAN[i])
      setSudahGeser(true)
      try {
        localStorage.setItem('pythagoras-sudah-geser', '1')
      } catch {
        // penyimpanan tidak tersedia: petunjuk geser muncul lagi saat aplikasi dibuka ulang
      }
    }
    window.addEventListener('touchstart', mulai, { passive: true })
    window.addEventListener('touchend', selesai, { passive: true })
    return () => {
      window.removeEventListener('touchstart', mulai)
      window.removeEventListener('touchend', selesai)
    }
  }, [fokusTes, halaman, pindah])
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
      {!fokusTes && <HiasanLucu />}
      {!fokusTes && <Latar3D />}
      {/* musik latar: tombolnya tidak dipasang saat tes, jadi musik berhenti selama tes */}
      {!fokusTes && <TombolMusik />}
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
      <PemberitahuanVersiBaru sembunyikan={fokusTes} />
      {/* layar perayaan penuh saat jawaban benar (tidak pernah dipicu di menu Tes) */}
      <LayarBenar />
      <LayarSemangat />
      <header className={`hero ${fokusTes ? '' : 'laut'}`}>
        {!fokusTes && <LatarHeaderLaut />}
        <div className="hero-teks">
          <span className="lencana">🐠 Media Belajar · SMP Kelas 8</span>
          {!fokusTes && <span className="lencana rumus-lencana">a² + b² = c²</span>}
          <h1>Penerapan Teorema Pythagoras</h1>
          <p>Menyelam sedikit demi sedikit, dari mengenal segitiga sampai soal sehari-hari.</p>
          {!fokusTes && <TombolInstall />}
        </div>
        <Panggung halaman={halaman} diam={fokusTes} sekolah={!fokusTes} />
      </header>

      {/* Selama tes berlangsung menu disembunyikan agar siswa tidak membuka materi/kalkulator */}
      {!fokusTes && (
        <>
          {/* penanda aktif berupa gelembung yang meluncur ke menu yang dipilih, ditunggangi ikan kecil */}
          <nav className="menu" aria-label="Menu utama" ref={menuRef} style={{ '--i': URUTAN.indexOf(halaman) }}>
            <span className={`menu-penanda ke-${arah}`} aria-hidden="true">
              <svg className="menu-ikan" key={halaman} viewBox="0 0 48 30">
                <path d="M14 15 L2 5 L4 15 L2 25 Z" fill="#f58bbd" stroke="#1e2a4d" strokeWidth="1.8" strokeLinejoin="round" />
                <ellipse cx="26" cy="15" rx="16" ry="11" fill="#ffc4de" stroke="#1e2a4d" strokeWidth="2" />
                <circle cx="33" cy="12" r="4.2" fill="#ffffff" />
                <circle cx="34" cy="12.5" r="2.5" fill="#1e2a4d" />
                <ellipse cx="31" cy="19" rx="3" ry="1.6" fill="#ff6fa8" opacity="0.6" />
              </svg>
            </span>
            {MENU.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={halaman === id ? 'aktif' : ''}
                aria-current={halaman === id ? 'page' : undefined}
                onClick={() => pindah(id)}
              >
                <Ikon nama={id} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          {!sudahGeser && (
            <p className="petunjuk-geser" aria-hidden="true">
              👆 Geser layar ke kiri/kanan untuk pindah menu
            </p>
          )}
        </>
      )}

      {/* Belajar & Latihan tetap terpasang (hanya disembunyikan) agar progres dan skor tidak hilang saat pindah tab */}
      <div className={`halaman geser-${arah}`} hidden={halaman !== 'belajar'}>
        <Belajar />
      </div>

      <div className={`halaman geser-${arah}`} hidden={halaman !== 'latihan'}>
        <Latihan />
      </div>

      <div className={`halaman geser-${arah}`} hidden={halaman !== 'tes'}>
        <Tes onFokus={setFokusTes} />
      </div>

      {halaman === 'kalkulator' && (
        <div className={`halaman geser-${arah}`}>
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

      {/* jalur menu di bawah halaman: sebelumnya / berikutnya, dengan penanda posisi sekarang */}
      {!fokusTes && (
        <nav className="jalur-menu" aria-label="Pindah ke menu sebelumnya atau berikutnya">
          {URUTAN.indexOf(halaman) > 0 ? (
            <button type="button" className="kecil" onClick={() => pindah(URUTAN[URUTAN.indexOf(halaman) - 1])}>
              ← {MENU[URUTAN.indexOf(halaman) - 1][1]}
            </button>
          ) : (
            <span />
          )}
          <ol className="jalur-titik">
            {MENU.map(([id, label], i) => (
              <li key={id} className={i < URUTAN.indexOf(halaman) ? 'lewat' : id === halaman ? 'di-sini' : ''}>
                <button type="button" onClick={() => pindah(id)} aria-label={label} aria-current={id === halaman ? 'step' : undefined}>
                  <Ikon nama={id} />
                </button>
              </li>
            ))}
          </ol>
          {URUTAN.indexOf(halaman) < URUTAN.length - 1 ? (
            <button type="button" className="kecil lanjut" onClick={() => pindah(URUTAN[URUTAN.indexOf(halaman) + 1])}>
              {MENU[URUTAN.indexOf(halaman) + 1][1]} →
            </button>
          ) : (
            <span />
          )}
        </nav>
      )}

      <footer className="kaki">
        <button type="button" className="kecil tombol-animasi" aria-pressed={animasi} onClick={() => setAnimasi(!animasi)}>
          {animasi ? '✨ Animasi: nyala' : '⏸ Animasi: mati'}
        </button>
        <button
          type="button"
          className="kecil tombol-animasi"
          aria-pressed={suaraTepuk}
          onClick={() => {
            aturSuaraTepuk(!suaraTepuk)
            setSuaraTepuk(!suaraTepuk)
          }}
        >
          {suaraTepuk ? '👏 Suara tepuk tangan: nyala' : '🔇 Suara tepuk tangan: mati'}
        </button>
        <p>Project UAS Algoritma Pemrograman · Azkiah Safira · 2225250013</p>
      </footer>
    </main>
  )
}

export default App
