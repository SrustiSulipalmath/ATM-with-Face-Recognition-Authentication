// static/js/register.js
import { fio } from './faceIO.js';

// Webcam elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureFaceBtn');
const preview = document.getElementById('preview');
const registrationForm = document.getElementById('registrationForm');

let capturedImage = null;
let stream = null;

// Initialize Webcam
async function initWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        });
        video.srcObject = stream;
        video.play().catch(error => {
            console.error('Error playing video:', error);
        });
    } catch (err) {
        console.error('Error accessing webcam:', err);
        alert('Failed to access webcam. Please enable camera permissions.');
        throw err;
    }
}

// Capture face image
captureBtn.addEventListener('click', () => {
    try {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        capturedImage = canvas.toDataURL('image/jpeg');
        preview.src = capturedImage;
        preview.style.display = 'block';
    } catch (error) {
        console.error('Capture error:', error);
        alert('Failed to capture image. Please try again.');
    }
});

// Form submission handler
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate inputs
    const pin = document.getElementById('pin').value;
    if (!/^\d{4}$/.test(pin)) {
        alert('PIN must be 4 digits');
        return;
    }

    if (!capturedImage) {
        alert('Please capture your face image first!');
        return;
    }

    try {
        // Get form data
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            account: document.getElementById('account').value,
            pin: pin,
            faceImage: capturedImage
        };

        // Register with FaceIO
        const faceResponse = await fio.enroll({
            "locale": "auto",
            "payload": {
                "userId": userData.account,
                "email": userData.email
            }
        });
        
        // Add facialId to user data
        userData.facialId = faceResponse.facialId;

        // Send to backend
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = '/login.html';
        } else {
            const error = await response.json();
            alert(`Registration failed: ${error.message}`);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert(`Registration failed: ${error.message}`);
    } finally {
        // Stop webcam stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
});

// Initialize webcam when page loads
window.addEventListener('DOMContentLoaded', initWebcam);