import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ssr-editor-frontend'
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1337', // Backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
