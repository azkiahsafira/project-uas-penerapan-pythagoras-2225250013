import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import TombolBacakan from './Bacakan.jsx'
import { HewanHidup } from './Hewan.jsx'
import { IlustrasiSesi, Konfeti, Pelangi } from './Hiasan.jsx'
import Maskot from './Maskot.jsx'
import FormKode from './Masuk.jsx'
import CekPrasyarat from './Prasyarat.jsx'
import { kunciBelajar } from './alur.js'
import Segitiga from './Segitiga.jsx'
import SegitigaPutar from './SegitigaPutar.jsx'
import { BATAS_SIAP, JUMLAH_PRASYARAT, bacaPrasyarat } from './bantuan.js'
import { rayakan, semangati } from './perayaan.js'
import { SESI } from './materi.js'
import { catatAktivitas, identitasTerakhir, kirimTertunda } from './penyimpanan.js'
import { keAngka } from './pythagoras.js'

// three.js berukuran besar: komponen 3D baru diunduh saat langkahnya dibuka
const Tangga3D = lazy(() => import('./Tangga3D.jsx'))

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
    <svg
      viewBox={`0 0 ${11 * s + 20} ${10 * s + 20}`}
      className="segitiga"
      role="img"
      aria-label="Persegi pada sisi segitiga: 9 + 16 = 25"
    >
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
  if (visual.jenis === 'putar') return <SegitigaPutar sisi={visual.sisi} orientasi={visual.orientasi} huruf={visual.label} />
  if (visual.jenis === 'tangga3d') {
    const { a, b, c } = visual.sisi
    const datar = <Segitiga sisi={visual.sisi} cari={visual.cari} />
    const nama = { a: 'kaki', b: 'tinggi', c: 'panjang' }
    return (
      <Suspense fallback={datar}>
        <Tangga3D kaki={a} tinggi={b} panjang={c} cari={nama[visual.cari]} cadangan={datar} />
      </Suspense>
    )
  }
  return <Segitiga sisi={visual.sisi} cari={visual.cari} sembunyikan={visual.sembunyikan} />
}

// Pertanyaan cek pemahaman. Setelah 2 kali salah, jawaban & penjelasan ditampilkan
// agar siswa tidak buntu (menjaga beban kognitif tetap terkendali).
function Cek({ cek, onSelesai, onSalah, disorot = false }) {
  const [isian, setIsian] = useState('')
  const [salah, setSalah] = useState(0)
  const [hasil, setHasil] = useState(null) // null | 'benar' | 'salah' | 'dibuka'

  const selesai = hasil === 'benar' || hasil === 'dibuka'

  const periksa = (nilai) => {
    if (selesai) return
    const benar = cek.tipe === 'angka' ? Math.abs(keAngka(nilai) - cek.jawab) < 0.01 : nilai === cek.jawab
    if (benar) {
      setHasil('benar')
      onSelesai('benar')
      rayakan()
    } else if (salah + 1 >= 2) {
      setSalah(salah + 1)
      setHasil('dibuka')
      semangati({ jenis: 'dibuka' })
      onSalah()
      onSelesai('dibuka')
    } else {
      setSalah(salah + 1)
      setHasil('salah')
      semangati({ jenis: 'petunjuk' })
      onSalah()
    }
  }

  return (
    <div className="cek">
      <p className={`cek-tanya ${disorot ? 'dibaca' : ''}`}>{cek.tanya}</p>
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
      {hasil && (
        // key: maskot dianimasikan ulang setiap umpan balik baru
        <div className="umpan-maskot" key={`${hasil}-${salah}`}>
          <div className="maskot-wadah">
            {hasil === 'benar' && <Konfeti />}
            <Maskot suasana={hasil === 'benar' ? 'senang' : 'mikir'} ukuran={64} />
          </div>
          {hasil === 'salah' && <p className="umpan salah">Belum tepat. Petunjuk: {cek.petunjuk}</p>}
          {hasil === 'benar' && <p className="umpan benar">Benar! {cek.penjelasan}</p>}
          {hasil === 'dibuka' && <p className="umpan">Tidak apa-apa, ini jawabannya: {cek.penjelasan}</p>}
        </div>
      )}
    </div>
  )
}

// Mencatat proses belajar (lihat tabel `aktivitas` di supabase/schema.sql):
// setiap kali siswa meninggalkan sebuah langkah, dicatat lama waktunya,
// berapa kali salah, dan hasil pertanyaannya; saat sesi selesai/keluar,
// dicatat total waktu sesi.
function PemutarSesi({ sesi, identitas, onKeluar, onTamat }) {
  const [idx, setIdx] = useState(0)
  const [beres, setBeres] = useState([]) // indeks langkah yang ceknya sudah dijawab
  const langkah = sesi.langkah[idx]
  const terakhir = idx === sesi.langkah.length - 1
  const bolehLanjut = !langkah.cek || beres.includes(idx)

  // bagian yang dibacakan berurutan: judul, tiap paragraf, rumus, lalu pertanyaan
  const [dibaca, setDibaca] = useState(null)
  const bagianDibaca = [
    langkah.judul,
    ...langkah.isi,
    ...(langkah.rumus ? [langkah.rumus.join('. ')] : []),
    ...(langkah.cek
      ? [langkah.cek.tanya + (langkah.cek.tipe === 'pilihan' ? ` Pilihannya: ${langkah.cek.opsi.join(', ')}.` : '')]
      : []),
  ]

  // catatan langkah yang sedang dibuka
  const catatan = useRef({ mulai: null, salah: 0, hasil: null, dibacakan: 0 })
  const sesiMulai = useRef(null)

  // waktu mulai sesi & langkah pertama dicatat sekali saat sesi dibuka
  useEffect(() => {
    const sekarang = new Date()
    sesiMulai.current = sekarang
    catatan.current.mulai = sekarang
  }, [])
  const totalSalah = useRef(0)
  const idxRef = useRef(0)

  const catatLangkah = (nomor) => {
    const selesai = new Date()
    const c = catatan.current
    catatAktivitas({
      jenis: 'langkah',
      ...identitas,
      sesi: sesi.id,
      langkah: nomor + 1,
      judul: sesi.langkah[nomor].judul,
      mulai: c.mulai.toISOString(),
      selesai: selesai.toISOString(),
      durasiDetik: Math.round((selesai - c.mulai) / 1000),
      salah: c.salah,
      dibacakan: c.dibacakan,
      hasil: c.hasil,
    })
    catatan.current = { mulai: selesai, salah: 0, hasil: null, dibacakan: 0 }
  }

  const catatSesi = (hasil) => {
    const selesai = new Date()
    catatAktivitas({
      jenis: 'sesi',
      ...identitas,
      sesi: sesi.id,
      langkah: null,
      judul: sesi.judul,
      mulai: sesiMulai.current.toISOString(),
      selesai: selesai.toISOString(),
      durasiDetik: Math.round((selesai - sesiMulai.current) / 1000),
      salah: totalSalah.current,
      hasil,
    })
    kirimTertunda()
  }

  // bila halaman ditutup di tengah sesi, langkah terakhir tetap tercatat
  useEffect(() => {
    const tutup = () => {
      catatLangkah(idxRef.current)
      catatSesi('keluar')
    }
    window.addEventListener('pagehide', tutup)
    return () => window.removeEventListener('pagehide', tutup)
  })

  const pindah = (ke) => {
    catatLangkah(idx)
    setDibaca(null)
    idxRef.current = ke
    setIdx(ke)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const keluar = () => {
    catatLangkah(idx)
    catatSesi('keluar')
    onKeluar()
  }

  const tamat = () => {
    catatLangkah(idx)
    catatSesi('selesai')
    onTamat()
  }

  return (
    <div className="pemutar">
      <div className="kepala-sesi">
        <button type="button" onClick={keluar}>
          ← Daftar sesi
        </button>
        <span className="ket">
          Langkah {idx + 1} dari {sesi.langkah.length}
        </span>
      </div>
      <div className="progres-wadah">
        <div className="progres" role="progressbar" aria-valuemin={1} aria-valuemax={sesi.langkah.length} aria-valuenow={idx + 1}>
          <div style={{ width: `${((idx + 1) / sesi.langkah.length) * 100}%` }} />
        </div>
        {/* Siku mini ikut berjalan di ujung progress bar */}
        <span className="pelari" style={{ left: `${((idx + 1) / sesi.langkah.length) * 100}%` }}>
          <Maskot ukuran={34} />
        </span>
      </div>

      <div className={langkah.visual ? 'grid' : ''}>
        <section className="kartu">
          <div className="kepala-langkah">
            <p className="ket">{sesi.judul}</p>
            {/* key: bacaan berhenti otomatis saat pindah langkah */}
            <TombolBacakan
              key={`baca-${sesi.id}-${idx}`}
              bagian={bagianDibaca}
              onBagian={setDibaca}
              onMulai={() => {
                catatan.current.dibacakan += 1
              }}
            />
          </div>
          <h2 className={dibaca === 0 ? 'dibaca' : ''}>{langkah.judul}</h2>
          {langkah.isi.map((p, i) => (
            <p key={p} className={`paragraf ${dibaca === i + 1 ? 'dibaca' : ''}`}>
              {p}
            </p>
          ))}
          {langkah.rumus && (
            <div className={`rumus ${dibaca === langkah.isi.length + 1 ? 'dibaca' : ''}`}>
              {langkah.rumus.map((r) => (
                <code key={r}>{r}</code>
              ))}
            </div>
          )}
          {/* key memastikan state cek direset saat pindah langkah */}
          {langkah.cek && (
            <Cek
              key={`${sesi.id}-${idx}`}
              disorot={dibaca === bagianDibaca.length - 1}
              cek={langkah.cek}
              onSalah={() => {
                catatan.current.salah += 1
                totalSalah.current += 1
              }}
              onSelesai={(hasil) => {
                catatan.current.hasil = hasil
                setBeres((b) => [...b, idx])
              }}
            />
          )}

          <div className="navigasi">
            <button type="button" disabled={idx === 0} onClick={() => pindah(idx - 1)}>
              Sebelumnya
            </button>
            {terakhir ? (
              <button type="button" className="hitung" disabled={!bolehLanjut} onClick={tamat}>
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
  const [selamat, setSelamat] = useState(null) // sesi yang baru saja diselesaikan
  const [identitas, setIdentitas] = useState(identitasTerakhir)
  const [kenalan, setKenalan] = useState(null) // sesi yang akan dibuka setelah masuk ('ganti' = hanya ganti kode)
  const [prasyarat, setPrasyarat] = useState(bacaPrasyarat) // hasil cek prasyarat terakhir
  const [cekPrasyarat, setCekPrasyarat] = useState(false)

  // s = sesi, atau 'prasyarat' untuk membuka cek prasyarat
  const mulai = (s) => {
    if (kunciBelajar()) return
    // identitas mungkin baru diisi di menu Latihan
    const id = identitas ?? identitasTerakhir()
    if (!id) return setKenalan(s)
    setIdentitas(id)
    if (s === 'prasyarat') setCekPrasyarat(true)
    else setAktif(s)
  }

  const tamat = (id) => {
    const baru = selesai.includes(id) ? selesai : [...selesai, id]
    setSelesai(baru)
    simpanProgres(baru)
    setSelamat(aktif)
    setAktif(null)
  }

  if (kenalan) {
    return (
      <FormKode
        tombol={kenalan === 'ganti' ? 'Masuk' : 'Masuk & mulai'}
        onBatal={() => setKenalan(null)}
        onMasuk={(baru) => {
          setIdentitas(baru)
          if (kunciBelajar()) setKenalan(null)
          else if (kenalan === 'prasyarat') setCekPrasyarat(true)
          else if (kenalan !== 'ganti') setAktif(kenalan)
          setKenalan(null)
        }}
      />
    )
  }

  if (cekPrasyarat) {
    const tutup = () => {
      setPrasyarat(bacaPrasyarat())
      setCekPrasyarat(false)
    }
    return (
      <CekPrasyarat
        identitas={identitas}
        onKeluar={() => setCekPrasyarat(false)}
        onSelesai={tutup}
        onKeSesi1={() => {
          tutup()
          setAktif(SESI[0])
        }}
      />
    )
  }

  if (aktif) {
    return <PemutarSesi sesi={aktif} identitas={identitas} onKeluar={() => setAktif(null)} onTamat={() => tamat(aktif.id)} />
  }

  // dibaca ulang setiap render: pre-test bisa baru saja dikumpulkan di menu Tes
  const kunciUmum = kunciBelajar()

  return (
    <section>
      {selamat && (
        <div className="selamat-latar" role="dialog" aria-modal="true" aria-labelledby="judul-selamat">
          <div className="selamat kartu">
            <div className="maskot-wadah besar">
              <Pelangi besar />
              <Konfeti jumlah={40} />
              <Maskot suasana="menari" ukuran={130} topi />
            </div>
            <h2 id="judul-selamat">Hebat, sesi {selamat.id} selesai! 🎉</h2>
            <p>
              {selamat.id < SESI.length
                ? `Sesi ${selamat.id + 1} sekarang sudah terbuka. Istirahat sebentar, lalu lanjut ya!`
                : 'Kamu sudah menyelesaikan semua sesi. Di pertemuan 4, terapkan ilmumu di menu Latihan Soal ya!'}
            </p>
            <button type="button" className="hitung" autoFocus onClick={() => setSelamat(null)}>
              Oke, siap!
            </button>
          </div>
        </div>
      )}
      <h2>Belajar Teorema Pythagoras</h2>
      <p className="ket">Ikuti sesi secara berurutan. Setiap sesi berisi penjelasan singkat, contoh, dan pertanyaan.</p>
      {identitas && (
        <p className="belajar-sebagai">
          Masuk sebagai <strong>{identitas.kode}</strong> (kelas {identitas.kelas})
          <button type="button" className="kecil" onClick={() => setKenalan('ganti')}>
            Ganti kode
          </button>
        </p>
      )}
      {/* Pertemuan 1: Belajar baru dibuka setelah pre-test dikumpulkan (alur.js) */}
      {kunciUmum && (
        <p className="info-terkunci" role="status">
          🔒 {kunciUmum}
        </p>
      )}
      {/* F2 Cek prasyarat kuadrat & akar (temuan IL3), dianjurkan sebelum Sesi 1 */}
      <article className={`kartu kartu-prasyarat ${prasyarat ? 'sudah' : 'berikutnya'}`}>
        <div>
          <span className="nomor-sesi">Pemanasan</span>
          <h3>Cek Prasyarat: Kuadrat & Akar</h3>
          <p className="ket">
            {prasyarat
              ? `Skor terakhir ${prasyarat.benar} / ${prasyarat.total}${
                  prasyarat.benar >= BATAS_SIAP ? ' · ✓ Siap belajar' : ' · Pelajari kuadrat & akar di Sesi 1'
                }`
              : `${JUMLAH_PRASYARAT} soal singkat (±2 menit) sebelum mulai Sesi 1.`}
          </p>
        </div>
        <button type="button" className="hitung" disabled={!!kunciUmum} onClick={() => mulai('prasyarat')}>
          {prasyarat ? 'Ulangi cek' : 'Mulai cek'}
        </button>
      </article>
      <div className="daftar-sesi ada-hewan">
        {/* anak ayam & kelinci hinggap di atas kartu sesi */}
        <HewanHidup jenis="ayam" className="hinggap kiri" />
        <HewanHidup jenis="kelinci" className="hinggap kanan" />
        {SESI.map((s, i) => {
          const sudah = selesai.includes(s.id)
          const terkunci = i > 0 && !selesai.includes(SESI[i - 1].id)
          // sesi pertama yang belum selesai & tidak terkunci diberi tanda berdenyut
          const berikutnya = prasyarat && !sudah && !terkunci && SESI.findIndex((x) => !selesai.includes(x.id)) === i
          return (
            <article key={s.id} className={`kartu sesi warna-${i + 1} ${sudah ? 'sudah' : ''} ${berikutnya ? 'berikutnya' : ''}`}>
              <IlustrasiSesi nomor={s.id} />
              <span className="nomor-sesi">Sesi {s.id}</span>
              <h3>{s.judul.replace(/^Sesi \d+: /, '')}</h3>
              <p>{s.tujuan}</p>
              <p className="ket">
                {s.langkah.length} langkah{sudah ? ' · ✓ Selesai' : ''}
                {terkunci ? ' · Selesaikan sesi sebelumnya dulu' : ''}
              </p>
              <button type="button" className="hitung" disabled={terkunci || !!kunciUmum} onClick={() => mulai(s)}>
                {sudah ? 'Ulangi sesi' : 'Mulai sesi'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
