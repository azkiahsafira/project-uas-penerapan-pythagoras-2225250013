import { useEffect, useRef } from 'react'

// Efek lucu di seluruh halaman:
// - setiap klik/sentuh memunculkan hati & bintang kecil yang meletup
// - di laptop, kursor meninggalkan jejak kilau (tidak di dalam materi/tes
//   agar siswa tetap fokus membaca)
// Partikel dibuat langsung di DOM dan dihapus sendiri setelah animasinya selesai.

const BENTUK = ['♥', '✦', '★', '♥', '●']
const WARNA = ['#f472b6', '#7cc3ff', '#c4b5fd', '#fda4af', '#5fb4ff']

function bolehAnimasi() {
  if (document.documentElement.classList.contains('tanpa-animasi')) return false
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function buatPartikel(wadah, x, y, { dx, dy, ukuran, jenis, lama }) {
  const el = document.createElement('span')
  el.className = `partikel ${jenis}`
  el.textContent = BENTUK[Math.floor(Math.random() * BENTUK.length)]
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.style.color = WARNA[Math.floor(Math.random() * WARNA.length)]
  el.style.fontSize = `${ukuran}px`
  el.style.setProperty('--dx', `${dx}px`)
  el.style.setProperty('--dy', `${dy}px`)
  el.style.animationDuration = `${lama}ms`
  el.addEventListener('animationend', () => el.remove())
  wadah.appendChild(el)
}

export default function EfekKlik({ aktif }) {
  const wadah = useRef(null)

  useEffect(() => {
    if (!aktif) return undefined
    let terakhir = 0

    const klik = (e) => {
      if (!wadah.current || !bolehAnimasi()) return
      const jumlah = 8
      for (let i = 0; i < jumlah; i++) {
        const sudut = (i / jumlah) * Math.PI * 2 + Math.random() * 0.5
        const jarak = 28 + Math.random() * 26
        buatPartikel(wadah.current, e.clientX, e.clientY, {
          dx: Math.cos(sudut) * jarak,
          dy: Math.sin(sudut) * jarak - 18,
          ukuran: 10 + Math.random() * 8,
          jenis: 'letup',
          lama: 700 + Math.random() * 300,
        })
      }
    }

    const gerak = (e) => {
      if (e.pointerType !== 'mouse' || !wadah.current || !bolehAnimasi()) return
      const sekarang = performance.now()
      if (sekarang - terakhir < 70) return // batasi jumlah partikel
      if (e.target.closest?.('.pemutar, .sempit, input, select, textarea')) return
      terakhir = sekarang
      buatPartikel(wadah.current, e.clientX, e.clientY, {
        dx: (Math.random() - 0.5) * 16,
        dy: 14 + Math.random() * 10,
        ukuran: 8 + Math.random() * 5,
        jenis: 'jejak',
        lama: 650,
      })
    }

    window.addEventListener('pointerdown', klik)
    window.addEventListener('pointermove', gerak)
    return () => {
      window.removeEventListener('pointerdown', klik)
      window.removeEventListener('pointermove', gerak)
    }
  }, [aktif])

  return <div className="efek-klik" ref={wadah} aria-hidden="true" />
}
