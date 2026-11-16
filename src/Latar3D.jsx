// Latar belakang 3D "Langit Pythagoras" (three.js) untuk semua menu, di belakang kotak-kotak yang tembus pandang.
// Tema langit pastel biru soft + pink soft, karakter bergaya chibi (mata besar berkilau, berkedip, pipi merona).
// Semua objek adalah contoh dari materi teorema Pythagoras:
//   - Siku: segitiga siku-siku berwajah dengan tangan kecil, tanda kotak sudut siku-siku, sisi miring biru
//   - Menara kotak 3² + 4² = 5²: 9 kubus biru, 16 kubus pink, 25 kubus putih (bukti luas)
//   - Layang-layang berwajah dengan benang pink (benang = sisi miring, Contoh 2 materi)
//   - Tangga bersandar (kaki 3, tinggi 4, tangga 5) dengan kelinci yang naik-turun (Contoh 1 materi)
//   - balon segitiga siku-siku, awan & bintang berwajah, pelangi, hati, dan kilauan
// Objek bisa diklik/diketuk: bereaksi dan berbicara tentang materi. Sudut pandang ikut bergerak saat digulir/tetikus
// digerakkan (kesan 3D). Hemat: three.js diunduh setelah halaman tampil, ±30 fps, berhenti saat tab tidak dilihat,
// saat "Animasi: mati", dan saat prefers-reduced-motion. Disembunyikan saat tes (App.jsx).
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const W = {
  biru: 0xa8d8ff,
  biruTua: 0x62b0f5,
  pink: 0xffbdd9,
  pinkTua: 0xf77fb7,
  putih: 0xffffff,
  lila: 0xe3d4ff,
  mata: 0x1b2447,
  pipi: 0xff8fc0,
  kayu: 0xffdcb0,
}

const SAPAAN = {
  siku: ['Halo! Aku Siku, segitiga siku-siku 🔺', 'Sisi terpanjangku sisi miring 💙', 'Kotak kecil di pojokku = sudut 90° ✨'],
  persegi: ['3² + 4² = 5² 🧊', '9 + 16 = 25, pas sekali! ✨', 'Luas dua kotak kecil = luas kotak besar 💖'],
  layang: ['Benangku sisi miring! 🪁', 'Tinggi² + jarak² = benang² 💨', 'Wuusss, terbang tinggi! ☁️'],
  tangga: ['Kaki 3, tinggi 4, tangga 5! 🪜', 'Aku naik sisi miring 🐰', 'Tangga bersandar = segitiga siku-siku 💙'],
  balon: ['Pop! Aku balon siku-siku 🎈', 'Aku terbang ke sisi miring langit 💗', 'Hore, kamu hebat! 🎉'],
  awan: ['Aku awan empuk ☁️', 'Belajar pelan-pelan saja ya 💤', 'Semangat, kamu pasti bisa! 💙'],
  bintang: ['Kamu bintangnya! ⭐', 'Berkilau seperti jawabanmu ✨', 'c² = a² + b², ingat ya! 🌟'],
}

export default function Latar3D() {
  const kanvas = useRef(null)
  const [ucap, setUcap] = useState(null)

  useEffect(() => {
    if (!ucap) return undefined
    const t = setTimeout(() => setUcap(null), 2600)
    return () => clearTimeout(t)
  }, [ucap])

  useEffect(() => {
    let batal = false
    let bersihkan = () => {}
    // three.js diunduh setelah halaman utama tampil agar pembukaan aplikasi tetap cepat
    const tunda = setTimeout(() => {
      Promise.all([import('three'), import('three/examples/jsm/geometries/RoundedBoxGeometry.js')]).then(([THREE, rb]) => {
        if (batal || !kanvas.current) return
        bersihkan = bangunAdegan(THREE, rb.RoundedBoxGeometry, kanvas.current, setUcap)
      })
    }, 600)
    return () => {
      batal = true
      clearTimeout(tunda)
      bersihkan()
    }
  }, [])

  return (
    <>
      <div className="latar-adegan latar-3d" aria-hidden="true">
        <canvas ref={kanvas} className="latar-3d-kanvas" />
      </div>
      {ucap &&
        createPortal(
          <span className="laut-ucap" key={ucap.n} style={{ left: ucap.x, top: ucap.y }} role="status">
            {ucap.teks}
          </span>,
          document.body,
        )}
    </>
  )
}

function bangunAdegan(THREE, RoundedBoxGeometry, kanvas, setUcap) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas: kanvas, antialias: true, alpha: true })
  } catch {
    return () => {}
  }
  const hp = Math.min(window.innerWidth, window.innerHeight) < 600
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, hp ? 1.25 : 1.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  const gelap = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const adegan = new THREE.Scene()
  // kabut pastel: objek yang jauh memudar, memberi kesan kedalaman
  adegan.fog = new THREE.Fog(gelap ? 0x241b3c : 0xf4ecff, 26, 52)
  const kamera = new THREE.PerspectiveCamera(36, 1, 0.1, 120)
  kamera.position.set(0, 0, 24)

  // cahaya lembut dari beberapa arah: putih dari depan, pink dari belakang (cahaya tepi), biru dari samping
  adegan.add(new THREE.HemisphereLight(0xeef7ff, 0xffd9ea, 1.25))
  const utama = new THREE.DirectionalLight(0xffffff, 1.7)
  utama.position.set(5, 8, 12)
  const tepi = new THREE.DirectionalLight(0xff9fcd, 1.3)
  tepi.position.set(-7, 4, -8)
  const pengisi = new THREE.DirectionalLight(0x9fd3ff, 0.9)
  pengisi.position.set(9, -3, 5)
  adegan.add(utama, tepi, pengisi)

  const bahan = {}
  const lembut = (warna, kasar = 0.45) =>
    (bahan[`${warna}-${kasar}`] ??= new THREE.MeshStandardMaterial({
      color: warna,
      roughness: kasar,
      metalness: 0,
      emissive: warna,
      emissiveIntensity: 0.08,
    }))
  const datar = (warna, transparan = 1) =>
    (bahan[`d${warna}-${transparan}`] ??= new THREE.MeshBasicMaterial({
      color: warna,
      transparent: transparan < 1,
      opacity: transparan,
    }))

  const semuaMata = [] // untuk animasi berkedip

  // wajah chibi: mata besar berkilau, pipi merona, senyum (mulut terbuka saat bereaksi)
  function wajah(lebar, r) {
    const g = new THREE.Group()
    for (const s of [-1, 1]) {
      const mata = new THREE.Group()
      const bola = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 16), datar(W.mata))
      bola.scale.set(1, 1.18, 0.45)
      const kilau1 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.36, 10, 8), datar(W.putih))
      kilau1.position.set(r * 0.32, r * 0.38, r * 0.4)
      const kilau2 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.17, 8, 6), datar(W.putih))
      kilau2.position.set(-r * 0.3, -r * 0.35, r * 0.42)
      mata.add(bola, kilau1, kilau2)
      mata.position.set((s * lebar) / 2, 0, 0)
      g.add(mata)
      semuaMata.push(mata)
      const pipi = new THREE.Mesh(new THREE.CircleGeometry(r * 0.75, 18), datar(W.pipi, 0.75))
      pipi.scale.x = 1.35
      pipi.position.set(s * (lebar / 2 + r * 1.15), -r * 1.15, 0)
      g.add(pipi)
    }
    const senyum = new THREE.Mesh(new THREE.TorusGeometry(r * 0.7, r * 0.17, 8, 20, Math.PI), datar(W.mata))
    senyum.rotation.z = Math.PI
    senyum.position.set(0, -r * 0.75, 0)
    const mulut = new THREE.Mesh(new THREE.SphereGeometry(r * 0.55, 16, 12), datar(0xff6fa8))
    mulut.scale.set(1, 0.8, 0.3)
    mulut.position.set(0, -r * 1.05, 0)
    mulut.visible = false
    g.add(senyum, mulut)
    g.userData = { senyum, mulut }
    return g
  }
  const girang = (muka, aktif) => {
    if (!muka) return
    muka.userData.senyum.visible = !aktif
    muka.userData.mulut.visible = aktif
  }

  // segitiga siku-siku bulat (dipakai Siku & balon); titik berat di pusat
  function geoSegitiga(alas, tinggi, tebal, bevel) {
    const b = new THREE.Shape()
    b.moveTo(0, 0)
    b.lineTo(alas, 0)
    b.lineTo(0, tinggi)
    b.closePath()
    const geo = new THREE.ExtrudeGeometry(b, {
      depth: tebal,
      bevelEnabled: true,
      bevelSize: bevel,
      bevelThickness: bevel,
      bevelSegments: 6,
      curveSegments: 4,
    })
    geo.translate(-alas / 3, -tinggi / 3, -tebal / 2)
    return geo
  }

  const objek = [] // { nama, grup, muka, skala, reaksi(t), perbarui(t, dt) }

  // reaksi umum: melompat & berputar sambil membuka mulut
  function denganLompat(o, tinggi = 1.4, putaran = 1, lama = 0.9) {
    let mulai = -1
    o.reaksi = (t) => (mulai = t)
    o.lompat = (t) => {
      if (mulai < 0) return { y: 0, putar: 0 }
      const r = Math.min((t - mulai) / lama, 1)
      girang(o.muka, r < 1)
      if (r >= 1) mulai = -1
      return { y: Math.sin(r * Math.PI) * tinggi, putar: r * Math.PI * 2 * putaran }
    }
    return o
  }

  // ---- 1. Siku ----
  {
    const grup = new THREE.Group()
    grup.add(new THREE.Mesh(geoSegitiga(3.2, 2.6, 0.9, 0.38), lembut(W.pink)))
    const muka = wajah(0.78, 0.2)
    muka.position.set(-0.05, 0.05, 0.86)
    grup.add(muka)
    const kotak = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.5, 0.12, 2, 0.05), lembut(W.putih))
    kotak.position.set(-3.2 / 3 + 0.33, -2.6 / 3 + 0.33, 0.82)
    grup.add(kotak)
    const panjang = Math.hypot(3.2, 2.6)
    const miring = new THREE.Mesh(new RoundedBoxGeometry(panjang + 0.4, 0.26, 1.5, 3, 0.12), lembut(W.biruTua, 0.35))
    miring.position.set(3.2 / 6 + 0.16, 2.6 / 6 + 0.2, 0)
    miring.rotation.z = Math.atan2(-2.6, 3.2)
    grup.add(miring)
    // tangan kecil yang melambai
    const tangan = []
    for (const [x, y, s] of [
      [-1.55, -0.1, -1],
      [0.95, -0.55, 1],
    ]) {
      const t = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.42, 4, 10), lembut(W.pink))
      t.position.set(x, y, 0.2)
      t.rotation.z = s * 0.9
      t.userData.s = s
      grup.add(t)
      tangan.push(t)
    }
    const o = denganLompat({ nama: 'siku', grup, muka, skala: 1.05 })
    o.perbarui = (t) => {
      const { y, putar } = o.lompat(t)
      const pantul = Math.sin(t * 2.2)
      const k = grup.userData.k
      grup.position.y = grup.userData.y + pantul * 0.22 + y
      grup.scale.set(k * (1 - pantul * 0.03), k * (1 + pantul * 0.04), k)
      grup.rotation.y = Math.sin(t * 0.7) * 0.45 + putar
      grup.rotation.z = Math.sin(t * 1.1) * 0.06
      tangan.forEach((m, i) => (m.rotation.z = m.userData.s * (0.9 + Math.sin(t * 5 + i * 2) * 0.35)))
    }
    objek.push(o)
  }

  // ---- 2. Menara kotak 3² + 4² = 5² ----
  {
    const dalam = new THREE.Group()
    const s = 0.4
    const kubus = new RoundedBoxGeometry(s * 0.88, s * 0.88, s * 0.88, 2, s * 0.14)
    const O = new THREE.Vector2(0, 0)
    const A = new THREE.Vector2(3 * s, 0)
    const B = new THREE.Vector2(0, 4 * s)
    const sisi = [
      { p: O, q: A, n: new THREE.Vector2(0, -1), jumlah: 3, warna: W.biru },
      { p: B, q: O, n: new THREE.Vector2(-1, 0), jumlah: 4, warna: W.pink },
      { p: A, q: B, n: new THREE.Vector2(4, 3).normalize(), jumlah: 5, warna: W.putih },
    ]
    const kubusSemua = []
    let pusatBesar = null
    for (const { p, q, n, jumlah, warna } of sisi) {
      const u = q.clone().sub(p).normalize()
      if (jumlah === 5)
        pusatBesar = {
          pos: p
            .clone()
            .addScaledVector(u, 2.5 * s)
            .addScaledVector(n, 2.5 * s),
          sudut: Math.atan2(u.y, u.x),
        }
      for (let i = 0; i < jumlah; i++)
        for (let j = 0; j < jumlah; j++) {
          const m = new THREE.Mesh(kubus, lembut(jumlah === 5 && (i + j) % 2 ? W.lila : warna))
          const pos = p
            .clone()
            .addScaledVector(u, (i + 0.5) * s)
            .addScaledVector(n, (j + 0.5) * s)
          m.position.set(pos.x, pos.y, 0)
          m.rotation.z = Math.atan2(u.y, u.x)
          m.userData.jarak = i + j
          dalam.add(m)
          kubusSemua.push(m)
        }
    }
    const segitiga = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([O, A, B])), lembut(W.pinkTua))
    segitiga.position.z = 0.05
    dalam.add(segitiga)
    // kotak besar (25 kubus) ikut punya wajah
    const muka = wajah(0.55, 0.15)
    muka.position.set(pusatBesar.pos.x, pusatBesar.pos.y, s * 0.5)
    muka.rotation.z = pusatBesar.sudut
    dalam.add(muka)
    dalam.position.set(-0.9, -0.7, 0)
    const grup = new THREE.Group()
    grup.add(dalam)
    let gelombang = -1
    const o = { nama: 'persegi', grup, muka, skala: 1 }
    o.reaksi = (t) => (gelombang = t)
    o.perbarui = (t) => {
      grup.rotation.y = Math.sin(t * 0.45) * 0.7
      grup.rotation.x = -0.22 + Math.sin(t * 0.6) * 0.1
      grup.position.y = grup.userData.y + Math.sin(t * 1.2 + 1) * 0.2
      for (const m of kubusSemua) {
        const f = gelombang >= 0 ? t - gelombang - m.userData.jarak * 0.06 : -1
        const naik = f > 0 && f < 0.5 ? Math.sin((f / 0.5) * Math.PI) : 0
        m.scale.setScalar(1 + naik * 0.5)
        m.position.z = naik * 0.35
      }
      girang(muka, gelombang >= 0)
      if (gelombang >= 0 && t - gelombang > 1.5) gelombang = -1
    }
    objek.push(o)
  }

  // ---- 3. Layang-layang (benang = sisi miring) ----
  const benang = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 6), datar(W.pinkTua))
  adegan.add(benang)
  {
    const dalam = new THREE.Group()
    const atas = new THREE.Vector3(0, 1.6, 0)
    const kanan = new THREE.Vector3(1.15, 0.35, 0)
    const bawah = new THREE.Vector3(0, -1.9, 0)
    const kiri = new THREE.Vector3(-1.15, 0.35, 0)
    const pusat = new THREE.Vector3(0, 0.35, 0.28)
    const segi = (a, b, warna) => {
      const geo = new THREE.BufferGeometry().setFromPoints([a, b, pusat])
      geo.computeVertexNormals()
      const mat = new THREE.MeshStandardMaterial({
        color: warna,
        roughness: 0.5,
        side: THREE.DoubleSide,
        emissive: warna,
        emissiveIntensity: 0.1,
      })
      bahan[`layang-${a.x}-${b.x}`] = mat
      dalam.add(new THREE.Mesh(geo, mat))
    }
    segi(atas, kiri, W.pink)
    segi(kanan, atas, W.biru)
    segi(bawah, kanan, W.pink)
    segi(kiri, bawah, W.biru)
    const muka = wajah(0.5, 0.14)
    muka.position.set(0, 0.3, 0.36)
    dalam.add(muka)
    const pita = []
    for (let i = 0; i < 5; i++) {
      const p = new THREE.Group()
      for (const s of [-1, 1]) {
        const c = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.32, 10), lembut(i % 2 ? W.biruTua : W.pinkTua))
        c.rotation.z = (s * Math.PI) / 2
        c.position.x = s * 0.15
        p.add(c)
      }
      dalam.add(p)
      pita.push(p)
    }
    const grup = new THREE.Group()
    grup.add(dalam)
    const ujung = new THREE.Vector3()
    const tangan = new THREE.Vector3()
    const o = denganLompat({ nama: 'layang', grup, muka, skala: 1 }, 0.8, 1, 1.1)
    o.perbarui = (t) => {
      const { y, putar } = o.lompat(t)
      grup.position.x = grup.userData.x + Math.sin(t * 0.8) * 0.5
      grup.position.y = grup.userData.y + Math.sin(t * 1.3) * 0.3 + y
      dalam.rotation.z = Math.sin(t * 1.1) * 0.15 + putar
      dalam.rotation.y = Math.sin(t * 0.9) * 0.35
      pita.forEach((p, i) => p.position.set(Math.sin(t * 3 + i) * 0.14 * (i + 1), -2.25 - i * 0.48, 0))
      // benang turun dari layang-layang ke tangan di bawah tepi layar (tidak memotong materi)
      ujung.set(0, -1.8, 0)
      dalam.localToWorld(ujung)
      tangan.set(grup.userData.x + 1.2 * grup.userData.k, grup.userData.y - 8 * grup.userData.k, -1)
      const arah = ujung.clone().sub(tangan)
      benang.position.copy(tangan).addScaledVector(arah, 0.5)
      benang.scale.set(1, arah.length(), 1)
      benang.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arah.normalize())
    }
    objek.push(o)
  }

  // ---- 4. Tangga bersandar dengan kelinci ----
  {
    const dalam = new THREE.Group()
    const lantai = new THREE.Mesh(new RoundedBoxGeometry(4.4, 0.3, 1.8, 3, 0.12), lembut(W.pink))
    lantai.position.set(1.1, -0.15, 0)
    const dinding = new THREE.Mesh(new RoundedBoxGeometry(0.55, 4.1, 1.8, 3, 0.14), lembut(W.putih))
    dinding.position.set(-0.85, 2.05, 0)
    dalam.add(lantai, dinding)
    // perbandingan kaki : tinggi : tangga = 3 : 4 : 5
    const kaki = new THREE.Vector3(1.85, 0, 0.42)
    const puncak = new THREE.Vector3(-0.55, 3.2, 0.42)
    const arah = puncak.clone().sub(kaki)
    const panjang = arah.length()
    const tangga = new THREE.Group()
    for (const z of [-0.34, 0.34]) {
      const rel = new THREE.Mesh(new RoundedBoxGeometry(0.16, panjang, 0.16, 2, 0.06), lembut(W.biruTua, 0.35))
      rel.position.set(0, panjang / 2, z)
      tangga.add(rel)
    }
    for (let i = 1; i <= 5; i++) {
      const anak = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.68, 10), lembut(W.kayu))
      anak.rotation.x = Math.PI / 2
      anak.position.set(0, (panjang * i) / 6, 0)
      tangga.add(anak)
    }
    tangga.position.copy(kaki)
    tangga.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arah.clone().normalize())
    dalam.add(tangga)
    const kelinci = new THREE.Group()
    const badan = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 16), lembut(W.putih))
    badan.scale.set(1, 0.92, 0.95)
    const kepala = new THREE.Mesh(new THREE.SphereGeometry(0.33, 20, 16), lembut(W.putih))
    kepala.position.set(0, 0.48, 0.06)
    kelinci.add(badan, kepala)
    for (const s of [-1, 1]) {
      const telinga = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.34, 4, 10), lembut(W.putih))
      telinga.position.set(s * 0.13, 0.9, 0)
      telinga.rotation.z = -s * 0.18
      const dalamTelinga = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.24, 4, 8), lembut(W.pink))
      dalamTelinga.position.set(0, 0, 0.05)
      telinga.add(dalamTelinga)
      kelinci.add(telinga)
    }
    const muka = wajah(0.24, 0.065)
    muka.position.set(0, 0.5, 0.36)
    kelinci.add(muka)
    dalam.add(kelinci)
    dalam.position.set(-0.6, -1.7, 0)
    const grup = new THREE.Group()
    grup.add(dalam)
    const o = denganLompat({ nama: 'tangga', grup, muka, skala: 1 }, 0.9, 0, 0.7)
    o.perbarui = (t) => {
      const { y } = o.lompat(t)
      const p = 0.15 + (Math.sin(t * 0.5) * 0.5 + 0.5) * 0.65 // naik-turun di sepanjang tangga
      kelinci.position.copy(kaki).addScaledVector(arah, p)
      kelinci.position.x += 0.28
      kelinci.position.y += 0.3 + Math.abs(Math.sin(t * 4)) * 0.14 + y
      kelinci.rotation.y = Math.sin(t * 0.5) > 0 ? -0.5 : 0.5
      grup.rotation.y = -0.35 + Math.sin(t * 0.35) * 0.18
      grup.position.y = grup.userData.y + Math.sin(t * 0.9 + 2) * 0.12
    }
    objek.push(o)
  }

  // ---- 5. Balon segitiga siku-siku (naik pelan, berulang) ----
  for (let i = 0; i < 3; i++) {
    const grup = new THREE.Group()
    const tubuh = new THREE.Mesh(geoSegitiga(1.3, 1.6, 0.5, 0.3), lembut([W.pink, W.biru, W.lila][i], 0.3))
    const muka = wajah(0.36, 0.09)
    muka.position.set(-0.05, 0.05, 0.56)
    const tali = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.6, 4), datar(W.mata, 0.45))
    tali.position.set(-0.1, -1.45, 0)
    grup.add(tubuh, muka, tali)
    const o = denganLompat({ nama: 'balon', grup, muka, skala: 0.85, urutan: i }, 0.6, 1, 0.8)
    o.perbarui = (t) => {
      const { y, putar } = o.lompat(t)
      const tinggi = grup.userData.tinggiDunia
      const jalan = ((t * (0.55 + i * 0.12) + i * 5.3) % (tinggi + 6)) - tinggi / 2 - 3
      grup.position.set(grup.userData.x + Math.sin(t * 0.9 + i) * 0.5, jalan + y, -2 - i)
      grup.rotation.z = Math.sin(t * 1.3 + i) * 0.12
      grup.rotation.y = Math.sin(t * 0.6 + i) * 0.5 + putar
    }
    objek.push(o)
  }

  // ---- 6. Awan berwajah ----
  for (let i = 0; i < 3; i++) {
    const grup = new THREE.Group()
    for (const [x, y, r] of [
      [0, 0, 1.05],
      [1.05, -0.1, 0.8],
      [-1.05, -0.12, 0.78],
      [0.45, 0.62, 0.72],
      [-0.45, 0.5, 0.62],
    ]) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(r, 22, 16), lembut(W.putih, 0.7))
      b.position.set(x, y, 0)
      grup.add(b)
    }
    const muka = wajah(0.5, 0.11)
    muka.position.set(0, 0.05, 1.04)
    grup.add(muka)
    const o = denganLompat({ nama: 'awan', grup, muka, skala: 1 - i * 0.12, urutan: i }, 0.5, 0, 0.8)
    o.perbarui = (t, dt) => {
      const { y } = o.lompat(t)
      const lebar = grup.userData.lebarDunia
      grup.userData.geser = (grup.userData.geser ?? 0) + (0.22 + i * 0.07) * dt
      let x = grup.userData.x + grup.userData.geser
      if (x > lebar / 2 + 4) {
        grup.userData.geser -= lebar + 8
        x -= lebar + 8
      }
      grup.position.set(x, grup.userData.y + Math.sin(t * 0.8 + i) * 0.15 + y, -5 - i * 2)
      grup.scale.setScalar(grup.userData.k * (1 + Math.sin(t * 1.5 + i) * 0.02))
    }
    objek.push(o)
  }

  // ---- 7. Bintang berwajah ----
  {
    const b = new THREE.Shape()
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.45 : 1
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2
      if (i === 0) b.moveTo(Math.cos(a) * r, Math.sin(a) * r)
      else b.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    b.closePath()
    const geo = new THREE.ExtrudeGeometry(b, {
      depth: 0.3,
      bevelEnabled: true,
      bevelSize: 0.14,
      bevelThickness: 0.14,
      bevelSegments: 4,
    })
    geo.translate(0, 0, -0.15)
    for (let i = 0; i < 2; i++) {
      const grup = new THREE.Group()
      grup.add(new THREE.Mesh(geo, lembut(i ? W.pink : W.biru, 0.3)))
      const muka = wajah(0.32, 0.08)
      muka.position.set(0, -0.05, 0.31)
      grup.add(muka)
      const o = denganLompat({ nama: 'bintang', grup, muka, skala: 0.8, urutan: i }, 0.6, 1, 0.8)
      o.perbarui = (t) => {
        const { y, putar } = o.lompat(t)
        grup.position.y = grup.userData.y + Math.sin(t * 1.4 + i * 2) * 0.25 + y
        grup.rotation.z = Math.sin(t * 0.8 + i) * 0.25
        grup.rotation.y = putar
        grup.scale.setScalar(grup.userData.k * (1 + Math.sin(t * 3 + i) * 0.06))
      }
      objek.push(o)
    }
  }

  // ---- hiasan: pelangi, hati, kilauan ----
  const pelangi = new THREE.Group()
  ;[W.pinkTua, W.pink, W.putih, W.biru, W.biruTua].forEach((w, i) => {
    pelangi.add(new THREE.Mesh(new THREE.TorusGeometry(9 - i * 0.55, 0.28, 10, 60, Math.PI), lembut(w, 0.6)))
  })
  pelangi.position.set(0, -6, -16)
  adegan.add(pelangi)

  const bentukHati = new THREE.Shape()
  bentukHati.moveTo(0, 0.25)
  bentukHati.bezierCurveTo(0, 0.5, -0.5, 0.5, -0.5, 0.15)
  bentukHati.bezierCurveTo(-0.5, -0.15, 0, -0.35, 0, -0.55)
  bentukHati.bezierCurveTo(0, -0.35, 0.5, -0.15, 0.5, 0.15)
  bentukHati.bezierCurveTo(0.5, 0.5, 0, 0.5, 0, 0.25)
  const geoHati = new THREE.ExtrudeGeometry(bentukHati, {
    depth: 0.2,
    bevelEnabled: true,
    bevelSize: 0.08,
    bevelThickness: 0.08,
    bevelSegments: 3,
  })
  const hati = []
  for (let i = 0; i < 8; i++) {
    const m = new THREE.Mesh(geoHati, lembut(i % 2 ? W.pinkTua : W.pink, 0.35))
    m.scale.setScalar(0.6 + (i % 3) * 0.2)
    m.userData = { x0: (i / 8) * 2 - 1, kecepatan: 0.45 + (i % 4) * 0.15, fase: i * 1.9 }
    adegan.add(m)
    hati.push(m)
  }

  // kilauan bulat lembut (titik bercahaya)
  const tekstur = (() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.35, 'rgba(255,255,255,0.7)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  })()
  const kilau = []
  for (const [warna, jumlah] of [
    [0xffffff, 40],
    [0xffb3d6, 30],
    [0xa8d8ff, 30],
  ]) {
    const posisi = new Float32Array(jumlah * 3)
    for (let i = 0; i < jumlah; i++) {
      posisi[i * 3] = (Math.random() - 0.5) * 34
      posisi[i * 3 + 1] = (Math.random() - 0.5) * 22
      posisi[i * 3 + 2] = -2 - Math.random() * 10
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posisi, 3))
    const mat = new THREE.PointsMaterial({
      color: warna,
      size: 0.5,
      map: tekstur,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    })
    bahan[`kilau-${warna}`] = mat
    const p = new THREE.Points(geo, mat)
    adegan.add(p)
    kilau.push(p)
  }

  for (const o of objek) {
    o.grup.traverse((m) => (m.userData.pemilik = o))
    adegan.add(o.grup)
  }

  // ---- tata letak menyesuaikan ukuran layar ----
  let lebarDunia = 20
  let tinggiDunia = 15
  function susun() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    kamera.aspect = w / h
    kamera.updateProjectionMatrix()
    tinggiDunia = 2 * kamera.position.z * Math.tan((kamera.fov * Math.PI) / 360)
    lebarDunia = tinggiDunia * kamera.aspect
    const tegak = kamera.aspect < 1
    const k = tegak ? 0.48 : w >= 1280 ? 1 : w >= 960 ? 0.85 : 0.72
    const tx = lebarDunia / 2
    const ty = tinggiDunia / 2
    // objek ditaruh di tepi layar agar tidak menutupi kotak materi di tengah;
    // di HP layar sempit, jadi objek lebih kecil & sebagian "mengintip" dari tepi
    const letak = tegak
      ? {
          siku: [[-tx + 0.55, ty - 2.4]],
          layang: [[tx - 0.55, ty - 3.2]],
          persegi: [[-tx + 0.45, -ty + 1.7]],
          tangga: [[tx - 1, -ty + 0.9]],
          balon: [
            [-tx + 0.35, 0],
            [tx - 0.35, 0],
            [-tx + 0.8, 0],
          ],
          awan: [
            [-tx, ty - 1],
            [0, ty - 6],
            [tx * 0.5, -ty + 5],
          ],
          bintang: [
            [tx - 0.5, ty - 8.5],
            [-tx + 0.5, -ty + 6.2],
          ],
        }
      : {
          siku: [[-tx + 2.6 * k + 0.4, ty - 3.4 * k - 1.4]],
          layang: [[tx - 1.8 * k - 0.5, ty - 2.6 * k - 1.2]],
          persegi: [[-tx + 2.6 * k + 0.6, -ty + 2.8 * k + 0.5]],
          tangga: [[tx - 2.8 * k - 0.5, -ty + 1.5 * k + 0.3]],
          balon: [
            [-tx + 1.1, 0],
            [tx - 1.2, 0],
            [-tx + 4.2 * k, 0],
          ],
          awan: [
            [-tx * 0.6, ty - 1.4],
            [tx * 0.3, ty - 2.2],
            [tx * 0.7, -ty + 4.4],
          ],
          bintang: [
            [tx - 4.6 * k, ty - 1.8],
            [-tx + 5 * k, -ty + 1.6],
          ],
        }
    for (const o of objek) {
      const [x, y] = letak[o.nama][o.urutan ?? 0]
      const kk = k * o.skala
      o.grup.userData = { ...o.grup.userData, x, y, k: kk, lebarDunia, tinggiDunia, geser: 0 }
      o.grup.position.set(x, y, o.grup.position.z)
      o.grup.scale.setScalar(kk)
    }
    // di HP pelangi dikecilkan & diturunkan agar tidak berada tepat di belakang tulisan materi
    pelangi.scale.setScalar(tegak ? 0.55 : 1)
    pelangi.userData.y = tegak ? -12 : -6
  }
  susun()
  window.addEventListener('resize', susun)

  // ---- sudut pandang ikut bergerak (kesan 3D): tetikus & guliran halaman ----
  const arahPandang = { x: 0, y: 0 }
  const tetikus = (e) => {
    arahPandang.x = (e.clientX / window.innerWidth) * 2 - 1
    arahPandang.y = (e.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('pointermove', tetikus, { passive: true })

  // ---- klik / ketuk objek ----
  const sinar = new THREE.Raycaster()
  const titik = new THREE.Vector2()
  const kenai = (e) => {
    const r = kanvas.getBoundingClientRect()
    titik.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    sinar.setFromCamera(titik, kamera)
    const hasil = sinar.intersectObjects(
      objek.map((o) => o.grup),
      true,
    )
    return hasil[0]?.object.userData.pemilik ?? null
  }
  let waktu = 0
  const diklik = (e) => {
    const o = kenai(e)
    if (!o) return
    o.reaksi(waktu)
    const daftar = SAPAAN[o.nama]
    const n = (o.hitung = (o.hitung ?? -1) + 1)
    // balon kata di atas objek, digambar di lapisan depan agar tidak tertutup kotak
    const atas = new THREE.Vector3(0, 2, 0)
    o.grup.localToWorld(atas)
    atas.project(kamera)
    const x = Math.min(Math.max(((atas.x + 1) / 2) * window.innerWidth, 130), window.innerWidth - 130)
    const y = Math.max(((1 - atas.y) / 2) * window.innerHeight, 70)
    setUcap({ teks: daftar[n % daftar.length], x, y, n: Date.now() })
    gambar(true)
  }
  const melayang = (e) => {
    kanvas.style.cursor = kenai(e) ? 'pointer' : 'default'
  }
  kanvas.addEventListener('click', diklik)
  kanvas.addEventListener('pointermove', melayang)

  // ---- putaran animasi hemat (±30 fps) ----
  const gerakDikurangi = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  const animasiMati = () => document.documentElement.classList.contains('tanpa-animasi') || gerakDikurangi?.matches
  let bingkai = 0
  let terakhir = performance.now()
  let waktuBerhenti = 0
  let kedip = 3
  function perbaruiSemua(dt) {
    waktu += dt
    for (const o of objek) o.perbarui(waktu, dt)
    // semua karakter berkedip bersama setiap beberapa detik
    kedip -= dt
    const tutup = kedip < 0.12 && kedip > 0
    for (const m of semuaMata) m.scale.y = tutup ? 0.12 : 1
    if (kedip <= 0) kedip = 2.5 + Math.random() * 2.5
    for (const m of hati) {
      const { x0, kecepatan, fase } = m.userData
      const jalan = ((waktu * kecepatan + fase) % (tinggiDunia + 4)) - tinggiDunia / 2 - 2
      m.position.set(x0 * (lebarDunia / 2 - 1) + Math.sin(waktu + fase) * 0.6, jalan, -4)
      m.rotation.y = waktu * 1.2 + fase
    }
    kilau.forEach((p, i) => {
      p.material.opacity = 0.55 + Math.sin(waktu * 2 + i * 2) * 0.35
    })
    pelangi.position.y = pelangi.userData.y + Math.sin(waktu * 0.4) * 0.2
    // kamera bergeser pelan mengikuti tetikus & guliran: objek dekat & jauh bergerak berbeda (paralaks 3D)
    const gulir = Math.min(window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1), 1)
    const tujuanX = arahPandang.x * 1.4 + Math.sin(waktu * 0.15) * 0.6
    const tujuanY = -arahPandang.y * 0.9 - (gulir - 0.5) * 2.4
    kamera.position.x += (tujuanX - kamera.position.x) * Math.min(dt * 2, 1)
    kamera.position.y += (tujuanY - kamera.position.y) * Math.min(dt * 2, 1)
    kamera.lookAt(0, 0, -4)
  }
  function gambar(sekali = false) {
    cancelAnimationFrame(bingkai)
    const langkah = (sekarang) => {
      const dt = Math.min((sekarang - terakhir) / 1000, 0.1)
      if (dt >= 1 / 32) {
        terakhir = sekarang
        perbaruiSemua(dt)
        renderer.render(adegan, kamera)
      }
      if (document.hidden) return
      // saat animasi mati, reaksi klik tetap digerakkan ±1,5 detik lalu berhenti
      if (animasiMati() && !(sekali && sekarang < waktuBerhenti)) return
      bingkai = requestAnimationFrame(langkah)
    }
    waktuBerhenti = sekali ? performance.now() + 1500 : 0
    terakhir = performance.now() - 40
    bingkai = requestAnimationFrame(langkah)
  }
  perbaruiSemua(0.016)
  renderer.render(adegan, kamera)
  if (!animasiMati()) gambar()

  const ubahTampil = () => {
    if (!document.hidden && !animasiMati()) gambar()
  }
  document.addEventListener('visibilitychange', ubahTampil)
  const pengamat = new MutationObserver(() => (animasiMati() ? cancelAnimationFrame(bingkai) : gambar()))
  pengamat.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  return () => {
    cancelAnimationFrame(bingkai)
    window.removeEventListener('resize', susun)
    window.removeEventListener('pointermove', tetikus)
    document.removeEventListener('visibilitychange', ubahTampil)
    kanvas.removeEventListener('click', diklik)
    kanvas.removeEventListener('pointermove', melayang)
    pengamat.disconnect()
    adegan.traverse((m) => m.geometry?.dispose())
    Object.values(bahan).forEach((b) => b.dispose())
    tekstur.dispose()
    renderer.dispose()
  }
}
