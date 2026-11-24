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
    monkeypatch.delenv("CADANGAN_API_KEY", raising=False)


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


def test_tanpa_api_key_siku_mandiri_tetap_menjawab(monkeypatch):
    """Tanpa kunci AI apa pun, Tanya Siku tetap berfungsi lewat Siku Mandiri (tanpa AI)."""
    monkeypatch.delenv("DEEPSEEK_API_KEY")
    r = klien.post("/api/asisten", json={"pertanyaan": "halo"}, headers=masuk())
    assert r.status_code == 200, r.text
    assert r.json()["penyedia"] == "mandiri" and r.json()["model"] == asisten.MODEL_MANDIRI
    assert r.json()["balasan"] == asisten.MEDIASI_MANDIRI["pahami"][1]


def test_asisten_mati_saat_tes():
    r = klien.post("/api/asisten", json={"pertanyaan": "jawaban no 1?", "halaman": "tes"}, headers=masuk())
    assert r.status_code == 403


def test_asisten_membalas_dan_mencatat_aktivitas(monkeypatch):
    monkeypatch.setattr(asisten, "panggil_deepseek", tiruan(jawab("pahami", "Apa saja yang diketahui di soal itu?")))
    r = klien.post("/api/asisten", headers=masuk(),
                   json={"pertanyaan": "Tangga 6 m dan dinding 8 m, aku bingung", "halaman": "latihan", "tingkat": 2})
    assert r.status_code == 200, r.text
    assert r.json() == {"balasan": "Apa saja yang diketahui di soal itu?", "tahap": "pahami", "tingkat": 2,
                        "penyedia": "deepseek", "model": "deepseek-flash"}
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


def test_deepseek_gagal_siku_mandiri_menjawab(monkeypatch):
    def gagal(pesan, kunci):
        raise asisten.AsistenGagal("putus")

    monkeypatch.setattr(asisten, "panggil_deepseek", gagal)
    r = klien.post("/api/asisten", headers=masuk(), json={"pertanyaan": "halo"})
    assert r.status_code == 200 and r.json()["penyedia"] == "mandiri" and "Siku" not in r.json().get("galat", "")


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
    assert isi["asisten"] is True and isi["ai"] == ["deepseek"] and "kunci-uji-palsu" not in str(isi)
    monkeypatch.delenv("DEEPSEEK_API_KEY")
    # tanpa kunci AI pun Tanya Siku tetap siap (Siku Mandiri)
    assert klien.get("/api/sehat").json() | {"waktu": ""} == {"status": "ok", "waktu": "", "asisten": True, "ai": []}


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
    assert asisten.panggil_deepseek([{"role": "user", "content": "halo"}], "kunci-x") == ("Apa yang diketahui?", "deepseek-flash")
    url, otorisasi, isi = terkirim[0]
    assert url == "https://api.deepseek.com/chat/completions" and otorisasi == "Bearer kunci-x"
    assert isi["model"] == "deepseek-flash" and isi["response_format"] == {"type": "json_object"}
    assert len(terkirim) == 2 and "response_format" not in terkirim[1][2]


def test_saldo_habis_terbaca_sebagai_kode_alasan(monkeypatch):
    """DeepSeek membalas 402 (saldo habis): siswa melihat pesan ramah + kode alasan untuk peneliti."""
    monkeypatch.setattr(asisten.httpx, "post", lambda url, headers, json, timeout: _Jawaban(402, {"error": {"message": "Insufficient Balance"}}))
    r = klien.post("/api/asisten", headers=masuk(), json={"pertanyaan": "halo"})
    assert r.status_code == 200 and r.json()["penyedia"] == "mandiri"
    (catat,) = main.db.semua("aktivitas")
    assert "gagal=deepseek:saldo_habis" in catat["catatan"] and "model=mandiri" in catat["catatan"]


# --- model cadangan gratis (OpenRouter) ----------------------------------------------------
def test_cadangan_menjawab_bila_deepseek_saldo_habis_dan_modelnya_dilaporkan_jujur(monkeypatch):
    monkeypatch.setenv("CADANGAN_API_KEY", "kunci-cadangan-palsu")
    terkirim = []

    def post(url, headers, json, timeout):
        terkirim.append((url, headers["Authorization"], json["model"]))
        if "deepseek.com" in url:
            return _Jawaban(402, {"error": {"message": "Insufficient Balance"}})
        isi = '```json\n{"tahap": "pahami", "balasan": "Apa yang ditanyakan soal itu?"}\n```'
        return _Jawaban(200, {"model": "google/gemma-4-31b-it:free", "choices": [{"message": {"content": isi}}]})

    monkeypatch.setattr(asisten.httpx, "post", post)
    r = klien.post("/api/asisten", headers=masuk(), json={"pertanyaan": "bingung"})
    assert r.status_code == 200, r.text
    assert r.json()["balasan"] == "Apa yang ditanyakan soal itu?"
    assert r.json()["penyedia"] == "cadangan" and r.json()["model"] == "google/gemma-4-31b-it:free"
    assert terkirim[0][0] == "https://api.deepseek.com/chat/completions"
    assert terkirim[1] == ("https://openrouter.ai/api/v1/chat/completions", "Bearer kunci-cadangan-palsu", "openrouter/free")
    (catat,) = main.db.semua("aktivitas")
    assert "model=cadangan:google/gemma-4-31b-it:free" in catat["catatan"]


def test_semua_penyedia_gagal_siku_mandiri_dan_kode_dicatat(monkeypatch):
    monkeypatch.setenv("CADANGAN_API_KEY", "kunci-cadangan-palsu")
    monkeypatch.setattr(asisten.httpx, "post", lambda url, headers, json, timeout: _Jawaban(402 if "deepseek" in url else 429))
    r = klien.post("/api/asisten", headers=masuk(), json={"pertanyaan": "halo"})
    assert r.status_code == 200 and r.json()["penyedia"] == "mandiri"
    (catat,) = main.db.semua("aktivitas")
    assert "gagal=deepseek:saldo_habis,cadangan:sibuk" in catat["catatan"]


def test_urutan_penyedia_gemini_lalu_groq(monkeypatch):
    """DeepSeek saldo habis → Gemini kuota habis → Groq menjawab; URL & model sesuai."""
    monkeypatch.setenv("GEMINI_API_KEY", "kunci-gemini-palsu")
    monkeypatch.setenv("GROQ_API_KEY", "kunci-groq-palsu")
    terkirim = []

    def post(url, headers, json, timeout):
        terkirim.append((url, json["model"]))
        if "deepseek" in url:
            return _Jawaban(402)
        if "googleapis" in url:
            return _Jawaban(429)
        return _Jawaban(200, {"choices": [{"message": {"content": '{"tahap": "rencana", "balasan": "Sisi mana yang dicari?"}'}}]})

    monkeypatch.setattr(asisten.httpx, "post", post)
    r = klien.post("/api/asisten", headers=masuk(), json={"pertanyaan": "bingung"})
    assert r.json()["penyedia"] == "groq" and r.json()["balasan"] == "Sisi mana yang dicari?"
    assert [u for u, _ in terkirim] == [asisten.URL_DEEPSEEK, asisten.URL_GEMINI, asisten.URL_GROQ]
    assert terkirim[1][1] == asisten.MODEL_GEMINI and terkirim[2][1] == asisten.MODEL_GROQ


def test_siku_mandiri_mengikuti_tahap_rmt_dan_tidak_memberi_jawaban():
    m = asisten.siku_mandiri
    assert m("aku bingung, tangga 6 m dan 8 m", [], "pahami", 1)["tahap"] == "pahami"
    assert m("yang dicari sisi miring c", [], "pahami", 3)["tahap"] == "rencana"
    assert m("6² + 8² = 36 + 64", [], "rencana", 2)["tahap"] == "kerjakan"
    assert m("hasilku 10 m", [], "kerjakan", 1)["tahap"] == "periksa"
    minta = m("kasih jawabannya saja", [], "kerjakan", 2)
    assert minta["tahap"] == "pahami" and "tidak memberi jawaban akhir" in minta["balasan"]
    for tahap, isi in asisten.MEDIASI_MANDIRI.items():
        assert set(isi) == {1, 2, 3, 4}, tahap


def test_hanya_cadangan_tetap_aktif(monkeypatch):
    monkeypatch.delenv("DEEPSEEK_API_KEY")
    monkeypatch.setenv("CADANGAN_API_KEY", "kunci-cadangan-palsu")
    assert klien.get("/api/sehat").json()["asisten"] is True


def test_balasan_kosong_dicoba_ulang_lalu_petunjuk_aman(monkeypatch):
    """Model gratis kadang membalas kosong: dicoba sekali lagi; bila tetap kosong, siswa mendapat petunjuk aman (bukan galat)."""
    monkeypatch.setattr(asisten, "panggil_deepseek", tiruan("", jawab("pahami", "Apa yang diketahui?")))
    r = klien.post("/api/asisten", headers=masuk(), json={"pertanyaan": "halo"})
    assert r.status_code == 200 and r.json()["balasan"] == "Apa yang diketahui?" and len(tiruan.terkirim) == 2

    monkeypatch.setattr(asisten, "panggil_deepseek", tiruan("", "   "))
    r = klien.post("/api/asisten", headers=masuk(), json={"pertanyaan": "kasih jawabannya saja", "tahap": "kerjakan"})
    assert r.status_code == 200 and r.json()["balasan"] == asisten.PETUNJUK_AMAN["kerjakan"]


def test_sehat_lengkap_memeriksa_key_ai_gratis(monkeypatch):
    """Pemeriksaan harian: key OpenRouter sah → cadangan True; ditolak → False; tidak dipasang → None."""
    monkeypatch.setenv("CADANGAN_API_KEY", "kunci-cadangan-palsu")
    monkeypatch.setattr(asisten.httpx, "get", lambda url, headers, timeout: _Jawaban(200 if url.endswith("/api/v1/key") else 404))
    assert klien.get("/api/sehat?lengkap=1").json()["cadangan"] is True
    monkeypatch.setattr(asisten.httpx, "get", lambda url, headers, timeout: _Jawaban(401))
    assert klien.get("/api/sehat?lengkap=1").json()["cadangan"] is False
    monkeypatch.delenv("CADANGAN_API_KEY")
    assert klien.get("/api/sehat?lengkap=1").json()["cadangan"] is None
    assert "cadangan" not in klien.get("/api/sehat").json()
