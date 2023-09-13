import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        // target: 'http://localhost:8081',
        // target: "http://www.luoxian.tech:8080",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
