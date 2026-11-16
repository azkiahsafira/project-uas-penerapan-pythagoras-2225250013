// Latar belakang 3D "Akuarium Pythagoras" (three.js) untuk semua menu, di belakang kotak-kotak yang tembus pandang.
// Dunia bawah air bernuansa biru soft + pink soft: ikan, ubur-ubur bercahaya, ikan buntal, dan kerang bermata besar
// berkilau yang MELIRIK ke arah kursor/jari dan berkedip. Kesan 3D: dasar laut berpasir yang menjauh sampai hilang di
// kabut, sinar matahari menembus air, pola cahaya (kaustik) di pasir, efek bersinar (bloom), dan sudut pandang yang
// ikut bergeser (paralaks). Kaitan materi: sirip punggung ikan berbentuk segitiga siku-siku, batu karang segitiga
// bersisi 3-4-5, mutiara "3² + 4² = 5²", dan setiap karakter berbicara tentang teorema Pythagoras saat diklik.
// Interaksi: klik karakter → bereaksi (berputar, mengembang, bersinar, membuka); klik air kosong → gelembung muncul dan
// ikan-ikan berenang mendekat. Hemat: three.js diunduh setelah halaman tampil, ±30 fps, efek bersinar hanya di layar
// besar, berhenti saat tab tidak dilihat, saat "Animasi: mati", dan prefers-reduced-motion. Disembunyikan saat tes.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const W = {
  biru: 0xb3dcff,
  biruTua: 0x6fb3f0,
  pink: 0xffc4de,
  pinkTua: 0xf58bbd,
  putih: 0xffffff,
  lila: 0xdccbf5,
  lilaTua: 0xb9a3ea,
  mata: 0x1b2447,
  iris: 0x4d6fd6,
  pasir: 0xf1c6d3,
}

const SAPAAN = {
  ikan: ['Blub! Aku ikan segitiga 🐟', 'Sirip punggungku segitiga siku-siku 📐', 'Ayo lanjut ke soal berikutnya! 💙'],
  ubur: ['Aku bersinar seperti idemu ✨', 'c² = a² + b², ingat ya! 💡', 'Pelan-pelan, pasti bisa 💗'],
  buntal: ['Puff! Aku mengembang 🐡', 'Kaget ya? Hehe 💕', 'Sisi miring selalu paling panjang! 📏'],
  kerang: ['Mutiaraku: 3² + 4² = 5² 🦪', '9 + 16 = 25, berkilau! ✨', 'Kamu hebat! 💎'],
  batu: ['Sisiku 3, 4, dan 5 📐', 'Sisi terpanjangku = 5, itu sisi miring 💙', '3² + 4² = 5² ✅'],
  bintang: ['Kamu bintangnya! ⭐', 'Semangat belajar ya 🌟', 'Jawaban benar bikin berkilau ✨'],
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
        bersihkan = bangunAdegan(THREE, modul, kanvas.current, setUcap)
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

function bangunAdegan(THREE, M, kanvas, setUcap) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas: kanvas, antialias: true, powerPreference: 'high-performance' })
  } catch {
    return () => {}
  }
  const hp = Math.min(window.innerWidth, window.innerHeight) < 600
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, hp ? 1.25 : 1.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1.05
  const gelap = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const acak = (a, b) => a + Math.random() * (b - a)

  const adegan = new THREE.Scene()
  const warnaAir = gelap ? 0x22305c : 0xbfe0fb
  adegan.fog = new THREE.Fog(warnaAir, 30, 72)
  const KAMERA_Z = 24
  const kamera = new THREE.PerspectiveCamera(36, 1, 0.1, 160)
  kamera.position.set(0, 0.5, KAMERA_Z)

  // ---- tekstur buatan sendiri (tanpa berkas gambar) ----
  const teksturKanvas = (lebar, tinggi, lukis, srgb = true) => {
    const c = document.createElement('canvas')
    c.width = lebar
    c.height = tinggi
    lukis(c.getContext('2d'), lebar, tinggi)
    const t = new THREE.CanvasTexture(c)
    if (srgb) t.colorSpace = THREE.SRGBColorSpace
    return t
  }
  // langit bawah air: terang di atas (dekat permukaan), menyatu dengan warna kabut di tengah
  const teksturAir = teksturKanvas(4, 512, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h)
    const [atas, tengah, bawah] = gelap ? ['#34588f', '#22305c', '#3a2552'] : ['#e2f4ff', '#bfe0fb', '#f6d3e6']
    grad.addColorStop(0, atas)
    grad.addColorStop(0.5, tengah)
    grad.addColorStop(1, bawah)
    g.fillStyle = grad
    g.fillRect(0, 0, w, h)
  })
  adegan.background = teksturAir
  const teksturBulat = teksturKanvas(64, 64, (g) => {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.35, 'rgba(255,255,255,0.6)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 64, 64)
  })
  // sinar matahari yang menembus air: terang di atas, memudar ke bawah, lembut di kedua tepi
  const teksturSinar = teksturKanvas(64, 256, (g, w, h) => {
    const datar = g.createLinearGradient(0, 0, w, 0)
    datar.addColorStop(0, 'rgba(255,255,255,0)')
    datar.addColorStop(0.5, 'rgba(255,255,255,1)')
    datar.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = datar
    g.fillRect(0, 0, w, h)
    g.globalCompositeOperation = 'destination-in'
    const tegak = g.createLinearGradient(0, 0, 0, h)
    tegak.addColorStop(0, 'rgba(255,255,255,1)')
    tegak.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = tegak
    g.fillRect(0, 0, w, h)
  })
  // pola cahaya air di pasir (kaustik): garis terang di batas sel-sel acak, bisa diulang tanpa sambungan
  const teksturKaustik = teksturKanvas(
    256,
    256,
    (g, N) => {
      const titik = Array.from({ length: 22 }, () => [Math.random() * N, Math.random() * N])
      const gambar = g.createImageData(N, N)
      for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++) {
          let d1 = 1e9
          let d2 = 1e9
          for (const [px, py] of titik) {
            const dx = Math.min(Math.abs(x - px), N - Math.abs(x - px))
            const dy = Math.min(Math.abs(y - py), N - Math.abs(y - py))
            const d = dx * dx + dy * dy
            if (d < d1) {
              d2 = d1
              d1 = d
            } else if (d < d2) d2 = d
          }
          const v = Math.max(0, 1 - (Math.sqrt(d2) - Math.sqrt(d1)) / 9) ** 3
          const i = (y * N + x) * 4
          gambar.data[i] = gambar.data[i + 1] = gambar.data[i + 2] = 255 * v
          gambar.data[i + 3] = 255
        }
      g.putImageData(gambar, 0, 0)
    },
    false,
  )
  teksturKaustik.wrapS = teksturKaustik.wrapT = THREE.RepeatWrapping

  // ---- cahaya: pantulan lembut ala studio + matahari dari atas + cahaya pink & biru ----
  const pmrem = new THREE.PMREMGenerator(renderer)
  const ruang = new M.RoomEnvironment()
  const lingkungan = pmrem.fromScene(ruang, 0.04).texture
  ruang.dispose?.()
  pmrem.dispose()
  adegan.environment = lingkungan
  adegan.environmentIntensity = 0.5
  adegan.add(new THREE.HemisphereLight(0xeaf6ff, 0xffd6ea, 1.0))
  const matahari = new THREE.DirectionalLight(0xffffff, 1.7)
  matahari.position.set(3, 12, 6)
  const tepi = new THREE.DirectionalLight(0xffa8d2, 0.9)
  tepi.position.set(-6, 2, -8)
  const pengisi = new THREE.DirectionalLight(0xa8d8ff, 0.5)
  pengisi.position.set(8, -2, 6)
  adegan.add(matahari, tepi, pengisi)

  // ---- bahan & bentuk dasar ----
  const bahan = {}
  const std = (warna, kasar = 0.6) =>
    (bahan[`s${warna}-${kasar}`] ??= new THREE.MeshStandardMaterial({ color: warna, roughness: kasar }))
  const kilap = (warna, kasar = 0.3) =>
    (bahan[`k${warna}-${kasar}`] ??= new THREE.MeshPhysicalMaterial({
      color: warna,
      roughness: kasar,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    }))
  const datar = (warna) => (bahan[`d${warna}`] ??= new THREE.MeshBasicMaterial({ color: warna }))
  const tembus = (warna, op) =>
    (bahan[`t${warna}-${op}`] ??= new THREE.MeshBasicMaterial({
      color: warna,
      transparent: true,
      opacity: op,
      depthWrite: false,
    }))
  const cahaya = (warna, op) =>
    new THREE.SpriteMaterial({
      map: teksturBulat,
      color: warna,
      transparent: true,
      opacity: op,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  const bola = new THREE.SphereGeometry(1, 32, 24)
  const SUMBU_Y = new THREE.Vector3(0, 1, 0)
  const bentuk = (titik) => new THREE.Shape(titik.map(([x, y]) => new THREE.Vector2(x, y)))
  const ekstrusi = (b, tebal, bevel) => {
    const geo = new THREE.ExtrudeGeometry(b, {
      depth: tebal,
      bevelEnabled: true,
      bevelSize: bevel,
      bevelThickness: bevel,
      bevelSegments: 4,
      curveSegments: 16,
    })
    geo.translate(0, 0, -tebal / 2)
    return geo
  }
  // warna gradasi per titik (perut lebih terang dari punggung) agar bentuk terasa membulat
  function gradasi(geo, bawah, atas, dari = -0.7, sampai = 0.5) {
    const p = geo.attributes.position
    const warna = new Float32Array(p.count * 3)
    const c = new THREE.Color()
    const cb = new THREE.Color(bawah)
    const ca = new THREE.Color(atas)
    for (let i = 0; i < p.count; i++) {
      const t = Math.min(Math.max((p.getY(i) - dari) / (sampai - dari), 0), 1)
      c.copy(cb).lerp(ca, t * t * (3 - 2 * t))
      c.toArray(warna, i * 3)
    }
    geo.setAttribute('color', new THREE.BufferAttribute(warna, 3))
    return geo
  }
  const kilapGradasi = (kunci) =>
    (bahan[kunci] ??= new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.32,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      sheen: 0.6,
      sheenColor: new THREE.Color(0xffffff),
    }))

  // ---- mata besar berkilau yang melirik ke kursor & berkedip ----
  const semuaMata = []
  const semuaIris = []
  function mataBesar(r) {
    const mata = new THREE.Group()
    const putih = new THREE.Mesh(bola, kilap(W.putih, 0.12))
    putih.scale.setScalar(r)
    const iris = new THREE.Group()
    const cincin = new THREE.Mesh(bola, kilap(W.iris, 0.1))
    cincin.scale.set(r * 0.7, r * 0.7, r * 0.3)
    cincin.position.z = r * 0.76
    const pupil = new THREE.Mesh(bola, kilap(W.mata, 0.1))
    pupil.scale.set(r * 0.48, r * 0.48, r * 0.26)
    pupil.position.z = r * 0.86
    const kilau1 = new THREE.Mesh(bola, datar(W.putih))
    kilau1.scale.setScalar(r * 0.2)
    kilau1.position.set(r * 0.22, r * 0.26, r * 0.98)
    const kilau2 = new THREE.Mesh(bola, datar(W.putih))
    kilau2.scale.setScalar(r * 0.1)
    kilau2.position.set(-r * 0.2, -r * 0.18, r * 0.98)
    iris.add(cincin, pupil, kilau1, kilau2)
    mata.add(putih, iris)
    semuaMata.push(mata)
    semuaIris.push(iris)
    return mata
  }
  function pipiSenyum(induk, lebar, r, z = 0) {
    for (const s of [-1, 1]) {
      const pipi = new THREE.Mesh(bola, tembus(W.pinkTua, 0.5))
      pipi.scale.set(r * 0.85, r * 0.5, r * 0.2)
      pipi.position.set(s * (lebar / 2 + r * 0.9), -r * 1.05, z)
      induk.add(pipi)
    }
    const senyum = new THREE.Mesh(new THREE.TorusGeometry(r * 0.5, r * 0.13, 8, 16, Math.PI), datar(W.mata))
    senyum.rotation.z = Math.PI
    senyum.position.set(0, -r * 0.95, z + r * 0.05)
    const mulut = new THREE.Mesh(bola, datar(0xe0568f))
    mulut.scale.set(r * 0.42, r * 0.5, r * 0.2)
    mulut.position.set(0, -r * 1.05, z + r * 0.05)
    mulut.visible = false
    induk.add(senyum, mulut)
    return { senyum, mulut }
  }
  const girang = (m, aktif) => {
    m.senyum.visible = !aktif
    m.mulut.visible = aktif
  }

  const objek = [] // karakter yang bisa diklik: { nama, grup, perbarui(t, dt), reaksi(t) }

  // ---- 1. Ikan gemuk bermata besar (sirip punggung segitiga siku-siku) ----
  const PALET_IKAN = [
    [W.pinkTua, 0xffe6f1, W.pink],
    [W.biruTua, 0xe6f4ff, W.biru],
    [W.lilaTua, 0xf3ecff, W.pink],
    [0xff9fb0, 0xfff1e8, W.biruTua],
    [0x7fc8f2, 0xfff0f7, W.pinkTua],
  ]
  const geoEkor = (() => {
    const b = new THREE.Shape()
    b.moveTo(0, 0)
    b.quadraticCurveTo(-0.45, 0.55, -0.95, 0.8)
    b.quadraticCurveTo(-0.7, 0, -0.95, -0.8)
    b.quadraticCurveTo(-0.45, -0.55, 0, 0)
    return ekstrusi(b, 0.08, 0.05)
  })()
  const geoSiripPunggung = ekstrusi(
    bentuk([
      [-0.45, 0],
      [0.4, 0],
      [-0.45, 0.62],
    ]),
    0.06,
    0.04,
  )
  const jumlahIkan = hp ? 5 : 8
  const ikanSemua = []
  for (let i = 0; i < jumlahIkan; i++) {
    const [warna, perut, sirip] = PALET_IKAN[i % PALET_IKAN.length]
    const grup = new THREE.Group()
    const badan = new THREE.Group()
    grup.add(badan)
    const tubuh = new THREE.Mesh(gradasi(new THREE.SphereGeometry(1, 40, 28), perut, warna), kilapGradasi(`ikan${i % 5}`))
    tubuh.scale.set(1.15, 0.95, 0.85)
    const ekor = new THREE.Group()
    ekor.position.x = -1.0
    ekor.add(new THREE.Mesh(geoEkor, kilap(sirip, 0.3)))
    const punggung = new THREE.Mesh(geoSiripPunggung, kilap(sirip, 0.3))
    punggung.position.set(-0.1, 0.8, 0)
    const siripSamping = [-1, 1].map((s) => {
      const m = new THREE.Mesh(bola, kilap(sirip, 0.3))
      m.scale.set(0.3, 0.08, 0.2)
      const g = new THREE.Group()
      g.position.set(0.15, -0.35, s * 0.78)
      m.position.x = -0.2
      g.add(m)
      g.userData.s = s
      badan.add(g)
      return g
    })
    badan.add(tubuh, ekor, punggung)
    // wajah di bagian depan-samping yang menghadap kamera
    for (const s of [-1, 1]) {
      const n = new THREE.Vector3(0.62, 0.3, s * 0.6).normalize()
      const mata = mataBesar(0.42)
      mata.position.set(n.x * 1.15 * 0.93, n.y * 0.95 * 0.93, n.z * 0.85 * 0.93)
      badan.add(mata)
      const pipi = new THREE.Mesh(bola, tembus(W.pinkTua, 0.5))
      const np = new THREE.Vector3(0.72, -0.2, s * 0.68).normalize()
      pipi.position.set(np.x * 1.15, np.y * 0.95, np.z * 0.85)
      pipi.scale.set(0.15, 0.09, 0.04)
      pipi.lookAt(pipi.position.clone().multiplyScalar(2))
      badan.add(pipi)
    }
    const muka = new THREE.Group()
    muka.position.set(1.12, -0.12, 0)
    muka.rotation.y = Math.PI / 2
    const senyum = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 16, Math.PI), datar(W.mata))
    senyum.rotation.z = Math.PI
    const mulut = new THREE.Mesh(bola, datar(0xe0568f))
    mulut.scale.set(0.1, 0.13, 0.05)
    mulut.position.y = -0.06
    mulut.visible = false
    muka.add(senyum, mulut)
    badan.add(muka)
    const d = {
      fx: acak(-1, 1),
      fy: acak(-0.75, 0.75),
      z: [2, -1, -4, -7, -10, 0, -5, -12][i],
      arah: i % 2 ? -1 : 1,
      kec: acak(1, 1.8),
      ukuran: [0.85, 0.7, 0.95, 0.75, 1.05, 0.65, 0.9, 1.15][i],
      fase: acak(0, 6.3),
      tujuan: null,
      sampai: 0,
      hadap: 0,
      putar: -1,
    }
    const o = { nama: 'ikan', grup, d }
    o.reaksi = (t) => {
      d.putar = t
      semburGelembung(grup.position, 8)
    }
    o.perbarui = (t, dt) => {
      const k = grup.userData.k ?? 1
      const lebar = (lebarDunia / 2) * ((KAMERA_Z - d.z) / KAMERA_Z) + 3
      const tinggi = (tinggiDunia / 2) * ((KAMERA_Z - d.z) / KAMERA_Z)
      d.x ??= d.fx * lebar
      d.yDasar ??= d.fy * tinggi
      if (d.tujuan && t < d.sampai) {
        // berenang mendekati gelembung yang diklik
        const dx = d.tujuan.x - d.x
        const dy = d.tujuan.y - d.yDasar
        const jarak = Math.hypot(dx, dy)
        if (jarak > 0.6) {
          const langkah = Math.min(jarak, 4 * dt)
          d.x += (dx / jarak) * langkah
          d.yDasar += (dy / jarak) * langkah
        }
        if (Math.abs(dx) > 0.3) d.arah = Math.sign(dx)
      } else {
        d.tujuan = null
        d.x += d.arah * d.kec * dt
        if (d.x > lebar) d.x = -lebar
        if (d.x < -lebar) d.x = lebar
      }
      const yTarget = d.arah > 0 ? -0.85 : Math.PI + 0.85
      d.hadap += (yTarget - d.hadap) * Math.min(dt * 4, 1)
      let guling = 0
      if (d.putar >= 0) {
        const r = (t - d.putar) / 0.9
        if (r >= 1) d.putar = -1
        else guling = r * Math.PI * 2
        senyum.visible = r >= 1
        mulut.visible = r < 1
      }
      grup.position.set(d.x, d.yDasar + Math.sin(t * 1.3 + d.fase) * 0.3, d.z)
      grup.rotation.set(guling, d.hadap, Math.sin(t * 1.3 + d.fase + 1) * 0.12)
      grup.scale.setScalar(d.ukuran * k)
      const kibas = t * 9 + d.fase
      ekor.rotation.y = Math.sin(kibas) * 0.5
      badan.rotation.y = Math.sin(kibas + 1) * 0.06
      siripSamping.forEach((g) => (g.rotation.x = g.userData.s * (0.3 + Math.sin(kibas * 0.8) * 0.4)))
    }
    objek.push(o)
    ikanSemua.push(o)
  }

  // ---- 2. Ubur-ubur bercahaya ----
  const uburSemua = []
  const jumlahUbur = hp ? 3 : 4
  for (let i = 0; i < jumlahUbur; i++) {
    const warna = [W.pink, W.biru, W.lila, W.pinkTua][i]
    const grup = new THREE.Group()
    const lonceng = new THREE.Group()
    lonceng.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.55),
        (bahan[`ubur${i}`] = new THREE.MeshPhysicalMaterial({
          color: warna,
          emissive: warna,
          emissiveIntensity: 0.45,
          roughness: 0.15,
          clearcoat: 1,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
          depthWrite: false,
        })),
      ),
    )
    const inti = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
      (bahan[`inti${i}`] = new THREE.MeshStandardMaterial({
        color: warna,
        emissive: warna,
        emissiveIntensity: 2.2,
        roughness: 0.4,
      })),
    )
    inti.position.y = -0.05
    const tepiLonceng = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.07, 8, 48), kilap(warna, 0.2))
    tepiLonceng.rotation.x = Math.PI / 2
    tepiLonceng.position.y = -0.15
    lonceng.add(inti, tepiLonceng)
    grup.add(lonceng)
    for (const s of [-1, 1]) {
      const mata = mataBesar(0.27)
      mata.position.set(s * 0.36, 0.24, 0.88)
      grup.add(mata)
    }
    const muka = pipiSenyum(grup, 0.66, 0.2, 0.93)
    muka.senyum.position.y = 0.04
    muka.mulut.position.y = 0.02
    // tentakel bergelombang (titik-titiknya digeser setiap bingkai)
    const tentakel = []
    const matTentakel = (bahan[`tentakel${i}`] = new THREE.MeshStandardMaterial({
      color: warna,
      emissive: warna,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.85,
      roughness: 0.4,
    }))
    for (let j = 0; j < 9; j++) {
      const tebal = j < 3 ? 0.07 : 0.028
      const panjang = j < 3 ? 1.6 : acak(2, 2.8)
      const geo = new THREE.CylinderGeometry(tebal, tebal * 0.4, panjang, 6, 24, true)
      geo.translate(0, -panjang / 2, 0)
      const a = (j / 9) * Math.PI * 2
      const m = new THREE.Mesh(geo, matTentakel)
      const r = j < 3 ? 0.25 : 0.75
      m.position.set(Math.cos(a) * r, -0.12, Math.sin(a) * r)
      m.userData = { asal: geo.attributes.position.array.slice(), panjang, fase: j * 0.8 }
      grup.add(m)
      tentakel.push(m)
    }
    const halo = new THREE.Sprite(cahaya(warna, gelap ? 0.6 : 0.45))
    halo.scale.setScalar(4.2)
    halo.position.y = -0.3
    grup.add(halo)
    let kilatan = -1
    const d = { fase: i * 1.7 }
    const o = { nama: 'ubur', grup, urutan: i, d }
    o.reaksi = (t) => {
      kilatan = t
      semburGelembung(grup.position, 6)
    }
    o.perbarui = (t) => {
      const u = grup.userData
      const denyut = Math.sin(t * 2.4 + d.fase)
      lonceng.scale.set(1 + denyut * 0.07, 0.85 * (1 - denyut * 0.09), 1 + denyut * 0.07)
      let terang = 0
      let putar = 0
      if (kilatan >= 0) {
        const r = (t - kilatan) / 1.2
        if (r >= 1) kilatan = -1
        else {
          terang = Math.sin(r * Math.PI)
          putar = r * Math.PI * 2
        }
        girang(muka, r < 1)
      }
      inti.material.emissiveIntensity = 2.2 + terang * 5
      halo.material.opacity = (gelap ? 0.6 : 0.45) + terang * 0.5
      grup.position.set(
        u.x + Math.sin(t * 0.3 + d.fase) * 0.9,
        u.y + Math.sin(t * 0.45 + d.fase) * 1.3 + Math.max(0, -denyut) * 0.15,
        u.z,
      )
      grup.rotation.set(
        Math.sin(t * 0.6 + d.fase) * 0.08,
        Math.sin(t * 0.4 + d.fase) * 0.4 + putar,
        Math.sin(t * 0.5 + d.fase) * 0.1,
      )
      grup.scale.setScalar(u.k * (0.75 + (i % 2) * 0.2))
      for (const m of tentakel) {
        const { asal, panjang, fase } = m.userData
        const p = m.geometry.attributes.position
        for (let v = 0; v < p.count; v++) {
          const y = asal[v * 3 + 1]
          const f = -y / panjang
          p.setX(v, asal[v * 3] + Math.sin(y * 2.4 + t * 3 + fase) * 0.22 * f)
          p.setZ(v, asal[v * 3 + 2] + Math.cos(y * 2 + t * 2.6 + fase) * 0.18 * f)
        }
        p.needsUpdate = true
      }
    }
    objek.push(o)
    uburSemua.push(o)
  }

  // ---- 3. Ikan buntal: mengembang berduri saat diklik ----
  {
    const grup = new THREE.Group()
    const tubuhGrup = new THREE.Group()
    grup.add(tubuhGrup)
    const tubuh = new THREE.Mesh(gradasi(new THREE.SphereGeometry(1, 40, 28), 0xfff6fb, 0xffb8d6), kilapGradasi('buntal'))
    tubuhGrup.add(tubuh)
    const duri = new THREE.Group()
    const geoDuri = new THREE.ConeGeometry(0.07, 0.3, 8)
    geoDuri.translate(0, 0.15, 0)
    for (let i = 0; i < 46; i++) {
      // sebaran merata di permukaan bola (spiral Fibonacci), bagian wajah dikosongkan
      const y = 1 - (i / 45) * 2
      const r = Math.sqrt(1 - y * y)
      const a = i * 2.39996
      const n = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)
      if (n.z > 0.55 && Math.abs(n.y) < 0.6) continue
      const m = new THREE.Mesh(geoDuri, kilap(W.pinkTua, 0.3))
      m.position.copy(n).multiplyScalar(0.96)
      m.quaternion.setFromUnitVectors(SUMBU_Y, n)
      duri.add(m)
    }
    tubuhGrup.add(duri)
    for (const s of [-1, 1]) {
      const mata = mataBesar(0.38)
      mata.position.set(s * 0.4, 0.25, 0.82)
      tubuhGrup.add(mata)
    }
    const muka = pipiSenyum(tubuhGrup, 0.76, 0.24, 0.94)
    muka.senyum.position.y = -0.12
    muka.mulut.position.y = -0.15
    const sirip = [-1, 1].map((s) => {
      const g = new THREE.Group()
      const m = new THREE.Mesh(bola, kilap(W.biruTua, 0.3))
      m.scale.set(0.28, 0.2, 0.07)
      m.position.x = s * 0.25
      g.add(m)
      g.position.set(s * 0.95, -0.1, 0.1)
      g.userData.s = s
      grup.add(g)
      return g
    })
    const ekor = new THREE.Mesh(geoEkor, kilap(W.biruTua, 0.3))
    ekor.scale.setScalar(0.55)
    ekor.rotation.y = Math.PI / 2
    ekor.position.z = -1.05
    grup.add(ekor)
    let kembung = 0
    let sampai = 0
    const o = { nama: 'buntal', grup }
    o.reaksi = (t) => {
      sampai = t + 2.6
      semburGelembung(grup.position, 10)
    }
    o.perbarui = (t, dt) => {
      const u = grup.userData
      const tujuan = t < sampai ? 1 : 0
      kembung += (tujuan - kembung) * Math.min(dt * (tujuan ? 9 : 2.5), 1)
      tubuhGrup.scale.setScalar(1 + kembung * 0.55)
      duri.children.forEach((m) => m.scale.set(1, 0.35 + kembung * 1.1, 1))
      girang(muka, kembung > 0.3)
      grup.position.set(u.x + Math.sin(t * 0.5) * 0.8, u.y + Math.sin(t * 1.1) * 0.35, u.z)
      grup.rotation.set(Math.sin(t * 0.9) * 0.08, Math.sin(t * 0.5) * 0.45, Math.sin(t * 1.2) * 0.06)
      grup.scale.setScalar(u.k * 0.75)
      sirip.forEach((g) => (g.rotation.y = g.userData.s * Math.sin(t * 10) * 0.6))
      ekor.rotation.y = Math.PI / 2 + Math.sin(t * 7) * 0.4
    }
    objek.push(o)
  }

  // ---- 4. Kerang dengan mutiara bercahaya ----
  {
    const grup = new THREE.Group()
    const cangkang = (bawah) => {
      const geo = new THREE.SphereGeometry(1, 48, 16, 0, Math.PI * 2, bawah ? Math.PI / 2 : 0, Math.PI / 2)
      const p = geo.attributes.position
      for (let i = 0; i < p.count; i++) {
        const a = Math.atan2(p.getZ(i), p.getX(i))
        const f = 1 + Math.abs(Math.sin(a * 7)) * 0.07
        p.setX(i, p.getX(i) * f)
        p.setZ(i, p.getZ(i) * f)
      }
      geo.computeVertexNormals()
      gradasi(geo, bawah ? W.pinkTua : W.pink, bawah ? W.pink : 0xfff0f7, bawah ? -1 : 0, bawah ? 0 : 1)
      return new THREE.Mesh(geo, kilapGradasi('kerang'))
    }
    const bawah = cangkang(true)
    bawah.scale.set(1.25, 0.4, 1)
    const engsel = new THREE.Group()
    engsel.position.z = -1
    const atas = cangkang(false)
    atas.scale.set(1.25, 0.45, 1)
    atas.position.z = 1
    engsel.add(atas)
    for (const s of [-1, 1]) {
      const n = new THREE.Vector3(s * 0.32, 0.6, 0.73).normalize()
      const mata = mataBesar(0.22)
      mata.position.set(n.x * 1.25, n.y * 0.45 + 0.08, n.z + 1)
      engsel.add(mata)
    }
    const mutiara = new THREE.Mesh(
      bola,
      (bahan.mutiara = new THREE.MeshPhysicalMaterial({
        color: 0xfff6fb,
        emissive: 0xffe6f4,
        emissiveIntensity: 1.2,
        roughness: 0.05,
        clearcoat: 1,
        iridescence: 1,
      })),
    )
    mutiara.scale.setScalar(0.32)
    mutiara.position.set(0, 0.12, 0.15)
    const halo = new THREE.Sprite(cahaya(0xffd6ec, 0.6))
    halo.scale.setScalar(2.2)
    halo.position.copy(mutiara.position)
    grup.add(bawah, engsel, mutiara, halo)
    let sampai = 0
    let buka = 0.2
    const o = { nama: 'kerang', grup }
    o.reaksi = (t) => {
      sampai = t + 2.8
      semburGelembung(grup.position, 12)
    }
    o.perbarui = (t, dt) => {
      const u = grup.userData
      const tujuan = t < sampai ? 0.95 : 0.2 + Math.sin(t * 0.8) * 0.07
      buka += (tujuan - buka) * Math.min(dt * 4, 1)
      engsel.rotation.x = -buka
      mutiara.material.emissiveIntensity = 1.2 + (buka - 0.2) * 4
      halo.material.opacity = 0.35 + buka * 0.6
      grup.position.set(u.x, u.y + 0.4 * u.k, u.z)
      grup.rotation.y = 0.35 + Math.sin(t * 0.3) * 0.1
      grup.scale.setScalar(u.k * 0.9)
      if (Math.random() < dt * 1.2) semburGelembung(grup.position, 1)
    }
    objek.push(o)
  }

  // ---- 5. Batu karang segitiga siku-siku bersisi 3-4-5 ----
  {
    const grup = new THREE.Group()
    const geo = ekstrusi(
      bentuk([
        [0, 0],
        [1.5, 0],
        [0, 2],
      ]),
      0.8,
      0.15,
    )
    geo.translate(-0.5, 0, 0)
    const batu = new THREE.Mesh(gradasi(geo, W.lilaTua, W.lila, 0, 2), kilapGradasi('batu'))
    grup.add(batu)
    const tanda = new THREE.Group()
    for (const [x, y, w, h] of [
      [0.12, 0.25, 0.25, 0.04],
      [0.25, 0.12, 0.04, 0.25],
    ]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.04), std(W.putih, 0.4))
      m.position.set(x, y, 0)
      tanda.add(m)
    }
    tanda.position.set(-0.5, 0.02, 0.58)
    grup.add(tanda)
    for (const s of [-1, 1]) {
      const mata = mataBesar(0.13)
      mata.position.set(-0.05 + s * 0.17, 0.75, 0.52)
      grup.add(mata)
    }
    pipiSenyum(grup, 0.34, 0.12, 0.55).senyum.position.y = 0.6
    // label panjang sisi
    const label = (teks, x, y, warna) => {
      const t = teksturKanvas(128, 128, (g) => {
        g.fillStyle = warna
        g.beginPath()
        g.arc(64, 64, 56, 0, Math.PI * 2)
        g.fill()
        g.fillStyle = '#ffffff'
        g.font = 'bold 76px sans-serif'
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        g.fillText(teks, 64, 68)
      })
      const s = new THREE.Sprite((bahan[`label${teks}`] = new THREE.SpriteMaterial({ map: t, depthWrite: false })))
      bahan[`teksturLabel${teks}`] = t
      s.scale.setScalar(0.45)
      s.position.set(x, y, 0.6)
      grup.add(s)
    }
    label('3', 0.25, -0.32, '#6fb3f0')
    label('4', -0.85, 1, '#f58bbd')
    label('5', 0.75, 1.25, '#9b83e0')
    let mulai = -1
    const o = { nama: 'batu', grup }
    o.reaksi = (t) => (mulai = t)
    o.perbarui = (t) => {
      const u = grup.userData
      let lompat = 0
      if (mulai >= 0) {
        const r = (t - mulai) / 0.8
        if (r >= 1) mulai = -1
        else lompat = Math.sin(r * Math.PI) * 0.8
      }
      grup.position.set(u.x, u.y + lompat * u.k, u.z)
      grup.rotation.y = -0.3 + Math.sin(t * 0.4) * 0.15
      grup.scale.setScalar(u.k)
    }
    objek.push(o)
  }

  // ---- 6. Bintang laut di pasir ----
  {
    const b = new THREE.Shape()
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.42 : 1
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2
      if (i === 0) b.moveTo(Math.cos(a) * r, Math.sin(a) * r)
      else b.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    const grup = new THREE.Group()
    grup.add(new THREE.Mesh(gradasi(ekstrusi(b, 0.25, 0.14), 0xffb38a, 0xffd2b8, -1, 1), kilapGradasi('bintang')))
    for (const s of [-1, 1]) {
      const mata = mataBesar(0.14)
      mata.position.set(s * 0.17, 0.08, 0.27)
      grup.add(mata)
    }
    const muka = pipiSenyum(grup, 0.34, 0.12, 0.3)
    muka.senyum.position.y = -0.1
    muka.mulut.position.y = -0.12
    let mulai = -1
    const o = { nama: 'bintang', grup }
    o.reaksi = (t) => (mulai = t)
    o.perbarui = (t) => {
      const u = grup.userData
      let lompat = 0
      let putar = 0
      if (mulai >= 0) {
        const r = (t - mulai) / 1
        if (r >= 1) mulai = -1
        else {
          lompat = Math.sin(r * Math.PI) * 1.2
          putar = r * Math.PI * 2
        }
        girang(muka, r < 1)
      }
      grup.position.set(u.x, u.y + (0.35 + lompat) * u.k, u.z)
      grup.rotation.set(-0.5, 0, Math.sin(t * 1.5) * 0.12 + putar)
      grup.scale.setScalar(u.k * 0.6)
    }
    objek.push(o)
  }

  // ---- dasar laut: pasir bergelombang + pola cahaya kaustik ----
  const geoLantai = new THREE.PlaneGeometry(110, 70, 70, 40)
  {
    const p = geoLantai.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      p.setZ(i, Math.sin(x * 0.45) * 0.22 + Math.sin(y * 0.6 + 1) * 0.18 + Math.sin((x + y) * 0.25) * 0.3)
    }
    geoLantai.computeVertexNormals()
  }
  const lantai = new THREE.Mesh(geoLantai, std(gelap ? 0x8e7fb5 : W.pasir, 0.9))
  lantai.rotation.x = -Math.PI / 2
  // kaustik hanya terlihat di pasir bagian dekat lalu memudar ke kejauhan (tanpa kabut: cahaya tambahan + kabut = pita putih)
  const teksturPudar = teksturKanvas(
    4,
    256,
    (g, w, h) => {
      for (let y = 0; y < h; y++) {
        const v = 1 - y / h
        const a = v < 0.12 ? v / 0.12 : v < 0.3 ? 1 : Math.max(0, 1 - (v - 0.3) / 0.22)
        g.fillStyle = `rgb(${a * 255},${a * 255},${a * 255})`
        g.fillRect(0, y, w, 1)
      }
    },
    false,
  )
  const kaustik = [0, 1].map((i) => {
    const t = teksturKaustik.clone()
    t.needsUpdate = true
    t.repeat.set(26, 16)
    bahan[`teksturKaustik${i}`] = t
    const m = new THREE.Mesh(
      geoLantai,
      (bahan[`kaustik${i}`] = new THREE.MeshBasicMaterial({
        map: t,
        color: gelap ? 0x8fb4ff : 0xffffff,
        transparent: true,
        alphaMap: teksturPudar,
        opacity: gelap ? 0.3 : 0.26,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      })),
    )
    m.rotation.x = -Math.PI / 2
    adegan.add(m)
    return m
  })
  adegan.add(lantai)

  // ---- rumput laut bergoyang ----
  const rumputLaut = []
  for (let i = 0; i < (hp ? 8 : 14); i++) {
    const tinggi = acak(2.2, 4.5)
    const geo = new THREE.PlaneGeometry(0.42, tinggi, 1, 16)
    geo.translate(0, tinggi / 2, 0)
    const m = new THREE.Mesh(
      geo,
      (bahan[`rumputLaut${i % 3}`] ??= new THREE.MeshStandardMaterial({
        color: [0x9ed9f0, 0xf5a9cf, 0xc6b3f2][i % 3],
        roughness: 0.55,
        side: THREE.DoubleSide,
      })),
    )
    m.userData = { asal: geo.attributes.position.array.slice(), tinggi, fase: acak(0, 6.3), f: acak(0.55, 1) }
    adegan.add(m)
    rumputLaut.push(m)
  }
  // karang bulat & bercabang
  const karang = []
  for (let i = 0; i < (hp ? 4 : 7); i++) {
    const g = new THREE.Group()
    if (i % 2) {
      const geo = new THREE.SphereGeometry(1, 32, 20)
      const p = geo.attributes.position
      for (let v = 0; v < p.count; v++) {
        const f = 1 + Math.sin(p.getX(v) * 9) * Math.sin(p.getY(v) * 9) * Math.sin(p.getZ(v) * 9) * 0.06
        p.setXYZ(v, p.getX(v) * f, p.getY(v) * f * 0.75, p.getZ(v) * f)
      }
      geo.computeVertexNormals()
      g.add(new THREE.Mesh(geo, kilap([W.pink, W.lila][(i >> 1) % 2], 0.45)))
    } else {
      for (let c = 0; c < 6; c++) {
        const tinggi = acak(0.7, 1.4)
        const m = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.12, tinggi, 4, 10),
          kilap([W.pinkTua, W.biruTua][(i >> 1) % 2], 0.35),
        )
        const a = (c / 6) * Math.PI * 2
        m.position.set(Math.cos(a) * 0.25, tinggi / 2, Math.sin(a) * 0.25)
        m.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5)
        g.add(m)
      }
    }
    adegan.add(g)
    karang.push(g)
  }

  // ---- sinar matahari menembus air ----
  const sinar = []
  for (let i = 0; i < 6; i++) {
    const geo = new THREE.PlaneGeometry(acak(2, 4), 36)
    geo.translate(0, -18, 0)
    const m = new THREE.Mesh(
      geo,
      (bahan[`sinar${i}`] = new THREE.MeshBasicMaterial({
        map: teksturSinar,
        color: gelap ? 0x9fb8ff : 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      })),
    )
    m.userData = { fx: -0.9 + i * 0.36, z: -4 - (i % 3) * 4, fase: i * 1.3, kuat: acak(0.16, 0.3) * (gelap ? 0.6 : 1) }
    adegan.add(m)
    sinar.push(m)
  }

  // ---- gelembung (naik terus + semburan saat klik) ----
  const matGelembung = (bahan.gelembung = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.03,
    transparent: true,
    opacity: 0.45,
    emissive: 0xeaf6ff,
    emissiveIntensity: 0.3,
    clearcoat: 1,
    iridescence: 1,
    iridescenceIOR: 1.3,
    depthWrite: false,
  }))
  const gelembung = Array.from({ length: hp ? 36 : 70 }, () => {
    const m = new THREE.Mesh(bola, matGelembung)
    m.visible = false
    m.userData = { hidup: 0, kec: new THREE.Vector3(), besar: 0.1, fase: 0 }
    adegan.add(m)
    return m
  })
  let giliran = 0
  function semburGelembung(asal, jumlah, sebar = 0.5) {
    for (let i = 0; i < jumlah; i++) {
      const m = gelembung[giliran++ % gelembung.length]
      m.visible = true
      m.position.set(asal.x + acak(-sebar, sebar), asal.y + acak(-sebar, sebar), asal.z + acak(-0.3, 0.3))
      m.userData.hidup = acak(4, 7)
      m.userData.kec.set(acak(-0.4, 0.4), acak(1.2, 2.4), 0)
      m.userData.besar = acak(0.06, 0.2)
      m.userData.fase = acak(0, 6.3)
    }
  }
  // butiran putih yang melayang pelan + kilauan bercahaya
  const titikAcak = (n, x, y, z) => {
    const posisi = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) posisi.set([acak(-x, x), acak(y[0], y[1]), acak(z[0], z[1])], i * 3)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posisi, 3))
    return geo
  }
  const butiran = new THREE.Points(
    titikAcak(hp ? 90 : 180, 22, [-10, 12], [-16, 6]),
    (bahan.butiran = new THREE.PointsMaterial({
      size: 0.14,
      map: teksturBulat,
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    })),
  )
  const kilau = new THREE.Points(
    titikAcak(hp ? 30 : 60, 20, [-8, 11], [-12, 4]),
    (bahan.kilau = new THREE.PointsMaterial({
      size: 0.3,
      map: teksturBulat,
      color: new THREE.Color(2.2, 2, 2.3),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })),
  )
  adegan.add(butiran, kilau)

  for (const o of objek) {
    o.grup.traverse((m) => (m.userData.pemilik = o))
    adegan.add(o.grup)
  }

  // ---- efek bersinar (bloom): hanya bagian yang sangat terang (ubur-ubur, mutiara, kilauan) yang berpendar ----
  let komposer = null
  let bloom = null
  if (!hp) {
    const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 })
    komposer = new M.EffectComposer(renderer, target)
    komposer.addPass(new M.RenderPass(adegan, kamera))
    bloom = new M.UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.55, 1.0)
    komposer.addPass(bloom)
    komposer.addPass(new M.OutputPass())
  }

  // ---- tata letak menyesuaikan ukuran layar ----
  let lebarDunia = 20
  let tinggiDunia = 15
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
    const k = tegak ? 0.55 : w >= 1280 ? 1 : w >= 960 ? 0.88 : 0.75
    const tx = lebarDunia / 2
    const ty = tinggiDunia / 2
    const yLantai = -ty + 0.3
    const jauh = (z) => (KAMERA_Z - z) / KAMERA_Z
    lantai.position.set(0, yLantai, -20)
    kaustik.forEach((m, i) => m.position.set(0, yLantai + 0.03 + i * 0.01, -20))
    // karakter yang diam di tempat ditaruh di tepi layar agar tidak menutupi kotak materi di tengah
    const letak = {
      ubur: tegak
        ? [
            [-tx + 0.6, ty - 3, -1],
            [tx - 0.6, 0.5, -3],
            [-tx + 1, -2.5, -7],
          ]
        : [
            [-tx + 2.4 * k, ty - 3.2, -1],
            [tx - 2.6 * k, ty - 4.6, -3],
            [-tx + 3.2 * k, -1.2, -7],
            [tx * 0.35, ty - 2.2, -11],
          ],
      buntal: tegak ? [tx - 0.7, -ty + 5.2, 0] : [tx - 2.4 * k, -0.6, 0],
      kerang: tegak ? [-tx + 1.2, yLantai, -3] : [-tx + 3.4 * k, yLantai, -3],
      batu: tegak ? [tx - 1.3, yLantai, -5] : [tx - 4.2 * k, yLantai, -4],
      bintang: tegak ? [0.6, yLantai, -1] : [-tx * 0.3, yLantai, -1],
    }
    const tempatkan = (o, [x, y, z]) => {
      const j = jauh(z)
      o.grup.userData = { ...o.grup.userData, x: x * j, y: y === yLantai ? yLantai : y * j, z, k }
    }
    uburSemua.forEach((o, i) => tempatkan(o, letak.ubur[i]))
    for (const o of objek) if (letak[o.nama] && o.nama !== 'ubur') tempatkan(o, letak[o.nama])
    for (const o of ikanSemua) o.grup.userData.k = k
    rumputLaut.forEach((m, i) => {
      const z = -2 - (i % 4) * 2.5
      const kiri = i % 2 === 0
      const x = (kiri ? -1 : 1) * (tx * jauh(z) - 0.6 - ((i >> 1) % 3) * 1.1 * k)
      m.position.set(x, yLantai, z)
      m.scale.setScalar(tegak ? 0.6 : 1)
    })
    karang.forEach((g, i) => {
      const z = -3 - (i % 3) * 3
      const x = (i % 2 ? 1 : -1) * (tx * jauh(z) * (0.55 + (i % 4) * 0.12))
      g.position.set(x, yLantai, z)
      g.scale.setScalar((tegak ? 0.45 : 0.75) * (0.8 + (i % 3) * 0.25))
    })
    sinar.forEach((m) => {
      const { fx, z } = m.userData
      m.position.set(fx * tx * jauh(z), ty * jauh(z) + 3, z)
    })
  }
  susun()
  window.addEventListener('resize', susun)

  // ---- arah pandang mata & kamera mengikuti tetikus/jari ----
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
      // klik air kosong: gelembung muncul di situ dan ikan-ikan berenang mendekat
      const titik = pemilih.ray.at((kamera.position.z - 0) / Math.max(-pemilih.ray.direction.z, 0.01), new THREE.Vector3())
      titik.z = 0
      semburGelembung(titik, 14, 0.35)
      for (const ikan of ikanSemua) {
        const j = (KAMERA_Z - ikan.d.z) / KAMERA_Z
        ikan.d.tujuan = { x: titik.x * j + acak(-0.8, 0.8), y: titik.y * j + acak(-0.6, 0.6) }
        ikan.d.sampai = waktu + 3.5
      }
      gambar(true)
      return
    }
    o.reaksi(waktu)
    const daftar = SAPAAN[o.nama]
    const n = (o.hitung = (o.hitung ?? -1) + 1)
    // balon kata di atas karakter, digambar di lapisan depan agar tidak tertutup kotak
    const atas = new THREE.Vector3(0, 1.8, 0)
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
  const asalGelembung = new THREE.Vector3()
  function perbaruiSemua(dt) {
    waktu += dt
    const t = waktu
    for (const o of objek) o.perbarui(t, dt)
    // mata melirik ke kursor/jari (tanpa kursor: melihat ke depan sambil sesekali melirik)
    if (arahPandang.ada) {
      ndc.set(arahPandang.x, -arahPandang.y)
      sinarPandang.setFromCamera(ndc, kamera)
      sinarPandang.ray.at((kamera.position.z - 8) / Math.max(-sinarPandang.ray.direction.z, 0.01), titikPandang)
    } else titikPandang.set(Math.sin(t * 0.7) * 6, Math.sin(t * 0.5) * 3, 10)
    for (const iris of semuaIris) iris.lookAt(titikPandang)
    kedip -= dt
    const tutup = kedip < 0.12 && kedip > 0
    for (const m of semuaMata) m.scale.y = tutup ? 0.1 : 1
    if (kedip <= 0) kedip = acak(2.2, 4.5)
    for (const m of rumputLaut) {
      const { asal, tinggi, fase, f } = m.userData
      const p = m.geometry.attributes.position
      for (let v = 0; v < p.count; v++) {
        const y = asal[v * 3 + 1]
        const h = y / tinggi
        p.setX(v, asal[v * 3] + Math.sin(y * 0.9 - t * 1.6 + fase) * 0.35 * Math.max(h, 0) ** 1.2 * f)
        p.setZ(v, asal[v * 3 + 2] + Math.cos(y * 0.7 - t * 1.2 + fase) * 0.15 * h)
      }
      p.needsUpdate = true
    }
    kaustik[0].material.map.offset.set(t * 0.02, t * 0.015)
    kaustik[1].material.map.offset.set(-t * 0.017, t * 0.022)
    sinar.forEach((m) => {
      const d = m.userData
      m.rotation.z = 0.3 + Math.sin(t * 0.25 + d.fase) * 0.06
      m.material.opacity = d.kuat * (0.65 + Math.sin(t * 0.6 + d.fase) * 0.35)
    })
    const tyAtas = tinggiDunia / 2 + 4
    for (const m of gelembung) {
      const d = m.userData
      if (!m.visible) continue
      d.hidup -= dt
      m.position.addScaledVector(d.kec, dt)
      m.position.x += Math.sin(t * 3 + d.fase) * 0.01
      m.scale.setScalar(d.besar * (1 + Math.sin(t * 5 + d.fase) * 0.08))
      if (d.hidup <= 0 || m.position.y > tyAtas) m.visible = false
    }
    // gelembung kecil muncul sendiri dari dasar laut
    if (Math.random() < dt * 2.5) {
      asalGelembung.set(acak(-lebarDunia / 2, lebarDunia / 2), -tinggiDunia / 2, acak(-8, 2))
      semburGelembung(asalGelembung, 1, 0.1)
    }
    butiran.rotation.y = Math.sin(t * 0.05) * 0.2
    butiran.position.y = Math.sin(t * 0.2) * 0.4
    kilau.material.opacity = 0.55 + Math.sin(t * 3) * 0.35
    // kamera bergeser pelan mengikuti tetikus & guliran: benda dekat & jauh bergerak berbeda (paralaks 3D)
    const gulir = Math.min(window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1), 1)
    const tujuanX = arahPandang.x * 1.6 + Math.sin(t * 0.15) * 0.7
    const tujuanY = 0.5 - arahPandang.y * 1 - (gulir - 0.5) * 2.4
    kamera.position.x += (tujuanX - kamera.position.x) * Math.min(dt * 2, 1)
    kamera.position.y += (tujuanY - kamera.position.y) * Math.min(dt * 2, 1)
    kamera.lookAt(0, -0.5, -4)
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
      // saat animasi mati, reaksi klik tetap digerakkan ±2 detik lalu berhenti
      if (animasiMati() && !(sekali && sekarang < waktuBerhenti)) return
      bingkai = requestAnimationFrame(langkah)
    }
    waktuBerhenti = sekali ? performance.now() + 2000 : 0
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

  return () => {
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
    for (const t of [teksturAir, teksturBulat, teksturSinar, teksturKaustik, teksturPudar, lingkungan]) t.dispose()
    bloom?.dispose()
    komposer?.dispose()
    renderer.dispose()
  }
}
