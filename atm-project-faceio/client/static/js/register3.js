// FaceIO Initialization
import { fio } from './faceIO.js';

 // Webcam setup
 const video = document.getElementById('video');
 const canvas = document.getElementById('canvas');
 const captureFaceBtn = document.getElementById('captureFaceBtn');
 const preview = document.getElementById('preview');
 let capturedImage = null;
 let stream = null;

async function registerWithFace() {
  try {
    const response = await fio.enroll({
      "locale": "auto",
      "payload": {
        "userId": document.getElementById('account').value,
        "email": document.getElementById('email').value
      }
    });
    
    return response.facialId;
  } catch (error) {
    console.error("Face registration failed:", error);
    throw error;
  }
}

// Add to form submission handler
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const facialId = await registerWithFace();
  const userData = {
    // ... other form data
    facialId: facialId
  };
  
  // Send to server
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(userData)
  });
  // ... handle response
});

document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const pin = document.getElementById('pin').value;
  if (!/^\d{4}$/.test(pin)) {
      alert('PIN must be 4 digits');
      return;
  }
  
  // Rest of your existing code
});



 // Access webcam
 navigator.mediaDevices.getUserMedia({ video: true })
     .then(stream => {
         video.srcObject = stream;
     })
     .catch(err => {
         console.error('Error accessing webcam:', err);
         alert('Failed to access webcam. Please enable camera permissions.');
     });

 // Capture face image
 captureFaceBtn.addEventListener('click', () => {
     const context = canvas.getContext('2d');
     canvas.width = video.videoWidth;
     canvas.height = video.videoHeight;
     context.drawImage(video, 0, 0, canvas.width, canvas.height);
     
     // Convert to base64
     capturedImage = canvas.toDataURL('image/jpeg');
     preview.src = capturedImage;
     preview.style.display = 'block';
 });

 // Form submission
 document.getElementById('registrationForm').addEventListener('submit', async (e) => {
     e.preventDefault();

     if (!capturedImage) {
         alert('Please capture your face image first!');
         return;
     }

     const userData = {
         name: document.getElementById('name').value,
         email: document.getElementById('email').value,
         phone: document.getElementById('phone').value,
         account: document.getElementById('account').value,
         pin: document.getElementById('pin').value,
         faceImage: capturedImage
     };

     try {
         const response = await fetch('http://localhost:5000/api/auth/register', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(userData),
         credentials: 'include' // For session cookies
         });
         

         if (response.ok) {
             alert('Registration successful!');
             window.location.href = '/login';
         } else {
             const error = await response.json();
             alert(`Registration failed: ${error.message}`);
         }
     } catch (error) {
         console.error('Error:', error);
         alert('Registration failed. Please try again.');
     }
 });

 import { fio } from './faceIO.js';

// Add to your existing registration form handler
async function registerUser(userDetails) {
  try {
    const response = await faceIO.enroll({
      "locale": "auto",
      "payload": {
        "userId": userDetails.accountNumber, // Use actual account number from form
        "email": userDetails.email
      }
    });
    
    // Add facialId to user data
    userDetails.facialId = response.facialId;
    
    // Send to backend
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userDetails)
    });
    
    return await res.json();
    
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
}

// Usage in form submission
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    account: document.getElementById('account').value,
    pin: document.getElementById('pin').value
  };

  try {
    const result = await registerUser(userData);
    if(result.success) {
      window.location.href = '/login.html';
    }
  } catch (error) {
    alert('Registration failed: ' + error.message);
  }
});