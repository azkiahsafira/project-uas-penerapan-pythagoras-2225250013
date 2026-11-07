import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Path relatif agar aplikasi tetap jalan di GitHub Pages
  // (https://<user>.github.io/<nama-repo>/)
  base: './',
})
