import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks: these change rarely, so browsers keep them cached across app deploys.
        codeSplitting: {
          groups: [
            { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 30 },
            { name: 'vendor-router', test: /node_modules[\\/]react-router[\\/]/, priority: 20 },
            { name: 'vendor-query', test: /node_modules[\\/]@tanstack[\\/]/, priority: 20 },
            { name: 'vendor-ui', test: /node_modules[\\/](radix-ui|@radix-ui|@floating-ui|lucide-react)[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
})
