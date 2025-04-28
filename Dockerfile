# 1. Node.js 공식 이미지 사용 (Node.js 22.11.0 버전 기준)
FROM node:22.11.0

# 2. 애플리케이션 작업 디렉토리 설정
WORKDIR /app

# 3. package.json과 package-lock.json 파일을 먼저 복사 (의존성 설치를 위한 준비)
COPY package.json package-lock.json ./

# 4. 의존성 설치
RUN npm install && npm audit fix

# 5. 리액트 애플리케이션 파일들을 복사
COPY . .

# 6. 리액트 애플리케이션 빌드 (Production 환경 빌드)
RUN npm run build || (cat /app/npm-debug.log && exit 1)

# 6.5. 빌드된 리액트 애플리케이션의 내용 확인 (디버깅용)
RUN ls -alh build/

# 7. 앱 실행을 위한 HTTP 서버 설치 (리액트 앱은 빌드 후 정적 파일을 제공)
RUN npm install -g serve

# 8. 앱을 실행할 포트 설정 (80번 포트로 설정)
EXPOSE 80

# 9. 빌드된 리액트 앱을 serve로 실행
CMD ["serve", "build", "--single", "--listen", "80"]
