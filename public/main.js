document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 선택
    const apiKeyInput = document.querySelector('#apiKey');
    const apiUrlInput = document.querySelector('#apiUrl');
    const internalTestForm = document.querySelector('#internalTest');
    const externalTestForm = document.querySelector('#externalTest');
    
    // 로컬 스토리지에서 값 로드
    if (localStorage.getItem('api_key')) apiKeyInput.value = localStorage.getItem('api_key');
    if (localStorage.getItem('glitch_url')) apiUrlInput.value = localStorage.getItem('glitch_url');
    
    // 이벤트 리스너 등록
    internalTestForm.addEventListener('submit', internalTestHandler);
    externalTestForm.addEventListener('submit', externalTestHandler);
    
    /**
     * 내부 테스트 핸들러 - 로컬 서버와 통신
     * @param {Event} event - 제출 이벤트
     */
    async function internalTestHandler(event) {
        event.preventDefault();
        const url = 'http://localhost:3000';
        try {
            const response = await fetchToApi(url);
            alert(`응답: ${response}`);
        } catch (error) {
            alert(`오류 발생: ${error.message}`);
        }
    }
    
    /**
     * 외부 테스트 핸들러 - 사용자가 지정한 URL과 통신
     * @param {Event} event - 제출 이벤트
     */
    async function externalTestHandler(event) {
        event.preventDefault();
        const url = apiUrlInput.value;
        if (!url) {
            alert('URL을 입력해주세요');
            return;
        }
        localStorage.setItem('glitch_url', url);
        try {
            const response = await fetchToApi(url);
            alert(`응답: ${response}`);
        } catch (error) {
            alert(`오류 발생: ${error.message}`);
        }
    }
    
    /**
     * API 요청 전송 함수
     * @param {string} url - 요청할 API 주소
     * @returns {Promise<string>} - 응답 텍스트
     */
    /**
     * API 서버에 요청을 보내고 응답을 받아오는 함수
     * 입력된 API 키를 로컬 스토리지에 저장하고, Authorization 헤더에 포함하여 요청합니다.
     * 
     * @async
     * @param {string} url - 요청을 보낼 API 서버의 URL
     * @returns {Promise<string>} API 서버로부터 받은 응답 텍스트
     * @throws {Error} HTTP 응답이 실패하거나 네트워크 오류가 발생할 경우 에러를 발생시킵니다.
     */
    async function fetchToApi(url) {
        const apiKey = apiKeyInput.value;
        if (apiKey) localStorage.setItem('api_key', apiKey);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': apiKey,
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            throw new Error(`API 호출 실패: ${error.message}`);
        }
    }
});