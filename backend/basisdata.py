"""Penyimpanan data untuk backend.

- SupabaseREST : dipakai di server (Render). Menulis ke Supabase lewat REST API dengan service key
                 (rahasia, hanya ada di environment variable server).
- Memori       : dipakai saat menjalankan di komputer tanpa Supabase dan saat pengujian (pytest),
                 sehingga data uji TIDAK pernah masuk ke database penelitian.
"""
import os

import httpx


class Memori:
    def __init__(self, siswa=None):
        # kode siswa contoh untuk mencoba di komputer
        self.siswa = {s["kode"]: s for s in (siswa or [
            {"kode": "8A-01", "kelas": "8", "kelompok": "Belajar dengan aplikasi", "aktif": True},
            {"kode": "8A-02", "kelas": "8", "kelompok": "Belajar dengan aplikasi", "aktif": True},
            {"kode": "8A-99", "kelas": "8", "kelompok": "Belajar dengan aplikasi", "aktif": False},
        ])}
        self.tabel = {"hasil": {}, "aktivitas": {}}

    def cari_siswa(self, kode):
        return self.siswa.get(kode)

    def tambah(self, tabel, baris):
        """Tambah banyak baris; id yang sudah ada dilewati (pengiriman ulang aman)."""
        diterima = duplikat = 0
        for b in baris:
            if b["id"] in self.tabel[tabel]:
                duplikat += 1
            else:
                self.tabel[tabel][b["id"]] = b
                diterima += 1
        return diterima, duplikat

    def semua(self, tabel):
        return list(self.tabel[tabel].values())


class SupabaseREST:
    def __init__(self, url, kunci_layanan):
        self.url = url.rstrip("/") + "/rest/v1"
        # Kunci Supabase baru (sb_secret_...) cukup di header apikey; kunci lama (JWT service_role)
        # juga dikirim sebagai Bearer.
        self.kepala = {"apikey": kunci_layanan}
        if not kunci_layanan.startswith("sb_"):
            self.kepala["Authorization"] = f"Bearer {kunci_layanan}"
        self.klien = httpx.Client(timeout=15)

    def cari_siswa(self, kode):
        r = self.klien.get(f"{self.url}/siswa", headers=self.kepala, params={"kode": f"eq.{kode}", "select": "*"})
        r.raise_for_status()
        data = r.json()
        return data[0] if data else None

    def tambah(self, tabel, baris):
        if not baris:
            return 0, 0
        # resolution=ignore-duplicates: id yang sudah ada tidak dianggap galat
        kepala = {**self.kepala, "Prefer": "resolution=ignore-duplicates,return=representation"}
        r = self.klien.post(f"{self.url}/{tabel}", headers=kepala, json=baris, params={"on_conflict": "id"})
        r.raise_for_status()
        diterima = len(r.json())
        return diterima, len(baris) - diterima

    def semua(self, tabel):
        r = self.klien.get(f"{self.url}/{tabel}", headers=self.kepala, params={"select": "*", "order": "dibuat"})
        r.raise_for_status()
        return r.json()


def buat_penyimpanan():
    url, kunci = os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_SERVICE_KEY")
    if url and kunci:
        return SupabaseREST(url, kunci)
    return Memori()
