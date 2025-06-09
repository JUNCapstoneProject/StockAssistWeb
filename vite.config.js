import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      includeAssets: ['images/*.png'], // ✅ public/logo.png → logo.png
      manifest: {
        name: '투자인',
        short_name: '투자인',
        description: '투자인',
        theme_color: '#000000',
        icons: [
          {
            src: 'Logo.png', // ✅ public/ 생략
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'Logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        display: 'standalone', // 선택 사항이지만 넣어주면 좋아요
      },
    }),
  ],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
