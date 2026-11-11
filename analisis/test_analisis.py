"""Pengujian otomatis script analisis data penelitian (jalankan: python -m pytest analisis -q)."""
import csv
import importlib.util
import json
import os

import pytest

import analisis as A
import analisis_literasi as L
import ekspor_jawaban_literasi as E

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def baris_tes(nama, jenis, jawaban, selesai, kelompok="Belajar dengan aplikasi"):
    return {"jenis": jenis, "nama": nama, "kelas": "8", "sekolah": "-", "kelompok": kelompok, "selesai": selesai,
            "durasi": 600, "skor": None, "IL": None, "EL": None, "GL": None, "jawaban": jawaban}


def jawaban_benar(jenis):
    return {str(i): (str(k) if isinstance(k, (int, float)) else k) for i, k in enumerate(A.KUNCI[jenis])}


# --- tes pilihan/angka -----------------------------------------------------
@pytest.mark.parametrize("pre,post,harapan", [(50, 75, 0.5), (20, 100, 1.0), (40, 40, 0.0), (100, 100, None), (None, 80, None)])
def test_n_gain(pre, post, harapan):
    assert A.n_gain(pre, post) == harapan


def test_kategori_n_gain_hake():
    assert [A.kategori_n_gain(g) for g in (0.8, 0.5, 0.1)] == ["tinggi", "sedang", "rendah"]


@pytest.mark.parametrize("jenis", ["pretest", "posttest"])
def test_koreksi_semua_benar(jenis):
    assert all(A.koreksi(jenis, jawaban_benar(jenis)))


def test_koreksi_huruf_lembar_kertas():
    jawaban = {str(i): (h or "0") for i, h in enumerate(A.KUNCI_HURUF["pretest"])}
    benar = A.koreksi("pretest", jawaban)
    assert [benar[i] for i, h in enumerate(A.KUNCI_HURUF["pretest"]) if h] == [True] * 4


def test_kunci_sama_dengan_backend():
    """Kunci analisis HARUS sama dengan penilaian di server (agents.md §6)."""
    spec = importlib.util.spec_from_file_location("penilaian", os.path.join(AKAR, "backend", "penilaian.py"))
    penilaian = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(penilaian)
    for jenis in ("pretest", "posttest"):
        assert [str(k) for k in A.KUNCI[jenis]] == [str(k) for k in penilaian.KUNCI[jenis]]


def test_skor_proses_literasi():
    skor = A.skor_proses([True] * 10)
    assert skor == {"Merumuskan": 100, "Menerapkan": 100, "Menafsirkan": 100}
    assert A.skor_proses([False] * 10)["Menafsirkan"] == 0
    assert sorted(A.PROSES_LITERASI.count(p) for p in A.URUTAN_PROSES) == [2, 4, 4]


def test_rekap_memakai_percobaan_pertama():
    data = [baris_tes("8A-01", "pretest", {}, "2026-11-10"), baris_tes("8A-01", "pretest", jawaban_benar("pretest"), "2026-11-12")]
    rekap, peringatan = A.rekap_per_siswa(data)
    assert rekap[0]["pretest"] == 0 and "lebih dari sekali" in peringatan[0]


# --- tes Mathematical Literacy (uraian) ------------------------------------
def tulis(tmp_path, nama, baris):
    p = tmp_path / nama
    with open(p, "w", encoding="utf-8", newline="") as f:
        csv.writer(f).writerows(baris)
    return str(p)


def test_skor_literasi_total_dan_n_gain(tmp_path):
    p = tulis(tmp_path, "skor.csv", [["nama", "kelompok", "jenis", "s1", "s2", "s3", "s4"],
                                     ["8A-01", "Belajar dengan aplikasi", "pretest", 2, 1, 3, 0],
                                     ["8A-01", "Belajar dengan aplikasi", "post-test", 5, 6, 6, 4]])
    data, peringatan = L.baca_skor(p)
    hasil, _ = L.rekap(data)
    assert not peringatan
    assert (hasil[0]["total_pre"], hasil[0]["total_post"], hasil[0]["selisih"]) == (6, 21, 15)
    assert hasil[0]["n_gain"] == pytest.approx((87.5 - 25) / 75)


def test_skor_literasi_di_luar_rentang_ditandai(tmp_path):
    p = tulis(tmp_path, "skor.csv", [["nama", "kelompok", "jenis", "s1", "s2", "s3", "s4"],
                                     ["8A-01", "x", "pretest", 9, "", 3, "dua"]])
    data, peringatan = L.baca_skor(p)
    assert data[0]["skor"] == [0, 0, 3, 0] and len(peringatan) == 3


def test_soal_aplikasi_sama_dengan_rubrik():
    soal = json.load(open(os.path.join(AKAR, "src", "data", "soal-literasi.json"), encoding="utf-8"))
    kisi = E.muat_kisi()
    assert len(soal) == len(kisi) == 4
    for s, k in zip(soal, kisi):
        assert (s["judul"], s["teks"], s["tanya"]) == (k["judul"], k["teks"], k["tanya"])
        assert sum(t["skor"] for t in k["tahap"]) == L.SKOR_MAKS


def test_ekspor_jawaban_hanya_uraian_pertama_tanpa_demo():
    uraian = {"0": "c² = 100² + 240²", "_instrumen": "literasi"}
    data = [
        baris_tes("8A-02", "posttest", uraian, "2026-11-20"),
        baris_tes("8A-02", "pretest", uraian, "2026-11-10"),
        baris_tes("8A-02", "pretest", {**uraian, "0": "ulang"}, "2026-11-11"),
        baris_tes("8Z-99", "pretest", uraian, "2026-11-10", kelompok=A.KELOMPOK_UJI),
        baris_tes("8A-03", "pretest", {"0": "x"}, "2026-11-10"),  # tes pilihan lama
    ]
    hasil = E.jawaban_literasi(data)
    assert [(d["nama"], d["jenis"]) for d in hasil] == [("8A-02", "pretest"), ("8A-02", "posttest")]
    assert hasil[0]["jawaban"]["0"] == "c² = 100² + 240²"


def test_lembar_penilaian_aman_dan_lengkap(tmp_path):
    d = baris_tes("8A-02", "pretest", {"0": "<b>260</b>\nTangga B", "_instrumen": "literasi"}, "2026-11-10")
    html = E.lembar_html([d], E.muat_kisi())
    assert "&lt;b&gt;260&lt;/b&gt;<br>Tangga B" in html  # jawaban siswa di-escape, baris baru dipertahankan
    assert html.count("<h3>Soal") == 4 and "(tidak dijawab)" in html
    p = tmp_path / "skor.csv"
    E.tulis_csv_skor([d], p)
    assert p.read_text(encoding="utf-8-sig").splitlines() == ["nama,kelompok,jenis,s1,s2,s3,s4",
                                                              "8A-02,Belajar dengan aplikasi,pretest,,,,"]
