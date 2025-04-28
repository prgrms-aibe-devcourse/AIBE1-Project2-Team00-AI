const apiKeyInput = document.querySelector('#apiKey');
const internalTestForm = document.querySelector('#internalTest');
const externalTestForm = document.querySelector('#externalTest');

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#internalTest').addEventListener('submit', internalTestHandler);
    document.querySelector('#externalTest').addEventListener('submit', externalTestHandler);
});

const internalTestHandler = async (event) => {
    event.preventDefault();
    const apiKey = apiKeyInput.value;
    alert(apiKey);
}

const externalTestHandler = async (event) => {
    event.preventDefault();
    const apiKey = apiKeyInput.value;
    alert(apiKey);
}