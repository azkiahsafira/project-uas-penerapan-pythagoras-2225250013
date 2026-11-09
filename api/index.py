"""Titik masuk Vercel (serverless Python) untuk backend FastAPI.

Semua permintaan /api/... diteruskan ke sini oleh vercel.json, lalu ditangani
oleh aplikasi FastAPI di backend/main.py (rute tetap /api/masuk, /api/hasil, dst.).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app  # noqa: E402,F401
