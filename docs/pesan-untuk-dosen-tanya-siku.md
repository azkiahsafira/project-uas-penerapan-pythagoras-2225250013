# Draf pesan untuk Pak Aan — status chatbot Tanya Siku

> Draf ini boleh disesuaikan sendiri sebelum dikirim.

Assalamu'alaikum Pak Aan, izin melaporkan progres Tahap 2.

Chatbot pedagogis **Tanya Siku** sudah terintegrasi dengan **API resmi DeepSeek** di backend (API key disimpan sebagai
environment variable `DEEPSEEK_API_KEY` di server Vercel, tidak ada di kode frontend maupun GitHub). Chatbot menerapkan
tahap RMT (pahami → rencanakan → kerjakan → periksa), petunjuk bertingkat 1–4, pengelolaan IL/EL/GL, dan tidak memberi
jawaban akhir (dicek juga di server). Penjelasan lengkap ada di `docs/chatbot-tanya-siku.md` pada repository.

Kendala: API DeepSeek ternyata berbayar dan saldo akun saya masih kosong (DeepSeek membalas *Insufficient Balance*).
Agar tetap bisa diuji tanpa biaya, sementara saya menambahkan **model cadangan gratis lewat OpenRouter** yang hanya dipakai
bila DeepSeek gagal. Di aplikasi tertulis jelas model mana yang menjawab ("Dijawab oleh: …"). Begitu saldo DeepSeek
diisi, chatbot otomatis kembali memakai DeepSeek tanpa perubahan kode.

Mohon arahan Bapak apakah cara ini diperkenankan, atau sebaiknya saya mengisi saldo DeepSeek. Terima kasih, Pak.

Azkiah Safira · NIM 2225250013 · Kelas 3F
