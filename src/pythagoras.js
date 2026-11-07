// Logika perhitungan teorema Pythagoras: c² = a² + b²

export const NAMA = { a: 'Alas (a)', b: 'Tinggi (b)', c: 'Sisi miring (c)' }

// Sisi yang perlu diketahui untuk mencari sisi tertentu
export const INPUT = { c: ['a', 'b'], a: ['b', 'c'], b: ['a', 'c'] }

export const bulat = (x) => Math.round(x * 100) / 100

export const keAngka = (teks) => parseFloat(String(teks).replace(',', '.'))

export function hitung(cari, nilai) {
  const v = {}
  for (const k of INPUT[cari]) {
    const n = keAngka(nilai[k])
    if (!Number.isFinite(n) || n <= 0) {
      return { error: `${NAMA[k]} harus berupa angka lebih dari 0.` }
    }
    v[k] = n
  }

  if (cari === 'c') {
    const kuadrat = v.a ** 2 + v.b ** 2
    return {
      sisi: { ...v, c: Math.sqrt(kuadrat) },
      langkah: [
        'c² = a² + b²',
        `c² = ${v.a}² + ${v.b}²`,
        `c² = ${bulat(v.a ** 2)} + ${bulat(v.b ** 2)}`,
        `c² = ${bulat(kuadrat)}`,
        `c = √${bulat(kuadrat)} = ${bulat(Math.sqrt(kuadrat))}`,
      ],
    }
  }

  const lain = cari === 'a' ? 'b' : 'a'
  if (v.c <= v[lain]) {
    return { error: 'Sisi miring (c) harus lebih panjang dari sisi lainnya.' }
  }
  const kuadrat = v.c ** 2 - v[lain] ** 2
  const hasil = Math.sqrt(kuadrat)
  return {
    sisi: { ...v, [cari]: hasil },
    langkah: [
      `${cari}² = c² − ${lain}²`,
      `${cari}² = ${v.c}² − ${v[lain]}²`,
      `${cari}² = ${bulat(v.c ** 2)} − ${bulat(v[lain] ** 2)}`,
      `${cari}² = ${bulat(kuadrat)}`,
      `${cari} = √${bulat(kuadrat)} = ${bulat(hasil)}`,
    ],
  }
}

export const isTripel = (sisi) =>
  ['a', 'b', 'c'].every((k) => Math.abs(sisi[k] - Math.round(sisi[k])) < 1e-9)
