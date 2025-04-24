/**
 * Vite 설정 파일
 * React 프로젝트의 빌드 및 개발 서버 설정
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from "vite-plugin-pwa"

// Vite 설정 정의
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },

      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'TUZAIN',
        short_name: 'TUZAIN',
        description: '투자 플랫폼',
        theme_color: '#000000',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
    })
  ],
})