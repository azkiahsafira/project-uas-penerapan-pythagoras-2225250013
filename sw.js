// Service worker "pemati" untuk alamat lama yang sudah tidak dipakai.
// Perangkat yang pernah membuka aplikasi di alamat lama menyimpan salinannya (service worker + cache),
// sehingga aplikasi masih bisa tampil walau server sudah 404. Berkas ini menggantikan service worker lama:
// semua cache dihapus, service worker dicabut, lalu halaman dimuat ulang sehingga yang tampil hanya 404.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const nama of await caches.keys()) await caches.delete(nama)
      await self.registration.unregister()
      const jendela = await self.clients.matchAll({ type: 'window' })
      jendela.forEach((j) => j.navigate(j.url))
    })(),
  )
})
