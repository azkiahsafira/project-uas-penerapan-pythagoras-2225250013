import { useEffect, useRef, useState } from 'react'
import { asistenTersedia, tanyaAsisten, tokenSaya } from './api.js'
import Maskot from './Maskot.jsx'
import FormKode from './Masuk.jsx'

// Chatbot pedagogis "Tanya Siku" (DeepSeek lewat backend, lihat backend/asisten.py).
// - RMT: alur pahami → rencanakan → kerjakan → periksa ditampilkan sebagai jalur tahap, mengikuti tahap dari server.
// - Petunjuk bertingkat (1–4): siswa menaikkan sendiri lewat "Petunjuk lebih jelas" (graduated prompts),
//   sehingga bantuan sesedikit mungkin dan siswa tetap yang menghitung. Jawaban akhir tidak pernah diberikan.
// - Beban kognitif: satu balasan pendek per giliran, tombol cepat untuk siswa yang belum tahu cara bertanya.
// - Tidak dipasang saat tes (App), sehingga tidak bisa dipakai mencontek.
// - Tombol baru muncul bila server melaporkan API key DeepSeek sudah dipasang (GET /api/sehat → asisten).

const TAHAP = [
  ['pahami', 'Pahami'],
  ['rencana', 'Rencanakan'],
  ['kerjakan', 'Kerjakan'],
  ['periksa', 'Periksa'],
]

const SAPA =
  'Halo, aku Siku! Tulis soal atau bagian yang membuatmu bingung. Kita kerjakan bersama, satu langkah demi satu langkah. Aku memberi petunjuk, bukan jawaban akhir ya 😊'

const MAKS_RIWAYAT = 10 // giliran terakhir yang dikirim ke server (server menerima paling banyak 12)

export default function TanyaSiku({ halaman }) {
  const [tersedia, setTersedia] = useState(false)
  const [buka, setBuka] = useState(false)
  const [pesan, setPesan] = useState([]) // [{ peran: 'user' | 'assistant', isi }]
  const [isian, setIsian] = useState('')
  const [tahap, setTahap] = useState('pahami')
  const [penjawab, setPenjawab] = useState('') // model yang SEBENARNYA menjawab (DeepSeek / cadangan gratis), ditampilkan jujur
  const [tingkat, setTingkat] = useState(1)
  const [memuat, setMemuat] = useState(false)
  const [galat, setGalat] = useState('')
  const [sudahMasuk, setSudahMasuk] = useState(() => Boolean(tokenSaya()))
  const daftarRef = useRef(null)
  const isianRef = useRef(null)
  const sedangKirim = useRef(false) // penjaga klik ganda: state `memuat` baru berubah setelah render berikutnya

  useEffect(() => {
    let aktif = true
    asistenTersedia().then((ya) => aktif && setTersedia(ya))
    return () => {
      aktif = false
    }
  }, [])

  // balasan terbaru selalu terlihat
  useEffect(() => {
    const el = daftarRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [pesan, memuat, galat])

  // Esc menutup panel; fokus ke kotak tulis saat dibuka
  useEffect(() => {
    if (!buka) return undefined
    isianRef.current?.focus()
    const tutup = (e) => e.key === 'Escape' && setBuka(false)
    window.addEventListener('keydown', tutup)
    return () => window.removeEventListener('keydown', tutup)
  }, [buka, sudahMasuk])

  const kirim = async (teksMentah, tingkatKirim = tingkat) => {
    const teks = teksMentah.trim()
    if (!teks || sedangKirim.current) return
    sedangKirim.current = true
    const riwayat = pesan.slice(-MAKS_RIWAYAT)
    setPesan([...pesan, { peran: 'user', isi: teks }])
    setIsian('')
    setGalat('')
    setMemuat(true)
    try {
      const h = await tanyaAsisten({ pertanyaan: teks, riwayat, halaman, tingkat: tingkatKirim, tahap })
      setPesan((p) => [...p, { peran: 'assistant', isi: h.balasan }])
      setTahap(h.tahap)
      if (h.model) setPenjawab(h.penyedia === 'cadangan' ? `model cadangan gratis (${h.model})` : `DeepSeek (${h.model})`)
    } catch (e) {
      if (e.status === 401) setSudahMasuk(false)
      setGalat(e.message)
    } finally {
      sedangKirim.current = false
      setMemuat(false)
    }
  }

  const lebihJelas = () => {
    if (sedangKirim.current) return
    const naik = Math.min(4, tingkat + 1)
    setTingkat(naik)
    kirim('Aku masih bingung. Boleh petunjuk yang lebih jelas?', naik)
  }

  const soalBaru = () => {
    setPesan([])
    setTahap('pahami')
    setTingkat(1)
    setGalat('')
    isianRef.current?.focus()
  }

  const posisiTahap = TAHAP.findIndex(([id]) => id === tahap)

  if (!tersedia) return null

  if (!buka) {
    return (
      <button type="button" className="tanya-siku-tombol" onClick={() => setBuka(true)} aria-haspopup="dialog">
        <Maskot ukuran={34} diam />
        <span>Tanya Siku</span>
      </button>
    )
  }

  return (
    <section className="tanya-siku" role="dialog" aria-label="Tanya Siku" data-tanpa-geser>
      <header className="ts-kepala">
        <Maskot ukuran={42} diam />
        <div>
          <h2>Tanya Siku</h2>
          <p>Petunjuk langkah demi langkah, bukan jawaban akhir</p>
        </div>
        <button type="button" className="ts-tutup" onClick={() => setBuka(false)} aria-label="Tutup Tanya Siku">
          ×
        </button>
      </header>

      {/* jalur tahap berpikir RMT: siswa melihat sedang di tahap mana */}
      <ol className="ts-tahap" aria-label="Tahap berpikir">
        {TAHAP.map(([id, label], i) => (
          <li
            key={id}
            className={i === posisiTahap ? 'aktif' : i < posisiTahap ? 'lewat' : ''}
            aria-current={i === posisiTahap ? 'step' : undefined}
          >
            <b>{i + 1}</b>
            {label}
          </li>
        ))}
      </ol>

      {!sudahMasuk ? (
        <div className="ts-masuk">
          <FormKode
            judul="Masuk dulu ya"
            ket="Masukkan kode siswamu (kelas, huruf kelas, tanda -, nomor absen) agar bisa bertanya ke Siku."
            onMasuk={() => {
              setSudahMasuk(true)
              setGalat('')
            }}
          />
        </div>
      ) : (
        <>
          <div className="ts-daftar" ref={daftarRef} aria-live="polite">
            <p className="ts-gelembung siku">{SAPA}</p>
            {pesan.map((p, i) => (
              <p key={i} className={`ts-gelembung ${p.peran === 'user' ? 'saya' : 'siku'}`}>
                {p.isi}
              </p>
            ))}
            {memuat && (
              <p className="ts-gelembung siku ts-berpikir" aria-label="Siku sedang berpikir">
                <span />
                <span />
                <span />
              </p>
            )}
            {galat && (
              <p className="umpan salah ts-galat" role="alert">
                {galat}
              </p>
            )}
          </div>

          <div className="ts-cepat">
            {pesan.length === 0 ? (
              <button type="button" onClick={() => kirim('Aku bingung mulai dari mana.')} disabled={memuat}>
                🤔 Aku bingung mulai dari mana
              </button>
            ) : (
              <>
                <button type="button" onClick={lebihJelas} disabled={memuat || tingkat >= 4}>
                  💡 Petunjuk lebih jelas
                </button>
                <button type="button" onClick={() => setIsian('Langkahku: ')} disabled={memuat}>
                  ✏️ Cek langkahku
                </button>
                <button type="button" onClick={soalBaru} disabled={memuat}>
                  🔄 Soal baru
                </button>
              </>
            )}
          </div>
          <p className="ts-tingkat" aria-label={`Tingkat bantuan ${tingkat} dari 4`}>
            Tingkat bantuan
            {[1, 2, 3, 4].map((n) => (
              <i key={n} className={n <= tingkat ? 'isi' : ''} />
            ))}
            {penjawab && <span className="ts-model">Dijawab oleh: {penjawab}</span>}
          </p>

          <form
            className="ts-tulis"
            onSubmit={(e) => {
              e.preventDefault()
              kirim(isian)
            }}
          >
            <textarea
              ref={isianRef}
              value={isian}
              onChange={(e) => setIsian(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  kirim(isian)
                }
              }}
              rows={2}
              maxLength={400}
              placeholder="Tulis soal atau langkahmu di sini…"
              aria-label="Pertanyaan untuk Siku"
            />
            <button type="submit" className="hitung" disabled={memuat || !isian.trim()}>
              Kirim
            </button>
          </form>
        </>
      )}
    </section>
  )
}
