// Service worker: membuat aplikasi bisa di-install (PWA) dan tetap terbuka tanpa internet.
//
// Strategi:
// - Halaman (HTML): ambil dari internet dulu agar selalu versi terbaru;
//   bila offline, pakai salinan terakhir di cache.
// - File aplikasi (JS, CSS, gambar, ikon, font): ambil dari cache dulu agar cepat;
//   bila belum ada, unduh lalu simpan ke cache.
// - Permintaan ke Supabase (database) TIDAK di-cache. Bila offline, hasil tes
//   tetap tersimpan di perangkat dan dikirim ulang otomatis oleh aplikasi.

const VERSI = 'pythagoras-v1'
const INTI = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSI).then((cache) => cache.addAll(INTI)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // hapus cache versi lama
  event.waitUntil(
    caches
      .keys()
      .then((nama) => Promise.all(nama.filter((n) => n !== VERSI).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)

  // database & API: selalu langsung ke internet
  if (url.hostname.endsWith('supabase.co')) return

  // halaman: internet dulu, cache bila offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const salinan = res.clone()
          caches.open(VERSI).then((cache) => cache.put('./index.html', salinan))
          return res
        })
        .catch(() => caches.match('./index.html', { ignoreVary: true })),
    )
    return
  }

  // file aplikasi & font: cache dulu
  const fileApp = url.origin === self.location.origin
  const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'
  if (!fileApp && !font) return

  event.respondWith(
    caches.match(req, { ignoreVary: true }).then(
      (tersimpan) =>
        tersimpan ||
        fetch(req).then((res) => {
          if (res.ok || res.type === 'opaque') {
            const salinan = res.clone()
            caches.open(VERSI).then((cache) => cache.put(req, salinan))
          }
          return res
        }),
    ),
  )
})
