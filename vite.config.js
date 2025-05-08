import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  assetsInclude: ['**/*.woff2'],
  build: {
    assetsInlineLimit: 0
  }
}) 