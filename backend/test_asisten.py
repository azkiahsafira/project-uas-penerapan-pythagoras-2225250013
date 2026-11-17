"""Pengujian chatbot Tanya Siku. DeepSeek TIDAK dipanggil: fungsi pemanggilnya diganti tiruan,
dan penyimpanan memakai Memori (tidak menyentuh Supabase).

Jalankan dari folder aplikasi:  python -m pytest backend -q
"""
import json
import os

os.environ.pop("SUPABASE_URL", None)
os.environ.pop("SUPABASE_SERVICE_KEY", None)

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from backend import asisten, main  # noqa: E402

klien = TestClient(main.app)


@pytest.fixture(autouse=True)
def bersihkan(monkeypatch):
    main.db.tabel = {"hasil": {}, "aktivitas": {}}
    main._percobaan.clear()
    main._tanya.clear()
    monkeypatch.setenv("DEEPSEEK_API_KEY", "kunci-uji-palsu")


def masuk(kode="8A-01"):
    r = klien.post("/api/masuk", json={"kode": kode})
    return {"Authorization": f"Bearer {r.json()['token']}"}


def tiruan(*balasan):
    """Pengganti panggil_deepseek: mengembalikan balasan berurutan dan mencatat pesan yang dikirim."""
    antre = list(balasan)
    tiruan.terkirim = []

    def panggil(pesan, kunci):
        tiruan.terkirim.append(pesan)
        assert kunci == "kunci-uji-palsu"
        return antre.pop(0)

    return panggil


def jawab(tahap, teks):
    return json.dumps({"tahap": tahap, "balasan": teks})


# --- penjaga jawaban akhir --------------------------------------------------------------
def test_ambil_angka_format_indonesia():
    assert asisten.ambil_angka("22.500 − 6.400 = 16.100, c ≈ 12,7 cm, 2 inci") == [22500, 6400, 16100, 12.7, 2]


def test_bocor_bila_menyebut_sisi_miring_yang_belum_ditulis_siswa():
    assert asisten.bocorkan_jawaban("Jadi panjang tangga 10 m.", "kaki tangga 6 m, tinggi dinding 8 m")
    assert asisten.bocorkan_jawaban("Tinggi layang-layang = 12 m", "benang 13 m, jarak mendatar 5 m")


def test_tidak_bocor_bila_siswa_sendiri_yang_menulis_jawaban():
    assert not asisten.bocorkan_jawaban("Ya, 10 m sudah tepat! Mengapa?", "sisi 6 dan 8, jawabanku 10")


def test_tidak_bocor_untuk_langkah_antara():
    assert not asisten.bocorkan_jawaban("Coba hitung 6² + 8² dulu. Berapa hasilnya?", "sisi 6 dan 8")


def test_prompt_memuat_aturan_rmt_dan_tingkat():
    p = asisten.prompt_sistem("latihan", 3)
    for kata in ("Rigorous Mathematical Thinking", "pahami", "rencana", "kerjakan", "periksa", "JANGAN PERNAH", "3 dari 4"):
        assert kata in p


# --- endpoint ----------------------------------------------------------------------------
def test_asisten_butuh_masuk():
    r = klien.post("/api/asisten", json={"pertanyaan": "halo"})
    assert r.status_code == 401


def test_asisten_belum_aktif_tanpa_api_key(monkeypatch):
    monkeypatch.delenv("DEEPSEEK_API_KEY")
    r = klien.post("/api/asisten", json={"pertanyaan": "halo"}, headers=masuk())
    assert r.status_code == 503 and r.json()["galat"] == "asisten_belum_aktif"


def test_asisten_mati_saat_tes():
    r = klien.post("/api/asisten", json={"pertanyaan": "jawaban no 1?", "halaman": "tes"}, headers=masuk())
    assert r.status_code == 403


def test_asisten_membalas_dan_mencatat_aktivitas(monkeypatch):
    monkeypatch.setattr(asisten, "panggil_deepseek", tiruan(jawab("pahami", "Apa saja yang diketahui di soal itu?")))
    r = klien.post("/api/asisten", headers=masuk(),
                   json={"pertanyaan": "Tangga 6 m dan dinding 8 m, aku bingung", "halaman": "latihan", "tingkat": 2})
    assert r.status_code == 200, r.text
    assert r.json() == {"balasan": "Apa saja yang diketahui di soal itu?", "tahap": "pahami", "tingkat": 2}
    sistem = tiruan.terkirim[0][0]
    assert sistem["role"] == "system" and "2 dari 4" in sistem["content"]
    (catat,) = main.db.semua("aktivitas")
    assert catat["jenis"] == "asisten" and catat["nama"] == "8A-01" and catat["petunjuk"] == 2 and catat["hasil"] == "pahami"


def test_jawaban_akhir_diminta_ulang(monkeypatch):
    monkeypatch.setattr(asisten, "panggil_deepseek", tiruan(
        jawab("kerjakan", "Panjang tangga adalah 10 m."),
        jawab("kerjakan", "Hitung 6² + 8² lalu cari akarnya. Berapa hasilmu?"),
    ))
    r = klien.post("/api/asisten", headers=masuk(), json={"pertanyaan": "kasih jawabannya saja: sisi 6 dan 8"})
    assert r.json()["balasan"] == "Hitung 6² + 8² lalu cari akarnya. Berapa hasilmu?"
    assert len(tiruan.terkirim) == 2


def test_jawaban_akhir_diganti_petunjuk_aman_bila_tetap_bocor(monkeypatch):
    monkeypatch.setattr(asisten, "panggil_deepseek", tiruan(
        jawab("kerjakan", "Jawabannya 10."), jawab("kerjakan", "Oke, hasilnya 10 m."),
    ))
    r = klien.post("/api/asisten", headers=masuk(), json={"pertanyaan": "sisi 6 dan 8 berapa sisi miringnya"})
    assert r.json()["balasan"] == asisten.PETUNJUK_AMAN["kerjakan"]
    assert "10" not in r.json()["balasan"]


def test_balasan_bukan_json_tetap_dipakai(monkeypatch):
    monkeypatch.setattr(asisten, "panggil_deepseek", tiruan("Coba gambar segitiganya dulu ya."))
    r = klien.post("/api/asisten", headers=masuk(), json={"pertanyaan": "bingung", "tahap": "rencana"})
    assert r.json()["balasan"] == "Coba gambar segitiganya dulu ya." and r.json()["tahap"] == "rencana"


def test_deepseek_gagal_pesan_ramah(monkeypatch):
    def gagal(pesan, kunci):
        raise asisten.AsistenGagal("putus")

    monkeypatch.setattr(asisten, "panggil_deepseek", gagal)
    r = klien.post("/api/asisten", headers=masuk(), json={"pertanyaan": "halo"})
    assert r.status_code == 502 and "Siku" in r.json()["pesan"]


def test_batas_pertanyaan_per_siswa(monkeypatch):
    monkeypatch.setattr(asisten, "panggil_deepseek", lambda pesan, kunci: jawab("pahami", "Apa yang diketahui?"))
    kepala = masuk()
    kode = [klien.post("/api/asisten", headers=kepala, json={"pertanyaan": "tanya"}).status_code for _ in range(13)]
    assert kode[:12] == [200] * 12 and kode[12] == 429


def test_riwayat_dibatasi():
    r = klien.post("/api/asisten", headers=masuk(),
                   json={"pertanyaan": "x", "riwayat": [{"peran": "user", "isi": "a"}] * 13})
    assert r.status_code == 422


def test_sehat_melaporkan_asisten_tanpa_membocorkan_kunci(monkeypatch):
    isi = klien.get("/api/sehat").json()
    assert isi["asisten"] is True and "kunci-uji-palsu" not in str(isi)
    monkeypatch.delenv("DEEPSEEK_API_KEY")
    assert klien.get("/api/sehat").json()["asisten"] is False


class _Jawaban:
    def __init__(self, status, isi=None):
        self.status_code, self._isi = status, isi or {}

    def json(self):
        return self._isi


def test_panggil_deepseek_format_permintaan_dan_ulang_tanpa_mode_json(monkeypatch):
    """Permintaan ke DeepSeek asli: model deepseek-flash, kunci di header; bila mode JSON ditolak (400), diulang tanpa itu."""
    terkirim = []

    def post(url, headers, json, timeout):
        terkirim.append((url, headers["Authorization"], dict(json)))
        if "response_format" in json:
            return _Jawaban(400)
        return _Jawaban(200, {"choices": [{"message": {"content": "Apa yang diketahui?"}}]})

    monkeypatch.setattr(asisten.httpx, "post", post)
    assert asisten.panggil_deepseek([{"role": "user", "content": "halo"}], "kunci-x") == "Apa yang diketahui?"
    url, otorisasi, isi = terkirim[0]
    assert url == "https://api.deepseek.com/chat/completions" and otorisasi == "Bearer kunci-x"
    assert isi["model"] == "deepseek-flash" and isi["response_format"] == {"type": "json_object"}
    assert len(terkirim) == 2 and "response_format" not in terkirim[1][2]
