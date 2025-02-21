# ATM with Face Recognition Authentication

Project Overview:
This project is an ATM-like system where users must verify their identity using facial recognition before entering their PIN and proceeding with transactions. The system was developed using HTML, CSS, and JavaScript for the front end, with Flask managing the backend.

## 1. Initial Attempt – FaceIO (Not Used Due to Cost)

🔍 Current Status & Issues:

✅ Implemented Features:
User interface for ATM transactions.
Basic Flask backend for transaction handling.
Initial integration with FaceIO for facial recognition (not fully implemented).

⚠️ Known Issues & Incomplete Features:
Face recognition is incomplete due to FaceIO being a paid service.
Some functionalities may not be working properly or need better error handling.
Session management and security measures might need improvements.

💡 Possible Fixes & Enhancements:
Replace FaceIO with OpenCV or DeepFace for free face recognition.
Debug transaction flow and form validation issues.
Improve error handling and user feedback messages.
Enhance UI/UX for a more interactive experience.

📌 Tech Stack:
Frontend: HTML, CSS, JavaScript
Backend: Flask (Python)
Face Recognition (To be Fixed): FaceIO (Replaceable with OpenCV/DeepFace)


## 2. Second Attempt – MediaPipe + DeepFace (Incomplete & Not Fully Functional)

To make the project fully free and offline, MediaPipe was used for face detection on the frontend, and DeepFace was attempted for face verification on the backend with Flask.

✅ Implemented Components:

MediaPipe captures face images from the webcam (Frontend).
Flask backend receives the face image and attempts verification using DeepFace.

⚠️ Known Issues & Incomplete Features:
Face verification is not working properly – DeepFace integration is incomplete and has processing issues.
Some functionalities are not handled properly – Backend may fail to process requests correctly.
Session management issues – No proper handling of user authentication states.
Flask backend is incomplete – Needs better integration with the frontend and database 

📌 Tech Stack Used:
Frontend: HTML, CSS, JavaScript
Face Recognition (Attempted but Incomplete):
  FaceIO (Removed due to cost)
  MediaPipe + DeepFace (Integration issues)
Backend: Flask (Python)

🛠️ Project Status: Incomplete
Since this project is not fully functional, further development is needed to make face verification work and fix incomplete functionalities.

🚀 Contributions & Fixes Welcome!
If you're interested in debugging the issues, fixing face verification, or improving transaction handling, feel free to fork this project and submit a pull request!
