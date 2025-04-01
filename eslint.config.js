/**
 * ESLint 설정 파일
 * 코드 품질과 스타일을 관리하는 린터 설정
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] }, // dist 디렉토리 린트 제외
  {
    files: ['**/*.{js,jsx}'], // JavaScript와 JSX 파일에 대한 설정
    languageOptions: {
      ecmaVersion: 2020, // ECMAScript 버전 설정
      globals: globals.browser, // 브라우저 전역 변수 허용
      parserOptions: {
        ecmaVersion: 'latest', // 최신 ECMAScript 문법 지원
        ecmaFeatures: { jsx: true }, // JSX 문법 지원
        sourceType: 'module', // ES 모듈 사용
      },
    },
    plugins: {
      'react-hooks': reactHooks, // React Hooks 규칙 검사
      'react-refresh': reactRefresh, // React Fast Refresh 지원
    },
    rules: {
      ...js.configs.recommended.rules, // JavaScript 권장 규칙
      ...reactHooks.configs.recommended.rules, // React Hooks 권장 규칙
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], // 미사용 변수 검사 (대문자로 시작하는 변수는 제외)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // 상수 내보내기 허용
      ],
    },
  },
]
