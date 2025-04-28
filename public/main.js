const HTTP_METHOD = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
})
document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 선택
    const apiKeyInput = document.querySelector('#apiKey');
    const apiUrlInput = document.querySelector('#apiUrl');
    const isInternalTestInput = document.querySelector('#internal');
    const healthCheckForm = document.querySelector('#healthCheck');
    const geminiForm = document.querySelector('#gemini');
    const geminiPromptInput = document.querySelector('#geminiPrompt');
    const geminiModelInput = document.querySelector('#geminiModel');
    const geminiForm2 = document.querySelector('#gemini2');
    const geminiFileInput = document.querySelector('#geminiFile');
    const geminiPromptInput2 = document.querySelector('#geminiPrompt2');
    const geminiModelInput2 = document.querySelector('#geminiModel2');

    // 로컬 스토리지에서 값 로드
    if (localStorage.getItem('api_key')) apiKeyInput.value = localStorage.getItem('api_key');
    if (localStorage.getItem('glitch_url')) apiUrlInput.value = localStorage.getItem('glitch_url');
    
    // 이벤트 리스너 등록
    healthCheckForm.addEventListener('submit', healthCheckFormHandler);
    geminiForm.addEventListener('submit', geminiFormHandler);
    geminiForm2.addEventListener('submit', geminiForm2Handler);
    
    async function healthCheckFormHandler(event) {
        event.preventDefault();
        try {
            const response = await fetchToApi('/', HTTP_METHOD.GET);
            alert(`응답: ${response}`);
        } catch (error) {
            alert(`오류 발생: ${error.message}`);
        }
    }

    async function geminiFormHandler(event) {
        event.preventDefault();
        try {
            let response;
            if (!geminiPromptInput.value) {
                response = await fetchToApi('/gemini', HTTP_METHOD.GET);
            } else {
                response = await fetchToApi('/gemini/text', HTTP_METHOD.POST, {
                    text: geminiPromptInput.value,
                    model: geminiModelInput.value,
                });
            }
            alert(`응답: ${response}`);
        } catch (error) {
            alert(`오류 발생: ${error.message}`);
        }
    }

    async function geminiForm2Handler(event) {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('file', geminiFileInput.files[0]);
            formData.append('text', geminiPromptInput2.value);
            formData.append('model', geminiModelInput2.value);
            const response = await fetchToApi('/gemini/image', HTTP_METHOD.POST, null, formData);
            alert(`응답: ${response}`);
        } catch (error) {
            alert(`오류 발생: ${error.message}`);
        }
    }

    async function fetchToApi(path, method, body, formData) {
        const apiKey = apiKeyInput.value;
        const apiUrl = apiUrlInput.value;
        if (apiKey) localStorage.setItem('api_key', apiKey);
        if (apiUrl) localStorage.setItem('glitch_url', apiUrl);

        const baseUrl = isInternalTestInput.checked ? 'http://localhost:3000' : apiUrl;
        const startTime = new Date().getTime();
        try {
            const response = await fetch(`${baseUrl}${path}`, {
                method,
                headers: formData ? {
                    // 'Content-Type': 'multipart/form-data',
                    // fetch를 사용할 때 multipart/form-data 요청은 절대 Content-Type 헤더를 직접 설정하면 안됩니다.
                    // 브라우저가 자동으로 Content-Type을 설정하고, boundary도 자동으로 추가하기 때문입니다.
                    'Authorization': apiKey,                    
                } : {
                    'Content-Type': 'application/json',
                    'Authorization': apiKey,
                },
                body: formData || (body ? JSON.stringify(body) : null),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            throw new Error(`API 호출 실패: ${error.message}`);
        } finally {
            const endTime = new Date().getTime();
            const elapsedTime = endTime - startTime;
            console.log(`API 호출 시간: ${elapsedTime}ms`);
        }
    }
});