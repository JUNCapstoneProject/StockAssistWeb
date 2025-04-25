# 1. Node.js 공식 이미지 사용 (Node.js 18버전 기준)
FROM node:22.11.0

# 2. 애플리케이션 작업 디렉토리 설정
WORKDIR /app

# 3. package.json과 yarn.lock 파일을 먼저 복사
#    이 단계에서 의존성만 설치하기 위해 먼저 복사합니다.
COPY package.json ./

# 4. 의존성 설치 (npm 대신 yarn을 사용한다고 가정)
RUN yarn install

# 5. 리액트 프로젝트 파일들을 복사
COPY . .

# 6. 리액트 애플리케이션 빌드 (Production 환경 빌드)
RUN yarn build

# 7. 앱 실행을 위한 HTTP 서버 설치 (리액트 앱은 빌드 후 정적 파일을 제공)
#    `serve`는 빌드된 리액트 앱을 제공하는 간단한 서버입니다.
RUN yarn global add serve

# 8. 앱을 실행할 포트 설정 (3000번 포트로 실행될 것으로 가정)
EXPOSE 4000

# 9. 빌드된 리액트 앱을 serve로 실행
CMD ["serve", "-s", "build", "-l", "4000"]
