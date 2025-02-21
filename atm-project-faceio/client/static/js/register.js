import { fio } from './faceIO.js';

document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureFaceBtn = document.getElementById('captureFaceBtn');
    const preview = document.getElementById('preview');
    const form = document.getElementById('registrationForm');
    let capturedImage = null;
    let facialId = null;

    // Access webcam
    // try {
    //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //     video.srcObject = stream;
    // } catch (error) {
    //     console.error('Camera error:', error);
    //     alert('Camera access required for registration');
    // }

    document.addEventListener('DOMContentLoaded', async () => {
        const video = document.getElementById('video');
    
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            console.log("Webcam access granted.");
        } catch (error) {
            console.error('Camera error:', error);
            alert(`Camera access error: ${error.message}`);
        }
    });
    

    // Capture face image
    captureFaceBtn.addEventListener('click', async () => {
        try {
            const response = await fio.enroll({
                "locale": "auto",
                "payload": {
                    "userId": document.getElementById('account').value,
                    "email": document.getElementById('email').value
                }
            });

            facialId = response.facialId;
            alert('Face registered successfully!');

            // Capture image from video
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to base64
            capturedImage = canvas.toDataURL('image/jpeg');
            preview.src = capturedImage;
            preview.style.display = 'block';
        } catch (error) {
            console.error('Face registration failed:', error);
            alert(`Face registration error: ${error.message}`);
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const pin = document.getElementById('pin').value;
        if (!/^\d{4}$/.test(pin)) {
            alert('PIN must be 4 digits');
            return;
        }

        if (!capturedImage) {
            alert('Please capture your face image first!');
            return;
        }

        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            account: document.getElementById('account').value,
            pin: pin,
            facialId: facialId,
            faceImage: capturedImage
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
                credentials: 'include' // For session cookies
            });

            if (response.ok) {
                alert('Registration successful!');
                window.location.href = '/login.html';
            } else {
                const error = await response.json();
                alert(`Registration failed: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Registration failed. Please try again.');
        }
    });
});
