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

// Webcam and Face Capture Logic
document.addEventListener("DOMContentLoaded", () => {
  const captureBtn = document.getElementById("capture-btn");
  const pinSection = document.getElementById("pin-section");
  const webcam = document.getElementById("webcam");
  let capturedFace = null;

  // Webcam setup
  navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { webcam.srcObject = stream; })
      .catch(error => {
          console.error("Webcam access denied", error);
          alert('Webcam access required for login');
      });

  // Capture face
  captureBtn.addEventListener("click", async () => {
      const canvas = document.createElement('canvas');
      canvas.width = webcam.videoWidth;
      canvas.height = webcam.videoHeight;
      canvas.getContext('2d').drawImage(webcam, 0, 0);
      capturedFace = canvas.toDataURL('image/jpeg');

      try {
          const response = await fetch('/api/auth/verify-face', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ faceImage: capturedFace })
          });

          if (response.ok) {
              pinSection.classList.remove("hidden");
          } else {
              alert('Face verification failed');
          }
      } catch (error) {
          console.error('Verification error:', error);
          alert('Face verification error');
      }
  });

  // Handle PIN submission
  document.getElementById("submit-btn").addEventListener("click", async () => {
      const pin = document.getElementById("pin").value;

      try {
          const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  faceImage: capturedFace,
                  pin: pin
              })
          });

          const data = await response.json();

          if (response.ok) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              window.location.href = "dashboard.html";
          } else {
              alert(data.error || 'Login failed');
          }
      } catch (error) {
          console.error('Login error:', error);
          alert('Login failed');
      }
  });
});
