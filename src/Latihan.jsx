import { useEffect, useRef, useState } from 'react'
import TombolBacakan from './Bacakan.jsx'
import FormKode from './Masuk.jsx'
import { HewanHidup } from './Hewan.jsx'
import { Konfeti } from './Hiasan.jsx'
import Maskot from './Maskot.jsx'
import SegitigaPutar from './SegitigaPutar.jsx'
import {
  BATAS_LANCAR,
  PERAN,
  SETIAP_REFLEKSI,
  TAHAP_PETUNJUK,
  buatOrientasi,
  buatRefleksi,
  cekKewajaran,
  kalimatKewajaran,
  pecahCerita,
  peranSisi,
  petunjuk,
} from './bantuan.js'
import { rayakan, semangati } from './perayaan.js'
import { INPUT, bulat, hitung, keAngka } from './pythagoras.js'
import { catatAktivitas, identitasTerakhir, kirimTertunda } from './penyimpanan.js'

// Pertemuan 4 (implementasi): siswa menerapkan Pythagoras pada soal sehari-hari.
// Setiap soal yang dijawab dicatat ke tabel `aktivitas` (jenis 'latihan', sesi 4).
// Alur tiap soal (temuan wawancara, prd.md §5): 1) Diketahui & Ditanya (EL1), 2) tunjuk sisi miring
// pada segitiga yang diputar (IL1), 3) hitung dengan petunjuk bertingkat (GL3) dan cek kewajaran (GL2).
// Langkah 1-2 dipudarkan setelah siswa lancar; refleksi "Mengapa…?" (GL4) setiap soal ke-3.
export const PERTEMUAN_LATIHAN = 4
export const TARGET_SOAL = 10

// Tripel Pythagoras dasar (a, b, c) agar jawaban selalu bilangan bulat
const TRIPEL = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [9, 12, 15],
  [7, 24, 25],
  [12, 16, 20],
  [15, 20, 25],
  [20, 21, 29],
  [9, 40, 41],
]

// Cerita soal sehari-hari untuk tiap sisi yang dicari
const CERITA = {
  c: [
    (s) => `Layar laptop lebarnya ${s.a} cm dan tingginya ${s.b} cm. Berapa cm panjang diagonal layar?`,
    (s) => `Rina berjalan ${s.a} m ke timur, lalu ${s.b} m ke utara. Berapa meter jarak terpendek Rina dari titik awal?`,
    (s) =>
      `Taman berbentuk persegi panjang berukuran ${s.a} m × ${s.b} m. Berapa meter panjang jalan setapak yang memotong taman secara diagonal?`,
    (s) =>
      `Pada peta, rumah Dimas ${s.a} km di sebelah barat sekolah, dan pasar ${s.b} km di sebelah utara rumah Dimas. Berapa km jarak lurus dari sekolah ke pasar?`,
    (s) => `Sebuah kapal berlayar ${s.a} km ke selatan, lalu ${s.b} km ke barat. Berapa km jarak kapal dari pelabuhan asalnya?`,
    (s) =>
      `Bingkai foto berukuran ${s.a} cm × ${s.b} cm akan diberi pita lurus dari sudut ke sudut yang berseberangan. Berapa cm panjang pita yang dibutuhkan?`,
  ],
  b: [
    (s) =>
      `Tangga sepanjang ${s.c} m bersandar di dinding. Kaki tangga berjarak ${s.a} m dari dinding. Berapa meter tinggi dinding yang dicapai ujung tangga?`,
    (s) =>
      `Benang layang-layang yang terulur sepanjang ${s.c} m. Jarak mendatar anak ke titik tepat di bawah layang-layang ${s.a} m. Berapa meter tinggi layang-layang?`,
    (s) =>
      `Bayangan sebuah pohon panjangnya ${s.a} m. Jarak dari ujung bayangan ke puncak pohon ${s.c} m. Berapa meter tinggi pohon itu?`,
    (s) => `Layar televisi diagonalnya ${s.c} inci dan lebarnya ${s.a} inci. Berapa inci tinggi layar televisi itu?`,
  ],
  a: [
    (s) =>
      `Tiang bendera setinggi ${s.b} m ditopang kawat sepanjang ${s.c} m dari puncak tiang ke tanah. Berapa meter jarak ujung kawat di tanah ke kaki tiang?`,
    (s) =>
      `Papan seluncur sepanjang ${s.c} m dipasang dari ketinggian ${s.b} m. Berapa meter jarak mendatar dari bawah tangga ke ujung seluncuran?`,
    (s) =>
      `Jalan landai untuk kursi roda panjangnya ${s.c} m dan naik setinggi ${s.b} m. Berapa meter jarak mendatar jalan landai itu?`,
  ],
}

const acak = (arr) => arr[Math.floor(Math.random() * arr.length)]

function buatSoal(sebelumnya) {
  for (;;) {
    const [a, b, c] = acak(TRIPEL)
    const sisi = { a, b, c }
    const cari = acak(['a', 'b', 'c'])
    const cerita = acak(CERITA[cari])(sisi)
    if (cerita !== sebelumnya?.cerita) return { sisi, cari, cerita, orientasi: buatOrientasi() }
  }
}

const NAMA_SISI = { a: 'sisi a', b: 'sisi b', c: 'sisi miring c' }

// Keadaan awal setiap soal. `penuh` = bantuan langkah (Diketahui/Ditanya & tunjuk sisi miring) ditampilkan.
const awalSoal = (penuh) => ({
  tahap: penuh ? 'diketahui' : 'hitung', // 'diketahui' | 'miring' | 'hitung'
  diambil: [], // sisi yang angkanya sudah diketuk siswa, mis. ['a', 'b']
  peran: {}, // sisi -> 'siku' | 'miring' (pilihan siswa)
  ditanya: null, // 'siku' | 'miring'
  salahDiketahui: 0,
  pesanDiketahui: null,
  salahMiring: [], // sisi yang keliru diketuk
  petunjuk: 0, // jumlah petunjuk yang dibuka
  peringatan: null, // pesan cek kewajaran yang sedang tampil
  kewajaran: 0, // berapa kali cek kewajaran muncul
})

// F5 Langkah 1: ketuk angka di soal → tentukan perannya → tentukan yang ditanya
function LangkahDiketahui({ soal, keadaan, ubah, onBenar }) {
  const potongan = pecahCerita(soal)
  const diketahui = INPUT[soal.cari]
  const dibuka = keadaan.salahDiketahui >= 2
  const lengkap = keadaan.diambil.length > 0 && keadaan.diambil.every((k) => keadaan.peran[k]) && keadaan.ditanya

  const ambil = (k) =>
    ubah((s) => ({
      ...s,
      pesanDiketahui: null,
      diambil: s.diambil.includes(k) ? s.diambil.filter((x) => x !== k) : [...s.diambil, k],
    }))

  const periksa = () => {
    let pesan = null
    if (diketahui.some((k) => !keadaan.diambil.includes(k)))
      pesan = 'Masih ada angka yang diketahui yang belum kamu ketuk di soal.'
    else if (keadaan.diambil.some((k) => keadaan.peran[k] !== peranSisi(k)))
      pesan =
        'Ada sisi yang tertukar. Ingat: sisi miring berada di depan sudut siku-siku dan paling panjang (misalnya tangga yang bersandar, diagonal, atau jarak lurus).'
    else if (keadaan.ditanya !== peranSisi(soal.cari))
      pesan = 'Yang ditanya belum tepat. Baca lagi kalimat tanya di akhir soal: sisi mana yang dicari?'
    if (!pesan) return onBenar()
    ubah((s) => ({ ...s, salahDiketahui: s.salahDiketahui + 1, pesanDiketahui: pesan }))
  }

  return (
    <div className="langkah-bantu">
      <p className="judul-langkah">
        <span className="no-langkah">1</span> Diketahui &amp; Ditanya
      </p>
      <p className="ket">Ketuk angka yang diketahui pada soal, lalu tentukan sisinya.</p>
      <p className="soal soal-ketuk">
        {potongan.map((p, i) =>
          p.sisi ? (
            <button
              key={i}
              type="button"
              className={`chip-angka ${keadaan.diambil.includes(p.sisi) ? 'aktif' : ''}`}
              aria-pressed={keadaan.diambil.includes(p.sisi)}
              disabled={dibuka}
              onClick={() => ambil(p.sisi)}
            >
              {p.teks}
            </button>
          ) : (
            <span key={i}>{p.teks}</span>
          ),
        )}
      </p>

      <div className="tabel-diketahui">
        <p className="kepala-tabel">Diketahui</p>
        {(dibuka ? diketahui : keadaan.diambil).map((k) => (
          <div key={k} className="baris-diketahui">
            <span className="nilai">{potongan.find((p) => p.sisi === k)?.teks}</span>
            <div className="opsi">
              {Object.entries(PERAN).map(([id, nama]) => (
                <button
                  key={id}
                  type="button"
                  disabled={dibuka}
                  className={(dibuka ? peranSisi(k) : keadaan.peran[k]) === id ? 'aktif' : ''}
                  onClick={() => ubah((s) => ({ ...s, pesanDiketahui: null, peran: { ...s.peran, [k]: id } }))}
                >
                  {nama}
                </button>
              ))}
            </div>
          </div>
        ))}
        {!dibuka && keadaan.diambil.length === 0 && <p className="ket">Belum ada angka yang diketuk.</p>}
        <p className="kepala-tabel">Ditanya</p>
        <div className="opsi">
          {Object.entries(PERAN).map(([id, nama]) => (
            <button
              key={id}
              type="button"
              disabled={dibuka}
              className={(dibuka ? peranSisi(soal.cari) : keadaan.ditanya) === id ? 'aktif' : ''}
              onClick={() => ubah((s) => ({ ...s, pesanDiketahui: null, ditanya: id }))}
            >
              {nama}
            </button>
          ))}
        </div>
      </div>

      {keadaan.pesanDiketahui && !dibuka && <p className="umpan salah">{keadaan.pesanDiketahui}</p>}
      {dibuka ? (
        <>
          <p className="umpan">Tidak apa-apa, ini Diketahui &amp; Ditanya yang benar. Perhatikan baik-baik, ya.</p>
          <button type="button" className="hitung" onClick={onBenar}>
            Lanjut ke langkah 2
          </button>
        </>
      ) : (
        <button type="button" className="hitung" disabled={!lengkap} onClick={periksa}>
          Periksa Diketahui &amp; Ditanya
        </button>
      )}
    </div>
  )
}

// Ringkasan Diketahui & Ditanya yang tetap terlihat saat menghitung (mengurangi bolak-balik membaca soal)
function RingkasanDiketahui({ soal }) {
  const potongan = pecahCerita(soal)
  return (
    <div className="ringkas-diketahui">
      <p>
        <strong>Diketahui:</strong>{' '}
        {INPUT[soal.cari].map((k, i) => (
          <span key={k}>
            {i > 0 && ', '}
            {k} = {potongan.find((p) => p.sisi === k)?.teks} ({PERAN[peranSisi(k)].toLowerCase()})
          </span>
        ))}
      </p>
      <p>
        <strong>Ditanya:</strong> {soal.cari} ({PERAN[peranSisi(soal.cari)].toLowerCase()})
      </p>
    </div>
  )
}

export default function Latihan() {
  // identitas dibaca ulang dari perangkat agar ikut berubah bila diisi/diganti di menu Belajar
  const [, segarkan] = useState(0)
  const identitas = identitasTerakhir()
  const [soal, setSoal] = useState(() => buatSoal())
  const [jawaban, setJawaban] = useState('')
  const [status, setStatus] = useState(null) // null | 'benar' | 'salah' | 'menyerah'
  const [skor, setSkor] = useState({ benar: 0, total: 0 })
  const [beruntun, setBeruntun] = useState(0) // jumlah benar berturut-turut
  // F6 fading: jumlah soal benar berturut-turut TANPA bantuan apa pun
  const [lancar, setLancar] = useState(0)
  const [mintaBantuan, setMintaBantuan] = useState(false)
  const penuh = lancar < BATAS_LANCAR || mintaBantuan
  const [k, setK] = useState(() => awalSoal(true))
  const [refleksi, setRefleksi] = useState(null) // { tanya, opsi, benar, jelas, pilih, teks }
  const masukan = useRef(null)

  // waktu mulai & pemakaian Bacakan untuk soal yang sedang tampil
  const catatan = useRef({ mulai: null, dibacakan: 0 })
  useEffect(() => {
    catatan.current = { mulai: new Date(), dibacakan: 0 }
  }, [soal])

  const rekamSoal = (hasil) => {
    const selesai = new Date()
    const mulai = catatan.current.mulai ?? selesai
    catatAktivitas({
      jenis: 'latihan',
      ...identitasTerakhir(),
      sesi: PERTEMUAN_LATIHAN,
      langkah: skor.total + 1, // nomor soal
      judul: soal.cerita,
      mulai: mulai.toISOString(),
      selesai: selesai.toISOString(),
      durasiDetik: Math.round((selesai - mulai) / 1000),
      salah: hasil === 'benar' ? 0 : 1,
      hasil,
      dibacakan: catatan.current.dibacakan,
      petunjuk: k.petunjuk,
      catatan: [
        `bantuan:${penuh ? 'penuh' : 'pudar'}`,
        `diketahui_salah:${k.salahDiketahui}`,
        `miring_salah:${k.salahMiring.length}`,
        `kewajaran:${k.kewajaran}`,
      ].join(';'),
    })
    kirimTertunda()
  }

  const selesai = status !== null
  const kunci = soal.sisi[soal.cari]
  const pembahasan = hitung(soal.cari, soal.sisi)
  const daftarPetunjuk = petunjuk(soal)
  const batasPetunjuk = penuh ? TAHAP_PETUNJUK.length : 3

  const akhiri = (hasil) => {
    const benar = hasil === 'benar'
    setStatus(hasil)
    rekamSoal(hasil)
    setBeruntun((b) => (benar ? b + 1 : 0))
    const mandiri = benar && k.petunjuk === 0 && k.salahDiketahui === 0 && k.salahMiring.length === 0 && k.kewajaran === 0
    setLancar((n) => (mandiri ? n + 1 : 0))
    setSkor((s) => ({ benar: s.benar + (benar ? 1 : 0), total: s.total + 1 }))
    // F7 refleksi pada soal kunci (setiap soal ke-3)
    if ((skor.total + 1) % SETIAP_REFLEKSI === 0) setRefleksi({ ...buatRefleksi(soal), pilih: null, teks: '' })
    if (benar) rayakan({ beruntun: beruntun + 1 })
    else semangati({ jenis: 'pembahasan' })
  }

  const nilai = (e, abaikanKewajaran = false) => {
    e?.preventDefault()
    if (selesai) return
    const n = keAngka(jawaban)
    if (!Number.isFinite(n)) return
    // F8 cek kewajaran: jawaban yang mustahil tidak langsung dinilai salah, siswa diajak memeriksa dulu
    const tidakWajar = cekKewajaran(soal, n)
    if (tidakWajar && !abaikanKewajaran) {
      if (!k.peringatan) setK((s) => ({ ...s, peringatan: tidakWajar, kewajaran: s.kewajaran + 1 }))
      return
    }
    setK((s) => ({ ...s, peringatan: null }))
    akhiri(Math.abs(n - kunci) < 0.01 ? 'benar' : 'salah')
  }

  const rekamRefleksi = () => {
    if (!refleksi?.pilih) return
    const sekarang = new Date().toISOString()
    catatAktivitas({
      jenis: 'refleksi',
      ...identitasTerakhir(),
      sesi: PERTEMUAN_LATIHAN,
      langkah: skor.total, // nomor soal kunci
      judul: refleksi.tanya,
      mulai: sekarang,
      selesai: sekarang,
      durasiDetik: 0,
      salah: refleksi.pilih === refleksi.benar ? 0 : 1,
      hasil: refleksi.pilih === refleksi.benar ? 'benar' : 'salah',
      catatan: refleksi.teks.trim().slice(0, 300) || null,
    })
    kirimTertunda()
  }

  const berikutnya = () => {
    rekamRefleksi()
    setRefleksi(null)
    setMintaBantuan(false)
    setSoal(buatSoal(soal))
    setK(awalSoal(lancar < BATAS_LANCAR))
    setJawaban('')
    setStatus(null)
  }

  if (!identitas) {
    return (
      <FormKode
        tombol="Masuk & mulai latihan"
        onMasuk={() => {
          catatan.current = { mulai: new Date(), dibacakan: 0 } // waktu soal pertama dihitung setelah kenalan
          segarkan((n) => n + 1)
        }}
      />
    )
  }

  const tercapai = skor.total >= TARGET_SOAL
  const tunjuk = k.tahap === 'miring' && !selesai

  return (
    <div className="grid grid-latihan">
      <section className="kartu ada-hewan">
        <HewanHidup jenis="katak" className="hinggap kanan" />
        <div className="kepala-latihan">
          <span className="nomor-sesi warna-4">Pertemuan {PERTEMUAN_LATIHAN} · Implementasi</span>
          <span className="skor" aria-live="polite">
            Skor: {skor.benar} / {skor.total}
          </span>
        </div>
        <h2>Latihan Soal Sehari-hari</h2>
        <p className="ket">
          Terapkan teorema Pythagoras pada masalah sehari-hari. Kerjakan minimal {TARGET_SOAL} soal, ya {identitas.nama}!
        </p>
        <div
          className="progres"
          role="progressbar"
          aria-label="Target soal pertemuan 4"
          aria-valuemin={0}
          aria-valuemax={TARGET_SOAL}
          aria-valuenow={Math.min(skor.total, TARGET_SOAL)}
        >
          <div style={{ width: `${(Math.min(skor.total, TARGET_SOAL) / TARGET_SOAL) * 100}%` }} />
        </div>
        <p className="ket target-latihan" aria-live="polite">
          {tercapai
            ? `🎯 Target ${TARGET_SOAL} soal tercapai! Boleh lanjut berlatih kalau masih mau.`
            : `${skor.total} dari ${TARGET_SOAL} soal dikerjakan`}
        </p>
        {beruntun >= 2 && (
          <p className="combo" key={beruntun} aria-live="polite">
            <span className="api">🔥</span> {beruntun} benar berturut-turut!
            {beruntun >= 5 && ' Luar biasa!'}
          </p>
        )}

        {/* F6 fading: bantuan langkah disembunyikan bila siswa sudah lancar, tetapi bisa dibuka lagi */}
        {!penuh && !selesai && (
          <p className="info-pudar">
            💪 Kamu sudah lancar, jadi langkah bantuan disembunyikan.
            <button
              type="button"
              className="kecil"
              onClick={() => {
                setMintaBantuan(true)
                setK((s) => ({ ...s, tahap: 'diketahui' }))
              }}
            >
              Tampilkan bantuan
            </button>
          </p>
        )}
        {penuh && (
          <ol className="jejak-langkah" aria-label="Langkah mengerjakan">
            {[
              ['diketahui', 'Diketahui & Ditanya'],
              ['miring', 'Sisi miring'],
              ['hitung', 'Hitung'],
            ].map(([id, nama], i) => {
              const urut = ['diketahui', 'miring', 'hitung'].indexOf(k.tahap)
              return (
                <li key={id} className={i < urut || selesai ? 'beres' : i === urut ? 'aktif' : ''}>
                  {nama}
                </li>
              )
            })}
          </ol>
        )}

        {k.tahap === 'diketahui' && !selesai ? (
          <LangkahDiketahui soal={soal} keadaan={k} ubah={setK} onBenar={() => setK((s) => ({ ...s, tahap: 'miring' }))} />
        ) : (
          <p className="soal">{soal.cerita}</p>
        )}
        <TombolBacakan
          key={soal.cerita}
          bagian={[soal.cerita]}
          label="Bacakan soal"
          onMulai={() => {
            catatan.current.dibacakan += 1
          }}
        />

        {k.tahap !== 'diketahui' && penuh && <RingkasanDiketahui soal={soal} />}

        {tunjuk && (
          <div className="langkah-bantu">
            <p className="judul-langkah">
              <span className="no-langkah">2</span> Tunjuk sisi miring
            </p>
            <p className="ket">
              Segitiga pada gambar sudah diputar. Ketuk sisi miringnya: sisi di depan tanda sudut siku-siku (kotak kecil).
            </p>
            {k.salahMiring.length > 0 && (
              <p className="umpan salah">
                Itu sisi siku-siku, karena menempel pada tanda sudut siku-siku. Cari sisi yang berhadapan dengan kotak kecil.
              </p>
            )}
          </div>
        )}

        {k.tahap === 'hitung' && penuh && k.salahMiring.length >= 2 && !selesai && (
          <p className="umpan">Sisi miringnya adalah sisi c, yang berhadapan dengan tanda sudut siku-siku.</p>
        )}

        {k.tahap === 'hitung' && (
          <form onSubmit={nilai}>
            {penuh && (
              <p className="judul-langkah">
                <span className="no-langkah">3</span> Hitung
              </p>
            )}
            <label>
              Jawaban kamu ({NAMA_SISI[soal.cari]})
              <input
                ref={masukan}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={jawaban}
                disabled={selesai}
                onChange={(e) => {
                  setJawaban(e.target.value)
                  if (k.peringatan) setK((s) => ({ ...s, peringatan: null }))
                }}
              />
            </label>

            {k.peringatan && !selesai && (
              <div className="peringatan-wajar" role="alert">
                <p>
                  🤔 <strong>Cek kewajaran:</strong> {k.peringatan} Yakin dengan jawabanmu?
                </p>
                <div className="opsi">
                  <button
                    type="button"
                    className="hitung"
                    onClick={() => {
                      setK((s) => ({ ...s, peringatan: null }))
                      masukan.current?.focus()
                    }}
                  >
                    Perbaiki jawaban
                  </button>
                  <button type="button" onClick={() => nilai(null, true)}>
                    Tetap periksa
                  </button>
                </div>
              </div>
            )}

            {!selesai && !k.peringatan && (
              <div className="aksi">
                <button type="submit" className="hitung" disabled={!Number.isFinite(keAngka(jawaban))}>
                  Periksa
                </button>
                <button type="button" onClick={() => akhiri('menyerah')}>
                  Lihat jawaban
                </button>
              </div>
            )}

            {/* F6 petunjuk bertingkat: dibuka satu per satu */}
            {!selesai && (
              <div className="petunjuk-bertingkat">
                {daftarPetunjuk.slice(0, k.petunjuk).map((p, i) => (
                  <p key={TAHAP_PETUNJUK[i]} className="petunjuk-isi">
                    <span className="no-langkah kecil">{i + 1}</span>
                    <span>
                      <strong>{TAHAP_PETUNJUK[i]}.</strong> {p}
                    </span>
                  </p>
                ))}
                {k.petunjuk < batasPetunjuk && (
                  <button type="button" className="kecil" onClick={() => setK((s) => ({ ...s, petunjuk: s.petunjuk + 1 }))}>
                    💡 {k.petunjuk === 0 ? 'Minta petunjuk' : 'Petunjuk berikutnya'} ({k.petunjuk}/{batasPetunjuk})
                  </button>
                )}
              </div>
            )}
          </form>
        )}

        {status && (
          <div className="umpan-maskot" key={`${status}-${skor.total}`}>
            <div className="maskot-wadah">
              {status === 'benar' && <Konfeti />}
              <Maskot suasana={status === 'benar' ? 'senang' : 'mikir'} ukuran={64} />
            </div>
            {status === 'benar' && (
              <p className="umpan benar">
                Benar! {soal.cari} = {kunci}.
              </p>
            )}
            {status === 'salah' && (
              <p className="umpan salah">
                Belum tepat. Jawaban kamu {jawaban}, seharusnya {kunci}.
              </p>
            )}
            {status === 'menyerah' && (
              <p className="umpan">
                Jawabannya {soal.cari} = {kunci}.
              </p>
            )}
          </div>
        )}

        {selesai && (
          <div className="hasil">
            <p className="jawaban">Pembahasan</p>
            <ol>
              {pembahasan.langkah.map((l) => (
                <li key={l}>
                  <code>{l}</code>
                </li>
              ))}
            </ol>
            <p className="ket kewajaran">✔ {kalimatKewajaran(soal)}</p>
          </div>
        )}

        {/* F7 refleksi "Mengapa…?" pada soal kunci */}
        {selesai && refleksi && (
          <div className="refleksi">
            <p className="judul-langkah">🧠 Refleksi</p>
            <p className="cek-tanya">{refleksi.tanya}</p>
            <div className="opsi opsi-tegak">
              {refleksi.opsi.map((o) => (
                <button
                  key={o}
                  type="button"
                  disabled={!!refleksi.pilih}
                  className={refleksi.pilih && o === refleksi.benar ? 'aktif' : refleksi.pilih === o ? 'keliru' : ''}
                  onClick={() => setRefleksi((r) => ({ ...r, pilih: o }))}
                >
                  {o}
                </button>
              ))}
            </div>
            {refleksi.pilih && (
              <>
                <p className={`umpan ${refleksi.pilih === refleksi.benar ? 'benar' : 'salah'}`}>
                  {refleksi.pilih === refleksi.benar ? 'Tepat! ' : 'Belum tepat. '}
                  {refleksi.jelas}
                </p>
                <label>
                  Jelaskan dengan kata-katamu sendiri (boleh singkat, tidak wajib)
                  <textarea
                    rows={2}
                    maxLength={300}
                    value={refleksi.teks}
                    onChange={(e) => setRefleksi((r) => ({ ...r, teks: e.target.value }))}
                  />
                </label>
              </>
            )}
          </div>
        )}

        {selesai && (
          <button type="button" className="hitung tombol-berikutnya" onClick={berikutnya} disabled={refleksi && !refleksi.pilih}>
            Soal berikutnya
          </button>
        )}
        {selesai && refleksi && !refleksi.pilih && <p className="ket">Jawab pertanyaan refleksi dulu, ya.</p>}
      </section>

      <section className="kartu gambar">
        <h2>Gambar</h2>
        <SegitigaPutar
          key={soal.cerita}
          sisi={soal.sisi}
          cari={soal.cari}
          orientasi={soal.orientasi}
          sembunyikan={!selesai}
          tampilLabel={k.tahap === 'hitung' || selesai}
          pilihan={{ salah: k.salahMiring }}
          onPilih={
            tunjuk
              ? (sisi) => {
                  if (sisi === 'c') setK((s) => ({ ...s, tahap: 'hitung' }))
                  else
                    setK((s) => {
                      const salahMiring = s.salahMiring.includes(sisi) ? s.salahMiring : [...s.salahMiring, sisi]
                      // setelah 2 sisi keliru, hanya tersisa sisi miring: langsung ditunjukkan
                      return { ...s, salahMiring, tahap: salahMiring.length >= 2 ? 'hitung' : s.tahap }
                    })
                }
              : undefined
          }
        />
        <p className="ket">
          {selesai
            ? `Sisi ${soal.cari} = ${bulat(kunci)}.`
            : k.tahap === 'diketahui'
              ? 'Label sisi muncul setelah langkah 1 dan 2.'
              : tunjuk
                ? 'Ketuk sisi miring pada segitiga ini.'
                : `Cari panjang sisi yang berwarna (${soal.cari}).`}
        </p>
      </section>
    </div>
  )
}
