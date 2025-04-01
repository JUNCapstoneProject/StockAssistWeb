/**
 * Vite 설정 파일
 * React 프로젝트의 빌드 및 개발 서버 설정
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Vite 설정 정의
export default defineConfig({
  plugins: [react()], // React SWC 플러그인 사용 (빠른 빌드를 위한 설정)
})
