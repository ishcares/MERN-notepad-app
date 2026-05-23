// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 👇 ADD THIS 'proxy' BLOCK
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Replace 5000 with your back-end port
        changeOrigin: true, // Needed for virtual hosting
        secure: false, // Set to true if your back-end uses HTTPS
      }
    }
  },
  
  build: {
    outDir: 'dist', 
  },
});