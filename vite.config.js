import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'circular-timer.js',
      name: 'circular-timer',
      formats: ['es']
    }
  }
})