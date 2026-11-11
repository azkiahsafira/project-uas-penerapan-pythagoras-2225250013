// Pengujian logika perhitungan teorema Pythagoras (src/pythagoras.js) — jalankan: npm test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { bulat, hitung, isTripel, keAngka } from '../src/pythagoras.js'

test('mencari sisi miring: c² = a² + b²', () => {
  const h = hitung('c', { a: 3, b: 4 })
  assert.equal(h.sisi.c, 5)
  assert.deepEqual(h.langkah, ['c² = a² + b²', 'c² = 3² + 4²', 'c² = 9 + 16', 'c² = 25', 'c = √25 = 5'])
})

test('mencari sisi siku-siku: a² = c² − b² dan b² = c² − a²', () => {
  assert.equal(hitung('a', { b: 24, c: 26 }).sisi.a, 10)
  assert.equal(hitung('b', { a: 20, c: 29 }).sisi.b, 21)
})

test('sisi miring yang tidak paling panjang & input tidak valid ditolak dengan pesan jelas', () => {
  assert.match(hitung('a', { b: 13, c: 12 }).error, /sisi miring/i)
  assert.match(hitung('c', { a: 0, b: 4 }).error, /lebih dari 0/)
  assert.match(hitung('c', { a: 'abc', b: 4 }).error, /angka/)
})

test('koma desimal Indonesia diterima & hasil dibulatkan 2 angka', () => {
  assert.equal(keAngka('2,5'), 2.5)
  assert.equal(bulat(hitung('c', { a: '1,5', b: 2 }).sisi.c), 2.5)
  assert.equal(bulat(hitung('c', { a: 1, b: 1 }).sisi.c), 1.41)
})

test('tripel Pythagoras dikenali', () => {
  assert.equal(isTripel({ a: 20, b: 21, c: 29 }), true)
  assert.equal(isTripel({ a: 1, b: 1, c: Math.SQRT2 }), false)
})
