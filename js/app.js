// Get token and optional custom URL from the query parameters
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const customUrl = urlParams.get('url');

// Set base URL (default to prod if none provided)
const BASE_URL = customUrl || 'https://stream-nest-api.com';

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const input = document.getElementById(targetId);
    const eyeOpen = this.querySelector('.eye-open');
    const eyeClosed = this.querySelector('.eye-closed');
    
    if (input.type === 'password') {
      input.type = 'text';
      eyeOpen.style.display = 'none';
      eyeClosed.style.display = 'block';
    } else {
      input.type = 'password';
      eyeOpen.style.display = 'block';
      eyeClosed.style.display = 'none';
    }
  });
});

// Password strength checker
const passwordInput = document.getElementById('password');
const passwordStrength = document.getElementById('passwordStrength');

passwordInput.addEventListener('input', function() {
  const password = this.value;
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;
  
  passwordStrength.className = 'password-strength';
  if (password.length > 0) {
    if (strength <= 1) {
      passwordStrength.classList.add('weak');
    } else if (strength === 2 || strength === 3) {
      passwordStrength.classList.add('medium');
    } else {
      passwordStrength.classList.add('strong');
    }
  }
});

// Form submission
document.getElementById('resetForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const messageElement = document.getElementById('message');
  const messageText = document.getElementById('messageText');
  const submitBtn = document.getElementById('submitBtn');
  const buttonText = document.getElementById('buttonText');
  
  // Reset message state
  messageElement.className = 'message';
  messageElement.style.display = 'none';
  
  if (password !== confirmPassword) {
    messageText.innerText = 'Passwords do not match! Please try again.';
    messageElement.className = 'message error';
    return;
  }
  
  // Show loading state
  submitBtn.disabled = true;
  buttonText.innerHTML = 'Resetting Password<span class="loading"></span>';
  
  try {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Hide the form and show success page
      document.getElementById('resetFormContainer').style.display = 'none';
      document.getElementById('successPage').classList.add('active');
      
      // Clear form
      document.getElementById('resetForm').reset();
      passwordStrength.className = 'password-strength';
    } else {
      messageText.innerText = result.message || 'Error resetting password. The link may have expired.';
      messageElement.className = 'message error';
    }
  } catch (error) {
    messageText.innerText = 'Network error. Please check your connection and try again.';
    messageElement.className = 'message error';
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    buttonText.innerHTML = 'Reset Password';
  }
});

// Check if token exists on page load
if (!token) {
  const messageElement = document.getElementById('message');
  const messageText = document.getElementById('messageText');
  messageText.innerText = 'Invalid reset link. Please request a new password reset.';
  messageElement.className = 'message error';
  document.getElementById('submitBtn').disabled = true;
}
