import { useEffect, useState } from 'react'
import { BAGIAN_KUESIONER, KUESIONER_HARIAN, NAMA_DIMENSI, POSTTEST, PRETEST, SKALA_PAAS, nilaiHarian, nilaiTes } from './tes.js'
import FormKode from './Masuk.jsx'
import { daftarHasil, hapusHasil, identitasTerakhir, kirimTertunda, serverAktif, simpanHasil, unduhCsv } from './penyimpanan.js'
import { keAngka } from './pythagoras.js'
import { kunciTes } from './alur.js'
import SOAL_LITERASI from './data/soal-literasi.json'

// Sakelar tes Mathematical Literacy (4 soal uraian dari kisi-kisi dosen). Bila VITE_TES_LITERASI=1 di .env,
// pre-test & post-test memakai soal ini dan dinilai manual oleh peneliti dengan rubrik
// (docs/instrumen-cetak-literasi). Bawaan: mati, sehingga tes 10 soal yang lama tetap dipakai.
export const TES_LITERASI = import.meta.env.VITE_TES_LITERASI === '1'
const URAIAN = SOAL_LITERASI.map((s) => ({ ...s, tipe: 'uraian' }))
const KET_LITERASI =
  '4 soal cerita. Tuliskan langkah penyelesaianmu selengkap mungkin: apa yang diketahui, rumus, perhitungan, dan kesimpulan. Kerjakan sendiri.'

// Urutan = urutan pengerjaan dalam 2 pertemuan (alur.js)
const KET_KUESIONER =
  '10 pertanyaan tentang seberapa besar usaha berpikirmu hari ini. Pilih angka 1 sampai 9. Tidak ada jawaban benar atau salah, dan tidak memengaruhi nilai.'
const INSTRUMEN = {
  pretest: {
    judul: 'Pre-test',
    waktu: 'Awal Pertemuan 1',
    ket: TES_LITERASI
      ? `${KET_LITERASI} Tidak apa-apa jika belum bisa, kerjakan semampunya.`
      : '10 soal tentang teorema Pythagoras. Kerjakan sendiri tanpa kalkulator atau bantuan orang lain. Tidak apa-apa jika belum bisa, kerjakan semampunya.',
    soal: TES_LITERASI ? URAIAN : PRETEST,
  },
  beban1: {
    judul: 'Kuesioner Pertemuan 1',
    waktu: 'Akhir Pertemuan 1 (setelah Sesi 1 & 2)',
    ket: KET_KUESIONER,
    kuesioner: true,
  },
  beban2: {
    judul: 'Kuesioner Pertemuan 2',
    waktu: 'Akhir Pertemuan 2 (setelah Sesi 3 & Latihan Soal)',
    ket: KET_KUESIONER,
    kuesioner: true,
  },
  posttest: {
    judul: 'Post-test',
    waktu: 'Akhir Pertemuan 2 (setelah Kuesioner Pertemuan 2)',
    ket: TES_LITERASI ? KET_LITERASI : '10 soal tentang teorema Pythagoras. Kerjakan sendiri tanpa kalkulator atau bantuan orang lain.',
    soal: TES_LITERASI ? URAIAN : POSTTEST,
  },
}
const judulInstrumen = (jenis) => INSTRUMEN[jenis]?.judul ?? jenis

// Sebelum tes: pakai kode siswa yang sudah tersimpan, atau masuk dengan kode siswa
function FormIdentitas({ jenis, onMulai, onBatal }) {
  const [ganti, setGanti] = useState(false)
  const ada = identitasTerakhir()
  const info = (
    <>
      {INSTRUMEN[jenis].waktu && <p className="ket">{INSTRUMEN[jenis].waktu}</p>}
      <p>{INSTRUMEN[jenis].ket}</p>
    </>
  )

  if (ada && !ganti) {
    return (
      <section className="kartu sempit">
        {INSTRUMEN[jenis].waktu && <p className="ket">{INSTRUMEN[jenis].waktu}</p>}
        <h2>{INSTRUMEN[jenis].judul}</h2>
        <p>{INSTRUMEN[jenis].ket}</p>
        <p className="belajar-sebagai">
          Masuk sebagai <strong>{ada.kode}</strong> (kelas {ada.kelas})
          <button type="button" className="kecil" onClick={() => setGanti(true)}>
            Bukan kamu? Ganti kode
          </button>
        </p>
        <div className="navigasi">
          <button type="button" onClick={onBatal}>
            Batal
          </button>
          <button type="button" className="hitung" onClick={() => onMulai(ada)}>
            Mulai
          </button>
        </div>
      </section>
    )
  }

  return <FormKode judul={INSTRUMEN[jenis].judul} atas={info} tombol="Masuk & mulai" onBatal={onBatal} onMasuk={onMulai} />
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

      {s.tipe === 'uraian' ? (
        <>
          <p className="soal">
            <strong>{s.judul}.</strong> {s.teks} <strong>{s.tanya}</strong>
          </p>
          <label>
            Jawaban dan langkah penyelesaianmu
            <textarea
              className="jawaban-uraian"
              rows={9}
              value={jawaban[idx] ?? ''}
              onChange={(e) => setJawaban((j) => ({ ...j, [idx]: e.target.value }))}
            />
          </label>
        </>
      ) : (
        <p className="soal">{s.tanya}</p>
      )}
      {s.tipe === 'uraian' ? null : s.tipe === 'pilihan' ? (
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

// Kuesioner Harian Cognitive Load: 10 butir dikelompokkan seperti lembar dosen, skala usaha mental Paas 1–9
function KuesionerHarian({ jenis, onKumpul }) {
  const [jawaban, setJawaban] = useState({})
  const kosong = KUESIONER_HARIAN.filter((b) => jawaban[b.id] === undefined).length

  return (
    <section className="kartu sempit">
      <p className="ket">{INSTRUMEN[jenis].waktu}</p>
      <h2>{INSTRUMEN[jenis].judul}</h2>
      <p>
        Setiap pertanyaan menanyakan seberapa besar <strong>usaha berpikir</strong> yang kamu keluarkan selama pelajaran tadi.
        Pilih angka <strong>1 (sangat rendah)</strong>, <strong>5 (sedang)</strong>, sampai <strong>9 (amat sangat tinggi)</strong>.
        Tidak ada jawaban benar atau salah, dan jawabanmu tidak memengaruhi nilai.
      </p>
      <ol className="skala-paas" aria-label="Keterangan skala usaha berpikir">
        {SKALA_PAAS.map((t, i) => (
          <li key={t}>
            <b>{i + 1}</b> {t}
          </li>
        ))}
      </ol>
      {['EL', 'IL', 'GL'].map((dim, nomorBagian) => (
        <div key={dim}>
          <h3 className="bagian-kuesioner">
            {nomorBagian + 1}. {BAGIAN_KUESIONER[dim]}
          </h3>
          <ol className="butir" start={KUESIONER_HARIAN.findIndex((b) => b.dimensi === dim) + 1}>
            {KUESIONER_HARIAN.filter((b) => b.dimensi === dim).map((b) => (
              <li key={b.id}>
                <p>{b.teks}</p>
                <div className="skala" role="radiogroup" aria-label={b.teks}>
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={jawaban[b.id] === n}
                      aria-label={`${n}: ${SKALA_PAAS[n - 1]}`}
                      className={jawaban[b.id] === n ? 'aktif' : ''}
                      onClick={() => setJawaban((j) => ({ ...j, [b.id]: n }))}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="ujung-skala ket">
                  <span>Sangat rendah</span>
                  <span>Amat sangat tinggi</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <button type="button" className="hitung lebar" disabled={kosong > 0} onClick={() => onKumpul(jawaban)}>
        {kosong > 0 ? `Jawab ${kosong} pertanyaan lagi` : 'Kumpulkan'}
      </button>
    </section>
  )
}

function Hasil({ hasil, tersimpan, statusKirim, onKembali }) {
  return (
    <section className="kartu sempit">
      <h2>Terima kasih, {hasil.nama}!</h2>
      {INSTRUMEN[hasil.jenis]?.kuesioner ? (
        <>
          <p>Jawaban kuesioner sudah dicatat. Rata-rata usaha berpikir tiap komponen (skala 1–9):</p>
          <ul>
            {Object.entries(hasil.beban).map(([k, v]) => (
              <li key={k}>{NAMA_DIMENSI[k]}: <strong>{v}</strong></li>
            ))}
          </ul>
        </>
      ) : hasil.skor === null ? (
        <p className="jawaban">{INSTRUMEN[hasil.jenis].judul} selesai. Jawabanmu sudah dikumpulkan dan akan dinilai oleh guru.</p>
      ) : (
        <p className="jawaban">
          {judulInstrumen(hasil.jenis)} selesai. Benar {hasil.benar} dari {hasil.total} soal, nilai <strong>{hasil.skor}</strong>.
        </p>
      )}
      {!tersimpan && <p className="error">Hasil tidak bisa disimpan di perangkat ini. Catat atau foto layar ini.</p>}
      {serverAktif && statusKirim === 'mengirim' && <p className="ket">Mengirim hasil ke server...</p>}
      {serverAktif && statusKirim === 'terkirim' && <p className="umpan benar">Hasil sudah terkirim ke server.</p>}
      {serverAktif && statusKirim === 'gagal' && (
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
              {serverAktif && <th>Server</th>}
              <th aria-label="Aksi" />
            </tr>
          </thead>
          <tbody>
            {[...hasil].reverse().map((h) => (
              <tr key={h.id}>
                <td>{new Date(h.selesai).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>{h.nama} (kls {h.kelas})</td>
                <td>{h.kelompok}</td>
                <td>{judulInstrumen(h.jenis)}</td>
                <td>
                  {h.beban
                    ? `EL ${h.beban.EL} · IL ${h.beban.IL} · GL ${h.beban.GL}`
                    : h.skor === null || h.skor === undefined
                      ? 'uraian (dinilai manual)'
                      : `${h.skor} (${h.benar}/${h.total})`}
                </td>
                <td>{Math.round(h.durasiDetik / 60)} mnt</td>
                {serverAktif && <td>{h.terkirim ? '✓ terkirim' : 'belum'}</td>}
                <td>
                  <button
                    type="button"
                    className="kecil"
                    onClick={() => {
                      if (window.confirm(`Hapus hasil ${judulInstrumen(h.jenis)} milik ${h.nama}?`)) {
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
        {serverAktif && belum > 0 && (
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
  const [pesanKunci, setPesanKunci] = useState(null) // muncul bila kode yang dipakai tidak boleh mengerjakan tes ini

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
    const kuesioner = INSTRUMEN[jenis].kuesioner === true
    const uraian = TES_LITERASI && !kuesioner
    // soal uraian Mathematical Literacy dinilai manual dengan rubrik, jadi skor dikosongkan
    const nilai =
      kuesioner
        ? { beban: nilaiHarian(jawaban) }
        : uraian
          ? { benar: null, total: null, skor: null }
          : nilaiTes(INSTRUMEN[jenis].soal, jawaban)
    const data = {
      id: `${selesai.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      jenis,
      ...identitas,
      mulai: mulai.toISOString(),
      selesai: selesai.toISOString(),
      durasiDetik: Math.round((selesai - mulai) / 1000),
      jawaban: uraian ? { ...jawaban, _instrumen: 'literasi' } : jawaban,
      ...nilai,
    }
    setTersimpan(simpanHasil(data))
    setHasil(data)
    keTahap('hasil')
    if (serverAktif) {
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
          // dicek lagi untuk kode yang baru masuk: tiap tes hanya sekali & mengikuti urutan pertemuan
          const k = kunciTes(jenis)
          if (k.sudah || k.terkunci) {
            setPesanKunci(k.sudah ? `${INSTRUMEN[jenis].judul} sudah dikerjakan oleh ${id.kode}. Setiap tes hanya dikerjakan satu kali.` : k.terkunci)
            keTahap(null)
            return
          }
          setPesanKunci(null)
          setIdentitas(id)
          setMulai(new Date())
          keTahap('kerja')
        }}
      />
    )
  }
  if (tahap === 'kerja') {
    return INSTRUMEN[jenis].kuesioner ? (
      <KuesionerHarian jenis={jenis} onKumpul={kumpul} />
    ) : (
      <PengerjaanTes jenis={jenis} onKumpul={kumpul} />
    )
  }
  if (tahap === 'hasil') {
    return <Hasil hasil={hasil} tersimpan={tersimpan} statusKirim={statusKirim} onKembali={() => keTahap(null)} />
  }

  return (
    <section>
      <h2>Tes dan Kuesioner Penelitian</h2>
      <p className="ket">
        Dikerjakan oleh siswa yang belajar dengan aplikasi ini, dalam 2 pertemuan: pre-test di awal Pertemuan 1, kuesioner di akhir
        Pertemuan 1, kuesioner di akhir Pertemuan 2, lalu post-test. Setiap instrumen hanya dikerjakan satu kali.
      </p>
      {pesanKunci && (
        <p className="info-terkunci" role="alert">
          🔒 {pesanKunci}
        </p>
      )}
      <div className="daftar-sesi">
        {Object.entries(INSTRUMEN).map(([k, ins], i) => {
          const { terkunci, sudah } = kunciTes(k)
          return (
            <article key={k} className={`kartu sesi warna-${i + 1} ${sudah ? 'sudah' : ''}`}>
              {ins.waktu && <p className="ket">{ins.waktu}</p>}
              <h3>{ins.judul}</h3>
              <p>{ins.ket}</p>
              {terkunci && <p className="ket">🔒 {terkunci}</p>}
              <button
                type="button"
                className="hitung"
                disabled={sudah || !!terkunci}
                onClick={() => {
                  setPesanKunci(null)
                  setJenis(k)
                  keTahap('identitas')
                }}
              >
                {sudah ? '✓ Sudah dikerjakan' : terkunci ? 'Belum dibuka' : 'Mulai'}
              </button>
            </article>
          )
        })}
      </div>

      <h2 className="jarak-atas">Hasil Tersimpan</h2>
      <p className="ket">
        {serverAktif
          ? 'Hanya untuk peneliti. Tabel ini berisi hasil dari perangkat ini saja; hasil dari semua perangkat ada di dashboard Supabase (tabel hasil).'
          : 'Hanya untuk peneliti. Data tersimpan di perangkat ini saja, jadi unduh CSV-nya secara berkala.'}
      </p>
      <RiwayatHasil key={`${hasil?.id ?? 'awal'}-${versiRiwayat}-${statusKirim}`} />
    </section>
  )
}
