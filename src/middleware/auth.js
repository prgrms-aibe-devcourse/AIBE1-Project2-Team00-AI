// .env 파일의 환경 변수를 로드합니다.
require('dotenv').config();

// API 키를 검증하는 미들웨어 함수를 정의합니다.
const checkApiKey = (req, res, next) => {
  // 요청 헤더에서 'Authorization' 값을 추출합니다.
  const apiKey = req.header('Authorization');
  // 환경 변수에서 비밀 키를 가져옵니다.
  const secretKey = process.env.SECRET_KEY;
  
  // API 키가 없거나 환경 변수의 비밀 키와 일치하지 않으면 401 오류를 반환합니다.
  if (!apiKey || apiKey !== secretKey) {
    return res.status(401).json({ message: 'Unauthorized: Invalid API key' });
  }
  
  // 키가 유효하면 다음 미들웨어로 요청을 전달합니다.
  next();
  };
  
  // checkApiKey 함수를 모듈로 내보냅니다.
  module.exports = checkApiKey;