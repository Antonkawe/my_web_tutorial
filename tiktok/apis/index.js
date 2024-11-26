const toggleApiKey = document.getElementById('toggleApiKey');
const apiKeyInput = document.getElementById('apikey');
toggleApiKey.addEventListener('click', () => {
    if (apiKeyInput.type === "password") {
        apiKeyInput.type = "text";
        toggleApiKey.classList.remove("fa-eye");
        toggleApiKey.classList.add("fa-eye-slash");
    } else {
        apiKeyInput.type = "password";
        toggleApiKey.classList.remove("fa-eye-slash");
        toggleApiKey.classList.add("fa-eye");
    }
});