# app.py
from flask import Flask, request, jsonify,render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import base64
import cv2
import numpy as np
from deepface import DeepFace
import os
print("Templates path:", os.path.join(os.getcwd(), 'templates'))



# app = Flask(__name__,template_folder="D:/atm/templates")
# app = Flask(__name__, template_folder=r"D:\atm\templates")  # Use raw string

app = Flask(__name__, template_folder=os.path.join("D:", "atm", "templates"))


CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///atm.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    account = db.Column(db.String(20), unique=True, nullable=False)
    pin = db.Column(db.String(4), nullable=False)
    face_image = db.Column(db.Text, nullable=False)
    balance = db.Column(db.Float, default=0.0)
    
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

with app.app_context():
    db.create_all()

# Face Verification Helper
def verify_face(stored_image, current_image):
    try:

        
        # Handle data URL formatting
        if ',' in stored_image:
            stored_image = stored_image.split(',')[-1]
        if ',' in current_image:
            current_image = current_image.split(',')[-1]

        # Add image validation
        if not stored_image or not current_image:
            print("Empty image data received")
            return False
        
        # Decode images
        stored_img = base64.b64decode(stored_image)
        current_img = base64.b64decode(current_image)

        # Convert bytes to numpy array
        nparr_stored = np.frombuffer(stored_img, np.uint8)
        nparr_current = np.frombuffer(current_img, np.uint8)

       # Add size validation
        if len(stored_img) < 1024 or len(current_img) < 1024:
            print("Image data too small")
            return False

        # Save images for debugging
        cv2.imwrite('stored.jpg', img_stored)
        cv2.imwrite('current.jpg', img_current)

        # Run face verification
        result = DeepFace.verify(img_stored, img_current, enforce_detection=False)

        print("DeepFace Result:", result)  # Debugging
        return result.get('verified', False)
    except Exception as e:
        print("Face verification error:", e)
        return False



# Routes
# Serve the home page

# @app.route("/test")
# def home():
#     return render_template("test.html")

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
        
    new_user = User(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        account=data['account'],
        pin=data['pin'],
        face_image=data['faceImage'],
        balance=0.0
    )
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registration successful'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(account=data['account']).first()
    
    if not user or user.pin != data['pin']:
        return jsonify({'message': 'Invalid credentials'}), 401
        
    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'account': user.account,
            'balance': user.balance,
            'face_image': user.face_image
        }
    }), 200

@app.route('/verify-face', methods=['POST'])
def face_verification():
    try:
        data = request.json
        account = data.get('account')
        print(f"Verification attempt for account: {account}")
        
        user = User.query.filter_by(account=account).first()
        if not user:
            print(f"User not found: {account}")
            return jsonify({'verified': False}), 404

        # Debug logging
        print(f"Stored image size: {len(user.face_image)}")
        print(f"Received image size: {len(data['faceImage'])}")
        
        verified = verify_face(user.face_image, data['faceImage'])
        print(f"Verification result: {verified}")
        return jsonify({'verified': verified})

    except Exception as e:
        print(f"Verification error: {str(e)}")
        return jsonify({'verified': False}), 500


@app.route('/update-balance', methods=['POST'])
def update_balance():
    data = request.json
    user = User.query.get(data['user_id'])
    
    if data['type'] == 'withdraw' and user.balance < data['amount']:
        return jsonify({'message': 'Insufficient funds'}), 400
    
    if data['type'] == 'withdraw':
        user.balance -= data['amount']
    else:
        user.balance += data['amount']
    
    transaction = Transaction(
        user_id=user.id,
        amount=data['amount'],
        type=data['type']
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({
        'message': 'Transaction successful',
        'newBalance': user.balance
    }), 200

if __name__ == '__main__':
     app.run(debug=True)