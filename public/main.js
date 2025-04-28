const apiKeyInput = document.querySelector('#apiKey');
if (localStorage.getItem('api_key')) apiKeyInput.value = localStorage.getItem('api_key');
const apiUrlInput = document.querySelector('#apiUrl');
if (localStorage.getItem('glitch_url')) apiUrlInput.value = localStorage.getItem('glitch_url');
const internalTestForm = document.querySelector('#internalTest');
const externalTestForm = document.querySelector('#externalTest');

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#internalTest').addEventListener('submit', internalTestHandler);
    document.querySelector('#externalTest').addEventListener('submit', externalTestHandler);
});

const internalTestHandler = async (event) => {
    event.preventDefault();
    const url = 'http://localhost:3000';
    const response = await fetchToApi(url);
    alert(`Response: ${response}`);
}

const externalTestHandler = async (event) => {
    event.preventDefault();
    const url = apiUrlInput.value;
    if (!url) {
        alert('Please enter a URL');
        return;
    }
    localStorage.setItem('glitch_url', url);
    const response = await fetchToApi(url);
    alert(`Response: ${response}`);
}

const fetchToApi = async (url) => {
    const apiKey = apiKeyInput.value;
    if (apiKey) localStorage.setItem('api_key', apiKey);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey,
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
}