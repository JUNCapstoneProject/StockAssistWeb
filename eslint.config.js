/**
 * ESLint 설정 파일
 * 코드 품질과 스타일을 관리하는 린터 설정
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  // ✅ 빌드 디렉토리 무시
  { ignores: ['dist', 'dev-dist'] },

  // ✅ JS + JSX
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

  // ✅ TypeScript + TSX
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
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
      'no-undef': 'off', // 전역 허용한 것들 검사하지 않음
    },
  },
]
