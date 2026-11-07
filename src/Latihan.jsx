import { useState } from 'react'
import { Konfeti } from './Hiasan.jsx'
import Maskot from './Maskot.jsx'
import Segitiga from './Segitiga.jsx'
import { NAMA, bulat, hitung, keAngka } from './pythagoras.js'

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

// Cerita soal untuk tiap sisi yang dicari
const CERITA = {
  c: [
    (s) => `Layar laptop lebarnya ${s.a} cm dan tingginya ${s.b} cm. Berapa cm panjang diagonal layar?`,
    (s) => `Rina berjalan ${s.a} m ke timur, lalu ${s.b} m ke utara. Berapa meter jarak terpendek Rina dari titik awal?`,
    (s) => `Taman berbentuk persegi panjang berukuran ${s.a} m × ${s.b} m. Berapa meter panjang jalan setapak yang memotong taman secara diagonal?`,
    (s) => `Diketahui segitiga siku-siku dengan a = ${s.a} dan b = ${s.b}. Hitung panjang sisi miring c.`,
  ],
  b: [
    (s) => `Tangga sepanjang ${s.c} m bersandar di dinding. Kaki tangga berjarak ${s.a} m dari dinding. Berapa meter tinggi dinding yang dicapai ujung tangga?`,
    (s) => `Benang layang-layang yang terulur sepanjang ${s.c} m. Jarak mendatar anak ke titik tepat di bawah layang-layang ${s.a} m. Berapa meter tinggi layang-layang?`,
    (s) => `Diketahui segitiga siku-siku dengan a = ${s.a} dan sisi miring c = ${s.c}. Hitung tinggi b.`,
  ],
  a: [
    (s) => `Tiang bendera setinggi ${s.b} m ditopang kawat sepanjang ${s.c} m dari puncak tiang ke tanah. Berapa meter jarak ujung kawat di tanah ke kaki tiang?`,
    (s) => `Papan seluncur sepanjang ${s.c} m dipasang dari ketinggian ${s.b} m. Berapa meter jarak mendatar dari bawah tangga ke ujung seluncuran?`,
    (s) => `Diketahui segitiga siku-siku dengan b = ${s.b} dan sisi miring c = ${s.c}. Hitung alas a.`,
  ],
}

const acak = (arr) => arr[Math.floor(Math.random() * arr.length)]

function buatSoal(sebelumnya) {
  for (;;) {
    const [a, b, c] = acak(TRIPEL)
    const sisi = { a, b, c }
    const cari = acak(['a', 'b', 'c'])
    const cerita = acak(CERITA[cari])(sisi)
    if (cerita !== sebelumnya?.cerita) return { sisi, cari, cerita }
  }
}

export default function Latihan() {
  const [soal, setSoal] = useState(() => buatSoal())
  const [jawaban, setJawaban] = useState('')
  const [status, setStatus] = useState(null) // null | 'benar' | 'salah' | 'menyerah'
  const [skor, setSkor] = useState({ benar: 0, total: 0 })
  const [beruntun, setBeruntun] = useState(0) // jumlah benar berturut-turut

  const selesai = status !== null
  const kunci = soal.sisi[soal.cari]
  const pembahasan = hitung(soal.cari, soal.sisi)

  const periksa = (e) => {
    e.preventDefault()
    if (selesai) return
    const n = keAngka(jawaban)
    if (!Number.isFinite(n)) return
    const benar = Math.abs(n - kunci) < 0.01
    setStatus(benar ? 'benar' : 'salah')
    setBeruntun((b) => (benar ? b + 1 : 0))
    setSkor((s) => ({ benar: s.benar + (benar ? 1 : 0), total: s.total + 1 }))
  }

  const menyerah = () => {
    setStatus('menyerah')
    setBeruntun(0)
    setSkor((s) => ({ ...s, total: s.total + 1 }))
  }

  const berikutnya = () => {
    setSoal(buatSoal(soal))
    setJawaban('')
    setStatus(null)
  }

  return (
    <div className="grid">
      <section className="kartu">
        <div className="kepala-latihan">
          <h2>Latihan Soal</h2>
          <span className="skor" aria-live="polite">
            Skor: {skor.benar} / {skor.total}
          </span>
        </div>
        {beruntun >= 2 && (
          <p className="combo" key={beruntun} aria-live="polite">
            <span className="api">🔥</span> {beruntun} benar berturut-turut!
            {beruntun >= 5 && ' Luar biasa!'}
          </p>
        )}

        <p className="soal">{soal.cerita}</p>

        <form onSubmit={periksa}>
          <label>
            Jawaban kamu ({NAMA[soal.cari]})
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={jawaban}
              disabled={selesai}
              onChange={(e) => setJawaban(e.target.value)}
            />
          </label>
          {!selesai ? (
            <div className="aksi">
              <button type="submit" className="hitung" disabled={!Number.isFinite(keAngka(jawaban))}>
                Periksa
              </button>
              <button type="button" onClick={menyerah}>Lihat jawaban</button>
            </div>
          ) : (
            <button type="button" className="hitung" onClick={berikutnya} autoFocus>
              Soal berikutnya
            </button>
          )}
        </form>

        {status && (
          <div className="umpan-maskot" key={`${status}-${skor.total}`}>
            <div className="maskot-wadah">
              {status === 'benar' && <Konfeti />}
              <Maskot suasana={status === 'benar' ? 'senang' : 'mikir'} ukuran={64} />
            </div>
            {status === 'benar' && <p className="umpan benar">Benar! {NAMA[soal.cari]} = {kunci}.</p>}
            {status === 'salah' && (
              <p className="umpan salah">
                Belum tepat. Jawaban kamu {jawaban}, seharusnya {kunci}.
              </p>
            )}
            {status === 'menyerah' && <p className="umpan">Jawabannya {NAMA[soal.cari]} = {kunci}.</p>}
          </div>
        )}

        {selesai && (
          <div className="hasil">
            <p className="jawaban">Pembahasan</p>
            <ol>
              {pembahasan.langkah.map((l) => (
                <li key={l}><code>{l}</code></li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <section className="kartu gambar">
        <h2>Gambar</h2>
        <Segitiga sisi={soal.sisi} cari={soal.cari} sembunyikan={!selesai} />
        <p className="ket">
          {selesai ? `Sisi ${soal.cari} = ${bulat(kunci)}.` : `Cari panjang sisi yang berwarna (${soal.cari}).`}
        </p>
      </section>
    </div>
  )
}
