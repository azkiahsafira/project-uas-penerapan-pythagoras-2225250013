import { useState } from 'react'
import Segitiga from './Segitiga.jsx'
import { SESI } from './materi.js'
import { keAngka } from './pythagoras.js'

const KUNCI_PROGRES = 'pythagoras-sesi-selesai'

function bacaProgres() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI_PROGRES)) ?? []
  } catch {
    return []
  }
}

function simpanProgres(ids) {
  try {
    localStorage.setItem(KUNCI_PROGRES, JSON.stringify(ids))
  } catch {
    // penyimpanan tidak tersedia (mode privat): progres hanya bertahan selama halaman terbuka
  }
}

// Persegi pada tiap sisi segitiga 3-4-5, untuk menunjukkan 9 + 16 = 25
function PersegiPythagoras() {
  const s = 20
  const x0 = 4 * s + 10
  const y0 = 7 * s + 10
  const O = [x0, y0]
  const A = [x0 + 3 * s, y0]
  const B = [x0, y0 - 4 * s]
  const n = [4 * s, -3 * s] // arah keluar dari sisi miring
  const titik = (...p) => p.map((q) => q.join(',')).join(' ')
  const pusat = (...p) => [p.reduce((t, q) => t + q[0], 0) / p.length, p.reduce((t, q) => t + q[1], 0) / p.length]
  const kotakA = [O, A, [A[0], y0 + 3 * s], [x0, y0 + 3 * s]]
  const kotakB = [O, B, [x0 - 4 * s, B[1]], [x0 - 4 * s, y0]]
  const kotakC = [A, B, [B[0] + n[0], B[1] + n[1]], [A[0] + n[0], A[1] + n[1]]]
  const teks = (kotak, isi) => {
    const [x, y] = pusat(...kotak)
    return (
      <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="luas">
        {isi}
      </text>
    )
  }
  return (
    <svg viewBox={`0 0 ${11 * s + 20} ${10 * s + 20}`} className="segitiga" role="img" aria-label="Persegi pada sisi segitiga: 9 + 16 = 25">
      <polygon points={titik(...kotakA)} className="persegi kecil" />
      <polygon points={titik(...kotakB)} className="persegi kecil" />
      <polygon points={titik(...kotakC)} className="persegi besar" />
      <polygon points={titik(O, A, B)} className="bidang" />
      {teks(kotakA, '3² = 9')}
      {teks(kotakB, '4² = 16')}
      {teks(kotakC, '5² = 25')}
    </svg>
  )
}

function Visual({ visual }) {
  if (!visual) return null
  if (visual.jenis === 'persegi') return <PersegiPythagoras />
  return <Segitiga sisi={visual.sisi} cari={visual.cari} sembunyikan={visual.sembunyikan} />
}

// Pertanyaan cek pemahaman. Setelah 2 kali salah, jawaban & penjelasan ditampilkan
// agar siswa tidak buntu (menjaga beban kognitif tetap terkendali).
function Cek({ cek, onSelesai }) {
  const [isian, setIsian] = useState('')
  const [salah, setSalah] = useState(0)
  const [hasil, setHasil] = useState(null) // null | 'benar' | 'salah' | 'dibuka'

  const selesai = hasil === 'benar' || hasil === 'dibuka'

  const periksa = (nilai) => {
    if (selesai) return
    const benar = cek.tipe === 'angka' ? Math.abs(keAngka(nilai) - cek.jawab) < 0.01 : nilai === cek.jawab
    if (benar) {
      setHasil('benar')
      onSelesai()
    } else if (salah + 1 >= 2) {
      setSalah(salah + 1)
      setHasil('dibuka')
      onSelesai()
    } else {
      setSalah(salah + 1)
      setHasil('salah')
    }
  }

  return (
    <div className="cek">
      <p className="cek-tanya">{cek.tanya}</p>
      {cek.tipe === 'pilihan' ? (
        <div className="opsi">
          {cek.opsi.map((o) => (
            <button
              key={o}
              type="button"
              disabled={selesai}
              className={selesai && o === cek.jawab ? 'aktif' : ''}
              onClick={() => periksa(o)}
            >
              {o}
            </button>
          ))}
        </div>
      ) : (
        <form
          className="aksi"
          onSubmit={(e) => {
            e.preventDefault()
            periksa(isian)
          }}
        >
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-label="Jawaban"
            value={isian}
            disabled={selesai}
            onChange={(e) => setIsian(e.target.value)}
          />
          <button type="submit" className="hitung" disabled={selesai || !Number.isFinite(keAngka(isian))}>
            Periksa
          </button>
        </form>
      )}
      {hasil === 'salah' && <p className="umpan salah">Belum tepat. Petunjuk: {cek.petunjuk}</p>}
      {hasil === 'benar' && <p className="umpan benar">Benar! {cek.penjelasan}</p>}
      {hasil === 'dibuka' && <p className="umpan">Jawabannya: {cek.penjelasan}</p>}
    </div>
  )
}

function PemutarSesi({ sesi, onKeluar, onTamat }) {
  const [idx, setIdx] = useState(0)
  const [beres, setBeres] = useState([]) // indeks langkah yang ceknya sudah dijawab
  const langkah = sesi.langkah[idx]
  const terakhir = idx === sesi.langkah.length - 1
  const bolehLanjut = !langkah.cek || beres.includes(idx)

  const pindah = (ke) => {
    setIdx(ke)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="pemutar">
      <div className="kepala-sesi">
        <button type="button" onClick={onKeluar}>← Daftar sesi</button>
        <span className="ket">
          Langkah {idx + 1} dari {sesi.langkah.length}
        </span>
      </div>
      <div className="progres" role="progressbar" aria-valuemin={1} aria-valuemax={sesi.langkah.length} aria-valuenow={idx + 1}>
        <div style={{ width: `${((idx + 1) / sesi.langkah.length) * 100}%` }} />
      </div>

      <div className={langkah.visual ? 'grid' : ''}>
        <section className="kartu">
          <p className="ket">{sesi.judul}</p>
          <h2>{langkah.judul}</h2>
          {langkah.isi.map((p) => (
            <p key={p} className="paragraf">{p}</p>
          ))}
          {langkah.rumus && (
            <div className="rumus">
              {langkah.rumus.map((r) => (
                <code key={r}>{r}</code>
              ))}
            </div>
          )}
          {/* key memastikan state cek direset saat pindah langkah */}
          {langkah.cek && <Cek key={`${sesi.id}-${idx}`} cek={langkah.cek} onSelesai={() => setBeres((b) => [...b, idx])} />}

          <div className="navigasi">
            <button type="button" disabled={idx === 0} onClick={() => pindah(idx - 1)}>
              Sebelumnya
            </button>
            {terakhir ? (
              <button type="button" className="hitung" disabled={!bolehLanjut} onClick={onTamat}>
                Selesaikan sesi
              </button>
            ) : (
              <button type="button" className="hitung" disabled={!bolehLanjut} onClick={() => pindah(idx + 1)}>
                Lanjut
              </button>
            )}
          </div>
          {!bolehLanjut && <p className="ket">Jawab pertanyaan di atas untuk melanjutkan.</p>}
        </section>

        {langkah.visual && (
          <section className="kartu gambar">
            <Visual visual={langkah.visual} />
          </section>
        )}
      </div>
    </div>
  )
}

export default function Belajar() {
  const [aktif, setAktif] = useState(null)
  const [selesai, setSelesai] = useState(bacaProgres)

  const tamat = (id) => {
    const baru = selesai.includes(id) ? selesai : [...selesai, id]
    setSelesai(baru)
    simpanProgres(baru)
    setAktif(null)
  }

  if (aktif) {
    return <PemutarSesi sesi={aktif} onKeluar={() => setAktif(null)} onTamat={() => tamat(aktif.id)} />
  }

  return (
    <section>
      <h2>Belajar Teorema Pythagoras</h2>
      <p className="ket">Ikuti sesi secara berurutan. Setiap sesi berisi penjelasan singkat, contoh, dan pertanyaan.</p>
      <div className="daftar-sesi">
        {SESI.map((s, i) => {
          const sudah = selesai.includes(s.id)
          const terkunci = i > 0 && !selesai.includes(SESI[i - 1].id)
          return (
            <article key={s.id} className={`kartu sesi warna-${i + 1} ${sudah ? 'sudah' : ''}`}>
              <span className="nomor-sesi">Sesi {s.id}</span>
              <h3>{s.judul.replace(/^Sesi \d+: /, '')}</h3>
              <p>{s.tujuan}</p>
              <p className="ket">
                {s.langkah.length} langkah{sudah ? ' · ✓ Selesai' : ''}
                {terkunci ? ' · Selesaikan sesi sebelumnya dulu' : ''}
              </p>
              <button type="button" className="hitung" disabled={terkunci} onClick={() => setAktif(s)}>
                {sudah ? 'Ulangi sesi' : 'Mulai sesi'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
