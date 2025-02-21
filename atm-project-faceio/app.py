# app.py
from flask import Flask, request, jsonify,render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import base64
import cv2
import numpy as np
from deepface import DeepFace

app = Flask(__name__)
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
        stored_img = base64.b64decode(stored_image.split(',')[1])
        current_img = base64.b64decode(current_image.split(',')[1])
        
        nparr_stored = np.frombuffer(stored_img, np.uint8)
        nparr_current = np.frombuffer(current_img, np.uint8)
        
        img_stored = cv2.imdecode(nparr_stored, cv2.IMREAD_COLOR)
        img_current = cv2.imdecode(nparr_current, cv2.IMREAD_COLOR)
        
        result = DeepFace.verify(img_stored, img_current, enforce_detection=False)
        return result['verified']
    except Exception as e:
        print("Face verification error:", e)
        return False

# Routes
# Serve the home page
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
    data = request.json
    user = User.query.filter_by(account=data['account']).first()
    
    if not user:
        return jsonify({'verified': False}), 404
    
    verified = verify_face(user.face_image, data['faceImage'])
    return jsonify({'verified': verified}), 200

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