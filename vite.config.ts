import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@scenes': resolve(__dirname, './src/scenes'),
      '@store': resolve(__dirname, './src/store'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@assets': resolve(__dirname, './src/assets'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services')
    }
  },
  optimizeDeps: {
    include: ['three', 'cannon-es', 'gsap', 'howler']
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'physics': ['@react-three/cannon', 'cannon-es'],
          'animation': ['gsap', 'framer-motion'],
          'networking': ['socket.io-client', 'colyseus.js'],
          'ai': ['@tensorflow/tfjs', '@tensorflow/tfjs-models']
        }
      }
    }
  }
})