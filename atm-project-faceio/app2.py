from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from deepface import DeepFace
import cv2
import numpy as np
import base64
import json
import os
from flask_cors import CORS

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend
app.secret_key = "your_secret_key"  # Needed for session management

# Define paths for user data and face storage
USERS_FILE = "users.json"
FACE_DB = "face_database"
os.makedirs(FACE_DB, exist_ok=True)

# Ensure users.json exists
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

# Load user data from JSON file
def load_users():
    with open(USERS_FILE, "r") as f:
        return json.load(f)

# Save user data to JSON file
def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

# Helper function to decode base64 images
def decode_image(base64_str):
    image_data = base64.b64decode(base64_str.split(',')[1])
    np_arr = np.frombuffer(image_data, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

# 📌 Route to Register a New User (Face + Details)
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    account = data.get("account")
    pin = data.get("pin")
    face_image = data.get("faceImage")

    if not all([name, email, phone, account, pin, face_image]):
        return jsonify({"error": "Missing required fields"}), 400

    # Decode and save face image
    face_img = decode_image(face_image)
    face_path = os.path.join(FACE_DB, f"{email}.jpg")
    cv2.imwrite(face_path, face_img)

    # Load existing users and check if email already exists
    users = load_users()
    for user in users:
        if user["email"] == email:
            return jsonify({"error": "User already exists"}), 400

    # Save user details
    user_data = {
        "name": name,
        "email": email,
        "phone": phone,
        "account": account,
        "pin": pin,
        "facePath": face_path
    }
    users.append(user_data)
    save_users(users)

    return jsonify({"message": "Registration successful!"}), 200

# 📌 Route to Verify Face for Login
@app.route("/api/auth/verify-face", methods=["POST"])
def verify_face():
    data = request.json
    face_image = data.get("faceImage")

    if not face_image:
        return jsonify({"error": "No face image provided"}), 400

    # Decode captured face image
    captured_face = decode_image(face_image)

    # Load registered users
    users = load_users()

    # Compare face with stored images
    for user in users:
        user_face_path = user["facePath"]

        try:
            result = DeepFace.verify(img1_path=captured_face, img2_path=user_face_path, model_name="VGG-Face")
            if result["verified"]:
                return jsonify({"message": "Face Verified!", "user": user["email"]})
        except Exception as e:
            print("Error:", e)

    return jsonify({"error": "Face not recognized"}), 401

# 📌 Route to Verify PIN After Face Authentication
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    pin = data.get("pin")

    if not email or not pin:
        return jsonify({"error": "Email and PIN are required"}), 400

    # Load registered users
    users = load_users()

    # Validate PIN
    for user in users:
        if user["email"] == email and user["pin"] == pin:
            return jsonify({"message": "Login Successful!", "token": "dummy_token"})
    
    return jsonify({"error": "Incorrect PIN"}), 401

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
