/**
 * express 웹 서버 프레임워크 모듈을 불러옵니다.
 * HTTP 요청 처리와 라우팅을 쉽게 구현할 수 있게 해줍니다.
 */
const express = require('express');

/**
 * CORS(Cross-Origin Resource Sharing) 미들웨어 모듈을 불러옵니다.
 * 다른 도메인에서의 요청을 허용하기 위한 설정입니다.
 */
const cors = require('cors');

/**
 * API 키 검증 미들웨어를 불러옵니다.
 * 요청에 포함된 API 키의 유효성을 검사하는 역할을 합니다.
 */
const checkApiKey = require('./middleware/auth');

/**
 * Express 애플리케이션을 초기화하고 기본 미들웨어를 설정하는 함수입니다.
 * @returns {Object} 설정이 완료된 Express 애플리케이션 객체
 */
function initializeApp() {
  // Express 애플리케이션 인스턴스 생성
  const app = express();
  
  // 미들웨어 설정
  app.use(cors()); // CORS 설정으로 교차 출처 요청 허용
  app.use(express.json()); // JSON 형식 요청 본문 파싱
  app.use(express.urlencoded({ extended: true })); // URL-encoded 형식 요청 본문 파싱
  app.use(checkApiKey); // API 키 검증 미들웨어 적용
  
  return app;
}

/**
 * Express 애플리케이션에 라우트를 설정하는 함수입니다.
 * 각종 HTTP 요청에 대한 처리 경로를 정의합니다.
 * @param {Object} app - Express 애플리케이션 객체
 */
function setupRoutes(app) {
  // 루트 경로('/') GET 요청 처리
  app.get('/', (req, res) => {
    res.send('안녕하세요!');
  });
  
  // 추가 라우트는 여기에 추가하거나 별도 모듈로 분리 가능
}

/**
 * 서버를 초기화하고 시작하는 함수입니다.
 * 애플리케이션 초기화, 라우트 설정 후 지정된 포트에서 서버를 실행합니다.
 */
function startServer() {
  // 애플리케이션 초기화
  const app = initializeApp();
  // 라우트 설정
  setupRoutes(app);
  
  // 환경 변수에서 포트를 가져오거나 기본값 3000 사용
  const port = process.env.PORT || 3000;
  // 서버 시작
  app.listen(port, () => {
    console.log(`서버가 ${port} 포트에서 실행 중입니다`);
  });
}

// 서버 시작 함수 호출
startServer();