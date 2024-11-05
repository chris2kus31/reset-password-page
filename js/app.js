// Get the token from the URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

document.getElementById('resetForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const messageElement = document.getElementById('message');

  if (password !== confirmPassword) {
    messageElement.innerText = 'Passwords do not match!';
    return;
  }

  // Send password reset request to backend
  const response = await fetch('https://yourbackend.com/reset-password', {
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
});
