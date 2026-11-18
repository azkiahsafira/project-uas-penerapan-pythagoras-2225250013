// Latar belakang 3D "Dunia Sahabat Kawaii" (three.js) untuk semua menu, di belakang kotak-kotak yang tembus pandang.
// Gaya kartun kawaii pastel biru muda + pink muda: boneka 3D berbayang kartun (toon) dengan garis tepi lembut.
// Empat sahabat ORISINAL membawa bagian rumus Pythagoras: Kuadra si penguin (a²), Lila si domba (b²), Hipo si beruang
// (c² = sisi miring), dan Akar si kucing (√). Mereka duduk di awan, menoleh mengikuti kursor/jari, berkedip, dan
// melompat sambil berbicara saat diklik. Sekelilingnya ramai: bintang, hati, pita, permen, awan bermata, dan langit
// bertitik pink. Klik langit kosong → hujan hati & bintang. Hemat: three.js diunduh setelah halaman tampil, ±30 fps,
// efek bersinar hanya di layar besar, berhenti saat tab tidak dilihat, saat "Animasi: mati", dan prefers-reduced-motion.
// Disembunyikan saat tes.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const W = {
  biru: 0xb5ddff,
  biruTua: 0x6cbcff,
  pink: 0xffc2df,
  pinkTua: 0xff7fb8,
  putih: 0xffffff,
  krem: 0xfff6fb,
  lila: 0xe2cfff,
  kuning: 0xfff1a8,
  emas: 0xf2c14e,
  garis: 0x6b5a8e,
}

const SAPAAN = {
  kuadra: ['Halo, aku Kuadra si penguin! a² artinya a × a 🐧', '3² = 9, gampang kan? 💗', 'Ayo kuadratkan sisi siku-sikunya ✨'],
  lila: ['Aku Lila, pembawa b² 🐑', 'a² + b² ... hasilnya c²! 🌸', 'Pelan-pelan, kamu pasti bisa 💜'],
  hipo: ['Aku Hipo, si sisi miring c² 🐻', 'Sisi miring selalu paling panjang! 📏', '3² + 4² = 5², itu aku! 👑'],
  akar: ['Aku Akar, si kucing √ 🐱', '√25 = 5, meong! ✨', 'Jangan lupa tarik akarnya ya 💕'],
  awan: ['Halo dari awan empuk ☁️', 'Semangat belajar ya 💗', 'Kamu bintangnya hari ini ⭐'],
  balon: ['Pop! 🎈 Hujan hati untukmu', 'Dor! Semangat terus ya 💗', 'Pop! Kamu hebat ✨'],
  matahari: ['Selamat pagi, juara! ☀️', 'Cerah seperti ide Pythagorasmu 🌈', 'Ayo lanjut belajar! 💛'],
}

export default function Latar3D({ halaman, arah = 'kanan' }) {
  const kanvas = useRef(null)
  const pengendali = useRef(null)
  const halamanLalu = useRef(halaman)
  const [ucap, setUcap] = useState(null)

  // pindah menu → latar ikut bergerak: kamera menyapu ke arah menu tujuan, hiasan tertiup, para sahabat bersorak
  useEffect(() => {
    if (halamanLalu.current === halaman) return
    halamanLalu.current = halaman
    pengendali.current?.pindahMenu(arah === 'kiri' ? -1 : 1)
  }, [halaman, arah])

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
      Promise.all([
        import('three'),
        import('three/examples/jsm/environments/RoomEnvironment.js'),
        import('three/examples/jsm/postprocessing/EffectComposer.js'),
        import('three/examples/jsm/postprocessing/RenderPass.js'),
        import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
        import('three/examples/jsm/postprocessing/OutputPass.js'),
      ]).then(([THREE, a, b, c, d, e]) => {
        if (batal || !kanvas.current) return
        const modul = { ...a, ...b, ...c, ...d, ...e }
        const adegan = bangunAdegan(THREE, modul, kanvas.current, setUcap)
        bersihkan = adegan.bersihkan
        pengendali.current = adegan
      })
    }, 600)
    return () => {
      batal = true
      clearTimeout(tunda)
      pengendali.current = null
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

function bangunAdegan(THREE, M, kanvas, setUcap) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas: kanvas, antialias: true, powerPreference: 'high-performance' })
  } catch {
    return { bersihkan: () => {}, pindahMenu: () => {} }
  }
  const hp = Math.min(window.innerWidth, window.innerHeight) < 600
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, hp ? 1.25 : 1.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1.06
  const gelap = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const acak = (a, b) => a + Math.random() * (b - a)
  const pilih = (daftar) => daftar[Math.floor(Math.random() * daftar.length)]

  const adegan = new THREE.Scene()
  adegan.fog = new THREE.Fog(gelap ? 0x30306a : 0xf4e6ff, 42, 92)
  const KAMERA_Z = 24
  const kamera = new THREE.PerspectiveCamera(36, 1, 0.1, 170)
  kamera.position.set(0, 0.5, KAMERA_Z)

  // ---- tekstur buatan sendiri (tanpa berkas gambar) ----
  const teksturKanvas = (lebar, tinggi, lukis) => {
    const c = document.createElement('canvas')
    c.width = lebar
    c.height = tinggi
    lukis(c.getContext('2d'), lebar, tinggi)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }
  const teksturLangit = teksturKanvas(4, 512, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h)
    const warna = gelap ? ['#1f3a70', '#33306c', '#5c3268'] : ['#a8dbff', '#dfe3ff', '#ffc4e1']
    grad.addColorStop(0, warna[0])
    grad.addColorStop(0.55, warna[1])
    grad.addColorStop(1, warna[2])
    g.fillStyle = grad
    g.fillRect(0, 0, w, h)
  })
  adegan.background = teksturLangit
  const teksturBulat = teksturKanvas(64, 64, (g) => {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.35, 'rgba(255,255,255,0.6)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 64, 64)
  })
  const teksturTitik = teksturKanvas(64, 64, (g) => {
    g.fillStyle = '#ffffff'
    g.beginPath()
    g.arc(32, 32, 26, 0, Math.PI * 2)
    g.fill()
  })
  const lukisHati = (g, s = 1) => {
    g.beginPath()
    g.moveTo(32 * s, 54 * s)
    g.bezierCurveTo(4 * s, 36 * s, 6 * s, 10 * s, 22 * s, 10 * s)
    g.bezierCurveTo(28 * s, 10 * s, 32 * s, 15 * s, 32 * s, 20 * s)
    g.bezierCurveTo(32 * s, 15 * s, 36 * s, 10 * s, 42 * s, 10 * s)
    g.bezierCurveTo(58 * s, 10 * s, 60 * s, 36 * s, 32 * s, 54 * s)
    g.fill()
  }
  const teksturHati = teksturKanvas(64, 64, (g) => {
    g.fillStyle = '#ffffff'
    lukisHati(g)
  })
  const teksturBintang = teksturKanvas(64, 64, (g) => {
    g.fillStyle = '#ffffff'
    g.beginPath()
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 12 : 28
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2
      g.lineTo(32 + Math.cos(a) * r, 34 + Math.sin(a) * r)
    }
    g.fill()
  })
  // papan rumus yang dibawa setiap sahabat
  const teksturPapan = (teks, latar, warnaTeks) =>
    teksturKanvas(128, 72, (g) => {
      g.fillStyle = latar
      g.beginPath()
      g.roundRect(4, 4, 120, 64, 30)
      g.fill()
      g.lineWidth = 6
      g.strokeStyle = '#6b5a8e'
      g.stroke()
      g.fillStyle = warnaTeks
      g.font = '50px "Bubblegum Sans", "Itim", system-ui, sans-serif'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.fillText(teks, 64, 40)
    })

  // ---- cahaya lembut ----
  const pmrem = new THREE.PMREMGenerator(renderer)
  const ruang = new M.RoomEnvironment()
  const lingkungan = pmrem.fromScene(ruang, 0.04).texture
  ruang.dispose?.()
  pmrem.dispose()
  adegan.environment = lingkungan
  adegan.environmentIntensity = 0.45
  adegan.add(new THREE.HemisphereLight(0xffffff, 0xffd6ea, 1.55))
  const matahari = new THREE.DirectionalLight(0xffffff, 2.0)
  matahari.position.set(3, 10, 8)
  const tepi = new THREE.DirectionalLight(0xffb3d6, 0.8)
  tepi.position.set(-6, 3, -6)
  adegan.add(matahari, tepi)

  // ---- bahan kartun (toon): bayangan bertingkat 3 seperti gambar kartun, plus garis tepi lembut ----
  const bahan = {}
  const tingkat = new THREE.DataTexture(new Uint8Array([185, 232, 255]), 3, 1, THREE.RedFormat)
  tingkat.minFilter = tingkat.magFilter = THREE.NearestFilter
  tingkat.needsUpdate = true
  const kartun = (warna) => (bahan[`kt${warna}`] ??= new THREE.MeshToonMaterial({ color: warna, gradientMap: tingkat }))
  const garisTepi = (bahan.garis = new THREE.MeshBasicMaterial({ color: W.garis, side: THREE.BackSide }))
  const datar = (warna) => (bahan[`d${warna}`] ??= new THREE.MeshBasicMaterial({ color: warna }))
  const tembus = (warna, op) =>
    (bahan[`t${warna}-${op}`] ??= new THREE.MeshBasicMaterial({
      color: warna,
      transparent: true,
      opacity: op,
      depthWrite: false,
    }))
  const cahaya = (peta, warna, op) =>
    new THREE.SpriteMaterial({
      map: peta,
      color: warna,
      transparent: true,
      opacity: op,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  const bola = new THREE.SphereGeometry(1, 32, 24)
  // bagian tubuh membulat dengan garis tepi (cangkang terbalik sedikit lebih besar)
  function bulat(warna, sx, sy, sz, tebalGaris = 0.045) {
    const m = new THREE.Mesh(bola, kartun(warna))
    m.scale.set(sx, sy, sz)
    const g = new THREE.Mesh(bola, garisTepi)
    g.scale.set(1 + tebalGaris / sx, 1 + tebalGaris / sy, 1 + tebalGaris / sz)
    m.add(g)
    return m
  }
  const taruh = (m, x, y, z) => {
    m.position.set(x, y, z)
    return m
  }
  const bentukHati = (() => {
    const s = new THREE.Shape()
    s.moveTo(0, -0.55)
    s.bezierCurveTo(-0.9, -0.05, -0.75, 0.6, -0.3, 0.6)
    s.bezierCurveTo(-0.1, 0.6, 0, 0.45, 0, 0.3)
    s.bezierCurveTo(0, 0.45, 0.1, 0.6, 0.3, 0.6)
    s.bezierCurveTo(0.75, 0.6, 0.9, -0.05, 0, -0.55)
    return s
  })()
  const bentukBintang = (() => {
    const s = new THREE.Shape()
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.42 : 0.95
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2
      if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r)
      else s.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    return s
  })()
  const ekstrusi = (b, tebal) => {
    const geo = new THREE.ExtrudeGeometry(b, {
      depth: tebal,
      bevelEnabled: true,
      bevelSize: 0.12,
      bevelThickness: 0.12,
      bevelSegments: 4,
      curveSegments: 14,
    })
    geo.center()
    return geo
  }
  const geoHati = ekstrusi(bentukHati, 0.18)
  const geoBintang = ekstrusi(bentukBintang, 0.2)
  function benda3d(geo, warna) {
    const m = new THREE.Mesh(geo, kartun(warna))
    const g = new THREE.Mesh(geo, garisTepi)
    g.scale.setScalar(1.07)
    m.add(g)
    return m
  }

  // ---- wajah kawaii: mata oval kecil berkilau, pipi merona, mulut mungil ----
  const semuaMata = []
  function wajah(kepala, y, jarak, mulutW = false, maju = 0) {
    for (const s of [-1, 1]) {
      const mata = new THREE.Group()
      const hitam = new THREE.Mesh(bola, datar(0x3b2f55))
      hitam.scale.set(0.11, 0.15, 0.05)
      const kilau = new THREE.Mesh(bola, datar(W.putih))
      kilau.scale.setScalar(0.045)
      kilau.position.set(0.035, 0.055, 0.045)
      const kilauKecil = new THREE.Mesh(bola, datar(W.putih))
      kilauKecil.scale.setScalar(0.022)
      kilauKecil.position.set(-0.035, -0.05, 0.045)
      mata.add(hitam, kilau, kilauKecil)
      mata.position.set(s * jarak, y, 0.93 + maju)
      kepala.add(mata)
      semuaMata.push(mata)
      const pipi = new THREE.Mesh(bola, tembus(0xff6fa8, 0.7))
      pipi.scale.set(0.17, 0.095, 0.03)
      pipi.position.set(s * (jarak + 0.22), y - 0.19, 0.86 + maju)
      kepala.add(pipi)
    }
    const geoMulut = new THREE.TorusGeometry(0.055, 0.016, 6, 12, Math.PI)
    for (const s of mulutW ? [-1, 1] : [0]) {
      const m = new THREE.Mesh(geoMulut, datar(0x3b2f55))
      m.rotation.z = Math.PI
      m.position.set(s * 0.055, y - 0.17, 0.95 + maju)
      kepala.add(m)
    }
  }

  // ---- 1. Empat sahabat kawaii (boneka 3D) ----
  const RAGAM = {
    kuadra: { tubuh: 0x8fcaff, papan: ['a²', '#ffd6ea', '#c2477f'] },
    lila: { tubuh: W.lila, papan: ['b²', '#efe6ff', '#7a4fc4'] },
    hipo: { tubuh: W.biru, papan: ['c²', '#cfe9ff', '#2f6fb3'] },
    akar: { tubuh: W.pink, papan: ['√', '#cfe9ff', '#2f6fb3'] },
  }
  const tekstur = { teksturLangit, teksturBulat, teksturTitik, teksturHati, teksturBintang, tingkat }
  const warnaBalon = [0xffb3d1, W.biruTua, W.lila, 0xfff1a8, 0xa9dcff]
  const geoTali = new THREE.CylinderGeometry(0.012, 0.012, 1, 4)
  // balon pastel dengan simpul & tali (dipakai balon terbang & bayi sahabat yang bergelantungan)
  function balonPastel(warna) {
    const g = new THREE.Group()
    const kantong = bulat(warna, 0.55, 0.66, 0.55, 0.035)
    const kilauBalon = new THREE.Mesh(bola, tembus(W.putih, 0.7))
    kilauBalon.scale.set(0.12, 0.2, 0.05)
    kilauBalon.position.set(-0.2, 0.25, 0.5)
    const simpul = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.14, 10), kartun(warna))
    simpul.position.y = -0.72
    simpul.rotation.x = Math.PI
    const tali = new THREE.Mesh(geoTali, datar(W.garis))
    tali.scale.y = 1.3
    tali.position.y = -1.45
    g.add(kantong, kilauBalon, simpul, tali)
    return g
  }
  function sahabat(jenis, { mini = false, gantung = false } = {}) {
    const { tubuh, papan } = RAGAM[jenis]
    const grup = new THREE.Group()
    const boneka = new THREE.Group()
    grup.add(boneka)
    const telingaGoyang = []
    const tangan = []
    // awan tempat duduk (bayi yang bergelantungan di balon tidak duduk di awan)
    const awan = new THREE.Group()
    for (const [x, y, r] of [
      [-0.9, 0, 0.55],
      [-0.35, 0.12, 0.7],
      [0.35, 0.1, 0.68],
      [0.9, -0.02, 0.52],
      [0, -0.18, 0.62],
    ])
      awan.add(taruh(bulat(W.putih, r * 1.2, r * 0.75, r * 0.9, 0.04), x, y, 0))
    awan.position.y = -0.55
    if (!gantung) grup.add(awan)
    let balon = null
    if (gantung) {
      balon = balonPastel(pilih(warnaBalon))
      balon.position.set(0.55, 3.2, -0.1)
      grup.add(balon)
    }
    const badan = bulat(jenis === 'lila' ? W.krem : tubuh, 0.55, 0.5, 0.48)
    badan.position.y = 0.2
    boneka.add(badan)
    for (const s of [-1, 1]) {
      // penguin punya sirip pipih, sahabat lain tangan bulat
      const t1 = jenis === 'kuadra' ? bulat(tubuh, 0.12, 0.3, 0.12) : bulat(jenis === 'lila' ? W.krem : tubuh, 0.17, 0.15, 0.15)
      if (jenis === 'kuadra') t1.rotation.z = s * 0.5
      t1.position.set(s * 0.5, 0.22, 0.38)
      t1.userData.asal = t1.position.clone()
      tangan.push(t1)
      const kaki = bulat(jenis === 'kuadra' ? 0xffb35c : jenis === 'lila' ? W.krem : tubuh, 0.2, 0.15, 0.2)
      kaki.position.set(s * 0.28, -0.28, 0.32)
      boneka.add(t1, kaki)
    }
    const kepala = new THREE.Group()
    kepala.position.y = 1.12
    boneka.add(kepala)
    const tengkorak = bulat(jenis === 'lila' ? W.krem : tubuh, 1.1, 0.9, 0.92)
    kepala.add(tengkorak)
    if (jenis === 'kuadra') {
      // penguin: topeng wajah putih, paruh oranye, perut putih, jambul kecil
      const topeng = bulat(W.putih, 0.82, 0.66, 0.3, 0.02)
      topeng.position.set(0, -0.08, 0.7)
      const paruh = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 14), kartun(0xffb35c))
      paruh.rotation.x = Math.PI / 2
      paruh.position.set(0, -0.2, 1.08)
      const jambul = bulat(tubuh, 0.12, 0.2, 0.12, 0.03)
      jambul.position.set(0, 0.92, 0.05)
      jambul.rotation.z = -0.3
      kepala.add(topeng, paruh, jambul)
      telingaGoyang.push(jambul)
      const perut = bulat(W.putih, 0.4, 0.4, 0.18, 0.02)
      perut.position.set(0, 0.16, 0.38)
      boneka.add(perut)
      const syal = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.09, 10, 28), kartun(W.pinkTua))
      syal.rotation.x = Math.PI / 2
      syal.position.y = 0.62
      boneka.add(syal)
    } else if (jenis === 'akar') {
      const kerucut = new THREE.ConeGeometry(0.28, 0.45, 18)
      for (const s of [-1, 1]) {
        const telinga = new THREE.Mesh(kerucut, kartun(W.pink))
        const g = new THREE.Mesh(kerucut, garisTepi)
        g.scale.setScalar(1.12)
        telinga.add(g)
        telinga.position.set(s * 0.55, 0.72, 0)
        telinga.rotation.z = -s * 0.45
        kepala.add(telinga)
        telingaGoyang.push(telinga)
      }
      const kalung = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.06, 10, 28), kartun(W.biruTua))
      kalung.rotation.x = Math.PI / 2
      kalung.position.y = 0.6
      const bintang = benda3d(geoBintang, W.kuning)
      bintang.scale.setScalar(0.17)
      bintang.position.set(0, 0.5, 0.5)
      boneka.add(kalung, bintang)
      // ekor berujung hati
      const ekor = bulat(W.pink, 0.1, 0.42, 0.1)
      ekor.position.set(0.62, 0.35, -0.35)
      ekor.rotation.z = -0.6
      const ujung = benda3d(geoHati, W.pinkTua)
      ujung.scale.setScalar(0.2)
      ujung.position.set(0.85, 0.72, -0.4)
      boneka.add(ekor, ujung)
    } else if (jenis === 'hipo') {
      for (const s of [-1, 1]) {
        const telinga = bulat(W.biru, 0.28, 0.28, 0.2)
        telinga.position.set(s * 0.68, 0.62, -0.05)
        kepala.add(telinga)
        telingaGoyang.push(telinga)
      }
      const moncong = bulat(W.putih, 0.32, 0.22, 0.2, 0.03)
      moncong.position.set(0, -0.2, 0.72)
      const hidung = new THREE.Mesh(bola, datar(0x3b2f55))
      hidung.scale.set(0.09, 0.065, 0.05)
      hidung.position.set(0, -0.12, 0.92)
      kepala.add(moncong, hidung)
      const mahkota = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.2, 5, 1), kartun(W.kuning))
      mahkota.position.y = 0.88
      for (let i = 0; i < 5; i++) {
        const duri = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 8), kartun(W.kuning))
        const a = (i / 5) * Math.PI * 2
        duri.position.set(Math.cos(a) * 0.27, 1.05, Math.sin(a) * 0.27)
        kepala.add(duri)
      }
      kepala.add(mahkota)
    } else {
      // Lila: bulu domba ungu seperti awan di atas kepala, telinga terkulai
      for (const [x, y, z, r] of [
        [0, 0.72, 0, 0.42],
        [-0.42, 0.6, 0, 0.36],
        [0.42, 0.6, 0, 0.36],
        [-0.7, 0.25, -0.05, 0.3],
        [0.7, 0.25, -0.05, 0.3],
        [0, 0.55, -0.35, 0.4],
      ]) {
        const b = bulat(W.lila, r, r, r)
        b.position.set(x, y, z)
        kepala.add(b)
      }
      for (const s of [-1, 1]) {
        const telinga = bulat(0xffe7f1, 0.28, 0.13, 0.12)
        telinga.position.set(s * 0.95, -0.02, 0)
        telinga.rotation.z = s * 0.5
        kepala.add(telinga)
        telingaGoyang.push(telinga)
      }
    }
    if (jenis === 'kuadra' || jenis === 'akar') {
      const pitaKepala = pita(jenis === 'kuadra' ? W.pinkTua : W.biruTua)
      pitaKepala.scale.setScalar(0.55)
      pitaKepala.position.set(jenis === 'kuadra' ? 0.42 : -0.55, jenis === 'kuadra' ? 0.66 : 0.62, 0.35)
      pitaKepala.rotation.z = jenis === 'kuadra' ? -0.4 : 0.4
      kepala.add(pitaKepala)
    } else if (jenis === 'lila') {
      const bunga = new THREE.Group()
      for (let i = 0; i < 5; i++) {
        const kelopak = bulat(0xffa3cf, 0.14, 0.14, 0.08, 0.02)
        const a = (i / 5) * Math.PI * 2
        kelopak.position.set(Math.cos(a) * 0.15, Math.sin(a) * 0.15, 0)
        bunga.add(kelopak)
      }
      bunga.add(bulat(0xfff1a8, 0.08, 0.08, 0.06, 0.02))
      bunga.position.set(0.45, 0.62, 0.45)
      kepala.add(bunga)
    } else {
      const dasi = pita(W.pinkTua)
      dasi.scale.setScalar(0.42)
      dasi.position.set(0, 0.58, 0.42)
      boneka.add(dasi)
    }
    wajah(
      kepala,
      jenis === 'hipo' ? 0.08 : -0.02,
      jenis === 'hipo' ? 0.34 : 0.3,
      jenis === 'akar' || jenis === 'hipo',
      jenis === 'kuadra' ? 0.13 : 0,
    )
    // papan rumus di tangan (bayi sahabat tidak membawa papan)
    if (!mini) {
      const tp = (tekstur[`papan-${jenis}`] ??= teksturPapan(...papan))
      const pPapan = new THREE.Mesh(
        new THREE.PlaneGeometry(0.75, 0.42),
        (bahan[`papan-${jenis}`] ??= new THREE.MeshBasicMaterial({ map: tp, transparent: true })),
      )
      pPapan.position.set(0, 0.18, 0.6)
      boneka.add(pPapan)
    }

    const fase = acak(0, 6.3)
    const ritmeLambai = acak(4, 7)
    let mulaiKlik = -10
    let mulaiGeli = -10
    let hatiBerikut = acak(2, 6)
    const atasKepala = new THREE.Vector3()
    return {
      nama: jenis,
      grup,
      kepala,
      d: { x: 0, y: 0, z: 0, kec: 0 },
      perbarui(t, dt) {
        const s = t - mulaiKlik
        const aktif = s >= 0 && s < 1
        const lompat = aktif ? Math.sin(s * Math.PI) : 0
        const pegas = aktif ? Math.sin(s * Math.PI * 3) * (1 - s) * 0.12 : 0
        // bayi sahabat melompat-lompat kecil terus; yang besar memantul pelan
        const irama = mini && !gantung ? 3.2 : 2.4
        const pantulan = Math.abs(Math.sin(t * irama + fase))
        const loncat = mini && !gantung ? pantulan * 0.6 : gantung ? 0 : pantulan * 0.32
        // tertekan sedikit saat menyentuh awan, memanjang saat melayang (squash & stretch)
        const tekan = gantung ? 0 : (1 - pantulan) ** 3 * 0.1
        boneka.position.y = loncat + lompat * 1.4
        boneka.scale.set(1 + pegas + tekan, 1 - pegas - tekan, 1 + pegas + tekan)
        boneka.rotation.y = Math.sin(t * 0.7 + fase) * 0.15 + (aktif ? s * Math.PI * 2 : 0)
        const geli = t - mulaiGeli < 0.7 ? Math.sin((t - mulaiGeli) * 30) * (0.7 - (t - mulaiGeli)) * 0.5 : 0
        boneka.rotation.z = Math.sin(t * 1.6 + fase) * (gantung ? 0.2 : 0.12) + geli
        awan.position.y = -0.55 + Math.sin(t * 0.9 + fase) * 0.05
        // tangan kanan melambai sesekali (dan saat diklik); yang bergelantungan mengangkat kedua tangan
        const lambai = (t + fase) % ritmeLambai < 1.6 || (s >= 0 && s < 1.6)
        tangan.forEach((h, i) => {
          const a = h.userData.asal
          const naik = gantung ? 0.75 : lambai && i === 1 ? 0.55 : 0
          h.position.set(a.x * (gantung ? 0.8 : 1), a.y + naik + (naik ? Math.sin(t * 14) * 0.08 : 0), a.z)
        })
        telingaGoyang.forEach((e, i) => {
          e.rotation.x = Math.sin(t * 3 + fase + i) * 0.12
        })
        if (balon) balon.rotation.z = Math.sin(t * 1.1 + fase) * 0.12
        // sesekali hati kecil muncul di atas kepala
        hatiBerikut -= dt ?? 0
        if (hatiBerikut <= 0) {
          hatiBerikut = acak(3, 7)
          kepala.getWorldPosition(atasKepala)
          atasKepala.y += 1.1 * grup.scale.y
          semburKecil(atasKepala)
        }
      },
      reaksi(t) {
        mulaiKlik = t
        semburHati(grup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 1.6, 0.5)), 16, 1)
      },
      sorak(t) {
        mulaiKlik = t
      },
      geli(t) {
        if (t - mulaiGeli > 1.2) mulaiGeli = t
      },
    }
  }
  const urutan = ['kuadra', 'lila', 'hipo', 'akar']
  const sahabatSemua = urutan.map((j) => sahabat(j))
  // bayi-bayi sahabat yang melompat di awan kecil, dan yang bergelantungan di balon sambil terbang melintas
  const bayiSemua = Array.from({ length: hp ? 4 : 8 }, (_, i) => sahabat(urutan[i % 4], { mini: true }))
  const terbangSemua = Array.from({ length: hp ? 2 : 3 }, (_, i) => sahabat(urutan[(i + 2) % 4], { mini: true, gantung: true }))
  const objek = [...sahabatSemua, ...bayiSemua, ...terbangSemua] // yang bisa diklik: { nama, grup, perbarui, reaksi }

  // ---- 2. Awan bermata yang melayang pelan ----
  const awanSemua = Array.from({ length: hp ? 2 : 3 }, () => {
    const grup = new THREE.Group()
    const isi = new THREE.Group()
    grup.add(isi)
    for (const [x, y, r] of [
      [-1, 0, 0.6],
      [-0.4, 0.25, 0.8],
      [0.35, 0.2, 0.78],
      [0.95, 0, 0.6],
      [0, -0.15, 0.7],
    ])
      isi.add(taruh(bulat(W.putih, r * 1.15, r * 0.8, r * 0.85, 0.04), x, y, 0))
    const muka = new THREE.Group()
    muka.position.set(0, 0.1, -0.05)
    isi.add(muka)
    wajah(muka, 0, 0.32)
    const fase = acak(0, 6.3)
    let mulaiKlik = -10
    return {
      nama: 'awan',
      grup,
      perbarui(t) {
        const s = t - mulaiKlik
        const pantul = s < 1.1 ? Math.sin((s / 1.1) * Math.PI * 2) * (1 - s / 1.1) : 0
        isi.position.y = Math.sin(t * 0.8 + fase) * 0.25
        isi.scale.set(1 + pantul * 0.2, 1 - pantul * 0.2, 1)
      },
      reaksi(t) {
        mulaiKlik = t
        semburHati(grup.getWorldPosition(new THREE.Vector3()), 12, 1)
      },
    }
  })
  objek.push(...awanSemua)

  // ---- 3. Hiasan melayang: bintang, hati, pita, & permen 3D kartun ----
  function pita(warna) {
    const g = new THREE.Group()
    for (const s of [-1, 1]) {
      const sayap = bulat(warna, 0.42, 0.28, 0.12, 0.03)
      sayap.position.x = s * 0.38
      sayap.rotation.z = s * 0.35
      g.add(sayap)
    }
    const simpul = bulat(W.pinkTua, 0.16, 0.16, 0.14, 0.03)
    g.add(simpul)
    return g
  }
  function permen(warna) {
    const g = new THREE.Group()
    g.add(bulat(warna, 0.35, 0.35, 0.35, 0.03))
    const kerucut = new THREE.ConeGeometry(0.18, 0.3, 12)
    for (const s of [-1, 1]) {
      const ujung = new THREE.Mesh(kerucut, kartun(W.putih))
      ujung.rotation.z = (s * Math.PI) / 2
      ujung.position.x = s * 0.45
      g.add(ujung)
    }
    return g
  }
  function lolipop(warna) {
    const g = new THREE.Group()
    const tongkat = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8), kartun(W.putih))
    tongkat.position.y = -0.55
    g.add(tongkat)
    ;[0.36, 0.26, 0.16].forEach((r, i) => {
      const cincin = new THREE.Mesh(new THREE.TorusGeometry(r, 0.07, 10, 28), kartun(i % 2 ? W.putih : warna))
      cincin.position.z = i * 0.02
      g.add(cincin)
    })
    g.add(bulat(warna, 0.1, 0.1, 0.08, 0.02))
    return g
  }
  const hiasan = []
  const jumlahHias = hp ? 22 : 44
  for (let i = 0; i < jumlahHias; i++) {
    const jenis = i % 5
    let m
    if (jenis === 0) m = benda3d(geoBintang, pilih([W.kuning, W.biruTua, W.pink]))
    else if (jenis === 1) m = benda3d(geoHati, pilih([W.pinkTua, 0xffb3d1, W.biruTua]))
    else if (jenis === 2) m = pita(pilih([W.biruTua, 0xffb3d1]))
    else if (jenis === 3) m = permen(pilih([0xffb3d1, W.biruTua, W.lila]))
    else m = lolipop(pilih([0xffb3d1, W.biruTua, 0xc9a7ff]))
    const z = acak(-16, 2)
    m.userData = { fx: acak(-1, 1), fy: acak(-0.95, 0.95), z, besar: acak(0.3, 0.6), fase: acak(0, 6.3), putar: acak(-0.6, 0.6) }
    m.scale.setScalar(m.userData.besar)
    adegan.add(m)
    hiasan.push(m)
  }

  // ---- 4. Balon pastel yang naik pelan; diklik → meletus jadi hujan hati ----
  const balonSemua = Array.from({ length: hp ? 5 : 10 }, () => {
    const grup = new THREE.Group()
    const isi = balonPastel(pilih(warnaBalon))
    grup.add(isi)
    const d = { fx: acak(-0.95, 0.95), y: acak(-12, 12), z: acak(-12, 0), kec: acak(0.4, 0.8), fase: acak(0, 6.3), letus: -10 }
    return {
      nama: 'balon',
      grup,
      perbarui(t, dt) {
        const s = t - d.letus
        d.y += d.kec * dt
        if (d.y > tepiY(d.z) + 3) {
          d.y = -tepiY(d.z) - 3
          d.fx = acak(-0.95, 0.95)
        }
        grup.position.set(d.fx * tepiX(d.z) + Math.sin(t * 0.7 + d.fase) * 0.4, d.y, d.z)
        isi.rotation.z = Math.sin(t * 1.2 + d.fase) * 0.15
        // setelah meletus, balon hilang sebentar lalu muncul lagi dari bawah
        if (s >= 0 && s < 1.5) {
          grup.visible = false
          d.y = -tepiY(d.z) - 3
        } else grup.visible = true
      },
      reaksi(t) {
        d.letus = t
        semburHati(grup.getWorldPosition(new THREE.Vector3()), 14, 0.9)
      },
    }
  })
  objek.push(...balonSemua)

  // ---- 5. Pelangi kawaii dengan awan di kedua ujung ----
  const pelangi = new THREE.Group()
  ;[0xffb3d6, 0xffe0a8, 0xfff6b0, 0xc4eed6, 0xaad6ff, 0xceb9ff].forEach((warna, i) => {
    pelangi.add(new THREE.Mesh(new THREE.TorusGeometry(7 - i * 0.55, 0.3, 10, 64, Math.PI), kartun(warna)))
  })
  for (const s of [-1, 1])
    for (const [x, y, r] of [
      [-0.9, 0, 0.9],
      [0, 0.3, 1.1],
      [0.9, 0, 0.85],
    ])
      pelangi.add(taruh(bulat(W.putih, r, r * 0.8, r * 0.8, 0.05), s * 5.5 + x, y - 0.2, 0.6))
  adegan.add(pelangi)

  // ---- 6. Matahari berwajah dengan sinar yang berputar ----
  const matahariLucu = (() => {
    const grup = new THREE.Group()
    const isi = new THREE.Group()
    grup.add(isi)
    const sinar = new THREE.Group()
    const geoSinar = new THREE.ConeGeometry(0.22, 0.55, 10)
    for (let i = 0; i < 10; i++) {
      const c = new THREE.Mesh(geoSinar, kartun(i % 2 ? 0xffd6ea : 0xfff1a8))
      const a = (i / 10) * Math.PI * 2
      c.position.set(Math.cos(a) * 1.45, Math.sin(a) * 1.45, -0.1)
      c.rotation.z = a - Math.PI / 2
      sinar.add(c)
    }
    isi.add(sinar, bulat(0xfff1a8, 1.1, 1.1, 0.9))
    const muka = new THREE.Group()
    muka.position.z = 0.05
    isi.add(muka)
    wajah(muka, 0.05, 0.36, true)
    let mulaiKlik = -10
    return {
      nama: 'matahari',
      grup,
      perbarui(t) {
        const s = t - mulaiKlik
        sinar.rotation.z = t * 0.3 + (s < 1.2 ? s * 4 : 0)
        isi.position.y = Math.sin(t * 0.6) * 0.15
        isi.scale.setScalar(1 + (s < 0.8 ? Math.sin((s / 0.8) * Math.PI) * 0.15 : 0))
      },
      reaksi(t) {
        mulaiKlik = t
        semburHati(grup.getWorldPosition(new THREE.Vector3()), 16, 1.4)
      },
    }
  })()
  objek.push(matahariLucu)

  // ---- 7. Langit bertitik pink (polka) di kejauhan + bintang kecil & hati yang turun pelan ----
  const titikLangit = (() => {
    const posisi = []
    for (let x = -60; x <= 60; x += 4.5) for (let y = -34; y <= 34; y += 4.5) posisi.push(x + ((y / 4.5) % 2) * 2.25, y, -48)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(posisi, 3))
    return new THREE.Points(
      geo,
      (bahan.titik = new THREE.PointsMaterial({
        size: 1.5,
        map: teksturTitik,
        color: gelap ? 0x8a5f9f : 0xffc2dc,
        transparent: true,
        opacity: gelap ? 0.35 : 0.6,
        depthWrite: false,
        fog: false,
      })),
    )
  })()
  adegan.add(titikLangit)
  const titikAcak = (n, x, y, z) => {
    const posisi = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) posisi.set([acak(-x, x), acak(y[0], y[1]), acak(z[0], z[1])], i * 3)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posisi, 3))
    return geo
  }
  const kilau = new THREE.Points(
    titikAcak(hp ? 40 : 80, 22, [-9, 12], [-14, 5]),
    (bahan.kilau = new THREE.PointsMaterial({
      size: 0.45,
      map: teksturBintang,
      color: new THREE.Color(2.4, 2.2, 1.6),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })),
  )
  const hatiTurun = new THREE.Points(
    titikAcak(hp ? 40 : 90, 22, [-12, 14], [-10, 6]),
    (bahan.hatiTurun = new THREE.PointsMaterial({
      size: 0.4,
      map: teksturHati,
      color: 0xff9cc8,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })),
  )
  adegan.add(kilau, hatiTurun)

  // ---- hujan hati & bintang saat diklik ----
  const hati = Array.from({ length: hp ? 40 : 80 }, (_, i) => {
    const s = new THREE.Sprite(cahaya(i % 3 === 2 ? teksturBintang : teksturHati, pilih([0xff8fc4, 0xffd36b, 0x8fcaff]), 1))
    s.visible = false
    s.userData = { hidup: 0, awal: 1, kec: new THREE.Vector3(), besar: 0.3 }
    adegan.add(s)
    return s
  })
  let giliran = 0
  function semburKecil(asal) {
    for (let i = 0; i < 2; i++) {
      const s = hati[giliran++ % hati.length]
      s.visible = true
      s.position.set(asal.x + acak(-0.2, 0.2), asal.y, asal.z + 0.3)
      s.userData.hidup = s.userData.awal = acak(1.2, 1.8)
      s.userData.kec.set(acak(-0.3, 0.3), acak(0.8, 1.2), 0)
      s.userData.besar = acak(0.2, 0.32)
    }
  }
  function semburHati(asal, jumlah, sebar = 0.6) {
    for (let i = 0; i < jumlah; i++) {
      const s = hati[giliran++ % hati.length]
      s.visible = true
      s.position.set(asal.x + acak(-sebar, sebar) * 0.3, asal.y + acak(-sebar, sebar) * 0.3, asal.z + 0.5)
      s.userData.hidup = s.userData.awal = acak(1.4, 2.4)
      s.userData.kec.set(acak(-1, 1) * sebar * 1.6, acak(0.6, 2.2) * (0.6 + sebar * 0.5), acak(-0.3, 0.3))
      s.userData.besar = acak(0.3, 0.6)
    }
    gambar(true)
  }

  for (const o of objek) {
    o.grup.traverse((m) => (m.userData.pemilik = o))
    adegan.add(o.grup)
  }

  // bintang jatuh: kepala bintang terang + ekor berkilau yang memudar
  const bintangJatuh = Array.from({ length: 2 }, () => {
    const ekor = Array.from({ length: 8 }, (_, i) => {
      const sp = new THREE.Sprite(cahaya(i === 0 ? teksturBintang : teksturBulat, i === 0 ? 0xfff4c2 : 0xffc6e0, 1 - i * 0.11))
      sp.scale.setScalar(i === 0 ? 0.9 : 0.55 - i * 0.05)
      sp.visible = false
      adegan.add(sp)
      return sp
    })
    return { ekor, hidup: 0, asal: new THREE.Vector3(), arah: new THREE.Vector3() }
  })
  let bintangBerikut = 3
  let ombakBerikut = 9

  // ---- efek bersinar (bloom) hanya untuk kilau & hati yang sangat terang ----
  let komposer = null
  let bloom = null
  if (!hp) {
    const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 })
    komposer = new M.EffectComposer(renderer, target)
    komposer.addPass(new M.RenderPass(adegan, kamera))
    bloom = new M.UnrealBloomPass(new THREE.Vector2(256, 256), 0.4, 0.45, 1.35)
    komposer.addPass(bloom)
    komposer.addPass(new M.OutputPass())
  }

  // ---- tata letak menyesuaikan ukuran layar ----
  let lebarDunia = 20
  let tinggiDunia = 15
  const jauh = (z) => (KAMERA_Z - z) / KAMERA_Z
  const tepiX = (z) => (lebarDunia / 2) * jauh(z)
  const tepiY = (z) => (tinggiDunia / 2) * jauh(z)
  function susun() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    komposer?.setSize(w, h)
    kamera.aspect = w / h
    kamera.updateProjectionMatrix()
    tinggiDunia = 2 * KAMERA_Z * Math.tan((kamera.fov * Math.PI) / 360)
    lebarDunia = tinggiDunia * kamera.aspect
    const tegak = kamera.aspect < 1
    const k = tegak ? 0.78 : w >= 1280 ? 1.4 : w >= 960 ? 1.25 : 1.1
    // sahabat duduk di tepi kiri & kanan agar tidak menutupi kotak materi di tengah
    const letak = tegak
      ? [
          [-0.72, 0.5, -1],
          [0.72, 0.3, -2],
          [-0.7, -0.62, -1],
          [0.72, -0.5, -2],
        ]
      : [
          [-0.78, 0.42, -1],
          [0.78, 0.46, -2],
          [-0.8, -0.5, -2],
          [0.78, -0.52, -1],
        ]
    sahabatSemua.forEach((o, i) => {
      const [fx, fy, z] = letak[i]
      o.grup.position.set(fx * tepiX(z), fy * tepiY(z), z)
      o.grup.scale.setScalar(k)
    })
    const letakAwan = tegak
      ? [
          [0.3, 0.85, -8],
          [-0.35, -0.1, -10],
        ]
      : [
          [-0.25, 0.82, -9],
          [0.35, -0.05, -12],
          [-0.45, 0.05, -14],
        ]
    awanSemua.forEach((o, i) => {
      const [fx, fy, z] = letakAwan[i]
      o.grup.position.set(fx * tepiX(z), fy * tepiY(z), z)
      o.grup.scale.setScalar(k * 1.3)
    })
    const letakBayi = [
      [-0.55, 0.78, -7],
      [0.5, 0.82, -9],
      [-0.9, 0.05, -6],
      [0.92, 0.1, -8],
      [-0.4, -0.85, -10],
      [0.45, -0.88, -7],
      [-0.08, 0.6, -13],
      [0.15, -0.35, -14],
    ]
    bayiSemua.forEach((o, i) => {
      const [fx, fy, z] = letakBayi[i]
      o.grup.position.set(fx * tepiX(z), fy * tepiY(z), z)
      o.grup.scale.setScalar(k * 0.55)
    })
    terbangSemua.forEach((o, i) => {
      o.d.z = [-5, -9, -12][i]
      o.d.y = [0.25, -0.3, 0.55][i] * tepiY(o.d.z)
      o.d.x = acak(-1, 1) * tepiX(o.d.z)
      o.d.kec = acak(0.5, 0.8) * (i % 2 ? -1 : 1)
      o.grup.scale.setScalar(k * 0.6)
    })
    pelangi.position.set(0, tepiY(-30) * 0.35, -30)
    pelangi.scale.setScalar(tegak ? 0.9 : 1.6)
    matahariLucu.grup.position.set(tepiX(-20) * (tegak ? 0.6 : 0.72), tepiY(-20) * 0.72, -20)
    matahariLucu.grup.scale.setScalar(tegak ? 1.1 : 1.6)
  }
  susun()
  window.addEventListener('resize', susun)

  // ---- kepala menoleh & kamera mengikuti tetikus/jari ----
  const arahPandang = { x: 0, y: 0, ada: false }
  const tetikus = (e) => {
    arahPandang.x = (e.clientX / window.innerWidth) * 2 - 1
    arahPandang.y = (e.clientY / window.innerHeight) * 2 - 1
    arahPandang.ada = true
  }
  window.addEventListener('pointermove', tetikus, { passive: true })
  window.addEventListener('pointerdown', tetikus, { passive: true })
  const titikPandang = new THREE.Vector3()
  const sinarPandang = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const posKepala = new THREE.Vector3()

  // ---- klik / ketuk ----
  const pemilih = new THREE.Raycaster()
  const kenai = (e) => {
    const r = kanvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    pemilih.setFromCamera(ndc, kamera)
    const hasil = pemilih.intersectObjects(
      objek.map((o) => o.grup),
      true,
    )
    return hasil[0]?.object.userData.pemilik ?? null
  }
  let waktu = 0
  const diklik = (e) => {
    const o = kenai(e)
    if (!o) {
      // klik langit kosong: hujan hati & bintang di situ
      const titik = pemilih.ray.at(kamera.position.z / Math.max(-pemilih.ray.direction.z, 0.01), new THREE.Vector3())
      titik.z = 0
      semburHati(titik, 16, 0.9)
      return
    }
    o.reaksi(waktu)
    const daftar = SAPAAN[o.nama]
    const n = (o.hitung = (o.hitung ?? -1) + 1)
    // balon kata di atas karakter, digambar di lapisan depan agar tidak tertutup kotak
    const atas = new THREE.Vector3(0, 2.4, 0)
    o.grup.localToWorld(atas)
    atas.project(kamera)
    const x = Math.min(Math.max(((atas.x + 1) / 2) * window.innerWidth, 130), window.innerWidth - 130)
    const y = Math.max(((1 - atas.y) / 2) * window.innerHeight, 70)
    setUcap({ teks: daftar[n % daftar.length], x, y, n: Date.now() })
    gambar(true)
  }
  const melayang = (e) => {
    const o = kenai(e)
    kanvas.style.cursor = o ? 'pointer' : 'default'
    o?.geli?.(waktu)
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
  const angin = { mulai: -10, arah: 1 }
  function pindahMenu(arahMenu) {
    if (animasiMati()) return
    angin.mulai = waktu
    angin.arah = arahMenu
    for (const o of [...sahabatSemua, ...bayiSemua, ...terbangSemua]) o.sorak(waktu + acak(0, 0.45))
    semburHati(new THREE.Vector3(arahMenu * tepiX(0) * 0.7, tepiY(0) * 0.2, 0), 30, 2.2)
    gambar()
  }
  function perbaruiSemua(dt) {
    waktu += dt
    const t = waktu
    const sa = t - angin.mulai
    const tiup = sa >= 0 && sa < 2.2 ? Math.sin((sa / 2.2) * Math.PI) : 0
    for (const o of objek) o.perbarui(t, dt)
    // kepala sahabat menoleh ke arah kursor/jari (tanpa kursor: menoleh pelan ke kiri-kanan)
    if (arahPandang.ada) {
      ndc.set(arahPandang.x, -arahPandang.y)
      sinarPandang.setFromCamera(ndc, kamera)
      sinarPandang.ray.at((kamera.position.z - 4) / Math.max(-sinarPandang.ray.direction.z, 0.01), titikPandang)
    } else titikPandang.set(Math.sin(t * 0.6) * 6, Math.sin(t * 0.4) * 2, 8)
    for (const o of sahabatSemua) {
      o.kepala.getWorldPosition(posKepala)
      const dx = titikPandang.x - posKepala.x
      const dy = titikPandang.y - posKepala.y
      const dz = Math.max(titikPandang.z - posKepala.z, 1)
      const tujuanY = Math.max(-0.7, Math.min(0.7, Math.atan2(dx, dz)))
      const tujuanX = Math.max(-0.35, Math.min(0.35, -Math.atan2(dy, dz)))
      o.kepala.rotation.y += (tujuanY - o.kepala.rotation.y) * Math.min(dt * 5, 1)
      o.kepala.rotation.x += (tujuanX - o.kepala.rotation.x) * Math.min(dt * 5, 1)
    }
    kedip -= dt
    const tutup = kedip < 0.12 && kedip > 0
    for (const m of semuaMata) m.scale.y = tutup ? 0.12 : 1
    if (kedip <= 0) kedip = acak(2.2, 4.5)

    // bintang jatuh muncul setiap beberapa detik dari kiri/kanan atas
    bintangBerikut -= dt
    if (bintangBerikut <= 0) {
      bintangBerikut = acak(4, 8)
      const b = bintangJatuh.find((x) => x.hidup <= 0)
      if (b) {
        const kanan = Math.random() < 0.5
        b.asal.set((kanan ? -1 : 1) * tepiX(-10) * acak(0.2, 0.9), tepiY(-10) * acak(0.6, 1), -10)
        b.arah
          .set(kanan ? 1 : -1, -0.45, 0)
          .normalize()
          .multiplyScalar(14)
        b.hidup = 1.4
      }
    }
    for (const b of bintangJatuh) {
      if (b.hidup <= 0) {
        b.ekor.forEach((sp) => (sp.visible = false))
        continue
      }
      b.hidup -= dt
      const jalan = 1.4 - b.hidup
      b.ekor.forEach((sp, i) => {
        sp.visible = true
        sp.position.copy(b.asal).addScaledVector(b.arah, Math.max(jalan - i * 0.035, 0))
        sp.material.opacity = Math.min(b.hidup * 2, 1) * (1 - i * 0.11)
      })
    }
    // ombak sorak: para sahabat melompat bergantian dari kiri ke kanan
    ombakBerikut -= dt
    if (ombakBerikut <= 0 && !animasiMati()) {
      ombakBerikut = acak(12, 18)
      const semua = [...sahabatSemua, ...bayiSemua].sort((a, b) => a.grup.position.x - b.grup.position.x)
      const kiri = semua[0].grup.position.x
      const lebar = Math.max(semua.at(-1).grup.position.x - kiri, 1)
      for (const o of semua) o.sorak(t + ((o.grup.position.x - kiri) / lebar) * 1.2)
    }
    for (const o of terbangSemua) {
      const d = o.d
      d.x += d.kec * dt
      const batas = tepiX(d.z) + 3
      if (d.x > batas) d.x = -batas
      if (d.x < -batas) d.x = batas
      o.grup.position.set(d.x, d.y + Math.sin(t * 0.8 + d.z) * 0.5, d.z)
    }
    for (const m of hiasan) {
      const d = m.userData
      // saat pindah menu hiasan tertiup ke arah berlawanan (seperti angin), lalu kembali
      const x = (d.fx - angin.arah * tiup * 0.35) * tepiX(d.z)
      m.position.set(x, d.fy * tepiY(d.z) + Math.sin(t * 0.8 + d.fase) * 0.35 + tiup * 0.6, d.z)
      m.rotation.set(
        Math.sin(t * 0.5 + d.fase) * 0.3,
        t * d.putar + d.fase + tiup * 3,
        Math.sin(t * 0.7 + d.fase) * 0.25 - angin.arah * tiup * 0.8,
      )
    }
    for (const s of hati) {
      const d = s.userData
      if (!s.visible) continue
      d.hidup -= dt
      d.kec.y -= dt * 0.6
      s.position.addScaledVector(d.kec, dt)
      const sisa = Math.max(d.hidup / d.awal, 0)
      s.scale.setScalar(d.besar * (0.6 + (1 - sisa) * 0.6))
      s.material.opacity = Math.min(sisa * 1.6, 1)
      if (d.hidup <= 0) s.visible = false
    }
    // hati kecil turun pelan sambil bergoyang, muncul lagi dari atas
    const ph = hatiTurun.geometry.attributes.position
    for (let i = 0; i < ph.count; i++) {
      let y = ph.getY(i) - dt * (0.45 + (i % 5) * 0.08)
      if (y < -12) y = 14
      ph.setY(i, y)
      ph.setX(i, ph.getX(i) + Math.sin(t * 0.9 + i) * dt * 0.25)
    }
    ph.needsUpdate = true
    kilau.material.opacity = 0.5 + Math.sin(t * 2.6) * 0.4
    titikLangit.position.x = Math.sin(t * 0.08) * 2 - angin.arah * tiup * 4
    titikLangit.position.y = Math.cos(t * 0.06) * 1.2
    // kamera bergeser pelan mengikuti tetikus & guliran (paralaks 3D)
    const gulir = Math.min(window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1), 1)
    const tujuanX = arahPandang.x * 1.4 + Math.sin(t * 0.15) * 0.6 + angin.arah * tiup * 3.6
    const tujuanY = 0.5 - arahPandang.y * 0.9 - (gulir - 0.5) * 2.2
    kamera.position.x += (tujuanX - kamera.position.x) * Math.min(dt * 2, 1)
    kamera.position.y += (tujuanY - kamera.position.y) * Math.min(dt * 2, 1)
    kamera.lookAt(0, 0, -4)
  }
  const render = () => (komposer ? komposer.render() : renderer.render(adegan, kamera))
  function gambar(sekali = false) {
    cancelAnimationFrame(bingkai)
    const langkah = (sekarang) => {
      const dt = Math.min((sekarang - terakhir) / 1000, 0.1)
      if (dt >= 1 / 32) {
        terakhir = sekarang
        perbaruiSemua(dt)
        render()
      }
      if (document.hidden) return
      // saat animasi mati, reaksi klik tetap digerakkan ±2,5 detik lalu berhenti
      if (animasiMati() && !(sekali && sekarang < waktuBerhenti)) return
      bingkai = requestAnimationFrame(langkah)
    }
    waktuBerhenti = sekali ? performance.now() + 2500 : 0
    terakhir = performance.now() - 40
    bingkai = requestAnimationFrame(langkah)
  }
  perbaruiSemua(0.016)
  render()
  if (!animasiMati()) gambar()

  const ubahTampil = () => {
    if (!document.hidden && !animasiMati()) gambar()
  }
  document.addEventListener('visibilitychange', ubahTampil)
  const pengamat = new MutationObserver(() => (animasiMati() ? cancelAnimationFrame(bingkai) : gambar()))
  pengamat.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  const bersihkan = () => {
    cancelAnimationFrame(bingkai)
    window.removeEventListener('resize', susun)
    window.removeEventListener('pointermove', tetikus)
    window.removeEventListener('pointerdown', tetikus)
    document.removeEventListener('visibilitychange', ubahTampil)
    kanvas.removeEventListener('click', diklik)
    kanvas.removeEventListener('pointermove', melayang)
    pengamat.disconnect()
    adegan.traverse((m) => {
      m.geometry?.dispose()
      if (m.isSprite) m.material.dispose()
    })
    Object.values(bahan).forEach((b) => b.dispose())
    for (const t of [...Object.values(tekstur), lingkungan]) t.dispose()
    bloom?.dispose()
    komposer?.dispose()
    renderer.dispose()
  }
  return { bersihkan, pindahMenu }
}
