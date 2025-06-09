// Get token and optional custom URL from the query parameters
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const customUrl = urlParams.get('url');

// Set base URL (default to prod if none provided)
const BASE_URL = customUrl || 'https://stream-nest-api.com';

document.getElementById('resetForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const messageElement = document.getElementById('message');

  if (password !== confirmPassword) {
    messageElement.innerText = 'Passwords do not match!';
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });

    const result = await response.json();
    if (response.ok) {
      messageElement.innerText = 'Password reset successful!';
    } else {
      messageElement.innerText = result.message || 'Error resetting password';
    }
  } catch (error) {
    messageElement.innerText = 'Network error. Please try again.';
  }
});
