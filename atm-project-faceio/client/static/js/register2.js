// Initialize FaceIO
import { fio } from './faceIO.js';

// Webcam elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureFaceBtn = document.getElementById('captureFaceBtn');
const preview = document.getElementById('preview');
const registrationForm = document.getElementById('registrationForm');

let capturedImage = null;
let stream = null;

// Initialize Webcam
// async function initWebcam() {
//     try {
//         stream = await navigator.mediaDevices.getUserMedia({ 
//             video: { 
//                 facingMode: 'user',
//                 width: { ideal: 640 },
//                 height: { ideal: 480 }
//             } 
//         });
//         video.srcObject = stream;
//     } catch (err) {
//         console.error('Error accessing webcam:', err);
//         alert('Failed to access webcam. Please enable camera permissions.');
//         throw err;
//     }
// }

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
captureFaceBtn.addEventListener('click', async () => {
    try {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        capturedImage = canvas.toDataURL('image/jpeg');
        preview.src = capturedImage;
        preview.style.display = 'block';
        
        // Stop webcam stream after capture
        stream.getTracks().forEach(track => track.stop());
    } catch (error) {
        console.error('Capture error:', error);
        alert('Failed to capture image. Please try again.');
    }
});

// Form submission handler
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
        // Register with FaceIO
        const faceResponse = await fio.enroll({
            "locale": "auto",
            "payload": {
                "userId": userData.account,
                "email": userData.email
            }
        });
        userData.facialId = faceResponse.facialId;

        // Send to backend
        const response = await fetch('/api/auth/register', {
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
    }
});

// Initialize webcam when page loads
window.addEventListener('DOMContentLoaded', initWebcam);