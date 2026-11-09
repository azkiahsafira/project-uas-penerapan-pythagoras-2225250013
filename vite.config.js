import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Path relatif agar aplikasi jalan di alamat mana pun (Vercel: https://azkiah-safira-pythagoras.vercel.app)
  base: './',
})
