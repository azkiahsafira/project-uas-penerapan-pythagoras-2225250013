import { useEffect, useState } from 'react'
import { LEPPINK, NAMA_DIMENSI, POSTTEST, PRETEST, nilaiLeppink, nilaiTes } from './tes.js'
import { daftarHasil, hapusHasil, identitasTerakhir, kirimTertunda, simpanHasil, simpanIdentitas, unduhCsv } from './penyimpanan.js'
import { supabaseAktif } from './supabase.js'
import { keAngka } from './pythagoras.js'

const INSTRUMEN = {
  pretest: {
    judul: 'Pre-test',
    waktu: 'Pertemuan 1, sebelum Sesi 1',
    ket: '10 soal tentang teorema Pythagoras. Kerjakan sendiri tanpa kalkulator atau bantuan orang lain. Tidak apa-apa jika belum bisa, kerjakan semampunya.',
    soal: PRETEST,
  },
  posttest: {
    judul: 'Post-test',
    waktu: 'Pertemuan 5',
    ket: '10 soal tentang teorema Pythagoras. Kerjakan sendiri tanpa kalkulator atau bantuan orang lain.',
    soal: POSTTEST,
  },
  leppink: {
    judul: 'Kuesioner Beban Kognitif',
    waktu: 'Pertemuan 5, setelah post-test',
    ket: '10 pernyataan tentang pengalaman belajarmu. Tidak ada jawaban benar atau salah, jawab sejujurnya.',
  },
}

// semua siswa yang memakai aplikasi ini belajar dengan aplikasi
const KELOMPOK = 'Belajar dengan aplikasi'

function FormIdentitas({ jenis, onMulai, onBatal }) {
  // penelitian ini khusus siswa kelas 8, jadi kelas selalu 8
  const [data, setData] = useState(() => ({ nama: '', sekolah: '', ...identitasTerakhir(), kelas: '8', kelompok: KELOMPOK }))
  const lengkap = data.nama.trim() && data.kelas && data.sekolah.trim()
  const ubah = (k) => (e) => setData({ ...data, [k]: e.target.value })

  return (
    <section className="kartu sempit">
      <p className="ket">{INSTRUMEN[jenis].waktu}</p>
      <h2>{INSTRUMEN[jenis].judul}</h2>
      <p>{INSTRUMEN[jenis].ket}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!lengkap) return
          const bersih = { ...data, nama: data.nama.trim(), sekolah: data.sekolah.trim() }
          simpanIdentitas(bersih)
          onMulai(bersih)
        }}
      >
        <label>
          Nama siswa
          <input value={data.nama} onChange={ubah('nama')} autoComplete="off" />
        </label>
        <label>
          Kelas
          <select value={data.kelas} onChange={ubah('kelas')}>
            <option value="8">Kelas 8</option>
          </select>
        </label>
        <label>
          Sekolah
          <input value={data.sekolah} onChange={ubah('sekolah')} autoComplete="off" />
        </label>
        <div className="navigasi">
          <button type="button" onClick={onBatal}>Batal</button>
          <button type="submit" className="hitung" disabled={!lengkap}>Mulai</button>
        </div>
      </form>
    </section>
  )
}

// Soal ditampilkan satu per satu tanpa umpan balik benar/salah,
// agar tes tidak ikut mengajari siswa.
function PengerjaanTes({ jenis, onKumpul }) {
  const soal = INSTRUMEN[jenis].soal
  const [idx, setIdx] = useState(0)
  const [jawaban, setJawaban] = useState({})
  const [konfirmasi, setKonfirmasi] = useState(false)
  const s = soal[idx]
  const terjawab = (i) => jawaban[i] !== undefined && jawaban[i] !== ''
  const kosong = soal.filter((_, i) => !terjawab(i)).length

  return (
    <section className="kartu sempit">
      <div className="kepala-sesi">
        <strong>{INSTRUMEN[jenis].judul}</strong>
        <span className="ket">Soal {idx + 1} dari {soal.length}</span>
      </div>
      <div className="nomor">
        {soal.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${i === idx ? 'aktif' : ''} ${terjawab(i) ? 'terjawab' : ''}`}
            aria-label={`Soal ${i + 1}${terjawab(i) ? ', sudah dijawab' : ''}`}
            onClick={() => setIdx(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <p className="soal">{s.tanya}</p>
      {s.tipe === 'pilihan' ? (
        <div className="opsi-tes">
          {s.opsi.map((o, k) => (
            <label key={o} className={`radio pilihan ${jawaban[idx] === o ? 'dipilih' : ''}`}>
              <input type="radio" name={`soal-${idx}`} checked={jawaban[idx] === o} onChange={() => setJawaban((j) => ({ ...j, [idx]: o }))} />
              <span className="huruf">{'ABCD'[k]}.</span> {o}
            </label>
          ))}
        </div>
      ) : (
        <label>
          Jawaban (angka)
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={jawaban[idx] ?? ''}
            onChange={(e) => setJawaban((j) => ({ ...j, [idx]: e.target.value }))}
          />
          {terjawab(idx) && !Number.isFinite(keAngka(jawaban[idx])) && <span className="error">Isi dengan angka.</span>}
        </label>
      )}

      <div className="navigasi">
        <button type="button" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Sebelumnya</button>
        {idx < soal.length - 1 ? (
          <button type="button" className="hitung" onClick={() => setIdx(idx + 1)}>Berikutnya</button>
        ) : (
          <button type="button" className="hitung" onClick={() => setKonfirmasi(true)}>Kumpulkan</button>
        )}
      </div>

      {konfirmasi && (
        <div className="umpan konfirmasi">
          <p>{kosong > 0 ? `Masih ada ${kosong} soal yang belum dijawab. ` : 'Semua soal sudah dijawab. '}Yakin ingin mengumpulkan? Jawaban tidak bisa diubah lagi.</p>
          <div className="navigasi">
            <button type="button" onClick={() => setKonfirmasi(false)}>Periksa lagi</button>
            <button type="button" className="hitung" onClick={() => onKumpul(jawaban)}>Ya, kumpulkan</button>
          </div>
        </div>
      )}
    </section>
  )
}

function KuesionerLeppink({ onKumpul }) {
  const [jawaban, setJawaban] = useState({})
  const kosong = LEPPINK.filter((b) => jawaban[b.id] === undefined).length

  return (
    <section className="kartu sempit">
      <h2>{INSTRUMEN.leppink.judul}</h2>
      <p>
        Pikirkan kegiatan belajar teorema Pythagoras yang sudah kamu ikuti. Untuk setiap pernyataan, pilih angka
        <strong> 0 (sama sekali tidak setuju)</strong> sampai <strong>10 (sangat setuju)</strong>.
      </p>
      <ol className="butir">
        {LEPPINK.map((b) => (
          <li key={b.id}>
            <p>{b.teks}</p>
            <div className="skala" role="radiogroup" aria-label={b.teks}>
              {Array.from({ length: 11 }, (_, n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={jawaban[b.id] === n}
                  className={jawaban[b.id] === n ? 'aktif' : ''}
                  onClick={() => setJawaban((j) => ({ ...j, [b.id]: n }))}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="ujung-skala ket">
              <span>Tidak setuju</span>
              <span>Sangat setuju</span>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="hitung lebar" disabled={kosong > 0} onClick={() => onKumpul(jawaban)}>
        {kosong > 0 ? `Jawab ${kosong} pernyataan lagi` : 'Kumpulkan'}
      </button>
    </section>
  )
}

function Hasil({ hasil, tersimpan, statusKirim, onKembali }) {
  return (
    <section className="kartu sempit">
      <h2>Terima kasih, {hasil.nama}!</h2>
      {hasil.jenis === 'leppink' ? (
        <>
          <p>Jawaban kuesioner sudah dicatat. Rata-rata tiap jenis beban (skala 0–10):</p>
          <ul>
            {Object.entries(hasil.beban).map(([k, v]) => (
              <li key={k}>{NAMA_DIMENSI[k]}: <strong>{v}</strong></li>
            ))}
          </ul>
        </>
      ) : (
        <p className="jawaban">
          {INSTRUMEN[hasil.jenis].judul} selesai. Benar {hasil.benar} dari {hasil.total} soal, nilai <strong>{hasil.skor}</strong>.
        </p>
      )}
      {!tersimpan && <p className="error">Hasil tidak bisa disimpan di perangkat ini. Catat atau foto layar ini.</p>}
      {supabaseAktif && statusKirim === 'mengirim' && <p className="ket">Mengirim hasil ke server...</p>}
      {supabaseAktif && statusKirim === 'terkirim' && <p className="umpan benar">Hasil sudah terkirim ke server.</p>}
      {supabaseAktif && statusKirim === 'gagal' && (
        <p className="umpan">Belum terkirim karena internet bermasalah. Hasil aman di perangkat ini dan akan dikirim otomatis nanti.</p>
      )}
      <button type="button" className="hitung" onClick={onKembali}>Kembali ke menu Tes</button>
    </section>
  )
}

function RiwayatHasil() {
  const [hasil, setHasil] = useState(daftarHasil)
  const [mengirim, setMengirim] = useState(false)
  const belum = hasil.filter((h) => !h.terkirim).length
  if (hasil.length === 0) return <p className="ket">Belum ada hasil yang tersimpan di perangkat ini.</p>

  return (
    <>
      <div className="tabel-wadah">
        <table>
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Nama</th>
              <th>Kelompok</th>
              <th>Instrumen</th>
              <th>Hasil</th>
              <th>Durasi</th>
              {supabaseAktif && <th>Server</th>}
              <th aria-label="Aksi" />
            </tr>
          </thead>
          <tbody>
            {[...hasil].reverse().map((h) => (
              <tr key={h.id}>
                <td>{new Date(h.selesai).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>{h.nama} (kls {h.kelas})</td>
                <td>{h.kelompok}</td>
                <td>{INSTRUMEN[h.jenis].judul}</td>
                <td>{h.jenis === 'leppink' ? `IL ${h.beban.IL} · EL ${h.beban.EL} · GL ${h.beban.GL}` : `${h.skor} (${h.benar}/${h.total})`}</td>
                <td>{Math.round(h.durasiDetik / 60)} mnt</td>
                {supabaseAktif && <td>{h.terkirim ? '✓ terkirim' : 'belum'}</td>}
                <td>
                  <button
                    type="button"
                    className="kecil"
                    onClick={() => {
                      if (window.confirm(`Hapus hasil ${INSTRUMEN[h.jenis].judul} milik ${h.nama}?`)) {
                        hapusHasil(h.id)
                        setHasil(daftarHasil())
                      }
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="aksi-riwayat">
        <button type="button" onClick={() => unduhCsv(hasil)}>Unduh semua hasil (CSV)</button>
        {supabaseAktif && belum > 0 && (
          <button
            type="button"
            disabled={mengirim}
            onClick={async () => {
              setMengirim(true)
              await kirimTertunda()
              setHasil(daftarHasil())
              setMengirim(false)
            }}
          >
            {mengirim ? 'Mengirim...' : `Kirim ${belum} hasil ke server`}
          </button>
        )}
      </div>
    </>
  )
}

export default function Tes({ onFokus }) {
  // tahap: null (menu) | 'identitas' | 'kerja' | 'hasil'
  const [tahap, setTahap] = useState(null)
  const [jenis, setJenis] = useState(null)
  const [identitas, setIdentitas] = useState(null)
  const [mulai, setMulai] = useState(null)
  const [hasil, setHasil] = useState(null)
  const [tersimpan, setTersimpan] = useState(true)
  const [statusKirim, setStatusKirim] = useState(null) // null | 'mengirim' | 'terkirim' | 'gagal'
  const [versiRiwayat, setVersiRiwayat] = useState(0)

  // Saat aplikasi dibuka, kirim hasil yang tertunda dari sesi sebelumnya
  useEffect(() => {
    kirimTertunda().then((n) => n > 0 && setVersiRiwayat((v) => v + 1))
  }, [])

  const keTahap = (t) => {
    setTahap(t)
    onFokus(t === 'kerja') // menu lain disembunyikan selama mengerjakan
    window.scrollTo({ top: 0 })
  }

  const kumpul = (jawaban) => {
    const selesai = new Date()
    const nilai = jenis === 'leppink' ? { beban: nilaiLeppink(jawaban) } : nilaiTes(INSTRUMEN[jenis].soal, jawaban)
    const data = {
      id: `${selesai.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      jenis,
      ...identitas,
      mulai: mulai.toISOString(),
      selesai: selesai.toISOString(),
      durasiDetik: Math.round((selesai - mulai) / 1000),
      jawaban,
      ...nilai,
    }
    setTersimpan(simpanHasil(data))
    setHasil(data)
    keTahap('hasil')
    if (supabaseAktif) {
      setStatusKirim('mengirim')
      kirimTertunda().then(() => {
        const ini = daftarHasil().find((h) => h.id === data.id)
        setStatusKirim(ini?.terkirim ? 'terkirim' : 'gagal')
      })
    }
  }

  if (tahap === 'identitas') {
    return (
      <FormIdentitas
        jenis={jenis}
        onBatal={() => keTahap(null)}
        onMulai={(id) => {
          setIdentitas(id)
          setMulai(new Date())
          keTahap('kerja')
        }}
      />
    )
  }
  if (tahap === 'kerja') {
    return jenis === 'leppink' ? <KuesionerLeppink onKumpul={kumpul} /> : <PengerjaanTes jenis={jenis} onKumpul={kumpul} />
  }
  if (tahap === 'hasil') {
    return <Hasil hasil={hasil} tersimpan={tersimpan} statusKirim={statusKirim} onKembali={() => keTahap(null)} />
  }

  return (
    <section>
      <h2>Tes dan Kuesioner Penelitian</h2>
      <p className="ket">Dikerjakan oleh siswa yang belajar dengan aplikasi ini.</p>
      <div className="daftar-sesi">
        {Object.entries(INSTRUMEN).map(([k, ins], i) => (
          <article key={k} className={`kartu sesi warna-${i + 1}`}>
            <p className="ket">{ins.waktu}</p>
            <h3>{ins.judul}</h3>
            <p>{ins.ket}</p>
            <button
              type="button"
              className="hitung"
              onClick={() => {
                setJenis(k)
                keTahap('identitas')
              }}
            >
              Mulai
            </button>
          </article>
        ))}
      </div>

      <h2 className="jarak-atas">Hasil Tersimpan</h2>
      <p className="ket">
        {supabaseAktif
          ? 'Hanya untuk peneliti. Tabel ini berisi hasil dari perangkat ini saja; hasil dari semua perangkat ada di dashboard Supabase (tabel hasil).'
          : 'Hanya untuk peneliti. Data tersimpan di perangkat ini saja, jadi unduh CSV-nya secara berkala.'}
      </p>
      <RiwayatHasil key={`${hasil?.id ?? 'awal'}-${versiRiwayat}-${statusKirim}`} />
    </section>
  )
}
