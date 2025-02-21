const faceio = new faceIO("YOUR_FACEIO_PUBLIC_ID");

async function faceLogin() {
  try {
    const response = await faceio.authenticate({
      "locale": "auto"
    });
    
    // Verify with server
    const authResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        facialId: response.facialId,
        pin: document.getElementById('pin').value
      })
    });
    
    // Handle response
  } catch (error) {
    console.error("Login failed:", error);
  }
}

import { faceIO } from './faceIO.js';

async function authenticateUser() {
  try {
    const response = await faceIO.authenticate({
      "locale": "auto"
    });

    // Verify with backend
    const authResult = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        facialId: response.facialId,
        pin: document.getElementById('pin').value
      })
    });

    const data = await authResult.json();
    
    if(data.success) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard.html';
    } else {
      alert('Authentication failed');
    }
    
  } catch (error) {
    console.error("Auth Error:", error);
    alert(error instanceof faceIO.FaceIOError ? error.message : "Authentication failed");
  }
}

// Attach to login button
document.getElementById('loginBtn').addEventListener('click', authenticateUser);