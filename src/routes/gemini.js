// 환경 변수 로드
require('dotenv').config();

// 필요한 모듈 가져오기
const express = require('express');
const axios = require('axios');
const multer = require('multer'); // 파일 업로드 처리를 위한 미들웨어
const models = require('../enums/models');
const upload = multer({ storage: multer.memoryStorage() }); // 메모리에 파일 임시 저장
const router = express.Router();

// 상수 정의
// 허용된 모델 목록 (TEXT: 텍스트 처리용 모델, IMAGE: 이미지 처리용 모델)
const ALLOWED_MODELS = {
  TEXT: new Set(['g-20-f', 'g-20-fl', 'g-15-f', 'g-15-f8', 'g3-1b', 'g3-4b', 'g3-12b', 'g3-27b']),
  IMAGE: new Set(['g-20-f', 'g-20-fl', 'g-15-f', 'g-15-f8'])
};

// 헬퍼 함수들
/**
 * 요청된 모델이 유효한지 검증하는 함수
 * @param {string} model - 사용할 모델 ID
 * @param {string} type - 모델 타입 (TEXT 또는 IMAGE)
 * @returns {Object} 유효성 검증 결과
 */
const validateModel = (model, type) => {
  // 요청된 모델이 허용된 목록에 있는지 확인
  if (!ALLOWED_MODELS[type].has(model)) {
    return { valid: false, error: 'Not Allowed Model' };
  }
  
  // 모델 이름이 매핑 가능한지 확인
  const modelName = models[model];
  if (!modelName) {
    return { valid: false, error: 'Not Supported Model' };
  }
  
  return { valid: true, modelName };
};

/**
 * Gemini API 호출 함수
 * @param {string} modelName - 사용할 모델의 전체 이름
 * @param {Array} contents - 요청 내용 (텍스트 또는 이미지+텍스트)
 * @returns {string} API 응답 텍스트
 */
const callGeminiAPI = async (modelName, contents) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  // API 요청 전송
  const response = await axios.post(url, { contents }, {
    headers: { 'Content-Type': 'application/json' }
  });
  
  // 응답에서 생성된 텍스트 추출
  return response.data.candidates[0].content.parts[0].text;
};

/**
 * 에러 처리 함수
 * @param {Error} error - 발생한 에러 객체
 * @param {Response} res - Express 응답 객체
 */
const handleError = (error, res) => {
  if (error.response) {
    console.error('Response data:', error.response.data);
    res.status(error.response.status).json({ error: error.response.data });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 라우트 정의
// 기본 경로 - API 상태 확인용
router.get('/', (req, res) => {
  res.json({ provider: 'gemini' });
});

/**
 * 텍스트 처리 엔드포인트
 * 텍스트만 입력으로 받아 Gemini 모델로 처리
 */
router.post('/text', async (req, res) => {
  const { text, model } = req.body;
  // 모델 유효성 검사
  const validation = validateModel(model, 'TEXT');
  
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  try {
    // Gemini API 요청 형식에 맞게 데이터 구성
    const contents = [{
      parts: [{ text }]
    }];
    
    // API 호출 및 결과 반환
    const result = await callGeminiAPI(validation.modelName, contents);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
});

/**
 * 이미지 처리 엔드포인트
 * 이미지 파일과 텍스트를 입력으로 받아 Gemini 모델로 처리
 */
router.post('/image', upload.single('file'), async (req, res) => {
  // 파일 업로드 확인
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const { text, model } = req.body;
  // 이미지를 Base64로 인코딩
  const data = req.file.buffer.toString('base64');
  // 모델 유효성 검사
  const validation = validateModel(model, 'IMAGE');
  
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  try {
    // 이미지와 텍스트를 포함한 요청 구성
    const contents = [{
      parts: [
        { text },
        {
          inline_data: {
            mime_type: req.file.mimetype,
            data,
          }
        }
      ]
    }];
    
    // API 호출 및 결과 반환
    const result = await callGeminiAPI(validation.modelName, contents);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;