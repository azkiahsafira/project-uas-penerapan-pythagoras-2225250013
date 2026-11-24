"""Pengujian backend (pytest). Memakai penyimpanan Memori, jadi TIDAK menyentuh Supabase.

Jalankan dari folder aplikasi:  python -m pytest backend -q
"""
import os

os.environ.pop("SUPABASE_URL", None)
os.environ.pop("SUPABASE_SERVICE_KEY", None)

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from backend import main  # noqa: E402
from backend.penilaian import nilai_harian, nilai_tes  # noqa: E402
from backend.sesi import buat_token, periksa_token  # noqa: E402

klien = TestClient(main.app)


@pytest.fixture(autouse=True)
def bersihkan():
    main.db.tabel = {"hasil": {}, "aktivitas": {}}
    main._percobaan.clear()


def masuk(kode="8A-01"):
    r = klien.post("/api/masuk", json={"kode": kode})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}"}


# --- penilaian -------------------------------------------------------------
def test_nilai_tes_teks_angka_dan_huruf():
    jawaban = {"0": "Sisi yang berhadapan dengan sudut siku-siku", "1": "81", "2": "11,0", "3": "A", "4": "15",
               "5": "0", "6": "B", "7": "13", "8": "pilihan salah", "9": ""}
    assert nilai_tes("pretest", jawaban) == {"benar": 7, "total": 10, "skor": 70}


def test_nilai_harian_rata_rata():
    jawaban = {"b1": 2, "b2": 2, "b3": 2, "b4": 5, "b5": 5, "b6": 5, "b7": 8, "b8": 8, "b9": 8, "b10": 8}
    assert nilai_harian(jawaban) == {"EL": 2.0, "IL": 5.0, "GL": 8.0}
    # skala Paas 1-9: angka 0 atau 10 tidak sah
    assert nilai_harian({**jawaban, "b1": 0})["EL"] is None and nilai_harian({**jawaban, "b10": 10})["GL"] is None


def test_token_sah_palsu_kedaluwarsa():
    t = buat_token("8A-01", "rahasia", sekarang=1000)
    assert periksa_token(t, "rahasia", sekarang=2000) == "8A-01"
    assert periksa_token(t, "kunci-lain", sekarang=2000) is None
    assert periksa_token(t, "rahasia", sekarang=10**10) is None
    assert periksa_token("asal.asalan", "rahasia") is None


# --- endpoint --------------------------------------------------------------
def test_sehat():
    assert klien.get("/api/sehat").json()["status"] == "ok"


def test_masuk_berhasil_dan_kode_dirapikan():
    r = klien.post("/api/masuk", json={"kode": " 8a-1 "})
    assert r.status_code == 200
    assert r.json()["siswa"]["kode"] == "8A-01"


@pytest.mark.parametrize("kode,status,galat", [
    ("8A-55", 404, "kode_tidak_terdaftar"),
    ("8A-99", 403, "kode_nonaktif"),
    ("budi", 422, "format_kode"),
])
def test_masuk_gagal(kode, status, galat):
    r = klien.post("/api/masuk", json={"kode": kode})
    assert r.status_code == status
    assert r.json()["galat"] == galat


def test_batas_percobaan_masuk():
    for _ in range(5):
        klien.post("/api/masuk", json={"kode": "8A-55"})
    assert klien.post("/api/masuk", json={"kode": "8A-01"}).status_code == 429


def test_tanpa_token_ditolak():
    assert klien.get("/api/saya").status_code == 401
    assert klien.get("/api/saya", headers={"Authorization": "Bearer palsu.palsu"}).status_code == 401


def test_hasil_dinilai_di_server_tanpa_nama():
    kepala = masuk()
    jawaban = {str(i): "salah" for i in range(10)}
    jawaban.update({"1": "64", "2": "14"})
    r = klien.post("/api/hasil", headers=kepala, json={
        "id": "h1", "jenis": "posttest", "mulai": "2026-11-17T01:00:00Z", "selesai": "2026-11-17T01:15:00Z", "jawaban": jawaban})
    assert r.json() == {"tersimpan": True, "baru": True}
    baris = main.db.semua("hasil")[0]
    assert (baris["skor"], baris["benar"], baris["durasi_detik"]) == (20, 2, 900)
    assert baris["nama"] == "8A-01" and baris["sekolah"] == "-"


def test_aktivitas_kirim_ulang_tidak_dobel():
    kepala = masuk()
    isi = {"aktivitas": [{"id": "a1", "jenis": "langkah", "sesi": 1, "langkah": 2, "judul": "Nama sisi-sisinya",
                          "mulai": "2026-11-10T01:00:00Z", "selesai": "2026-11-10T01:01:05Z", "salah": 1, "hasil": "benar"}]}
    assert klien.post("/api/aktivitas", headers=kepala, json=isi).json() == {"diterima": 1, "duplikat": 0}
    assert klien.post("/api/aktivitas", headers=kepala, json=isi).json() == {"diterima": 0, "duplikat": 1}
    assert main.db.semua("aktivitas")[0]["durasi_detik"] == 65


def test_aktivitas_prasyarat_refleksi_dan_petunjuk():
    kepala = masuk()
    isi = {"aktivitas": [
        {"id": "p1", "jenis": "prasyarat", "sesi": 0, "langkah": 1, "judul": "7² = …", "mulai": "2026-11-10T01:00:00Z",
         "selesai": "2026-11-10T01:00:20Z", "hasil": "benar", "catatan": "jawaban:49"},
        {"id": "l1", "jenis": "latihan", "sesi": 4, "langkah": 3, "judul": "Tangga", "mulai": "2026-11-10T01:00:00Z",
         "selesai": "2026-11-10T01:02:00Z", "hasil": "benar", "petunjuk": 2, "catatan": "bantuan:penuh;kewajaran:1"},
        {"id": "r1", "jenis": "refleksi", "sesi": 4, "langkah": 3, "judul": "Mengapa…?", "mulai": "2026-11-10T01:02:00Z",
         "selesai": "2026-11-10T01:02:00Z", "hasil": "benar", "catatan": "karena sisi miring paling panjang"},
    ]}
    assert klien.post("/api/aktivitas", headers=kepala, json=isi).json() == {"diterima": 3, "duplikat": 0}
    baris = {b["id"]: b for b in main.db.semua("aktivitas")}
    assert baris["l1"]["petunjuk"] == 2 and baris["r1"]["catatan"].startswith("karena")
    isi["aktivitas"][0].update(id="x", jenis="lain")
    assert klien.post("/api/aktivitas", headers=kepala, json=isi).status_code == 422


def test_tes_hanya_sekali_per_kode():
    kepala = masuk()
    isi = {"id": "pre-1", "jenis": "pretest", "mulai": "2026-11-10T01:00:00Z", "selesai": "2026-11-10T01:10:00Z",
           "jawaban": {str(i): "x" for i in range(10)}}
    assert klien.post("/api/hasil", headers=kepala, json=isi).status_code == 200
    # kiriman ulang yang sama (internet putus-sambung) tetap diterima, tidak dobel
    assert klien.post("/api/hasil", headers=kepala, json=isi).json() == {"tersimpan": True, "baru": False}
    # percobaan kedua dengan id baru ditolak
    r = klien.post("/api/hasil", headers=kepala, json={**isi, "id": "pre-2"})
    assert r.status_code == 409 and r.json()["galat"] == "sudah_dikerjakan"
    # siswa lain tetap boleh
    assert klien.post("/api/hasil", headers=masuk("8A-02"), json={**isi, "id": "pre-3"}).status_code == 200


def test_tes_literasi_uraian_tanpa_skor_otomatis():
    kepala = masuk()
    isi = {"id": "ml-1", "jenis": "pretest", "mulai": "2026-11-10T01:00:00Z", "selesai": "2026-11-10T01:30:00Z",
           "jawaban": {"0": "c² = 100² + 240² = 67.600, c = 260 cm, beli tangga B", "1": "...", "_instrumen": "literasi"}}
    assert klien.post("/api/hasil", headers=kepala, json=isi).status_code == 200
    baris = main.db.semua("hasil")[0]
    assert baris["skor"] is None and baris["benar"] is None and baris["jawaban"]["_instrumen"] == "literasi"


def test_soal_latihan_berjenjang():
    soal = klien.get("/api/soal/latihan?tingkat=3&jumlah=4", headers=masuk()).json()["soal"]
    assert len(soal) == 4 and all("cerita" in s and s["dicari"] in ("b", "c") for s in soal)


def test_rekap_peneliti_dan_ngain():
    kepala = masuk()
    for jenis, benar in (("pretest", ["1", "2"]), ("posttest", ["1", "2", "4", "5", "7"])):
        jawaban = {str(i): "x" for i in range(10)}
        kunci = {"pretest": {"1": "81", "2": "11"}, "posttest": {"1": "64", "2": "14", "4": "20", "5": "24", "7": "17"}}[jenis]
        jawaban.update({k: kunci[k] for k in benar})
        klien.post("/api/hasil", headers=kepala, json={"id": jenis, "jenis": jenis, "mulai": "2026-11-10T01:00:00Z",
                                                       "selesai": "2026-11-10T01:10:00Z", "jawaban": jawaban})
    assert klien.get("/api/peneliti/rekap").status_code == 403
    data = klien.get("/api/peneliti/rekap", headers={"X-Kunci-Peneliti": main.KUNCI_PENELITI}).json()["siswa"][0]
    assert (data["pretest"], data["posttest"], data["n_gain"]) == (20, 50, 0.38)


def test_kuesioner_harian_tersimpan_dan_hanya_sekali_per_pertemuan():
    """Kuesioner Pertemuan 1 & 2 (beban1, beban2) dinilai di server: rata-rata EL, IL, GL skala 1-9; tiap pertemuan sekali."""
    kepala = {"Authorization": "Bearer " + klien.post("/api/masuk", json={"kode": "8A-02"}).json()["token"]}
    jawaban = {"b1": 3, "b2": 3, "b3": 3, "b4": 6, "b5": 6, "b6": 6, "b7": 7, "b8": 7, "b9": 7, "b10": 7}
    for jenis in ("beban1", "beban2"):
        r = klien.post("/api/hasil", headers=kepala, json={"id": f"k-{jenis}", "jenis": jenis, "mulai": "2026-11-25T01:00:00Z",
                                                          "selesai": "2026-11-25T01:05:00Z", "jawaban": jawaban})
        assert r.status_code == 200, r.text
    baris = {b["jenis"]: b for b in main.db.semua("hasil") if b["nama"] == "8A-02"}
    assert (baris["beban1"]["el"], baris["beban1"]["il"], baris["beban1"]["gl"]) == (3.0, 6.0, 7.0)
    ulang = klien.post("/api/hasil", headers=kepala, json={"id": "k-lagi", "jenis": "beban1", "mulai": "2026-11-25T02:00:00Z",
                                                          "selesai": "2026-11-25T02:05:00Z", "jawaban": jawaban})
    assert ulang.status_code == 409
    assert klien.post("/api/hasil", headers=kepala, json={"id": "k-x", "jenis": "leppink", "mulai": "2026-11-25T02:00:00Z",
                                                          "selesai": "2026-11-25T02:05:00Z", "jawaban": jawaban}).status_code == 422
