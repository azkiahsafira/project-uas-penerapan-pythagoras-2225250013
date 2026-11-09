"""Token sesi siswa sederhana (HMAC-SHA256), tanpa password dan tanpa nama asli.

Isi token: kode siswa + waktu kedaluwarsa, ditandatangani dengan KUNCI_TOKEN (rahasia di server).
"""
import base64
import hashlib
import hmac
import json
import time

LAMA_BERLAKU = 30 * 24 * 3600  # 30 hari


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _unb64(teks: str) -> bytes:
    return base64.urlsafe_b64decode(teks + "=" * (-len(teks) % 4))


def buat_token(kode: str, kunci: str, sekarang: float | None = None) -> str:
    isi = {"kode": kode, "exp": int((sekarang or time.time()) + LAMA_BERLAKU)}
    badan = _b64(json.dumps(isi, separators=(",", ":")).encode())
    tanda = _b64(hmac.new(kunci.encode(), badan.encode(), hashlib.sha256).digest())
    return f"{badan}.{tanda}"


def periksa_token(token: str, kunci: str, sekarang: float | None = None) -> str | None:
    """Kembalikan kode siswa bila token sah dan belum kedaluwarsa, selain itu None."""
    try:
        badan, tanda = token.split(".")
        harus = _b64(hmac.new(kunci.encode(), badan.encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(tanda, harus):
            return None
        isi = json.loads(_unb64(badan))
        if isi["exp"] < (sekarang or time.time()):
            return None
        return isi["kode"]
    except (ValueError, KeyError, json.JSONDecodeError):
        return None
