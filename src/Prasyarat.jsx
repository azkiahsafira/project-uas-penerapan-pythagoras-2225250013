import { useEffect, useRef, useState } from 'react'
import TombolBacakan from './Bacakan.jsx'
import { Konfeti } from './Hiasan.jsx'
import Maskot from './Maskot.jsx'
import { BATAS_SIAP, JUMLAH_PRASYARAT, buatPrasyarat, simpanPrasyarat } from './bantuan.js'
import { rayakan, semangati } from './perayaan.js'
import { catatAktivitas, kirimTertunda } from './penyimpanan.js'
import { keAngka } from './pythagoras.js'

// F2 Cek prasyarat (temuan IL3: siswa macet di kuadrat & akar kuadrat).
// 4 soal singkat sebelum Sesi 1. Bila benar < 3, siswa diarahkan ke bagian kuadrat & akar di Sesi 1.
// Tiap soal dicatat ke tabel `aktivitas` (jenis 'prasyarat', sesi 0).
export default function CekPrasyarat({ identitas, onSelesai, onKeluar, onKeSesi1 }) {
  const [soal] = useState(buatPrasyarat)
  const [idx, setIdx] = useState(0)
  const [isian, setIsian] = useState('')
  const [hasil, setHasil] = useState(null) // null | 'benar' | 'salah'
  const [benar, setBenar] = useState(0)
  const [tamat, setTamat] = useState(false)
  const mulai = useRef(null)
  useEffect(() => {
    mulai.current = new Date()
  }, [])

  const s = soal[idx]

  const periksa = (e) => {
    e.preventDefault()
    if (hasil) return
    const n = keAngka(isian)
    if (!Number.isFinite(n)) return
    const tepat = Math.abs(n - s.jawab) < 0.01
    const selesai = new Date()
    const awal = mulai.current ?? selesai
    catatAktivitas({
      jenis: 'prasyarat',
      ...identitas,
      sesi: 0,
      langkah: idx + 1,
      judul: s.tanya,
      mulai: awal.toISOString(),
      selesai: selesai.toISOString(),
      durasiDetik: Math.round((selesai - awal) / 1000),
      salah: tepat ? 0 : 1,
      hasil: tepat ? 'benar' : 'salah',
      catatan: `jawaban:${isian}`,
    })
    setHasil(tepat ? 'benar' : 'salah')
    if (tepat) {
      setBenar((b) => b + 1)
      rayakan()
    } else semangati({ jenis: 'pembahasan' })
  }

  const lanjut = () => {
    if (idx + 1 < soal.length) {
      setIdx(idx + 1)
      setIsian('')
      setHasil(null)
      mulai.current = new Date()
      return
    }
    simpanPrasyarat({ benar, total: soal.length, tanggal: new Date().toISOString() })
    kirimTertunda()
    setTamat(true)
  }

  if (tamat) {
    const siap = benar >= BATAS_SIAP
    return (
      <section className="kartu prasyarat">
        <div className="umpan-maskot">
          <div className="maskot-wadah">
            {siap && <Konfeti />}
            <Maskot suasana={siap ? 'senang' : 'mikir'} ukuran={72} />
          </div>
          <div>
            <h2>
              Skor cek prasyarat: {benar} / {soal.length}
            </h2>
            <p>
              {siap
                ? 'Mantap! Kuadrat dan akar kuadratmu sudah kuat. Kamu siap belajar teorema Pythagoras.'
                : 'Tidak apa-apa! Kuadrat dan akar kuadrat dipakai di setiap soal Pythagoras. Pelajari dulu bagian "Kuadrat" dan "Akar kuadrat" di Sesi 1, ya.'}
            </p>
          </div>
        </div>
        <div className="navigasi">
          <button type="button" onClick={onSelesai}>
            Kembali ke daftar sesi
          </button>
          <button type="button" className="hitung" autoFocus onClick={onKeSesi1}>
            {siap ? 'Mulai Sesi 1' : 'Pelajari kuadrat & akar (Sesi 1)'}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="kartu prasyarat">
      <div className="kepala-sesi">
        <button type="button" onClick={onKeluar}>
          ← Daftar sesi
        </button>
        <span className="ket">
          Soal {idx + 1} dari {JUMLAH_PRASYARAT}
        </span>
      </div>
      <div className="progres" role="progressbar" aria-valuemin={1} aria-valuemax={soal.length} aria-valuenow={idx + 1}>
        <div style={{ width: `${((idx + (hasil ? 1 : 0)) / soal.length) * 100}%` }} />
      </div>
      <h2>Pemanasan: Cek Prasyarat</h2>
      <p className="ket">Sebelum belajar Pythagoras, cek dulu kuadrat dan akar kuadrat. Hitung tanpa kalkulator ya!</p>
      <p className="soal-prasyarat" aria-live="polite">
        {s.tanya}
      </p>
      <TombolBacakan key={s.tanya} bagian={[s.baca]} label="Bacakan soal" />
      <form className="aksi" onSubmit={periksa}>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          aria-label="Jawaban"
          value={isian}
          disabled={!!hasil}
          onChange={(e) => setIsian(e.target.value)}
        />
        {!hasil ? (
          <button type="submit" className="hitung" disabled={!Number.isFinite(keAngka(isian))}>
            Periksa
          </button>
        ) : (
          <button type="button" className="hitung" autoFocus onClick={lanjut}>
            {idx + 1 < soal.length ? 'Soal berikutnya' : 'Lihat hasil'}
          </button>
        )}
      </form>
      {hasil && (
        <div className="umpan-maskot" key={`${idx}-${hasil}`}>
          <div className="maskot-wadah">
            {hasil === 'benar' && <Konfeti />}
            <Maskot suasana={hasil === 'benar' ? 'senang' : 'mikir'} ukuran={64} />
          </div>
          <p className={`umpan ${hasil}`}>
            {hasil === 'benar' ? 'Benar! ' : 'Belum tepat. '}
            {s.jelas}.
          </p>
        </div>
      )}
    </section>
  )
}
