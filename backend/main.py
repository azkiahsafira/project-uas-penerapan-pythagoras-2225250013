"""Backend API aplikasi Penerapan Teorema Pythagoras (Python + FastAPI).

Jalankan di komputer (tanpa Supabase, data hanya di memori):
    pip install -r backend/requirements.txt
    uvicorn backend.main:app --reload
lalu buka http://127.0.0.1:8000/docs untuk mencoba semua endpoint.

Di server (Render) isi environment variable:
    SUPABASE_URL, SUPABASE_SERVICE_KEY, KUNCI_TOKEN, KUNCI_PENELITI, ASAL_DIIZINKAN
Rancangan lengkap: api.md
"""
import csv
import hashlib
import io
import os
import random
import re
import time
from collections import defaultdict, deque
from datetime import datetime, timezone

from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from pydantic import BaseModel, Field

try:  # dijalankan sebagai paket: uvicorn backend.main:app, pytest
    from .basisdata import buat_penyimpanan
    from .penilaian import nilai_leppink, nilai_tes
    from .sesi import buat_token, periksa_token
except ImportError:  # dijalankan dari dalam folder backend (Vercel, Root Directory = backend)
    from basisdata import buat_penyimpanan
    from penilaian import nilai_leppink, nilai_tes
    from sesi import buat_token, periksa_token

# Cukup SATU rahasia di server (SUPABASE_SERVICE_KEY). Kunci tanda tangan token diturunkan darinya
# bila KUNCI_TOKEN tidak diisi, sehingga tetap sama walau server tidur/bangun ulang.
_KUNCI_LAYANAN = os.environ.get("SUPABASE_SERVICE_KEY", "")
KUNCI_TOKEN = os.environ.get("KUNCI_TOKEN") or (
    hashlib.sha256(f"token-sesi:{_KUNCI_LAYANAN}".encode()).hexdigest() if _KUNCI_LAYANAN else "kunci-lokal-hanya-untuk-mencoba"
)
# Endpoint peneliti hanya aktif bila KUNCI_PENELITI diisi (di komputer lokal: "peneliti-lokal")
KUNCI_PENELITI = os.environ.get("KUNCI_PENELITI") or ("" if _KUNCI_LAYANAN else "peneliti-lokal")
ASAL = os.environ.get(
    "ASAL_DIIZINKAN",
    "https://azkiah-safira-pythagoras.vercel.app,http://localhost:5173,http://127.0.0.1:5173",
).split(",")
POLA_KODE = re.compile(r"^[0-9]{1,2}[A-Z]?-[0-9]{1,3}$")  # contoh: 8A-07

app = FastAPI(
    title="API Penerapan Teorema Pythagoras",
    description="Backend penelitian: masuk dengan kode siswa, menilai tes di server, menyimpan hasil & aktivitas belajar.",
    version="2.0.0",
)
app.add_middleware(CORSMiddleware, allow_origins=ASAL, allow_methods=["*"], allow_headers=["*"])
db = buat_penyimpanan()


# ---------------------------------------------------------------------------
# Bantuan umum
# ---------------------------------------------------------------------------
class Galat(HTTPException):
    """Galat dengan pesan Bahasa Indonesia yang ramah siswa (format di api.md §5)."""

    def __init__(self, status, kode, pesan):
        super().__init__(status_code=status, detail={"galat": kode, "pesan": pesan})


@app.exception_handler(HTTPException)
async def tampilkan_galat(_request, exc):
    isi = exc.detail if isinstance(exc.detail, dict) else {"galat": "galat", "pesan": str(exc.detail)}
    return JSONResponse(status_code=exc.status_code, content=isi)


def rapikan_kode(kode: str) -> str:
    """Spasi dibuang, huruf besar, nomor absen 2 digit: '8a-1' -> '8A-01' (sama dengan kode yang didaftarkan)."""
    k = re.sub(r"\s+", "", kode or "").upper()
    m = re.match(r"^([0-9]{1,2}[A-Z]?)-([0-9]{1,3})$", k)
    return f"{m.group(1)}-{int(m.group(2)):02d}" if m else k


_percobaan = defaultdict(deque)


def batasi(ip: str, batas=5, jendela=60):
    """Maksimal `batas` percobaan masuk per menit per alamat IP (kode kelas+absen mudah ditebak)."""
    sekarang = time.time()
    antre = _percobaan[ip]
    while antre and sekarang - antre[0] > jendela:
        antre.popleft()
    if len(antre) >= batas:
        raise Galat(429, "terlalu_banyak", "Terlalu banyak percobaan. Tunggu satu menit, lalu coba lagi ya.")
    antre.append(sekarang)


def siswa_masuk(authorization: str = Header(default="")):
    """Dependensi: ambil data siswa dari token Bearer."""
    token = authorization.removeprefix("Bearer ").strip()
    kode = periksa_token(token, KUNCI_TOKEN) if token else None
    siswa = db.cari_siswa(kode) if kode else None
    if not siswa or not siswa.get("aktif", True):
        raise Galat(401, "belum_masuk", "Sesi berakhir. Masukkan kode siswamu lagi ya.")
    return siswa


def peneliti(x_kunci_peneliti: str = Header(default="")):
    if not KUNCI_PENELITI or x_kunci_peneliti != KUNCI_PENELITI:
        raise Galat(403, "bukan_peneliti", "Halaman ini khusus peneliti.")


def durasi(mulai, selesai):
    try:
        a = datetime.fromisoformat(mulai.replace("Z", "+00:00"))
        b = datetime.fromisoformat(selesai.replace("Z", "+00:00"))
        return max(0, round((b - a).total_seconds()))
    except (AttributeError, ValueError):
        return 0


def identitas_baris(siswa):
    # kolom `nama` diisi KODE siswa: tidak ada nama asli di basis data (privasi.md)
    return {"nama": siswa["kode"], "kelas": siswa.get("kelas", "8"), "sekolah": "-",
            "kelompok": siswa.get("kelompok", "Belajar dengan aplikasi")}


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------
@app.get("/api/sehat")
def sehat():
    """Cek server hidup; dipanggil aplikasi saat dibuka untuk membangunkan server gratis."""
    return {"status": "ok", "waktu": datetime.now(timezone.utc).isoformat(timespec="seconds")}


class Masuk(BaseModel):
    kode: str = Field(min_length=3, max_length=12, examples=["8A-07"])


@app.post("/api/masuk")
def masuk(data: Masuk, request: Request):
    batasi(request.client.host if request.client else "?")
    kode = rapikan_kode(data.kode)
    if not POLA_KODE.match(kode):
        raise Galat(422, "format_kode", "Format kode belum tepat. Contoh: 8A-07 (kelas, huruf kelas, tanda -, nomor absen).")
    siswa = db.cari_siswa(kode)
    if not siswa:
        raise Galat(404, "kode_tidak_terdaftar", "Kode siswa tidak ditemukan. Periksa lagi kodenya ya.")
    if not siswa.get("aktif", True):
        raise Galat(403, "kode_nonaktif", "Kode ini sudah tidak aktif. Tanyakan ke peneliti ya.")
    return {"token": buat_token(kode, KUNCI_TOKEN),
            "siswa": {"kode": kode, "kelas": siswa.get("kelas", "8"), "kelompok": siswa.get("kelompok")}}


@app.get("/api/saya")
def saya(siswa=Depends(siswa_masuk)):
    return {"kode": siswa["kode"], "kelas": siswa.get("kelas", "8"), "kelompok": siswa.get("kelompok")}


class Aktivitas(BaseModel):
    id: str
    jenis: str = Field(pattern="^(langkah|sesi|latihan|prasyarat|refleksi)$")
    sesi: int
    langkah: int | None = None
    judul: str
    mulai: str
    selesai: str
    salah: int = 0
    hasil: str | None = None
    dibacakan: int = 0
    petunjuk: int = Field(0, ge=0, le=20)  # jumlah petunjuk bertingkat yang dibuka (latihan)
    catatan: str | None = Field(None, max_length=500)  # rincian bantuan / jawaban refleksi siswa


class KirimAktivitas(BaseModel):
    aktivitas: list[Aktivitas] = Field(max_length=200)


@app.post("/api/aktivitas")
def kirim_aktivitas(data: KirimAktivitas, siswa=Depends(siswa_masuk)):
    baris = [{**a.model_dump(), **identitas_baris(siswa), "durasi_detik": durasi(a.mulai, a.selesai)} for a in data.aktivitas]
    diterima, duplikat = db.tambah("aktivitas", baris)
    return {"diterima": diterima, "duplikat": duplikat}


class Hasil(BaseModel):
    id: str
    jenis: str = Field(pattern="^(pretest|posttest|leppink)$")
    mulai: str
    selesai: str
    jawaban: dict


@app.post("/api/hasil")
def kirim_hasil(data: Hasil, siswa=Depends(siswa_masuk)):
    """Jawaban dinilai DI SERVER dengan kunci yang sama seperti aplikasi.
    Skor tidak dikirim balik agar tes tidak menjadi umpan balik bagi siswa."""
    baris = {**identitas_baris(siswa), "id": data.id, "jenis": data.jenis, "mulai": data.mulai, "selesai": data.selesai,
             "durasi_detik": durasi(data.mulai, data.selesai), "jawaban": data.jawaban,
             "benar": None, "total": None, "skor": None, "il": None, "el": None, "gl": None}
    if data.jenis == "leppink":
        beban = nilai_leppink(data.jawaban)
        baris.update(il=beban["IL"], el=beban["EL"], gl=beban["GL"])
    else:
        baris.update(nilai_tes(data.jenis, data.jawaban))
    diterima, _ = db.tambah("hasil", [baris])
    return {"tersimpan": True, "baru": diterima == 1}


# Soal latihan berjenjang (konten.md §6); tripel agar hasil bilangan bulat
TRIPEL = [(3, 4, 5), (6, 8, 10), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29), (9, 40, 41), (15, 20, 25)]
CERITA = {
    "c": [("tangga", "Kaki tangga berjarak {a} m dari dinding dan ujungnya menyentuh dinding setinggi {b} m. Berapa panjang tangga?"),
          ("jarak", "Rina berjalan {a} m ke timur lalu {b} m ke utara. Berapa meter jarak terpendeknya dari titik awal?")],
    "b": [("layang-layang", "Benang layang-layang {c} m. Jarak mendatar ke titik di bawah layang-layang {a} m. Berapa tinggi layang-layang?"),
          ("tangga", "Tangga {c} m bersandar di dinding, kakinya {a} m dari dinding. Berapa tinggi dinding yang dicapai?")],
}


@app.get("/api/soal/latihan")
def soal_latihan(tingkat: int = 1, jumlah: int = 5, _siswa=Depends(siswa_masuk)):
    if tingkat not in (1, 2, 3):
        raise Galat(422, "tingkat", "Tingkat harus 1, 2, atau 3.")
    acak = random.Random()
    hasil = []
    for i in range(max(1, min(jumlah, 20))):
        a, b, c = acak.choice(TRIPEL)
        dicari = acak.choice(["a", "b", "c"]) if tingkat < 3 else acak.choice(["b", "c"])
        sisi = {k: v for k, v in {"a": a, "b": b, "c": c}.items() if k != dicari}
        butir = {"id": f"L-T{tingkat}-{i + 1}", "tingkat": tingkat, "sisi": sisi, "dicari": dicari}
        if tingkat == 3:
            konteks, teks = acak.choice(CERITA[dicari])
            butir.update(konteks=konteks, cerita=teks.format(a=a, b=b, c=c))
        hasil.append(butir)
    return {"soal": hasil}


# ---------------------------------------------------------------------------
# Khusus peneliti (header X-Kunci-Peneliti)
# ---------------------------------------------------------------------------
@app.get("/api/peneliti/rekap", dependencies=[Depends(peneliti)])
def rekap():
    per = defaultdict(dict)
    for h in db.semua("hasil"):
        s = per[h["nama"]]
        s["kode"], s["kelompok"] = h["nama"], h.get("kelompok")
        if h["jenis"] in ("pretest", "posttest"):
            s[h["jenis"]] = h.get("skor")
        else:
            s.update(IL=h.get("il"), EL=h.get("el"), GL=h.get("gl"))
    for s in per.values():
        pre, post = s.get("pretest"), s.get("posttest")
        s["n_gain"] = round((post - pre) / (100 - pre), 2) if pre is not None and post is not None and pre < 100 else None
    return {"siswa": sorted(per.values(), key=lambda s: s["kode"])}


@app.get("/api/peneliti/ekspor/{tabel}", dependencies=[Depends(peneliti)], response_class=PlainTextResponse)
def ekspor(tabel: str):
    if tabel not in ("hasil", "aktivitas"):
        raise Galat(404, "tabel", "Tabel harus 'hasil' atau 'aktivitas'.")
    baris = db.semua(tabel)
    keluar = io.StringIO()
    if baris:
        tulis = csv.DictWriter(keluar, fieldnames=list(baris[0].keys()))
        tulis.writeheader()
        tulis.writerows(baris)
    return PlainTextResponse(keluar.getvalue(), media_type="text/csv")
