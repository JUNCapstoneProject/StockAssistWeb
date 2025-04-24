/**
 * ESLint 설정 파일
 * 코드 품질과 스타일을 관리하는 린터 설정 (JavaScript + React 기반)
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // ✅ 빌드 디렉토리 무시
  { ignores: ['dist', 'dev-dist'] },

  // ✅ JS + JSX 린트 설정
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // ✅ Service Worker 전역 허용 (sw.js, workbox 등)
  {
    files: ['**/sw.js', '**/dev-dist/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        self: 'readonly',
        define: 'readonly',
        importScripts: 'readonly',
        ExtendableEvent: 'readonly',
        FetchEvent: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
]
