import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // This strictly forces Vite to deduplicate React, killing the "Invalid hook call" error instantly.
    dedupe: ['react', 'react-dom']
  }
})