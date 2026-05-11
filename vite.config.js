import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from the custom subdomain https://imarah.mshadianto.id/ (root path).
export default defineConfig({
  plugins: [react()],
  base: '/',
})
