import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repo at https://mshadianto.github.io/imarah/
// so every built asset needs the /imarah/ prefix.
export default defineConfig({
  plugins: [react()],
  base: '/imarah/',
})
